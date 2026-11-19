"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { container } from "@/components/ui/Section";
import { navLinks } from "@/lib/content";

/** A solid white bar closed by a thick rule. It never changes with scroll. */
export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-ink bg-white">
      <nav aria-label="Main" className={`${container} flex h-16 items-center justify-between`}>
        <Logo />

        {/* The links only fit beside the logo and the button from "lg"; below that they live in the menu. */}
        <ul className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              {/* The label slides up and out while a blue copy slides in from below. */}
              <Link href={link.href} className="group flex h-11 items-center text-label uppercase text-ink">
                <span className="relative block overflow-hidden">
                  <span className="block transition-transform duration-200 ease-out group-hover:-translate-y-full">
                    {link.label}
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 translate-y-full text-blue transition-transform duration-200 ease-out group-hover:translate-y-0"
                  >
                    {link.label}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ButtonLink href="/#contact" size="sm" className="whitespace-nowrap">
              Book a free review
            </ButtonLink>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`grid size-11 place-items-center border-2 border-ink transition-colors duration-150 ease-linear lg:hidden ${
              open ? "bg-ink text-white" : "bg-white text-ink"
            }`}
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t-4 border-ink bg-white lg:hidden">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href} className="border-b-2 border-ink">
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-6 py-5 text-title font-bold uppercase text-ink transition-colors duration-150 ease-linear hover:bg-ink hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="p-6 sm:hidden" onClick={() => setOpen(false)}>
            <ButtonLink href="/#contact" className="w-full">
              Book a free review
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
