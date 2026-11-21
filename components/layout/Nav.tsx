"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { company, navLinks, whatsappLink } from "@/lib/content";
import { useMediaQuery } from "@/lib/hooks";

const swift = [0.16, 1, 0.3, 1] as const;
const reviewHref = "/#contact";
const whatsappHref = whatsappLink("Hi Polaris, I'd like a free process review for my business.");

/* The burger's three strokes. Open, the outer two cross and the middle one fades. */
const strokes = [
  { rest: "top-[6px]", open: "translate-y-[5.25px] rotate-45" },
  { rest: "top-[11.25px]", open: "scale-x-40 opacity-0" },
  { rest: "top-[16.5px]", open: "-translate-y-[5.25px] -rotate-45" },
];

/* What the four-dot button opens: the two ways to start, then the direct lines. */
const moreLinks = [
  { href: "/#build", label: "Build your ERP" },
  { href: reviewHref, label: "Book a free review" },
];
const directLines = [
  { href: `tel:+${company.phoneE164}`, label: company.phoneDisplay },
  { href: `mailto:${company.email}`, label: company.email },
];

const moreItem =
  "flex items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-caption font-medium text-navy transition-colors duration-150 ease-out hover:bg-surface";

/**
 * A bar fixed to the top of the screen, clear over the hero and navy once the
 * page has scrolled. Scrolling down tucks it away and scrolling up brings it
 * back. From "lg" the links sit in a block on the right, with a four-dot
 * button that opens the rest; below that everything moves into a full-screen
 * menu that wipes down from under the bar.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const [tucked, setTucked] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const { scrollY } = useScroll();
  const backdrop = useTransform(scrollY, [0, 96], [0, 1]);
  const menuOpen = open && !desktop;
  const moreOpen = more && desktop;

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (y < 120 || y < previous - 4) setTucked(false);
    else if (y > previous + 4) {
      setTucked(true);
      setMore(false);
    }
  });

  // While the menu is open the page behind it must not scroll, and Escape closes it.
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // The four-dot panel closes on Escape and on a press anywhere outside it.
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMore(false);
    const onPress = (e: PointerEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMore(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
    };
  }, [moreOpen]);

  const close = () => setOpen(false);
  const closeMore = () => setMore(false);

  return (
    <header
      data-tone="dark"
      // Tabbing into a tucked bar brings it back, so focus is never off screen.
      onFocusCapture={() => setTucked(false)}
      // The bar steps aside while the homepage hero plays its film.
      className={`fixed inset-x-0 top-0 z-50 transition-[translate,opacity] duration-[450ms] ease-swift in-data-hero-film:pointer-events-none in-data-hero-film:opacity-0 ${
        tucked && !menuOpen ? "-translate-y-full" : ""
      }`}
    >
      {/* The bar's own navy, faded in over the first stretch of scrolling. The open menu needs it at once. */}
      <motion.div
        aria-hidden
        style={{ opacity: menuOpen ? 1 : backdrop }}
        className={`absolute inset-0 border-b border-white/10 ${menuOpen ? "bg-navy" : "bg-navy/85 backdrop-blur-md lite:bg-navy/95 lite:backdrop-blur-none"}`}
      />

      <div className="relative flex h-[var(--header-h)] items-center justify-between gap-4 px-page">
        <Logo />

        <div className="flex shrink-0 items-center gap-2">
          <div ref={moreRef} className="relative hidden lg:block">
            <nav aria-label="Main" className="flex h-11 items-center gap-0.5 rounded-md bg-white/[0.08] px-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className="mono-label rounded-sm px-3 py-2 whitespace-nowrap text-white/80 transition-colors duration-150 ease-out hover:bg-white/10 hover:text-white aria-[current=page]:bg-white/10 aria-[current=page]:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setMore((m) => !m)}
                aria-expanded={moreOpen}
                aria-controls="more-menu"
                aria-label={moreOpen ? "Close more links" : "More links"}
                className={`grid size-8 place-items-center rounded-sm transition-colors duration-150 ease-out hover:bg-white/10 ${
                  moreOpen ? "bg-white/10" : ""
                }`}
              >
                <span
                  aria-hidden
                  className={`grid grid-cols-2 gap-[3px] transition-transform duration-300 ease-swift ${
                    moreOpen ? "rotate-45" : ""
                  }`}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className="size-[3px] rounded-[1px] bg-white" />
                  ))}
                </span>
              </button>
            </nav>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  id="more-menu"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: swift }}
                  className="absolute top-full right-0 mt-2 w-72 rounded-md bg-white p-2 shadow-float"
                >
                  <ul>
                    {moreLinks.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} onClick={closeMore} className={moreItem}>
                          {l.label}
                          <ArrowUpRight aria-hidden className="size-4 shrink-0 text-muted" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mono-label mt-2 border-t border-line px-3 pt-3 pb-1 text-muted">Talk to us</p>
                  <ul>
                    {directLines.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} onClick={closeMore} className={`${moreItem} wrap-anywhere`}>
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:block">
            <ButtonLink href={whatsappHref} variant="light" size="sm" external>
              WhatsApp
            </ButtonLink>
          </div>
          <div className="hidden sm:block">
            <ButtonLink href={reviewHref} size="sm">
              Book a review
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`grid size-11 place-items-center rounded-md transition-colors duration-200 ease-out lg:hidden ${
              menuOpen ? "bg-white/20" : "bg-white/[0.08] hover:bg-white/15"
            }`}
          >
            <span aria-hidden className="relative block size-6">
              {strokes.map((stroke) => (
                <span
                  key={stroke.rest}
                  className={`absolute inset-x-[3px] h-[1.5px] rounded-full bg-white transition-[translate,rotate,scale,opacity] duration-[450ms] ease-swift ${
                    stroke.rest
                  } ${menuOpen ? stroke.open : ""}`}
                />
              ))}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            // Keeps the smooth scroller from moving the page while the pointer is over the menu.
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: swift }}
            className="absolute inset-x-0 top-full flex h-[calc(100dvh-var(--header-h))] flex-col overflow-y-auto overscroll-contain bg-navy lg:hidden"
          >
            <nav aria-label="Menu" className="flex-1 px-page py-6">
              <ul>
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: swift }}
                    className="border-b border-white/15"
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      className="block py-4 font-display text-h3 text-white transition-colors duration-200 hover:text-sky"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.ul
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + navLinks.length * 0.06, ease: swift }}
                className="mt-8 space-y-3 text-body text-white/80"
              >
                {directLines.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="wrap-anywhere transition-colors duration-200 hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </motion.ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: swift }}
              onClick={close}
              className="flex shrink-0 flex-col gap-2 px-page pt-4 pb-8"
            >
              <ButtonLink href={reviewHref} className="w-full">
                Book a free review
              </ButtonLink>
              <ButtonLink href={whatsappHref} variant="light" external className="w-full">
                Chat on WhatsApp
              </ButtonLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
