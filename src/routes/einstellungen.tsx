import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/shell";
import { SettingsView } from "@/components/pos/settings-view";

export const Route = createFileRoute("/einstellungen")({ component: Page });

function Page() {
  return (
    <AppShell>
      <SettingsView />
    </AppShell>
  );
}
