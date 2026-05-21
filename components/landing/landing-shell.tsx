import { cn } from "@/lib/utils";

export function LandingShell({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn("px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
