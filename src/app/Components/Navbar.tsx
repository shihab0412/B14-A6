
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();

  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

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

    // Updates when the same page changes the workout list.
    window.addEventListener("fitlog-storage", updateCounts);

    // Updates when returning to the page or changing tabs.
    window.addEventListener("storage", updateCounts);
    window.addEventListener("focus", updateCounts);

    return () => {
      window.removeEventListener("fitlog-storage", updateCounts);
      window.removeEventListener("storage", updateCounts);
      window.removeEventListener("focus", updateCounts);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#30313A] bg-[#171820]">
      <nav className="mx-auto flex min-h-[68px] max-w-[1120px] items-center justify-between gap-3 px-3 sm:px-5">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="FitLog Icon"
            width={28}
            height={28}
            priority
            className="h-7 w-7 object-contain"
          />

          <span className="text-lg font-black tracking-tight text-white sm:text-xl">
            FITLOG
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`rounded-full px-2 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${
              pathname === "/"
                ? "bg-[#DFFF36] text-black"
                : "text-white hover:bg-[#292B35]"
            }`}
          >
            Workout
          </Link>

          <Link
            href="/my-plan"
            className={`rounded-full px-2 py-2 text-xs font-bold transition sm:px-4 sm:text-sm ${
              pathname === "/my-plan"
                ? "bg-[#DFFF36] text-black"
                : "text-white hover:bg-[#292B35]"
            }`}
          >
            My Plan
          </Link>
        </div>

        {/* Plan and Saved counters */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-5">
          <Link
            href="/my-plan"
            className="flex items-center gap-1 text-xs font-bold text-white sm:gap-2 sm:text-sm"
          >
            <span>Plan</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DFFF36] px-1 text-xs font-black text-black">
              {planCount}
            </span>
          </Link>

          <Link
            href="/my-plan"
            className="flex items-center gap-1 text-xs font-bold text-white sm:gap-2 sm:text-sm"
          >
            <span>Saved</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-[#555763] px-1 text-xs font-semibold text-white">
              {savedCount}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
