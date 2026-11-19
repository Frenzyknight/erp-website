import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "onDark";
type Size = "md" | "sm";

/* Rectangular, uppercase, and the colours snap on hover: no fades, no scaling. */
const base =
  "group inline-flex items-center justify-center gap-3 border-2 text-center text-small font-bold uppercase tracking-wider transition-colors duration-150 ease-linear disabled:pointer-events-none disabled:opacity-50";

const sizes: Record<Size, string> = {
  md: "min-h-14 px-7 py-3",
  sm: "min-h-11 px-5 py-2",
};

const variants: Record<Variant, string> = {
  primary: "border-blue bg-blue text-white hover:border-ink hover:bg-ink",
  secondary: "border-ink bg-white text-ink hover:bg-ink hover:text-white",
  onDark: "border-white text-white hover:bg-white hover:text-ink focus-visible:outline-sky",
};

export function buttonClass(variant: Variant = "primary", className = "", size: Size = "md") {
  return `${base} ${sizes[size]} ${variants[variant]} ${className}`;
}

export function ButtonArrow() {
  return (
    <ArrowRight
      aria-hidden
      strokeWidth={2.5}
      className="size-4 shrink-0 transition-transform duration-150 ease-linear group-hover:translate-x-1"
    />
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  external?: boolean;
}) {
  const content = (
    <>
      {children}
      {arrow && <ButtonArrow />}
    </>
  );

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
