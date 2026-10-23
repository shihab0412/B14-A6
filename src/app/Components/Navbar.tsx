
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();

  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function updateCounts() {
      try {
        const plan = JSON.parse(
          localStorage.getItem("fitlog-plan") || "[]"
        );
        const saved = JSON.parse(
          localStorage.getItem("fitlog-saved") || "[]"
        );

        setPlanCount(Array.isArray(plan) ? plan.length : 0);
        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch {
        setPlanCount(0);
        setSavedCount(0);
      }
    }

    updateCounts();

    window.addEventListener("fitlog-storage", updateCounts);
    window.addEventListener("storage", updateCounts);
    window.addEventListener("focus", updateCounts);

    return () => {
      window.removeEventListener("fitlog-storage", updateCounts);
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("focus", updateCounts);
    };
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinkClass = (active: boolean) =>
    `block whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-bold transition ${
      active
        ? "bg-[#DFFF36] text-black"
        : "text-white hover:bg-[#292B35]"
    }`;

  const counterClass =
    "flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs font-black";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#30313A] bg-[#171820]">
      <nav className="relative mx-auto flex min-h-[64px] w-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:min-h-[72px] sm:px-5 lg:px-8">
        <Link
          href="/"
          aria-label="FitLog Home"
          className="flex shrink-0 items-center gap-2"
        >
          <Image
            src="/assets/logo.png"
            alt="FitLog Icon"
            width={32}
            height={32}
            priority
            className="h-7 w-7 object-contain sm:h-8 sm:w-8"
          />

          <span className="text-lg font-black tracking-tight text-white sm:text-xl">
            FITLOG
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={navLinkClass(pathname === "/")}
          >
            Workout
          </Link>

          <Link
            href="/my-plan"
            aria-current={pathname === "/my-plan" ? "page" : undefined}
            className={navLinkClass(pathname === "/my-plan")}
          >
            My Plan
          </Link>
        </div>

        {/* Desktop Counters */}
        <div className="hidden shrink-0 items-center gap-4 md:flex lg:gap-5">
          <Link
            href="/my-plan"
            className="flex items-center gap-2 text-sm font-bold text-white transition hover:text-[#DFFF36]"
          >
            <span>Plan</span>
            <span className={`${counterClass} bg-[#DFFF36] text-black`}>
              {planCount}
            </span>
          </Link>

          <Link
            href="/my-plan"
            className="flex items-center gap-2 text-sm font-bold text-white transition hover:text-[#DFFF36]"
          >
            <span>Saved</span>
            <span
              className={`${counterClass} border border-[#555763] text-white`}
            >
              {savedCount}
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#343643] text-white transition hover:border-[#DFFF36] hover:text-[#DFFF36] md:hidden"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#30313A] bg-[#171820] px-4 pb-5 pt-4 md:hidden"
        >
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={navLinkClass(pathname === "/")}
            >
              Workout
            </Link>

            <Link
              href="/my-plan"
              aria-current={pathname === "/my-plan" ? "page" : undefined}
              className={navLinkClass(pathname === "/my-plan")}
            >
              My Plan
            </Link>

            <div className="my-2 border-t border-[#30313A]" />

            <Link
              href="/my-plan"
              className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold text-white transition hover:bg-[#292B35]"
            >
              <span>Plan</span>
              <span className={`${counterClass} bg-[#DFFF36] text-black`}>
                {planCount}
              </span>
            </Link>

            <Link
              href="/my-plan"
              className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold text-white transition hover:bg-[#292B35]"
            >
              <span>Saved</span>
              <span
                className={`${counterClass} border border-[#555763] text-white`}
              >
                {savedCount}
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
