import { useState } from "react";
import { Delete } from "lucide-react";
import { usePosStore } from "@/lib/pos/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function PinLock() {
  const unlock = usePosStore((s) => s.unlock);
  const settings = usePosStore((s) => s.settings);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function press(key: string) {
    if (key === "del") {
      setPin((p) => p.slice(0, -1));
      setError(false);
      return;
    }
    if (!key || pin.length >= 6) return;
    const next = pin + key;
    setPin(next);
    if (next.length >= 4) {
      const staff = unlock(next);
      if (!staff) {
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 420);
      }
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 text-fg">
      <div className="w-full max-w-sm">
        <p className="text-center text-3xl font-semibold tracking-tight">Vesper</p>
        <p className="mt-1 text-center text-sm text-muted">{settings.restaurantName}</p>
        <p className="mt-8 text-center text-xs font-medium tracking-wide text-subtle uppercase">
          Mitarbeiter-PIN
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "size-3 rounded-full border border-border",
                i < pin.length && "bg-accent border-accent",
                error && "border-danger bg-danger",
              )}
            />
          ))}
        </div>
        {error ? (
          <p className="mt-3 text-center text-sm text-danger">PIN unbekannt</p>
        ) : (
          <p className="mt-3 text-center text-sm text-subtle">Demo: 1111 Anna · 0000 Inhaber</p>
        )}
        <div className="mt-8 grid grid-cols-3 gap-2">
          {KEYS.map((key, i) =>
            key === "" ? (
              <span key={i} />
            ) : (
              <Button
                key={key + i}
                variant="muted"
                className="h-16 rounded-lg text-xl font-medium"
                onClick={() => press(key === "del" ? "del" : key)}
                aria-label={key === "del" ? "Löschen" : key}
              >
                {key === "del" ? <Delete className="size-5" /> : key}
              </Button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
