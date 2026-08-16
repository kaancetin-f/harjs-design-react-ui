import Link from "next/link";
import { DocsLogo } from "@/components/docs-logo";
import { HeroShowcase } from "@/components/hero-showcase";
import {
  LandingCatalog,
  LandingCompatibility,
  LandingInstall,
  LandingQuickStart,
  LandingWhy,
} from "@/components/landing-catalog";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="landing">
      <div className="landing-aurora" aria-hidden />
      <div className="landing-grain" aria-hidden />

      <header className="landing-nav">
        <DocsLogo />
        <div className="landing-links">
          <Link href="/docs">Docs</Link>
          <a href="https://www.npmjs.com/package/@harjs/react-ui" target="_blank" rel="noreferrer">
            npm
          </a>
          <a
            href="https://github.com/kaancetin-f/harjs-design-react-ui"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-kicker">React 18+ · TypeScript · ESM</div>
            <h1>Type-safe React UI, CSS included.</h1>
            <p>
              <code>@harjs/react-ui</code> is a component library for forms, data display, feedback,
              navigation, and layout. Import from the package root and the required CSS comes with
              it. The library does not import Next.js APIs.
            </p>
            <div className="hero-actions">
              <Link href="/docs" className="btn btn-primary">
                Get started
              </Link>
              <Link href="/docs/components/form/button" className="btn btn-ghost">
                Browse components
              </Link>
            </div>
            <LandingInstall />
          </div>
          <HeroShowcase />
        </section>

        <LandingWhy />
        <LandingCatalog />
        <LandingCompatibility />
        <LandingQuickStart />

        <div className="landing-cta-wrap">
          <section className="landing-cta" aria-labelledby="landing-cta">
            <div>
              <h2 id="landing-cta">Next: install and render a Button</h2>
              <p>Requirements, framework notes, and troubleshooting live on Get Started.</p>
            </div>
            <Link href="/docs" className="btn btn-primary">
              Get started
            </Link>
          </section>
        </div>
      </main>

      <footer className="landing-foot">
        <span>MIT · React 18+ · 45 public components</span>
        <span className="landing-foot-muted">@harjs/react-ui</span>
      </footer>
    </div>
  );
}
