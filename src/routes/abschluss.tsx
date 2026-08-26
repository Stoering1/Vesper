import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/shell";
import { CloseDayView } from "@/components/pos/close-day-view";

export const Route = createFileRoute("/abschluss")({ component: Page });

function Page() {
  return (
    <AppShell>
      <CloseDayView />
    </AppShell>
  );
}
