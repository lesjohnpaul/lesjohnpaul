import Image from "next/image";
import { cn } from "@/lib/utils";

/** Project thumbnail; projects without a screenshot get a branded monogram tile instead of a gap. */
export function ProjectThumb({
  src,
  title,
  sizes,
  className,
  priority,
}: {
  src: string;
  title: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={`${title} screenshot`}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }
  const initials = title
    .split(/[\s:&]+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_oklch,var(--primary)_22%,transparent),transparent_60%)] bg-card",
        className,
      )}
    >
      <span className="font-display text-4xl font-bold tracking-tight text-primary/80">{initials}</span>
    </div>
  );
}
