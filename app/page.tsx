import Navbar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import PopularDestinations from "@/components/landing/PopularDestinations";
import ExploreModes from "@/components/landing/ExploreModes";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PopularDestinations />
      <ExploreModes />
    </main>
  );
}