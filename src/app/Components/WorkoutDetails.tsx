
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
  rating?: number | string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  instructions?: string[] | string;
  [key: string]: unknown;
};

const API = "https://api.abcz.workers.dev/api/fitlog";

export default function WorkoutDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadWorkout() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API}/${encodeURIComponent(id)}`
        );

        if (!response.ok) {
          throw new Error("Workout details load kora jayni.");
        }

        const result: unknown = await response.json();

        let item: unknown = result;

        if (result && typeof result === "object" && !Array.isArray(result)) {
          const obj = result as Record<string, unknown>;
          item = obj.data ?? obj.workout ?? obj.result ?? result;
        }

        if (Array.isArray(item)) {
          item = item[0];
        }

        if (!item || typeof item !== "object") {
          throw new Error("Workout data paoa jayni.");
        }

        setWorkout(item as Workout);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) loadWorkout();
  }, [id]);

  function saveWorkout(type: "fitlog-plan" | "fitlog-saved") {
    if (!workout) return;

    const workoutId = String(workout.id ?? workout._id ?? id);
    const name = String(workout.name ?? workout.title ?? "Workout");

    const entry = {
      ...workout,
      id: workoutId,
      name,
    };

    try {
      const current = JSON.parse(
        localStorage.getItem(type) || "[]"
      ) as Workout[];

      if (current.some((item) => String(item.id ?? item._id) === workoutId)) {
        setMessage(
          type === "fitlog-plan"
            ? "Workout already in your plan!"
            : "Workout already saved!"
        );
        return;
      }

      if (type === "fitlog-plan" && current.length >= 5) {
        setMessage("Your plan can contain up to 5 workouts.");
        return;
      }

      localStorage.setItem(
        type,
        JSON.stringify([...current, entry])
      );

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
        Loading workout...
      </main>
    );
  }

  if (error || !workout) {
    return (
      <main className="min-h-screen bg-[#171820] px-5 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-black">Workout not found</h1>
          <p className="mt-3 text-gray-400">
            {error || "Ei workout-er details paoa jayni."}
          </p>
          <Link
            href="/"
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
  const description = workout.description;
  const instructions = Array.isArray(workout.instructions)
    ? workout.instructions
    : typeof workout.instructions === "string"
      ? workout.instructions.split(/\n+/).filter(Boolean)
      : [];

  const details = [
    { label: "CATEGORY", value: workout.category },
    { label: "EQUIPMENT", value: workout.equipment },
    { label: "DURATION", value: workout.duration ? `${workout.duration} min` : undefined },
    { label: "CALORIES", value: workout.calories ? `${workout.calories} kcal` : undefined },
    { label: "RATING", value: workout.rating ? `★ ${workout.rating}` : undefined },
  ].filter((item) => item.value !== undefined && item.value !== "");

  return (
    <main className="min-h-screen bg-[#171820] px-4 py-8 text-white sm:px-6 sm:py-12">
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
                className="h-full max-h-[500px] w-full object-cover"
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

            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              {name}
            </h1>

            {typeof workout.category === "string" && (
              <span className="mt-4 inline-block rounded-full border border-[#DFFF36]/40 px-3 py-1 text-xs font-bold text-[#DFFF36]">
                {workout.category}
              </span>
            )}

            <p className="mt-5 leading-7 text-gray-300">
              {typeof description === "string" && description
                ? description
                : "Add this workout to your plan and keep track of your fitness progress."}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#343643] bg-[#20222D] p-4"
                >
                  <p className="text-[10px] font-bold tracking-wider text-gray-400">
                    {item.label}
                  </p>
                  <p className="mt-2 break-words font-bold text-[#DFFF36]">
                    {String(item.value)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

            {message && (
              <p aria-live="polite" className="mt-4 text-sm text-[#DFFF36]">
                {message}
              </p>
            )}

            {instructions.length > 0 && (
              <section className="mt-9">
                <h2 className="text-xl font-black">How to Perform</h2>
                <ol className="mt-4 space-y-3">
                  {instructions.map((step, index) => (
                    <li key={index} className="flex gap-3 text-sm leading-6 text-gray-300">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#DFFF36] font-black text-black">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
