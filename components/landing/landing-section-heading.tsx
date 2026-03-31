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
  align = "left",
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: LandingSectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" ? "text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "font-mono text-xs font-medium uppercase tracking-[0.2em] text-blue-600",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "mt-4 heading-display text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 max-w-2xl text-[15px] leading-7 text-slate-500",
            align === "center" && "mx-auto",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
