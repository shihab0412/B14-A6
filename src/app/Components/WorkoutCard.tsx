
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
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#343643] bg-[#20222D] transition duration-300 hover:-translate-y-1 hover:border-[#DFFF36]"
    >
      <div className="relative h-48 overflow-hidden bg-[#292B36]">
        {workout.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={workout.image}
            alt={workout.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm font-medium text-gray-500">
              {workout.category || "WORKOUT"}
            </span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-md bg-[#171820]/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#DFFF36]">
          {workout.category || "STRENGTH"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-lg font-bold text-white transition-colors group-hover:text-[#DFFF36]">
          {workout.name}
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          {workout.equipment || "Gym equipment"}
        </p>

        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-[#343643] pt-4">
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {workout.duration ?? "--"} min
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Calories</p>
            <p className="mt-1 text-sm font-semibold text-white">
              {workout.calories ?? "--"} kcal
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Rating</p>
            <p className="mt-1 text-sm font-semibold text-white">
              <span className="text-[#DFFF36]">★</span>{" "}
              {workout.rating ?? "--"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#343643] pt-3">
          <span className="text-sm font-bold text-[#DFFF36]">
            View Details
          </span>
          <span
            aria-hidden="true"
            className="text-lg text-[#DFFF36] transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
