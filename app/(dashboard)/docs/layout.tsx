import { DocSidebar } from "@/components/docs/doc-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-8">
      <aside className="hidden w-60 shrink-0 lg:block animate-slide-in-left">
        <DocSidebar />
      </aside>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
