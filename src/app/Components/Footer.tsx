
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#30313A] bg-[#171820]">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row">
        {/* Left: Logo + Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="FITLOG logo"
            width={28}
            height={28}
            className="h-7 w-7 object-contain"
          />

          <span className="text-xl font-black tracking-tight text-white">
            FITLOG
          </span>
        </Link>

        {/* Right: Copyright */}
        <p className="text-center text-xs text-gray-400 sm:text-right sm:text-sm">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
