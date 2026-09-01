import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AppShell } from "@/components/layout/shell";
import { OrderWorkspace } from "@/components/pos/order-workspace";
import { usePosStore } from "@/lib/pos/store";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tisch/$tableId")({
  validateSearch: z.object({ checkId: z.string().optional() }),
  component: TableOrder,
});

function TableOrder() {
  const { tableId } = Route.useParams();
  const { checkId } = Route.useSearch();
  const check = usePosStore((s) =>
    checkId
      ? s.checks.find((c) => c.id === checkId && c.status !== "paid" && c.status !== "voided")
      : s.checks.find((c) => c.tableId === tableId && c.status !== "paid" && c.status !== "voided"),
  );

  return (
    <AppShell>
      {check ? (
        <OrderWorkspace checkId={check.id} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8">
          <p className="text-muted">Kein offener Vorgang an diesem Tisch.</p>
          <Button asChild variant="outline">
            <Link to="/">Zum Tischplan</Link>
          </Button>
        </div>
      )}
    </AppShell>
  );
}
