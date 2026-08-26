import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/shell";
import { ReservationsView } from "@/components/pos/reservations-view";

export const Route = createFileRoute("/reservierungen")({ component: Page });

function Page() {
  return (
    <AppShell>
      <ReservationsView />
    </AppShell>
  );
}
