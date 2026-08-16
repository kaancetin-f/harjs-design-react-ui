import Link from 'next/link';
import { LogoMark } from '@/components/logo-mark';

export function DocsLogo() {
  return (
    <Link href="/" className="docs-logo">
      <LogoMark size={32} />
      <span className="docs-logo-text">
        @harjs/<em>react-ui</em>
      </span>
    </Link>
  );
}

DocsLogo.displayName = "DocsLogo";
