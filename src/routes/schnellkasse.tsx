import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/shell";
import { Schnellkasse } from "@/components/pos/schnellkasse";

export const Route = createFileRoute("/schnellkasse")({ component: Page });

function Page() {
  return (
    <AppShell>
      <Schnellkasse />
    </AppShell>
  );
}
