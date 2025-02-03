"use client";

import React, { useState, useEffect } from "react";

interface TimerProps {
  running: boolean;
  onTimeOver: () => void;
}

const Timer: React.FC<TimerProps> = ({ running, onTimeOver }) => {
  const [time, setTime] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (running) {
      setTime(30);
      timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(timer);
            onTimeOver();
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [running]);

  const timerRed = time === 0 ? "text-red-500" : "";

  return (
    <div>
      <p className={`text-3xl font-bold ${timerRed}`}>{time}</p>
    </div>
  );
};

export default Timer;
