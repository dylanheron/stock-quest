import Home from "@/components/home/Home";
import Loader from "@/components/shared/Loader";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <Home />
    </Suspense>
  );
}
