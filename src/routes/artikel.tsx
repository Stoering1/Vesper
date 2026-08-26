import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/shell";
import { ArticlesView } from "@/components/pos/articles-view";

export const Route = createFileRoute("/artikel")({ component: Page });

function Page() {
  return (
    <AppShell>
      <ArticlesView />
    </AppShell>
  );
}
