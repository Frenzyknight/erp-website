import Link from "next/link";

export function StarMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className} fill="currentColor">
      <path d="M16 2c.9 7.3 6.7 13.1 14 14-7.3.9-13.1 6.7-14 14-.9-7.3-6.7-13.1-14-14 7.3-.9 13.1-6.7 14-14Z" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-ink" aria-label="Polaris Consulting home">
      <StarMark className="size-6 text-blue" />
      <span className="text-body font-black uppercase tracking-tight">
        Polaris <span className="font-medium">Consulting</span>
      </span>
    </Link>
  );
}
