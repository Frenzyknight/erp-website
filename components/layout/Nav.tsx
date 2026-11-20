"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
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

/**
 * A white bar that stays at the top of the screen. Scrolling down tucks it
 * away and scrolling up brings it back. Below "lg" the links move into a
 * full-screen menu that wipes down from under the bar.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [tucked, setTucked] = useState(false);
  const pathname = usePathname();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const { scrollY } = useScroll();
  const menuOpen = open && !desktop;

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (y < 120 || y < previous - 4) setTucked(false);
    else if (y > previous + 4) setTucked(true);
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

  const close = () => setOpen(false);

  return (
    <header
      // Tabbing into a tucked bar brings it back, so focus is never off screen.
      onFocusCapture={() => setTucked(false)}
      className={`sticky top-0 z-50 bg-white transition-transform duration-[450ms] ease-swift ${
        tucked && !menuOpen ? "-translate-y-full" : ""
      }`}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-page md:h-20 lg:gap-12">
        <Logo />

        <nav aria-label="Main" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navLinks.map((link) => (
            // A hairline draws in from the left under the label, and retracts to the right on leaving.
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className="relative px-4 py-2 text-body whitespace-nowrap text-ink after:absolute after:inset-x-4 after:bottom-[5px] after:h-[1.5px] after:origin-right after:scale-x-0 after:bg-navy after:transition-transform after:duration-[450ms] after:ease-swift hover:after:origin-left hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden sm:block">
            <ButtonLink href={reviewHref}>Book a free review</ButtonLink>
          </div>
          <div className="hidden xl:block">
            <ButtonLink href={whatsappHref} variant="outline" external>
              Chat on WhatsApp
            </ButtonLink>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`grid size-11 place-items-center rounded-md transition-colors duration-200 ease-out lg:hidden ${
              menuOpen ? "bg-line" : "hover:bg-surface"
            }`}
          >
            <span aria-hidden className="relative block size-6">
              {strokes.map((stroke) => (
                <span
                  key={stroke.rest}
                  className={`absolute inset-x-[3px] h-[1.5px] rounded-full bg-ink transition-[translate,rotate,scale,opacity] duration-[450ms] ease-swift ${
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
            className="absolute inset-x-0 top-full flex h-[calc(100dvh-var(--header-h))] flex-col overflow-y-auto overscroll-contain bg-surface lg:hidden"
          >
            <nav aria-label="Menu" className="flex-1 px-page py-6">
              <ul>
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: swift }}
                    className="border-b border-line"
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      className="block py-4 text-h3 text-ink transition-colors duration-200 hover:text-muted"
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
                className="mt-6 space-y-3 text-body text-ink"
              >
                <li>
                  <a href={`tel:+${company.phoneE164}`} className="transition-colors duration-200 hover:text-muted">
                    {company.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="break-all transition-colors duration-200 hover:text-muted"
                  >
                    {company.email}
                  </a>
                </li>
              </motion.ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: swift }}
              onClick={close}
              className="flex shrink-0 flex-col gap-3 px-page pb-8 pt-4"
            >
              <ButtonLink href={reviewHref} className="w-full">
                Book a free review
              </ButtonLink>
              <ButtonLink href={whatsappHref} variant="outline" external className="w-full">
                Chat on WhatsApp
              </ButtonLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
