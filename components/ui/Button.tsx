import Link from "next/link";

type Variant = "primary" | "light" | "dark" | "ghost" | "plain";
type Size = "md" | "sm";

/* Small capitals in the monospace face on a tight-cornered block. On hover the label wipes upwards. */
const base =
  "btn-wipe mono-label inline-flex items-center justify-center gap-2 rounded-md text-center whitespace-nowrap transition-colors duration-200 ease-out disabled:pointer-events-none disabled:opacity-50";

/* 48px, and 44px for the navigation bar. */
const sizes: Record<Size, string> = {
  md: "min-h-12 px-5",
  sm: "min-h-11 px-4",
};

/*
 * "primary" is the one accent button and works on any background. "light" is
 * the pale, quiet button, on navy or on a white card, and "dark" is the navy
 * one for light sheets. "ghost" and "plain" are the unfilled text buttons,
 * for navy and for light sheets.
 */
const variants: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-deep",
  light: "bg-line text-navy hover:bg-mist",
  dark: "bg-navy text-white hover:bg-blue",
  ghost: "text-white hover:bg-white/10 focus-visible:outline-sky",
  plain: "text-navy hover:bg-navy/[0.06]",
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
