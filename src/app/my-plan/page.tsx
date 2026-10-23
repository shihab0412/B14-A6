
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Workout = {
  id: string | number;
  name?: string;
  title?: string;
  duration?: number | string;
  calories?: number | string;
};

export default function MyPlanPage() {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [tab, setTab] = useState<"plan" | "saved">("plan");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setPlan(JSON.parse(localStorage.getItem("fitlog-plan") || "[]"));
      setSaved(JSON.parse(localStorage.getItem("fitlog-saved") || "[]"));
      setCompleted(
        JSON.parse(localStorage.getItem("fitlog-completed") || "[]")
      );
    } catch {
      setPlan([]);
      setSaved([]);
      setCompleted([]);
    }

    setReady(true);
  }, []);

  function removeWorkout(id: string | number) {
    if (tab === "plan") {
      const updated = plan.filter((item) => String(item.id) !== String(id));
      setPlan(updated);
      localStorage.setItem("fitlog-plan", JSON.stringify(updated));
    } else {
      const updated = saved.filter((item) => String(item.id) !== String(id));
      setSaved(updated);
      localStorage.setItem("fitlog-saved", JSON.stringify(updated));
    }
  }

  function toggleComplete(id: string | number) {
    const key = String(id);
    const updated = completed.includes(key)
      ? completed.filter((item) => item !== key)
      : [...completed, key];

    setCompleted(updated);
    localStorage.setItem("fitlog-completed", JSON.stringify(updated));
  }

  const minutes = plan.reduce(
    (total, item) => total + Number(item.duration || 0),
    0
  );

  const calories = plan.reduce(
    (total, item) => total + Number(item.calories || 0),
    0
  );

  const items = tab === "plan" ? plan : saved;

  return (
    <main className="min-h-screen bg-[#171820] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-[1120px]">
        <Link href="/" className="text-sm font-bold text-[#DFFF36]">
          ← Back to Workouts
        </Link>

        <p className="mt-8 text-xs font-black tracking-widest text-[#DFFF36]">
          YOUR FITNESS JOURNEY
        </p>

        <h1 className="mt-2 text-4xl font-black">My Plan</h1>

        <p className="mt-3 text-sm text-gray-400">
          Track your workouts and keep building your routine.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Exercises", value: plan.length },
            { label: "Minutes", value: minutes },
            { label: "Calories", value: calories },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#343643] bg-[#20222D] p-5"
            >
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="mt-2 text-3xl font-black text-[#DFFF36]">
                {ready ? item.value : "..."}
              </p>
            </div>
          ))}
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
            Today&apos;s Plan ({plan.length})
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
          <p className="py-10 text-gray-400">Loading...</p>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[#343643] bg-[#20222D] px-5 py-12 text-center">
            <h2 className="text-xl font-bold">
              {tab === "plan"
                ? "Your plan is empty"
                : "No saved workouts yet"}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Add workouts from the workout library to see them here.
            </p>

            <Link
              href="/#library"
              className="mt-5 inline-flex rounded-lg bg-[#DFFF36] px-5 py-3 text-sm font-black text-black"
            >
              Browse Workouts
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => {
              const name = item.name ?? item.title ?? "Workout";
              const isDone = completed.includes(String(item.id));

              return (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-[#343643] bg-[#20222D] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h2
                      className={`font-bold ${
                        tab === "plan" && isDone
                          ? "text-gray-500 line-through"
                          : "text-white"
                      }`}
                    >
                      {name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      {item.duration ?? "--"} min · {item.calories ?? "--"} kcal
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/workout/${item.id}`}
                      className="rounded-lg border border-[#555763] px-3 py-2 text-sm font-bold"
                    >
                      View Details
                    </Link>

                    {tab === "plan" && (
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className="rounded-lg bg-[#DFFF36] px-3 py-2 text-sm font-bold text-black"
                      >
                        {isDone ? "Undo Done" : "Mark as Done"}
                      </button>
                    )}

                    <button
                      onClick={() => removeWorkout(item.id)}
                      className="rounded-lg border border-red-900 px-3 py-2 text-sm font-bold text-red-400"
                    >
                      Remove
                    </button>
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
