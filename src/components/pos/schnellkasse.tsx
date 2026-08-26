import { useEffect, useState } from "react";
import { OrderWorkspace } from "@/components/pos/order-workspace";
import { usePosStore } from "@/lib/pos/store";
import { Button } from "@/components/ui/button";
import type { CheckType } from "@/lib/pos/types";

export function Schnellkasse() {
  const openWalkIn = usePosStore((s) => s.openWalkIn);
  const [checkId, setCheckId] = useState<string | null>(null);
  const [type, setType] = useState<CheckType>("takeaway");

  useEffect(() => {
    setCheckId(openWalkIn(type, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checkId) return null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex gap-2 border-b border-border px-4 py-2">
        <Button
          size="sm"
          variant={type === "takeaway" ? "default" : "outline"}
          onClick={() => {
            const id = openWalkIn("takeaway", 1);
            setType("takeaway");
            setCheckId(id);
          }}
        >
          Mitnahme (7 % Speisen)
        </Button>
        <Button
          size="sm"
          variant={type === "lieferung" ? "default" : "outline"}
          onClick={() => {
            const id = openWalkIn("lieferung", 1);
            setType("lieferung");
            setCheckId(id);
          }}
        >
          Lieferung
        </Button>
        <Button
          size="sm"
          variant={type === "tisch" ? "default" : "outline"}
          onClick={() => {
            const id = openWalkIn("tisch", 1);
            setType("tisch");
            setCheckId(id);
          }}
        >
          Theke / vor Ort
        </Button>
      </div>
      <div className="min-h-0 flex-1">
        <OrderWorkspace checkId={checkId} />
      </div>
    </div>
  );
}
