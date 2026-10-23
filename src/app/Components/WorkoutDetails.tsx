
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
const ALTERNATIVE_API =
  "https://api.api-store.workers.dev/api/fitlog";

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

        for (const api of [API, ALTERNATIVE_API]) {
          try {
            const response = await fetch(
              `${api}/${encodeURIComponent(id)}`
            );

            if (!response.ok) continue;

            const data: unknown = await response.json();
            let item: unknown = data;

            if (
              data &&
              typeof data === "object" &&
              !Array.isArray(data)
            ) {
              const obj = data as Record<string, unknown>;
              item = obj.data ?? obj.workout ?? obj.result ?? data;
            }

            if (Array.isArray(item)) item = item[0];

            if (item && typeof item === "object") {
              result = item;
              break;
            }
          } catch {
            // Try the alternative API.
          }
        }

        if (!result) {
          throw new Error("Workout details could not be loaded.");
        }

        if (!cancelled) setWorkout(result as Workout);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
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

    const timer = window.setTimeout(() => setMessage(""), 2500);
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

      localStorage.setItem(
        type,
        JSON.stringify([...current, entry])
      );

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
      <main className="flex min-h-[60vh] items-center justify-center bg-[#171820] px-4 text-[#DFFF36]">
        <p className="animate-pulse text-sm font-bold sm:text-base">
          Loading workout...
        </p>
      </main>
    );
  }

  if (error || !workout) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171820] px-4 py-12 text-white sm:px-6">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-2xl font-black sm:text-3xl">
            Workout not found
          </h1>
          <p className="mt-3 break-words text-sm text-gray-400 sm:text-base">
            {error || "Workout details could not be found."}
          </p>
          <Link
            href="/#library"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#DFFF36] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#c9ed20]"
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
      value: workout.duration != null
        ? `${workout.duration} min`
        : undefined,
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
    <main className="min-h-screen overflow-x-hidden bg-[#171820] px-3 py-5 text-white sm:px-6 sm:py-8 lg:px-8 lg:py-12">
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-3 top-3 z-50 mx-auto w-fit max-w-[calc(100%-24px)] rounded-lg border border-[#DFFF36] bg-[#20222D] px-4 py-3 text-center text-xs font-bold text-[#DFFF36] shadow-lg sm:inset-x-auto sm:right-5 sm:top-5 sm:max-w-sm sm:px-5 sm:text-sm"
        >
          {message}
        </div>
      )}

      <div className="mx-auto w-full max-w-[1120px]">
        <Link
          href="/#library"
          className="inline-flex min-h-10 items-center text-sm font-bold text-[#DFFF36] hover:underline"
        >
          ← Back to Workouts
        </Link>

        <div className="mt-5 grid min-w-0 grid-cols-1 items-start gap-6 sm:mt-7 sm:gap-8 md:grid-cols-2 md:gap-8 lg:gap-12">
          <div className="w-full min-w-0 overflow-hidden rounded-xl border border-[#343643] bg-[#20222D] sm:rounded-2xl">
            {typeof image === "string" && image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={name}
                className="block aspect-[4/3] w-full object-cover sm:aspect-[5/4] md:aspect-[4/5] lg:aspect-[5/4]"
              />
            ) : (
              <div className="flex aspect-[4/3] flex-col items-center justify-center p-6 text-center text-gray-500 sm:aspect-[5/4] md:aspect-[4/5] lg:aspect-[5/4]">
                <p className="text-5xl sm:text-6xl">🏋️</p>
                <p className="mt-3 text-sm">Workout image unavailable</p>
              </div>
            )}
          </div>

          <div className="min-w-0 py-1 sm:py-2">
            <p className="text-[10px] font-black tracking-[0.2em] text-[#DFFF36] sm:text-xs">
              WORKOUT DETAILS
            </p>

            <h1 className="mt-3 break-words text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {name}
            </h1>

            {categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <span
                    key={`${category}-${index}`}
                    className="max-w-full break-words rounded-full border border-[#DFFF36]/40 px-3 py-1 text-[10px] font-bold uppercase text-[#DFFF36] sm:text-xs"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 break-words text-sm leading-6 text-gray-300 sm:mt-5 sm:text-base sm:leading-7">
              {workout.description ||
                "Add this workout to your plan and keep track of your fitness routine."}
            </p>

            <section className="mt-6 sm:mt-7">
              <h2 className="mb-3 text-xs font-black tracking-widest text-[#DFFF36] sm:text-sm">
                KEY SPECS
              </h2>

              <div className="overflow-hidden rounded-xl border border-[#343643] bg-[#20222D]">
                {details.map((item) => (
                  <div
                    key={item.label}
                    className="flex min-w-0 items-start justify-between gap-3 border-b border-[#343643] px-3 py-3 last:border-b-0 sm:gap-4 sm:px-4"
                  >
                    <span className="shrink-0 text-[10px] font-bold tracking-wider text-gray-400 sm:text-xs">
                      {item.label}
                    </span>
                    <span className="min-w-0 break-words text-right text-xs font-bold text-white sm:text-sm">
                      {item.value != null && item.value !== ""
                        ? String(item.value)
                        : "--"}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => saveWorkout("fitlog-plan")}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#DFFF36] px-4 py-3 text-sm font-black text-black transition hover:bg-[#c9ed20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DFFF36]"
              >
                + Add to Today&apos;s Plan
              </button>

              <button
                type="button"
                onClick={() => saveWorkout("fitlog-saved")}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-[#555763] px-4 py-3 text-sm font-bold text-white transition hover:border-[#DFFF36] hover:text-[#DFFF36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DFFF36]"
              >
                ♡ Save for Later
              </button>
            </div>

            <section className="mt-8 sm:mt-9">
              <h2 className="text-lg font-black uppercase sm:text-xl">
                Instructions
              </h2>

              {instructions.length > 0 ? (
                <ol className="mt-4 space-y-4">
                  {instructions.map((step, index) => (
                    <li
                      key={`${index}-${step}`}
                      className="flex min-w-0 gap-3 text-sm leading-6 text-gray-300"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DFFF36] text-xs font-black text-black">
                        {index + 1}
                      </span>
                      <span className="min-w-0 break-words">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm leading-6 text-gray-400">
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
