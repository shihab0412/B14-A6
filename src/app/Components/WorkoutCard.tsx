
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
      href={`/workout/${workout.id}`}
      className="group overflow-hidden rounded-xl border border-[#343643] bg-[#20222D] transition hover:-translate-y-1 hover:border-[#DFFF36]"
    >
      <div className="flex h-48 items-center justify-center overflow-hidden bg-[#292B36]">
        {workout.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={workout.image}
            alt={workout.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="text-sm text-gray-500">Workout</span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#DFFF36]">
          {workout.category || "STRENGTH"}
        </p>

        <h2 className="mt-2 text-lg font-bold text-white">
          {workout.name}
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          {workout.equipment || "Gym equipment"}
        </p>

        <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-[#343643] pt-3 text-xs text-gray-300">
          <span>{workout.duration ?? "--"} min</span>
          <span>{workout.calories ?? "--"} kcal</span>
          <span>★ {workout.rating ?? "--"}</span>
        </div>
      </div>
    </Link>
  );
}
