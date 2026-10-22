"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#30313A] bg-[#171820]">
      <nav className="mx-auto flex min-h-[68px] max-w-[1120px] items-center justify-between gap-3 px-5">
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

          <span className="text-xl font-black tracking-tight text-white">
            FITLOG
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1 rounded-full">
          <Link
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              pathname === "/"
                ? "bg-lime-300 !text-black"
                : "text-white hover:bg-[#292B35]"
            }`}
          >
            Workouts
          </Link>

          <Link
            href="/my-plan"
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              pathname === "/my-plan"
                ? "bg-[#30312d] text-black"
                : "text-white hover:bg-[#292B35]"
            }`}
          >
            My Plan
          </Link>
        </div>

        {/* Plan and Saved */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <Link
            href="/my-plan"
            className="flex items-center gap-2 text-xs font-bold text-white sm:text-sm"
          >
            <span>Plan</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#DFFF36] text-xs font-black text-black">
              0
            </span>
          </Link>

          <Link
            href="/my-plan"
            className="flex items-center gap-2 text-xs font-bold text-white sm:text-sm"
          >
            <span>Saved</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#555763] text-xs font-semibold text-white">
              0
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
