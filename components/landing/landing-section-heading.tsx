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
        <p className="text-[11px] font-medium tracking-[0.3em] text-[#52A882] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-3">
        <h2 className="heading-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="mx-auto max-w-3xl text-base leading-7 text-white/40 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
