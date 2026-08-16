/**
 * Live-compile the Code panel. Sucrase turns the edited TSX into a function
 * the browser can run; rewriting that transformer by hand is not worth it.
 */
import * as React from 'react';
import * as UI from '@/lib/ui';
import {
  LayoutDemoFrame,
  LayoutShell,
  layoutDemoMenuData,
} from '@/components/demos/layout/layout/shell';
import { SessionStorage } from '../../src/libs/infrastructure/shared/Enums';

const scope: Record<string, unknown> = {
  ...UI,
  useState: React.useState,
  useEffect: React.useEffect,
  useMemo: React.useMemo,
  useCallback: React.useCallback,
  useRef: React.useRef,
  useId: React.useId,
  useLayoutEffect: React.useLayoutEffect,
  Fragment: React.Fragment,
  LayoutDemoFrame,
  LayoutShell,
  layoutDemoMenuData,
  SessionStorage,
};

function stripImports(source: string) {
  return source
    .replace(/import\s+(?:type\s+)?[\s\S]*?from\s+['"][^'"]+['"]\s*;?/g, '')
    .replace(/import\s+['"][^'"]+['"]\s*;?/g, '')
    .trim();
}

function findExportName(source: string, preferred?: string) {
  const names = [...source.matchAll(/export\s+(?:async\s+)?function\s+(\w+)/g)].map(
    (match) => match[1],
  );

  if (preferred && names.includes(preferred)) return preferred;
  return names[0] ?? '';
}

export async function compileLiveDemo(source: string, exportName?: string) {
  const { transform } = await import('sucrase');
  const componentName = findExportName(source, exportName);

  if (!componentName) {
    throw new Error('Export a function to render, for example `export function Demo()`.');
  }

  const prepared = stripImports(source)
    .replace(/export\s+default\s+function/g, 'function')
    .replace(/export\s+function/g, 'function')
    .replace(/export\s+const/g, 'const')
    .replace(/export\s+\{[\s\S]*?\}/g, '');

  const compiled = transform(prepared, {
    transforms: ['typescript', 'jsx'],
    jsxRuntime: 'classic',
    production: true,
  }).code;

  const keys = Object.keys(scope);
  const factory = new Function(
    'React',
    ...keys,
    `${compiled}\nreturn ${componentName};`,
  ) as (...args: unknown[]) => React.ComponentType;

  const Component = factory(React, ...keys.map((key) => scope[key]));

  if (typeof Component !== 'function') {
    throw new Error(`Could not render ${componentName}.`);
  }

  return Component;
}
