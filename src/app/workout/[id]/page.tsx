
import { Suspense } from "react";
import WorkoutDetails from "../../Components/WorkoutDetails";

export default function WorkoutPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#171820] text-[#DFFF36]">
          Loading workout...
        </main>
      }
    >
      <WorkoutDetails />
    </Suspense>
  );
}