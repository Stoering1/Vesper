import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/shell";
import { KitchenBoard } from "@/components/pos/kitchen-board";

export const Route = createFileRoute("/kueche")({ component: Page });

function Page() {
  return (
    <AppShell>
      <KitchenBoard />
    </AppShell>
  );
}
