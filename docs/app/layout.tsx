import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3, JetBrains_Mono } from "next/font/google";
import "../../src/assets/css/core/har-core.css";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display-loaded",
  weight: ["500", "600", "700", "800"],
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "HarJS · React UI",
    template: "%s · HarJS",
  },
  description: "Type-safe React UI components. CSS ships with the package import.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeInitScript = `(function(){try{var k='harjs-docs-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        style={
          {
            "--font-display": 'var(--font-display-loaded), "Plus Jakarta Sans", system-ui, sans-serif',
            "--font-body": 'var(--font-body-loaded), "Source Sans 3", system-ui, sans-serif',
            "--font-mono": 'var(--font-mono-loaded), "JetBrains Mono", ui-monospace, monospace',
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
