
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-3 pt-5 sm:px-5 sm:pt-8 lg:px-6">
      <div className="relative flex min-h-[420px] flex-col items-center justify-between overflow-hidden rounded-2xl border border-[#3A3C4B] bg-[#1d1e24] px-4 py-7 sm:min-h-[448px] sm:px-8 sm:py-10 md:flex-row md:gap-6 md:px-8 lg:px-12">
        {/* Left Content */}
        <div className="relative z-10 w-full max-w-[570px] md:w-[58%]">
          <p className="mb-3 text-[11px] font-black tracking-[0.18em] text-[#DFFF36] sm:mb-4 sm:text-xs">
            WORKOUT LIBRARY
          </p>

          <h1 className="max-w-[570px] text-[2rem] font-black leading-[1.08] tracking-tight text-white min-[400px]:text-4xl sm:text-5xl lg:text-6xl">
            TRAIN WITH INTENT.
            <br />
            LOG EVERY SET.
          </h1>

          <p className="mt-4 max-w-[440px] text-sm leading-6 text-gray-300 sm:mt-5 sm:text-base sm:leading-7">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <Link
            href="#library"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#DFFF36] px-5 py-3 text-xs font-black tracking-wide !text-black transition hover:bg-[#C6E22B] sm:mt-6 sm:px-6 sm:text-sm"
          >
            BROWSE WORKOUTS
          </Link>
        </div>

        {/* Right Banner Image */}
        <div className="relative mt-5 h-[190px] w-full shrink-0 sm:mt-7 sm:h-[260px] md:mt-0 md:h-[300px] md:w-[42%] lg:h-[340px]">
          <Image
            src="/assets/banner.png"
            alt="Workout illustration"
            fill
            priority
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 42vw, 38vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
