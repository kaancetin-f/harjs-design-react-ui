"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Alert, Badge, Button, Card, Chip, GridSystem, Icon, Steps, Typography } from "@/lib/ui";
import { CopyButton } from "@/components/copy-button";

const { Flex, Row, Column } = GridSystem;
const { Paragraph, Code } = Typography;

const INSTALL = "npm i @harjs/react-ui";

const STEPS = [
  { key: "account", title: "Account", content: <Paragraph size="sm">Workspace owner.</Paragraph> },
  { key: "company", title: "Company", content: <Paragraph size="sm">Billing profile.</Paragraph> },
  { key: "review", title: "Review", content: <Paragraph size="sm">Confirm and continue.</Paragraph> },
];

export function LandingInstall() {
  return (
    <div className="hero-install">
      <code>{INSTALL}</code>
      <CopyButton text={INSTALL} className="hero-install-copy" />
    </div>
  );
}

LandingInstall.displayName = "LandingInstall";

export function LandingWhy() {
  return (
    <section className="landing-section" aria-labelledby="landing-why">
      <h2 id="landing-why">Why this library</h2>
      <div className="landing-why">
        <article>
          <h3>Typed props</h3>
          <p>
            Shared unions for <code>color</code>, <code>variant</code>, and <code>size</code>. Tables, selects, and
            uploads use generics instead of <code>any</code>.
          </p>
        </article>
        <article>
          <h3>CSS with the import</h3>
          <p>
            Importing from <code>@harjs/react-ui</code> loads <code>har-core.css</code> and each component stylesheet.
            There is no separate CSS entry to remember.
          </p>
        </article>
        <article>
          <h3>Framework-agnostic</h3>
          <p>
            The package does not import <code>next/*</code>. Peer dependencies are React 18+ and React DOM. Next.js is
            optional.
          </p>
        </article>
        <article>
          <h3>Client + SSR guards</h3>
          <p>
            Interactive modules use <code>&quot;use client&quot;</code>. <code>sessionStorage</code> and{" "}
            <code>localStorage</code> reads check <code>typeof window</code> first.
          </p>
        </article>
      </div>
    </section>
  );
}

LandingWhy.displayName = "LandingWhy";

function CatalogCard({
  kicker,
  title,
  href,
  children,
}: {
  kicker: string;
  title: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <article className="landing-catalog-card">
      <div className="landing-catalog-preview">{children}</div>
      <div className="landing-catalog-meta">
        <Chip text={kicker} color="orange" variant="surface" border={{ radius: "full" }} size="sm" />
        <h3>{title}</h3>
        <Link href={href}>Open docs</Link>
      </div>
    </article>
  );
}

CatalogCard.displayName = "CatalogCard";

function LandingSteps() {
  // states
  const [step, setStep] = useState(0);

  return <Steps name="landing-steps" currentStep={step} onChange={setStep} config={{ locale: "en" }} steps={STEPS} />;
}

LandingSteps.displayName = "LandingSteps";

export function LandingCatalog() {
  return (
    <section className="landing-section" aria-labelledby="landing-catalog">
      <h2 id="landing-catalog">Components</h2>
      <p className="landing-lead">Live previews from the public API. Each card links to the matching docs page.</p>
      <div className="landing-catalog">
        <CatalogCard kicker="Form" title="Button" href="/docs/components/form/button">
          <Flex flexWrap="wrap" alignItems="center" gap="var(--space-12)">
            <Button color="blue">Save</Button>
            <Button variant="outlined" color="blue">
              Draft
            </Button>
          </Flex>
        </CatalogCard>
        <CatalogCard kicker="Data Display" title="Badge" href="/docs/components/data-display/badge">
          <Flex flexWrap="wrap" alignItems="flex-end" gap="var(--space-24)">
            <Badge count={5}>
              <span
                style={{
                  display: "block",
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-8)",
                  background: "var(--gray-200)",
                }}
              />
            </Badge>
            <Badge count={0} config={{ showZero: true }}>
              <span
                style={{
                  display: "block",
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-8)",
                  background: "var(--gray-200)",
                }}
              />
            </Badge>
            <Badge status="success" text="Success" />
          </Flex>
        </CatalogCard>
        <CatalogCard kicker="Data Display" title="Chip" href="/docs/components/data-display/chip">
          <Flex flexWrap="wrap" alignItems="center" gap="var(--space-8)">
            <Chip text="Design" color="blue" />
            <Chip text="API" color="green" variant="filled" />
            <Chip text="Docs" color="orange" variant="surface" />
          </Flex>
        </CatalogCard>
        <CatalogCard kicker="Feedback" title="Alert" href="/docs/components/feedback/alert">
          <Alert status="success" message="Aurora is live. The production slot is yours." />
        </CatalogCard>
        <CatalogCard kicker="Navigation" title="Steps" href="/docs/components/navigation/steps">
          <LandingSteps />
        </CatalogCard>
        <CatalogCard kicker="Layout" title="Grid System" href="/docs/components/layout/grid-system">
          <Row>
            <Column size={8}>
              <Card title="Main">Eight columns.</Card>
            </Column>
            <Column size={4}>
              <Card title="Aside">Four.</Card>
            </Column>
          </Row>
        </CatalogCard>
      </div>
    </section>
  );
}

LandingCatalog.displayName = "LandingCatalog";

function CompatStatus({ status }: { status: "Verified" | "Unsupported" }) {
  // variables
  const verified = status === "Verified";

  return (
    <span className={`landing-status${verified ? " verified" : " unsupported"}`}>
      <Icon
        icon={verified ? "TickCircle" : "CloseCircle"}
        size={16}
        fill="currentColor"
      />
      {status}
    </span>
  );
}

CompatStatus.displayName = "CompatStatus";

type CompatBrand = "next" | "vite" | "react" | "remix" | "blitz" | "webpack";

function CompatBrandIcon({ brand }: { brand: CompatBrand }) {
  // variables
  const props = {
    className: "landing-env-icon",
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
  };

  switch (brand) {
    case "next":
      return (
        <svg {...props}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.08-1.38L8.3 9.12V16.5H6.75V7.5h1.72l9.1 12.03A9.96 9.96 0 0 0 22 12c0-5.52-4.48-10-10-10Zm4.25 13.47-1.55-2.05V7.5h1.55v7.97Z" />
        </svg>
      );
    case "vite":
      return (
        <svg {...props}>
          <path d="M12.94 1.5 22.5 19.12a1 1 0 0 1-.87 1.5H2.37a1 1 0 0 1-.87-1.5L11.06 1.5a1 1 0 0 1 1.88 0ZM12 5.62 4.86 18.12h4.4L12 12.4l2.74 5.72h4.4L12 5.62Z" />
        </svg>
      );
    case "react":
      return (
        <svg {...props}>
          <path d="M12 10.2a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6Zm0-7.7c-2.9 0-5.5 1-7.4 2.6C2.7 6.7 1.5 9.2 1.5 12s1.2 5.3 3.1 6.9c1.9 1.6 4.5 2.6 7.4 2.6s5.5-1 7.4-2.6c1.9-1.6 3.1-4.1 3.1-6.9s-1.2-5.3-3.1-6.9C17.5 3.5 14.9 2.5 12 2.5Zm0 1.5c2.4 0 4.5.8 6 2.1 1.5 1.2 2.4 3 2.4 5.9s-.9 4.7-2.4 5.9c-1.5 1.3-3.6 2.1-6 2.1s-4.5-.8-6-2.1C4.5 16.7 3.6 14.9 3.6 12s.9-4.7 2.4-5.9C7.5 4.8 9.6 4 12 4Zm7.2 1.8c-1.6-1.1-3.7-1.5-5.9-.9 1.6 1.9 2.6 4.5 2.6 7.1s-1 5.2-2.6 7.1c2.2.6 4.3.2 5.9-.9 1.7-1.2 2.7-3.2 2.7-6.2s-1-5-2.7-6.2ZM4.8 5.8C3.1 7 2.1 9 2.1 12s1 5 2.7 6.2c1.6 1.1 3.7 1.5 5.9.9-1.6-1.9-2.6-4.5-2.6-7.1s1-5.2 2.6-7.1c-2.2-.6-4.3-.2-5.9.9Z" />
        </svg>
      );
    case "remix":
      return (
        <svg {...props}>
          <path d="M4.5 3.5h10.2c2.9 0 5.3 2.3 5.3 5.2 0 2.3-1.5 4.3-3.6 5L21 20.5h-4.6l-4.1-6.2H8.7v6.2H4.5V3.5Zm4.2 3.4v4.4h5.4c1.1 0 2-.9 2-2s-.9-2-2-2H8.7Z" />
        </svg>
      );
    case "blitz":
      return (
        <svg {...props}>
          <path d="M13.8 2.5 4.5 13.2h6.2l-1.5 8.3 10.3-12.2h-6.2l1.5-6.8Z" />
        </svg>
      );
    case "webpack":
      return (
        <svg {...props}>
          <path d="M12 1.8 3.5 6.7v10.6L12 22.2l8.5-4.9V6.7L12 1.8Zm0 2.3 6.2 3.6v1.8L12 13.1 5.8 9.5V7.7L12 4.1Zm-6.2 7.3 5.4 3.1v5.4l-5.4-3.1v-5.4Zm7 8.5v-5.4l5.4-3.1v5.4l-5.4 3.1Z" />
        </svg>
      );
  }
}

CompatBrandIcon.displayName = "CompatBrandIcon";

function CompatEnv({ brand, label }: { brand: CompatBrand; label: string }) {
  return (
    <span className="landing-env">
      <CompatBrandIcon brand={brand} />
      {label}
    </span>
  );
}

CompatEnv.displayName = "CompatEnv";

const COMPAT_ROWS: Array<{
  brand: CompatBrand;
  label: string;
  status: "Verified" | "Unsupported";
  notes: ReactNode;
}> = [
  {
    brand: "next",
    label: "Next.js App Router",
    status: "Verified",
    notes: "This documentation site. Interactive modules are client components.",
  },
  {
    brand: "next",
    label: "Next.js Pages Router",
    status: "Verified",
    notes: "Next.js 16 Pages Router. Import the package stylesheet in _app.",
  },
  {
    brand: "vite",
    label: "Vite + React",
    status: "Verified",
    notes: "Vite 6 production build with React 18.",
  },
  {
    brand: "react",
    label: "Create React App 5",
    status: "Verified",
    notes: "React Scripts 5 production build with React 18.",
  },
  {
    brand: "remix",
    label: "Remix (Vite)",
    status: "Verified",
    notes: "Remix 2 production client and server builds with Vite 6.",
  },
  {
    brand: "blitz",
    label: "Blitz.js",
    status: "Verified",
    notes: "Blitz 3 production build with Next.js 15.",
  },
  {
    brand: "webpack",
    label: "CRA 4 / webpack 4",
    status: "Unsupported",
    notes: (
      <>
        No CommonJS export (<code>exports.require</code> is absent).
      </>
    ),
  },
];

export function LandingCompatibility() {
  return (
    <section className="landing-section" aria-labelledby="landing-compat">
      <h2 id="landing-compat">Compatibility</h2>
      <p className="landing-lead">
        Package smoke builds run in CI for each environment listed as Verified.
      </p>
      <div className="landing-table-wrap">
        <table>
          <caption className="sr-only">Framework compatibility</caption>
          <thead>
            <tr>
              <th scope="col">Environment</th>
              <th scope="col">Status</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {COMPAT_ROWS.map((row) => (
              <tr key={row.label}>
                <td>
                  <CompatEnv brand={row.brand} label={row.label} />
                </td>
                <td>
                  <CompatStatus status={row.status} />
                </td>
                <td>{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

LandingCompatibility.displayName = "LandingCompatibility";

export function LandingQuickStart() {
  // variables
  const sample = `import "@harjs/react-ui/styles.css";
import { Button } from "@harjs/react-ui";

export function App() {
  return (
    <Button variant="filled" color="blue" size="md">
      Get started
    </Button>
  );
}`;

  return (
    <section className="landing-section" aria-labelledby="landing-install">
      <h2 id="landing-install">Quick start</h2>
      <p className="landing-lead">
        Peer dependencies are <code>react</code> and <code>react-dom</code> ≥ 18. Import the stylesheet once at your app entry.
      </p>
      <div className="landing-code">
        <div className="landing-code-header">
          <span>tsx</span>
          <CopyButton text={sample} />
        </div>
        <Code lang="tsx">{sample}</Code>
      </div>
    </section>
  );
}

LandingQuickStart.displayName = "LandingQuickStart";
