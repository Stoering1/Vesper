import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/shell";
import { TablePlan } from "@/components/pos/table-plan";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <TablePlan />
    </AppShell>
  );
}
