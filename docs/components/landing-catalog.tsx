"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Alert, Button, Card, Chip, GridSystem, Steps, Typography } from "@/lib/ui";
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

export function LandingCompatibility() {
  return (
    <section className="landing-section" aria-labelledby="landing-compat">
      <h2 id="landing-compat">Compatibility</h2>
      <p className="landing-lead">
        Claims below match the package graph. Environments that are not exercised in this repo are marked Not tested.
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
            <tr>
              <td>Next.js App Router</td>
              <td>Verified</td>
              <td>This documentation site. Interactive modules are client components.</td>
            </tr>
            <tr>
              <td>Next.js Pages Router</td>
              <td>Not tested</td>
              <td>No Next.js APIs in the library. CSS still comes from JS imports.</td>
            </tr>
            <tr>
              <td>Vite + React</td>
              <td>Not tested</td>
              <td>Vite handles CSS imported from JavaScript.</td>
            </tr>
            <tr>
              <td>Create React App 5</td>
              <td>Not tested</td>
              <td>Package is ESM-only. CRA 5 uses webpack 5.</td>
            </tr>
            <tr>
              <td>Remix (Vite)</td>
              <td>Not tested</td>
              <td>Same CSS-from-JS pattern as Vite.</td>
            </tr>
            <tr>
              <td>Blitz.js</td>
              <td>Not tested</td>
              <td>Built on Next.js. Follow the matching Next.js row.</td>
            </tr>
            <tr>
              <td>CRA 4 / webpack 4</td>
              <td>Unsupported</td>
              <td>
                No CommonJS export (<code>exports.require</code> is absent).
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

LandingCompatibility.displayName = "LandingCompatibility";

export function LandingQuickStart() {
  // variables
  const sample = `import { Button } from "@harjs/react-ui";

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
        Peer dependencies are <code>react</code> and <code>react-dom</code> ≥ 18. Styles load from the root entry.
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
