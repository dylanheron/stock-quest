import { Suspense } from "react";
import QuizDashboard from "@/components/learn/quiz/QuizDashboard";
import Loader from "@/components/shared/Loader";

export default function QuizDashboardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <QuizDashboard />
    </Suspense>
  );
}
