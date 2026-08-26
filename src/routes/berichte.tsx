import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/shell";
import { ReportsView } from "@/components/pos/reports-view";

export const Route = createFileRoute("/berichte")({ component: Page });

function Page() {
  return (
    <AppShell>
      <ReportsView />
    </AppShell>
  );
}
