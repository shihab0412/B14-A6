
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Workout = {
  id: string | number;
  _id?: string | number;
  name?: string;
  title?: string;
  image?: string;
  duration?: number | string;
  calories?: number | string;
  caloriesBurned?: number | string;
  rating?: number | string;
  sets?: number | string;
  reps?: number | string;
  difficulty?: string;
  muscleGroups?: string[] | string;
  equipment?: string;
};

export default function MyPlanPage() {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [tab, setTab] = useState<"plan" | "saved">("plan");
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const storedPlan = JSON.parse(
        localStorage.getItem("fitlog-plan") || "[]"
      );
      const storedSaved = JSON.parse(
        localStorage.getItem("fitlog-saved") || "[]"
      );
      const storedCompleted = JSON.parse(
        localStorage.getItem("fitlog-completed") || "[]"
      );

      setPlan(Array.isArray(storedPlan) ? storedPlan : []);
      setSaved(Array.isArray(storedSaved) ? storedSaved : []);
      setCompleted(
        Array.isArray(storedCompleted)
          ? storedCompleted.map(String)
          : []
      );
    } catch {
      setPlan([]);
      setSaved([]);
      setCompleted([]);
    }

    setReady(true);
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }

  function removeWorkout(id: string | number) {
    if (tab === "plan") {
      const updated = plan.filter(
        (item) => String(item.id ?? item._id) !== String(id)
      );
      setPlan(updated);
      localStorage.setItem("fitlog-plan", JSON.stringify(updated));
    } else {
      const updated = saved.filter(
        (item) => String(item.id ?? item._id) !== String(id)
      );
      setSaved(updated);
      localStorage.setItem("fitlog-saved", JSON.stringify(updated));
    }

    showToast("Workout removed");
  }

  function toggleComplete(id: string | number) {
    const key = String(id);
    const isDone = completed.includes(key);

    const updated = isDone
      ? completed.filter((item) => item !== key)
      : [...completed, key];

    setCompleted(updated);
    localStorage.setItem("fitlog-completed", JSON.stringify(updated));
    showToast(isDone ? "Workout marked as not done" : "Workout marked as done");
  }

  const minutes = plan.reduce(
    (total, item) => total + Number(item.duration || 0),
    0
  );

  const calories = plan.reduce(
    (total, item) =>
      total + Number(item.caloriesBurned ?? item.calories ?? 0),
    0
  );

  const items = tab === "plan" ? plan : saved;

  return (
    <main className="min-h-screen bg-[#171820] px-4 py-10 text-white sm:px-6">
      {toast && (
        <div
          role="status"
          className="fixed right-4 top-5 z-50 rounded-lg border border-[#DFFF36] bg-[#20222D] px-5 py-3 text-sm font-bold text-[#DFFF36] shadow-lg"
        >
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-[1120px]">
        <Link href="/" className="text-sm font-bold text-[#DFFF36]">
          ← Back to Workouts
        </Link>

        <p className="mt-8 text-xs font-black tracking-widest text-[#DFFF36]">
          YOUR FITNESS JOURNEY
        </p>

        <h1 className="mt-2 text-4xl font-black uppercase">My Plan</h1>

        <p className="mt-3 text-sm text-gray-400">
          Cap of five lifts for today. Finish them, then load more.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#343643] bg-[#20222D] p-5">
            <p className="text-sm text-gray-400">Exercises</p>
            <p className="mt-2 text-3xl font-black text-[#DFFF36]">
              {ready ? plan.length : 0}
            </p>
          </div>

          <div className="rounded-xl border border-[#343643] bg-[#20222D] p-5">
            <p className="text-sm text-gray-400">Minutes</p>
            <p className="mt-2 text-3xl font-black text-[#DFFF36]">
              {ready ? minutes : 0}
            </p>
          </div>

          <div className="rounded-xl border border-[#343643] bg-[#20222D] p-5">
            <p className="text-sm text-gray-400">Calories</p>
            <p className="mt-2 text-3xl font-black text-[#DFFF36]">
              {ready ? calories : 0}
            </p>
          </div>
        </div>

        <div className="mt-10 flex gap-6 border-b border-[#343643]">
          <button
            onClick={() => setTab("plan")}
            className={`pb-3 text-sm font-bold ${
              tab === "plan"
                ? "border-b-2 border-[#DFFF36] text-[#DFFF36]"
                : "text-gray-400"
            }`}
          >
            Today's Plan ({plan.length})
          </button>

          <button
            onClick={() => setTab("saved")}
            className={`pb-3 text-sm font-bold ${
              tab === "saved"
                ? "border-b-2 border-[#DFFF36] text-[#DFFF36]"
                : "text-gray-400"
            }`}
          >
            Saved ({saved.length})
          </button>
        </div>

        {!ready ? (
          <p className="py-10 text-gray-400">Loading workouts…</p>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[#343643] bg-[#20222D] px-5 py-12 text-center">
            <h2 className="text-xl font-black uppercase">
              NOTHING HERE YET
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Browse the library and add a lift to get today moving.
            </p>

            <Link
              href="/#library"
              className="mt-5 inline-flex rounded-lg bg-[#DFFF36] px-5 py-3 text-sm font-black text-black"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {items.map((item) => {
              const id = item.id ?? item._id;
              const name = item.name ?? item.title ?? "Workout";
              const isDone = completed.includes(String(id));
              const itemCalories = item.caloriesBurned ?? item.calories;

              return (
                <div
                  key={String(id)}
                  className="overflow-hidden rounded-xl border border-[#343643] bg-[#20222D]"
                >
                  <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={name}
                        className="h-40 w-full rounded-lg object-cover sm:w-48"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center rounded-lg bg-[#292B37] text-sm text-gray-500 sm:w-48">
                        No image
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h2
                        className={`text-lg font-bold ${
                          tab === "plan" && isDone
                            ? "text-gray-500 line-through"
                            : "text-white"
                        }`}
                      >
                        {name}
                      </h2>

                      <p className="mt-2 text-sm text-gray-400">
                        Equipment: {item.equipment || "--"}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                        <span>◷ {item.duration ?? "--"} min</span>
                        <span>🔥 {itemCalories ?? "--"} kcal</span>
                        <span>★ {item.rating ?? "--"}</span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                          href={`/workout/${id}`}
                          className="rounded-lg bg-[#DFFF36] px-4 py-2 text-sm font-black text-black"
                        >
                          View Details
                        </Link>

                        {tab === "plan" && (
                          <button
                            onClick={() => toggleComplete(id)}
                            className="rounded-lg border border-[#555763] px-4 py-2 text-sm font-bold"
                          >
                            {isDone ? "✓ Done" : "✓ Mark as Done"}
                          </button>
                        )}

                        <button
                          onClick={() => removeWorkout(id)}
                          aria-label={`Remove ${name}`}
                          className="rounded-lg border border-red-900 px-4 py-2 text-sm font-bold text-red-400"
                        >
                          X Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
