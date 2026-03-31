import { cn } from "@/lib/utils";

interface LandingSectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function LandingSectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: LandingSectionHeadingProps) {
  return (
    <div className={cn("space-y-4", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "text-sm font-semibold tracking-[0.22em] text-union uppercase",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3">
        <h2
          className={cn(
            "heading-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg",
              descriptionClassName,
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
