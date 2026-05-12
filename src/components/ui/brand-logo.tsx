import Image from "next/image";

const variantClass = {
  /** Workspace masthead — compact */
  masthead: "h-12 w-[214px] md:h-14 md:w-[248px]",
  /** Public landing top bar — slightly larger */
  landing: "h-14 w-[249px] md:h-16 md:w-[285px]",
  /** Footer wordmark replacement */
  footer: "h-8 w-[143px] md:h-9 md:w-[160px]"
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
      className={`relative inline-block shrink-0 ${variantClass[variant]} ${className}`}
    >
      <Image
        src="/logo.png"
        alt="SmallBiz IQ"
        fill
        sizes="(max-width: 768px) 249px, 285px"
        priority={priority}
        className="object-contain object-center"
      />
    </span>
  );
}
