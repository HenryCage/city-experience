import Navbar from "@/components/landing/NavBar";
import ExploreContent from "@/components/explore/ExploreContent";

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-(--background)">
      <Navbar />
      <ExploreContent />
    </main>
  );
}