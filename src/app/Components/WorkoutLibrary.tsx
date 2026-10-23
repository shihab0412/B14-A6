
"use client";

import { useEffect, useMemo, useState } from "react";
import WorkoutCard, { type Workout } from "./WorkoutCard";

const API_URLS = [
  "https://api.abcz.workers.dev/api/fitlog",
  "https://api.api-store.workers.dev/api/fitlog",
];

type SortOption = "duration" | "calories" | "rating";

function getWorkoutList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) {
    return data as Record<string, unknown>[];
  }

  if (data && typeof data === "object") {
    const result = data as Record<string, unknown>;

    for (const key of ["data", "workouts", "results", "items"]) {
      if (Array.isArray(result[key])) {
        return result[key] as Record<string, unknown>[];
      }
    }
  }

  return [];
}

function normalizeWorkout(
  item: Record<string, unknown>,
  index: number
): Workout {
  const image =
    item.image ??
    item.imageUrl ??
    item.image_url ??
    item.thumbnail ??
    item.photo;

  return {
    id: String(item.id ?? item._id ?? item.slug ?? index + 1),
    name: String(
      item.name ??
        item.title ??
        item.workoutName ??
        item.exercise ??
        "Workout"
    ),
    category: String(item.category ?? item.type ?? "STRENGTH"),
    equipment: String(
      item.equipment ?? item.equipmentType ?? "Gym equipment"
    ),
    duration: (item.duration ??
      item.durationMinutes ??
      item.minutes) as number | string | undefined,
    calories: (item.calories ??
      item.caloriesBurned) as number | string | undefined,
    rating: (item.rating ?? item.rate) as number | string | undefined,
    image: typeof image === "string" ? image : undefined,
    description: String(
      item.description ?? item.instructions ?? ""
    ),
  };
}

function getNumber(value: number | string | undefined): number {
  if (value === undefined || value === null || value === "") {
    return 0;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export default function WorkoutLibrary() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("duration");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkouts() {
      try {
        setLoading(true);
        setError("");

        let list: Record<string, unknown>[] = [];
        let lastError = "Failed to load workouts.";

        for (const apiUrl of API_URLS) {
          try {
            const response = await fetch(apiUrl, {
              signal: controller.signal,
              cache: "no-store",
            });

            if (!response.ok) {
              lastError = `API request failed: ${response.status}`;
              continue;
            }

            const data: unknown = await response.json();
            const result = getWorkoutList(data);

            if (result.length > 0) {
              list = result;
              break;
            }

            lastError = "No workout list was found in the API response.";
          } catch (err) {
            if (err instanceof Error && err.name === "AbortError") {
              return;
            }

            lastError = "Failed to load workouts.";
          }
        }

        if (list.length === 0) {
          throw new Error(lastError);
        }

        setWorkouts(list.map(normalizeWorkout));
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading workouts."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWorkouts();

    return () => controller.abort();
  }, []);

  const filteredWorkouts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return workouts;
    }

    return workouts.filter((workout) =>
      `${workout.name} ${workout.category ?? ""} ${
        workout.equipment ?? ""
      }`
        .toLowerCase()
        .includes(query)
    );
  }, [workouts, search]);

  const sortedWorkouts = useMemo(() => {
    return [...filteredWorkouts].sort((a, b) => {
      if (sortBy === "calories") {
        return getNumber(b.calories) - getNumber(a.calories);
      }

      if (sortBy === "rating") {
        return getNumber(b.rating) - getNumber(a.rating);
      }

      return getNumber(a.duration) - getNumber(b.duration);
    });
  }, [filteredWorkouts, sortBy]);

  return (
    <section
      id="library"
      className="mx-auto max-w-[1440px] px-4 py-12 sm:px-5 sm:py-16 lg:px-8"
    >
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black tracking-widest text-[#DFFF36]">
            WORKOUT LIBRARY
          </p>

          <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            THE <span className="text-[#DFFF36]">LIBRARY</span>
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Twelve lifts covering every major muscle group.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search workouts..."
            aria-label="Search workouts"
            className="w-full rounded-lg border border-[#3A3C4B] bg-[#20222D] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#DFFF36] sm:w-[240px]"
          />

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            aria-label="Sort workouts by"
            className="w-full rounded-lg border border-[#3A3C4B] bg-[#20222D] px-4 py-3 text-sm text-white outline-none focus:border-[#DFFF36] sm:w-[200px]"
          >
            <option value="duration">Sort by Duration</option>
            <option value="calories">Sort by Calories</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="h-[310px] animate-pulse rounded-xl border border-[#343643] bg-[#20222D]"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="mt-8 rounded-xl border border-red-900 bg-[#20222D] p-6">
          <p className="font-bold text-red-400">
            Could not load workouts
          </p>

          <p className="mt-2 break-words text-sm text-gray-300">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-[#DFFF36] px-4 py-2 text-sm font-bold text-black"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filteredWorkouts.length === 0 && (
        <p className="py-12 text-center text-gray-400">
          {search.trim()
            ? "No workouts match your search."
            : "No workouts available."}
        </p>
      )}

      {!loading && !error && sortedWorkouts.length > 0 && (
        <div className="grid grid-cols-1 gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </section>
  );
}
