import Link from 'next/link';
import { LogoMark } from '@/components/logo-mark';

export function DocsLogo() {
  return (
    <Link href="/" className="docs-logo">
      <LogoMark size={32} />
      <span className="docs-logo-text">
        <span className="docs-logo-full">
          @harjs/<em>react-ui</em>
        </span>
        <span className="docs-logo-short">HarJS</span>
      </span>
    </Link>
  );
}

DocsLogo.displayName = "DocsLogo";
