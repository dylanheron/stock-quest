import Resources from "@/components/learn/resources/Resources";
import Loader from "@/components/shared/Loader";
import { Suspense } from "react";

export default function QuizPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Resources />
    </Suspense>
  );
}
