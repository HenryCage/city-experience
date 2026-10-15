import { Suspense } from "react";

import AppNavigation from "@/components/app/AppNavigation";
import SavedPlacesView from "@/components/saved/SavedPlacesView";

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-(--background) pb-20 md:pb-0">
      <Suspense fallback={null}>
        <AppNavigation />
      </Suspense>

      <SavedPlacesView />
    </main>
  );
}