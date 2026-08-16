/**
 * Reads demo `.tsx` files so the Code tab matches the live preview.
 * Strips `"use client"` and rewrites `@/lib/ui` to `@harjs/react-ui`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Children, isValidElement, type ReactNode } from 'react';

const DEMOS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../components/demos');

export function formatDemoCode(source: string) {
  return source
    .replace(/^\uFEFF/, '')
    .replace(/^['"]use client['"];\r?\n+/m, '')
    .replace(/from ['"]@\/lib\/ui['"]/g, "from '@harjs/react-ui'")
    .trim();
}

function extractNamedExport(source: string, name: string) {
  const exports = [...source.matchAll(/^export function (\w+)/gm)].map((match) => match[1]);
  if (exports.length <= 1) return source;

  const start = source.search(new RegExp(`^export function ${name}\\b`, 'm'));
  if (start < 0) return source;

  const brace = source.indexOf('{', start);
  if (brace < 0) return source;

  let depth = 0;
  for (let index = brace; index < source.length; index++) {
    const char = source[index];
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        const headerStart = source.search(/^export function /m);
        const header = source.slice(0, headerStart).trimEnd();
        const fn = source.slice(start, index + 1).trim();
        return `${header}\n\n${fn}\n`;
      }
    }
  }

  return source;
}

function listDemoFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const files: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listDemoFiles(full));
    else if (entry.name.endsWith('.tsx')) files.push(full);
  }

  return files;
}

export function getDemoCodeByExportName(name: string) {
  if (!name) return '';

  for (const file of listDemoFiles(DEMOS_DIR)) {
    const source = fs.readFileSync(file, 'utf8');

    if (new RegExp(`export function ${name}\\b`).test(source)) {
      return formatDemoCode(extractNamedExport(source, name));
    }
  }

  return '';
}

function getClientReferenceId(type: object) {
  const record = type as Record<string, unknown>;
  if (typeof record.$$id === 'string') return record.$$id;

  const payload = record._payload as { value?: unknown } | undefined;
  const value = payload?.value;
  if (Array.isArray(value) && typeof value[0] === 'string') {
    return typeof value[1] === 'string' ? `${value[0]}#${value[1]}` : value[0];
  }

  return '';
}

function getComponentName(type: unknown) {
  if (!type) return '';

  if (typeof type === 'function') {
    const fn = type as { name?: string; displayName?: string };
    return fn.name || fn.displayName?.replace(/\W/g, '') || '';
  }

  if (typeof type !== 'object') return '';

  const record = type as { name?: string; displayName?: string };
  if (record.name) return record.name;
  if (record.displayName) return record.displayName.replace(/\W/g, '');

  const id = getClientReferenceId(type);
  if (!id) return '';

  const hashed = id.split('#').pop() ?? '';
  const exportName = hashed.match(/^[A-Za-z_][A-Za-z0-9_]*/)?.[0] ?? '';
  return exportName;
}

export function getDemoCodeFromChildren(children: ReactNode) {
  const child = Children.toArray(children).find(isValidElement);
  if (!child || typeof child.type === 'string') return '';

  return getDemoCodeByExportName(getComponentName(child.type));
}
