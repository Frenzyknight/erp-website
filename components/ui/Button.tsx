import Link from "next/link";

type Variant = "primary" | "outline" | "light" | "ghost" | "accent";
type Size = "md" | "sm" | "lg";

/* Rounded, sentence case, and the fill changes to the accent on hover while the label wipes upwards. */
const base =
  "btn-wipe inline-flex items-center justify-center gap-2 rounded-md border text-center text-body font-semibold leading-6 whitespace-nowrap transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-60";

/* Heights include the 1px border: 48px, 36px, and 48px growing to 82px for the footer pair. */
const sizes: Record<Size, string> = {
  md: "min-h-12 px-6 py-[11px]",
  sm: "min-h-9 px-5 py-[5px]",
  lg: "min-h-12 px-6 py-[11px] md:rounded-xl md:px-[54px] md:py-5 md:text-cta",
};

/* "light" and "ghost" are for navy and blue backgrounds, where the hover fill is sky. */
const variants: Record<Variant, string> = {
  primary: "border-navy bg-navy text-white hover:border-blue hover:bg-blue",
  outline: "border-navy bg-white text-navy hover:border-blue hover:bg-blue hover:text-white",
  light: "border-white bg-white text-navy hover:border-sky hover:bg-sky focus-visible:outline-white",
  ghost:
    "border-white bg-transparent text-white hover:border-sky hover:bg-sky hover:text-navy focus-visible:outline-white",
  accent: "border-blue bg-blue text-white hover:border-blue-deep hover:bg-blue-deep",
};

export function buttonClass(variant: Variant = "primary", className = "", size: Size = "md") {
  return `${base} ${sizes[size]} ${variants[variant]} ${className}`;
}

/** Wraps a plain text label in the two layers the hover wipe needs. Anything else passes through. */
export function ButtonLabel({ children }: { children: React.ReactNode }) {
  if (typeof children !== "string") return <>{children}</>;
  return (
    <span className="btn-label" data-label={children}>
      <span className="btn-text">{children}</span>
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
}) {
  const content = <ButtonLabel>{children}</ButtonLabel>;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, className, size)}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonClass(variant, className, size)}>
      {content}
    </Link>
  );
}
