import { CodeBlock } from "./code-block";
import { ApiEndpoint } from "./api-endpoint";
import { ApiParameterTable } from "./api-parameter-table";
import { ReviewCriteria } from "./review-criteria";
import { Checklist, ChecklistItem } from "./checklist";
import {
  Eyebrow,
  LeafShape,
  QuarterCircle,
} from "./geometric-motifs";
import { Card, CardContent } from "@/components/ui/card";
import { Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocBlock, DocPage, DocCategory } from "@/content/docs/types";

const categoryLabel: Record<DocCategory, string> = {
  "getting-started": "시작하기",
  development: "개발",
  guidelines: "가이드라인",
  design: "디자인",
  distribution: "배포",
};

// Callout palette tuned to DESIGN.md core 3-color system.
const calloutMeta = {
  info: {
    icon: Info,
    accent: "bg-foreground",
    surface: "bg-foreground/5 border-foreground/15",
    iconBox: "bg-foreground text-background",
    title: "text-foreground",
  },
  warning: {
    icon: AlertTriangle,
    accent: "bg-union",
    surface: "bg-union/5 border-union/30",
    iconBox: "bg-union text-white",
    title: "text-union",
  },
  success: {
    icon: CheckCircle2,
    accent: "bg-[#2D8A4E]",
    surface: "bg-[#2D8A4E]/5 border-[#2D8A4E]/30",
    iconBox: "bg-[#2D8A4E] text-white",
    title: "text-[#2D8A4E]",
  },
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[22px] font-bold tracking-tight text-foreground flex items-baseline gap-3 leading-snug">
      <span aria-hidden className="inline-block w-6 h-[3px] bg-union shrink-0 translate-y-[-4px]" />
      {children}
    </h2>
  );
}

