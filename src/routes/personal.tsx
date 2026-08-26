import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/shell";
import { StaffView } from "@/components/pos/staff-view";

export const Route = createFileRoute("/personal")({ component: Page });

function Page() {
  return (
    <AppShell>
      <StaffView />
    </AppShell>
  );
}
