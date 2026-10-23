
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Workout = {
  id?: string | number;
  _id?: string | number;
  name?: string;
  title?: string;
  category?: string;
  description?: string;
  equipment?: string;
  duration?: number | string;
  calories?: number | string;
  caloriesBurned?: number | string;
  rating?: number | string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  muscleGroups?: string[] | string;
  sets?: number | string;
  reps?: number | string;
  difficulty?: string;
  instructions?: string[] | string;
  [key: string]: unknown;
};

const API = "https://api.abcz.workers.dev/api/fitlog";
const ALTERNATIVE_API = "https://api.api-store.workers.dev/api/fitlog";

export default function WorkoutDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWorkout() {
      setLoading(true);
      setError("");

      try {
        let result: unknown = null;
        let loaded = false;

        for (const api of [API, ALTERNATIVE_API]) {
          try {
            const response = await fetch(
              `${api}/${encodeURIComponent(id)}`
            );

            if (!response.ok) continue;

            const data: unknown = await response.json();

            let item: unknown = data;

            if (data && typeof data === "object" && !Array.isArray(data)) {
              const obj = data as Record<string, unknown>;
              item = obj.data ?? obj.workout ?? obj.result ?? data;
            }

            if (Array.isArray(item)) {
              item = item[0];
            }

            if (item && typeof item === "object") {
              result = item;
              loaded = true;
              break;
            }
          } catch {
            // Try the alternative API.
          }
        }

        if (!loaded || !result) {
          throw new Error("Workout details could not be loaded.");
        }

        if (!cancelled) {
          setWorkout(result as Workout);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadWorkout();
    } else {
      setLoading(false);
      setError("Workout ID is missing.");
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      setMessage("");
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [message]);

  function saveWorkout(type: "fitlog-plan" | "fitlog-saved") {
    if (!workout) return;

    const workoutId = String(workout.id ?? workout._id ?? id);
    const name = String(workout.name ?? workout.title ?? "Workout");

    const entry: Workout = {
      ...workout,
      id: workoutId,
      name,
    };

    try {
      const stored = JSON.parse(localStorage.getItem(type) || "[]");
      const current: Workout[] = Array.isArray(stored) ? stored : [];

      const alreadyExists = current.some(
        (item) => String(item.id ?? item._id) === workoutId
      );

      if (alreadyExists) {
        setMessage(
          type === "fitlog-plan"
            ? "Workout is already in today's plan."
            : "Workout is already saved."
        );
        return;
      }

      if (type === "fitlog-plan" && current.length >= 5) {
        setMessage("Your plan is full. The limit is 5 workouts.");
        return;
      }

      const updated = [...current, entry];

      localStorage.setItem(type, JSON.stringify(updated));

      // Notify the Navbar so its counters update immediately.
      window.dispatchEvent(new Event("fitlog-storage"));

      setMessage(
        type === "fitlog-plan"
          ? "Added to today's plan!"
          : "Workout saved for later!"
      );
    } catch {
      setMessage("Could not save workout. Please try again.");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#171820] text-[#DFFF36]">
        <p className="animate-pulse font-bold">Loading workout...</p>
      </main>
    );
  }

  if (error || !workout) {
    return (
      <main className="min-h-screen bg-[#171820] px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-black">Workout not found</h1>

          <p className="mt-3 text-gray-400">
            {error || "Workout details could not be found."}
          </p>

          <Link
            href="/#library"
            className="mt-6 inline-flex rounded-lg bg-[#DFFF36] px-5 py-3 font-bold text-black"
          >
            Back to Workouts
          </Link>
        </div>
      </main>
    );
  }

  const name = String(workout.name ?? workout.title ?? "Workout");
  const image = workout.image ?? workout.imageUrl ?? workout.thumbnail;
  const calories = workout.caloriesBurned ?? workout.calories;

  const categories = Array.isArray(workout.muscleGroups)
    ? workout.muscleGroups
    : typeof workout.muscleGroups === "string"
      ? workout.muscleGroups.split(",").map((item) => item.trim()).filter(Boolean)
      : workout.category
        ? [workout.category]
        : [];

  const instructions = Array.isArray(workout.instructions)
    ? workout.instructions
    : typeof workout.instructions === "string"
      ? workout.instructions.split(/\n+/).map((step) => step.trim()).filter(Boolean)
      : [];

  const details = [
    { label: "EQUIPMENT", value: workout.equipment },
    { label: "DIFFICULTY", value: workout.difficulty },
    { label: "SETS", value: workout.sets },
    { label: "REPS", value: workout.reps },
    {
      label: "DURATION",
      value: workout.duration != null ? `${workout.duration} min` : undefined,
    },
    {
      label: "CALORIES",
      value: calories != null ? `${calories} kcal` : undefined,
    },
    {
      label: "RATING",
      value: workout.rating != null ? `★ ${workout.rating}` : undefined,
    },
  ];

  return (
    <main className="min-h-screen bg-[#171820] px-4 py-8 text-white sm:px-6 sm:py-12">
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-5 z-50 rounded-lg border border-[#DFFF36] bg-[#20222D] px-5 py-3 text-sm font-bold text-[#DFFF36] shadow-lg"
        >
          {message}
        </div>
      )}

      <div className="mx-auto max-w-[1120px]">
        <Link
          href="/#library"
          className="text-sm font-bold text-[#DFFF36] hover:underline"
        >
          ← Back to Workouts
        </Link>

        <div className="mt-7 grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-[#343643] bg-[#20222D] md:min-h-[420px]">
            {typeof image === "string" && image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name}
                className="min-h-[280px] max-h-[500px] w-full object-cover md:min-h-[420px]"
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p className="text-6xl">🏋️</p>
                <p className="mt-4">Workout image unavailable</p>
              </div>
            )}
          </div>

          <div className="py-2">
            <p className="text-xs font-black tracking-[0.2em] text-[#DFFF36]">
              WORKOUT DETAILS
            </p>

            <h1 className="mt-3 text-4xl font-black uppercase leading-tight sm:text-5xl">
              {name}
            </h1>

            {categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-[#DFFF36]/40 px-3 py-1 text-xs font-bold uppercase text-[#DFFF36]"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-5 leading-7 text-gray-300">
              {workout.description ||
                "Add this workout to your plan and keep track of your fitness routine."}
            </p>

            <section className="mt-7">
              <h2 className="mb-3 text-sm font-black tracking-widest text-[#DFFF36]">
                KEY SPECS
              </h2>

              <div className="overflow-hidden rounded-xl border border-[#343643] bg-[#20222D]">
                {details.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start justify-between gap-4 border-b border-[#343643] px-4 py-3 last:border-b-0"
                  >
                    <span className="text-xs font-bold tracking-wider text-gray-400">
                      {item.label}
                    </span>

                    <span className="text-right text-sm font-bold text-white">
                      {item.value != null && item.value !== ""
                        ? String(item.value)
                        : "--"}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => saveWorkout("fitlog-plan")}
                className="rounded-lg bg-[#DFFF36] px-5 py-3 font-black text-black transition hover:bg-[#c9ed20]"
              >
                + Add to Today&apos;s Plan
              </button>

              <button
                onClick={() => saveWorkout("fitlog-saved")}
                className="rounded-lg border border-[#555763] px-5 py-3 font-bold text-white hover:border-[#DFFF36]"
              >
                ♡ Save for Later
              </button>
            </div>

            <section className="mt-9">
              <h2 className="text-xl font-black uppercase">Instructions</h2>

              {instructions.length > 0 ? (
                <ol className="mt-4 space-y-3">
                  {instructions.map((step, index) => (
                    <li
                      key={`${index}-${step}`}
                      className="flex gap-3 text-sm leading-6 text-gray-300"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DFFF36] font-black text-black">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-gray-400">
                  Instructions are not available for this workout.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
