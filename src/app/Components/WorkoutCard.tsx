
import Link from "next/link";

export type Workout = {
  id: string | number;
  name: string;
  category?: string;
  equipment?: string;
  duration?: number | string;
  calories?: number | string;
  rating?: number | string;
  image?: string;
  description?: string;
};

export default function WorkoutCard({
  workout,
}: {
  workout: Workout;
}) {
  return (
    <Link
      href={`/workout/${encodeURIComponent(String(workout.id))}`}
      aria-label={`View details for ${workout.name}`}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#343643] bg-[#20222D] transition duration-300 hover:border-[#DFFF36] sm:hover:-translate-y-1"
    >
      {/* Workout Image */}
      <div className="relative h-44 shrink-0 overflow-hidden bg-[#292B36] sm:h-48 lg:h-52">
        {workout.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={workout.image}
            alt={workout.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 sm:group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="px-3 text-center text-sm font-medium text-gray-500">
              {workout.category || "WORKOUT"}
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 max-w-[calc(100%-24px)] truncate rounded-md bg-[#171820]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#DFFF36] sm:text-xs">
          {workout.category || "STRENGTH"}
        </span>
      </div>

      {/* Workout Information */}
      <div className="flex min-w-0 flex-1 flex-col p-3.5 sm:p-4">
        <h2 className="break-words text-base font-bold leading-snug text-white transition-colors group-hover:text-[#DFFF36] sm:text-lg">
          {workout.name}
        </h2>

        <p className="mt-2 break-words text-xs leading-5 text-gray-400 sm:text-sm">
          {workout.equipment || "Gym equipment"}
        </p>

        {/* Workout Stats */}
        <div className="mt-auto grid grid-cols-3 gap-1.5 border-t border-[#343643] pt-4 sm:gap-2">
          <div className="min-w-0">
            <p className="text-[10px] leading-4 text-gray-500 sm:text-xs">
              Duration
            </p>
            <p className="mt-1 break-words text-xs font-semibold text-white sm:text-sm">
              {workout.duration ?? "--"} min
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] leading-4 text-gray-500 sm:text-xs">
              Calories
            </p>
            <p className="mt-1 break-words text-xs font-semibold text-white sm:text-sm">
              {workout.calories ?? "--"} kcal
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] leading-4 text-gray-500 sm:text-xs">
              Rating
            </p>
            <p className="mt-1 break-words text-xs font-semibold text-white sm:text-sm">
              <span className="text-[#DFFF36]">★</span>{" "}
              {workout.rating ?? "--"}
            </p>
          </div>
        </div>

        {/* Details Link */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#343643] pt-3">
          <span className="text-xs font-bold text-[#DFFF36] sm:text-sm">
            View Details
          </span>

          <span
            aria-hidden="true"
            className="shrink-0 text-lg text-[#DFFF36] transition-transform sm:group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
