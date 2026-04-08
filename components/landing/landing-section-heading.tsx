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
    <div className={cn(align === "center" ? "text-center" : "text-left")}>
      {eyebrow ? (
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E83A33] mb-5">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className="heading-display font-bold leading-[1.08] tracking-tight text-[#262725]"
        style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-[#6B6D6B]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
