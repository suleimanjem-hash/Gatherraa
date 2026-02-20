import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "../ui/utils";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Layout shell for contributor dashboard and authenticated views.
 */
export function DashboardLayout({
  title,
  subtitle,
  actions,
  children,
  className,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Contributor</p>
            <h1 className="text-lg font-semibold">Gatherraa Dashboard</h1>
          </div>
          <Link href="/events" className="text-sm text-primary hover:text-primary-hover">
            Browse Events
          </Link>
        </div>
      </header>

      <main className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {subtitle ? <p className="mt-2 text-muted">{subtitle}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </div>
        {children}
      </main>
    </div>
  );
}
