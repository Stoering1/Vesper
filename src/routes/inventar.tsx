import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/shell";
import { InventoryView } from "@/components/pos/inventory-view";

export const Route = createFileRoute("/inventar")({ component: Page });

function Page() {
  return (
    <AppShell>
      <InventoryView />
    </AppShell>
  );
}
