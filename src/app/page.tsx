import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#171820]">
      <Navbar />
      <Hero />
    </main>
  );
}