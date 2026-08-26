import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  ShoppingBag,
  ChefHat,
  CalendarClock,
  BarChart3,
  UtensilsCrossed,
  Users,
  Package,
  ClipboardCheck,
  Settings,
  Lock,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePosStore } from "@/lib/pos/store";
import { formatEUR } from "@/lib/pos/money";
import { checkTotal, lastCloseAt } from "@/lib/pos/store";
import { Button } from "@/components/ui/button";
import { PinLock } from "@/components/pos/pin-lock";

const NAV = [
  { to: "/", label: "Tischplan", icon: LayoutGrid },
  { to: "/schnellkasse", label: "Schnellkasse", icon: ShoppingBag },
  { to: "/kueche", label: "Küche", icon: ChefHat },
  { to: "/reservierungen", label: "Reservierungen", icon: CalendarClock },
  { to: "/berichte", label: "Berichte", icon: BarChart3 },
  { to: "/artikel", label: "Artikel", icon: UtensilsCrossed },
  { to: "/personal", label: "Personal", icon: Users },
  { to: "/inventar", label: "Inventar", icon: Package },
  { to: "/abschluss", label: "Abschluss", icon: ClipboardCheck },
  { to: "/einstellungen", label: "Einstellungen", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const hydrated = usePosStore((s) => s.hydrated);
  const setHydrated = usePosStore((s) => s.setHydrated);
  const currentStaffId = usePosStore((s) => s.currentStaffId);
  const staff = usePosStore((s) => s.staff);
  const lock = usePosStore((s) => s.lock);
  const settings = usePosStore((s) => s.settings);
  const checks = usePosStore((s) => s.checks);
  const dayCloses = usePosStore((s) => s.dayCloses);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [clock, setClock] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    void Promise.resolve(usePosStore.persist.rehydrate()).finally(() => {
      if (!usePosStore.getState().hydrated) setHydrated();
    });
  }, [setHydrated]);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-bg text-fg">
        <p className="font-sans text-3xl font-semibold tracking-tight">Vesper</p>
        <p className="mt-2 text-sm text-muted">Kasse wird geladen…</p>
      </div>
    );
  }

  if (!currentStaffId) {
    return <PinLock />;
  }

  const me = staff.find((s) => s.id === currentStaffId);
  const since = lastCloseAt(dayCloses);
  const todaySales = checks
    .filter((c) => c.status === "paid" && (c.paidAt ?? 0) >= since)
    .reduce((s, c) => s + checkTotal(c), 0);
  const openTables = checks.filter((c) => c.status !== "paid" && c.status !== "voided" && c.tableId).length;

  return (
    <div className="flex min-h-dvh bg-bg text-fg">
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="px-5 pt-6 pb-4">
          <p className="text-lg font-semibold tracking-tight">Vesper</p>
          <p className="mt-0.5 truncate text-xs text-muted">{settings.restaurantName}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 pb-4">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" || pathname.startsWith("/tisch") : pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                  active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border px-4 py-4">
          <p className="text-xs text-subtle">Heute</p>
          <p className="font-mono text-lg tabular-nums">{formatEUR(todaySales)}</p>
          <p className="text-xs text-muted">{openTables} offene Tische</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-surface px-3 sm:px-5">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menü"
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{me?.name}</p>
            <p className="hidden text-xs text-muted sm:block">
              {me?.role === "inhaber" ? "Inhaber" : me?.role === "bar" ? "Bar" : me?.role === "kueche" ? "Küche" : "Service"}
            </p>
          </div>
          <p className="font-mono text-sm tabular-nums text-muted">{clock}</p>
          <Button variant="outline" size="sm" onClick={lock}>
            <Lock className="size-3.5" />
            Sperren
          </Button>
        </header>

        {menuOpen ? (
          <div className="border-b border-border bg-surface px-3 py-2 lg:hidden">
            <div className="grid grid-cols-2 gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex h-11 items-center gap-2 rounded-md px-3 text-sm",
                    pathname === item.to ? "bg-surface-2" : "text-muted",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
