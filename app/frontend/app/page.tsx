import Link from "next/link";
import { PublicLayout } from "@/components/layout";
import { Card } from "@/components/ui";

export default function Home() {
  return (
    <PublicLayout
      title="Welcome to Gatherraa"
      subtitle="Track your contributions, earnings, and missions in one place."
      className="flex items-center"
    >
      <Card className="w-full">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold">Build, contribute, and grow</h2>
            <p className="mt-2 text-muted">
              Explore events, monitor missions, and manage contributor progress
              through shared layouts and reusable components.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/events"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Browse Events
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </Card>
    </PublicLayout>
  );
}
