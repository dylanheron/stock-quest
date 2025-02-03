import { Suspense } from "react";
import Statistics from "@/components/statistics/Statistics";
import Loader from "@/components/shared/Loader";

export default function StatisticsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <Statistics />
    </Suspense>
  );
}
