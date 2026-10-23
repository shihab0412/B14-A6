
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import WorkoutLibrary from "./Components/WorkoutLibrary";
import Footer from "./Components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#171820]">
      <Navbar />
      <Hero />
      <WorkoutLibrary />
      <Footer />
    </main>
  );
}
