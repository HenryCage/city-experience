import Navbar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import PopularDestinations from "@/components/landing/PopularDestinations";
import ExploreModes from "@/components/landing/ExploreModes";
import FeaturedExperiences from "@/components/landing/FeaturedExperiences";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PopularDestinations />
      <ExploreModes />
      <FeaturedExperiences />
      <FinalCTA />
      <Footer />
    </main>
  );
}