"use client";

import React from "react";
import { useTimer } from "react-timer-hook";

// For more details please view https://www.npmjs.com/package/react-timer-hook
export default function Timer({ expiryTimestamp }: { expiryTimestamp: Date }) {
  const { seconds, minutes } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called")
  });

  return (
    <div>
      <div className="text-[5vw]">
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}
