import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="mx-auto max-w-[1120px] px-5 pt-8">
      <div className="relative flex min-h-[360px] flex-col items-center justify-between overflow-hidden rounded-2xl border border-[#3A3C4B] bg-[#252838] px-6 py-10 sm:px-10 md:flex-row md:px-12">
        {/* Left Content */}
        <div className="relative z-10 max-w-[570px]">
          <p className="mb-4 text-xs font-black tracking-wider text-[#DFFF36]">
            WORKOUT LIBRARY
          </p>

          <h1 className="max-w-[570px] text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            TRAIN WITH INTENT.
            <br />
            LOG EVERY SET.
          </h1>

          <p className="mt-5 max-w-[440px] text-sm leading-6 text-gray-300 sm:text-base">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <Link
            href="#library"
            className="mt-6 inline-flex rounded-md bg-[#DFFF36] px-6 py-3 text-xs font-black tracking-wide  !text-black transition hover:bg-[#C6E22B] sm:text-sm"
          >
            BROWSE WORKOUTS
          </Link>
        </div>

        {/* Right Banner Image */}
        <div className="relative mt-8 h-[230px] w-full shrink-0 sm:h-[270px] md:mt-0 md:w-[38%]">
          <Image
            src="/assets/banner.png"
            alt="Workout illustration"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 38vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;