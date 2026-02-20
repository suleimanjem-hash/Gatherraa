import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "../ui/utils";

interface PublicLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Layout shell for public pages like home and events.
 */
export function PublicLayout({
  title,
  subtitle,
  children,
  className,
}: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold">
            Gatherraa
          </Link>
          <nav className="flex items-center gap-3 text-sm text-muted">
            <Link href="/events" className="hover:text-foreground">
              Events
            </Link>
            <Link href="/dashboard" className="hover:text-foreground">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-2 text-muted">{subtitle}</p> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
