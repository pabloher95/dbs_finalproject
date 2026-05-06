import Image from "next/image";

/** Matches `public/logo.png` — keeps layout stable for `next/image`. */
const LOGO_WIDTH = 1672;
const LOGO_HEIGHT = 941;

const variantClass = {
  /** Workspace masthead — compact */
  masthead: "h-7 md:h-8",
  /** Public landing top bar — slightly larger */
  landing: "h-9 md:h-10",
  /** Footer wordmark replacement */
  footer: "h-6 md:h-7"
} as const;

export type BrandLogoVariant = keyof typeof variantClass;

export function BrandLogo({
  variant,
  className = "",
  priority = false
}: Readonly<{
  variant: BrandLogoVariant;
  className?: string;
  /** Pass true on LCP header marks (e.g. landing masthead). */
  priority?: boolean;
}>) {
  return (
    <span
      className={`relative inline-block max-w-[min(100%,280px)] ${variantClass[variant]} ${className}`}
      style={{ aspectRatio: `${LOGO_WIDTH} / ${LOGO_HEIGHT}` }}
    >
      <Image
        src="/logo.png"
        alt="SmallBiz IQ"
        fill
        sizes="(max-width: 768px) 200px, 280px"
        priority={priority}
        className="object-contain object-left"
      />
    </span>
  );
}
