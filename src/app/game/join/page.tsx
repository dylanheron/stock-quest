import Join from "@/components/game/join/Join";
import Loader from "@/components/shared/Loader";
import { Suspense } from "react";

export default function JoinPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Join />
    </Suspense>
  );
}
