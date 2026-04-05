import { cn } from "@/lib/utils";

interface LandingSectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}

export function LandingSectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: LandingSectionHeadingProps) {
  return (
    <div className={cn("space-y-4", align === "center" ? "text-center" : "text-left")}>
      {eyebrow ? (
        <p className="text-sm font-semibold tracking-[0.22em] text-union uppercase">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3">
        <h2 className="heading-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
