import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ThemeToggle } from "./theme-provider";

const headingSerif = Playfair_Display({
  variable: "--font-heading-serif",
  subsets: ["latin"],
});

const bodySans = DM_Sans({
  variable: "--font-body-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Gallery",
  description: "A calm, design-first online art gallery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingSerif.variable} ${bodySans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-[color:var(--secondary)] bg-[color:var(--background)]/95 backdrop-blur">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex flex-col">
                  <span className="font-serif text-lg tracking-wide uppercase">
                    The Gallery
                  </span>
                  <span className="text-xs text-neutral-600 dark:text-neutral-300">
                    A personal collection of images and objects
                  </span>
                </div>
                <nav className="flex items-center gap-4 text-sm">
                  <a href="/" className="hover:text-[color:var(--accent)]">
                    Home
                  </a>
                  <a
                    href="/gallery"
                    className="hover:text-[color:var(--accent)]"
                  >
                    Gallery
                  </a>
                  <a href="/about" className="hover:text-[color:var(--accent)]">
                    About
                  </a>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-[color:var(--secondary)] py-4 text-xs text-neutral-600 dark:text-neutral-300">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <span>&copy; {new Date().getFullYear()} The Gallery.</span>
                <span>Built with Next.js.</span>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
