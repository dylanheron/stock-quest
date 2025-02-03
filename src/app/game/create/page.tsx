import { Suspense } from "react";
import Create from "@/components/game/create/Create";
import Loader from "@/components/shared/Loader";

export default function CreateGamePage() {
  return (
    <Suspense fallback={<Loader />}>
      <Create />
    </Suspense>
  );
}
