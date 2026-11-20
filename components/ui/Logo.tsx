import Link from "next/link";

export function StarMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className} fill="currentColor">
      <path d="M16 2c.9 7.3 6.7 13.1 14 14-7.3.9-13.1 6.7-14 14-.9-7.3-6.7-13.1-14-14 7.3-.9 13.1-6.7 14-14Z" />
    </svg>
  );
}

/**
 * The star in the accent colour, then the name as a wordmark in the display
 * face. It only ever sits on navy (the navigation bar and the footer), so the
 * name is white.
 */
export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Polaris Consulting home"
      className="flex shrink-0 items-center gap-2 text-white transition-opacity duration-200 hover:opacity-80"
    >
      <StarMark className="size-5 text-blue md:size-6" />
      <span className="font-display text-md tracking-[-0.02em] whitespace-nowrap md:text-[1.25rem]">
        Polaris Consulting
      </span>
    </Link>
  );
}
