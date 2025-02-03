import { Suspense } from "react";
import Quiz from "@/components/learn/quiz/Quiz";
import Loader from "@/components/shared/Loader";

export default function QuizPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Quiz difficulty="medium" />
    </Suspense>
  );
}
