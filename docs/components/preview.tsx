import type { ReactNode } from "react";

export function Preview({ children }: { children: ReactNode }) {
  return <div className="preview">{children}</div>;
}

Preview.displayName = "Preview";

export function Cards({ children }: { children: ReactNode }) {
  return <div className="cards">{children}</div>;
}

Cards.displayName = "Cards";

export function Card({
  title,
  href,
  description,
}: {
  title: string;
  href: string;
  description?: string;
}) {
  return (
    <a className="card" href={href}>
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
    </a>
  );
}

Card.displayName = "Card";
