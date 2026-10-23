
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-8 w-full border-t border-[#30313A] bg-[#171820] sm:mt-12">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 sm:py-7">
        {/* Logo + Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="FITLOG home"
        >
          <Image
            src="/assets/logo.png"
            alt="FITLOG logo"
            width={28}
            height={28}
            sizes="28px"
            className="h-7 w-7 shrink-0 object-contain"
          />

          <span className="text-lg font-black tracking-tight text-white sm:text-xl">
            FITLOG
          </span>
        </Link>

        {/* Copyright */}
        <p className="max-w-full text-center text-xs leading-5 text-gray-400 sm:text-right sm:text-sm">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