function BlockRenderer({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "text":
      return (
        <section className="space-y-3">
          {block.title && <SectionHeading>{block.title}</SectionHeading>}
          <div className="space-y-2.5 text-[14.5px] leading-[1.75] text-foreground/75">
            {block.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      );

    case "code":
      return (
        <section className="space-y-2">
          {block.title && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              {block.title}
            </p>
          )}
          <CodeBlock code={block.code} language={block.language} />
        </section>
      );

    case "steps":
      return (
        <section className="space-y-5">
          {block.title && <SectionHeading>{block.title}</SectionHeading>}
          <ol className="space-y-3">
            {block.items.map((step, i) => (
              <li
                key={i}
                className="relative rounded-xl border border-border bg-card p-5 pl-16 space-y-2.5 transition-colors hover:border-union/40"
              >
                {/* Number badge — quarter-circle framed, charcoal/red split */}
                <div className="absolute left-5 top-5 w-8 h-8 grid place-items-center bg-foreground text-background font-display font-bold text-[13px] rounded-tr-2xl">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-[16px] font-bold text-foreground">
                  {step.title}
                </h3>
                {step.body && (
                  <p className="text-[13.5px] leading-relaxed text-foreground/70">
                    {step.body}
                  </p>
                )}
                {step.code && (
                  <CodeBlock code={step.code.content} language={step.code.language} />
                )}
              </li>
            ))}
          </ol>
        </section>
      );

    case "api":
      return (
        <section className="space-y-4">
          {block.title && <SectionHeading>{block.title}</SectionHeading>}
          <div className="space-y-3">
            {block.items.map((api, i) => (
              <ApiEndpoint
                key={i}
                method={api.module.toUpperCase()}
                path={api.signature}
                description={api.description}
              >
                <div className="space-y-3 mt-3">
                  {api.permission && (
                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <span className="text-[10px] uppercase tracking-wider font-semibold">필요 권한</span>
                      <code className="font-mono bg-union/8 text-union px-2 py-0.5 rounded text-[11.5px] font-semibold">
                        {api.permission}
                      </code>
                    </div>
                  )}
                  {api.params && api.params.length > 0 && (
                    <ApiParameterTable parameters={api.params} />
                  )}
                  <CodeBlock code={api.example} language="typescript" variant="compact" />
                </div>
              </ApiEndpoint>
            ))}
          </div>
        </section>
      );

    case "permissions":
      return (
        <section className="space-y-4">
          {block.title && <SectionHeading>{block.title}</SectionHeading>}
          <div className="grid gap-2.5">
            {block.items.map((perm) => (
              <Card
                key={perm.scope}
                className="relative border-border overflow-hidden hover:border-union/40 transition-colors"
              >
                {/* tiny quarter-circle on top-left */}
                <QuarterCircle
                  aria-hidden
                  className="absolute top-0 left-0 w-3 h-3 text-union"
                />
                <CardContent className="space-y-2 p-5 pl-6">
                  <code className="text-[13px] font-mono font-bold text-foreground">
                    {perm.scope}
                  </code>
                  <dl className="grid gap-1.5 text-[13px] leading-relaxed">
                    <div className="flex gap-2">
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold pt-[3px] w-20 shrink-0">
                        제공
                      </dt>
                      <dd className="text-foreground/85">{perm.grants}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold pt-[3px] w-20 shrink-0">
                        권장
                      </dt>
                      <dd className="text-foreground/85">{perm.recommended}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-[10px] uppercase tracking-wider text-union font-semibold pt-[3px] w-20 shrink-0">
                        남용 사례
                      </dt>
                      <dd className="text-foreground/85">{perm.abuse}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      );

    case "criteria":
      return (
        <section className="space-y-4">
          {block.title && <SectionHeading>{block.title}</SectionHeading>}
          <div className="space-y-2.5">
            {block.items.map((c, i) => (
              <ReviewCriteria key={i} criteria={c} />
            ))}
          </div>
        </section>
      );

    case "checklist":
      return (
        <section className="space-y-3">
          {block.title && <SectionHeading>{block.title}</SectionHeading>}
          <Checklist>
            {block.items.map((item) => (
              <ChecklistItem key={item.id} id={item.id} detail={item.detail}>
                {item.label}
              </ChecklistItem>
            ))}
          </Checklist>
        </section>
      );

    case "callout": {
      const meta = calloutMeta[block.tone];
      const Icon = meta.icon;
      return (
        <aside
          className={cn(
            "relative rounded-xl border overflow-hidden",
            meta.surface,
          )}
        >
          {/* left accent bar */}
          <div className={cn("absolute left-0 top-0 bottom-0 w-1", meta.accent)} />
          <div className="flex gap-3 px-5 py-4 pl-6">
            <div className={cn("h-7 w-7 shrink-0 grid place-items-center rounded-md", meta.iconBox)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-1 text-[13.5px] leading-relaxed pt-0.5">
              {block.title && (
                <p className={cn("font-display font-bold tracking-tight text-[14px]", meta.title)}>
                  {block.title}
                </p>
              )}
              <p className="text-foreground/80">{block.body}</p>
            </div>
          </div>
        </aside>
      );
    }

    default:
      return null;
  }
}

export function DocRenderer({ page }: { page: DocPage }) {
  return (
    <article className="max-w-3xl space-y-12">
      {/* Hero header — eyebrow + display title + leaf decoration + accent bar */}
      <header className="relative pb-2">
        {/* Decorative leaf, top-right, very subtle */}
        <LeafShape
          aria-hidden
          className="absolute -top-4 right-0 w-20 h-20 text-union/8 -rotate-12 pointer-events-none hidden md:block"
        />
        <div className="relative space-y-4">
          <Eyebrow>{categoryLabel[page.category]}</Eyebrow>
          <h1 className="font-display text-[40px] md:text-[44px] font-bold tracking-[-0.02em] leading-[1.1] text-foreground">
            {page.title}
          </h1>
          <p className="text-[16px] leading-[1.7] text-foreground/65 max-w-2xl">
            {page.description}
          </p>
          <div className="pt-1">
            <span aria-hidden className="block h-[3px] w-12 bg-union" />
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {page.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    </article>
  );
}
