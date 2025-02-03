"use client";

import QuizFinished from "@/components/learn/quiz/QuizFinished";
import QuizPlaying from "@/components/learn/quiz/QuizPlaying";

import React, { useState } from "react";

interface QuizProps {
  difficulty: string;
}

export default function QuizPage({ difficulty }: QuizProps) {
  const [isCompleted, setCompleted] = useState(false);
  const [correctCounter, setCorrectCounter] = useState(0);

  return (
    <div>
      {isCompleted ? (
        <QuizFinished correctCounter={correctCounter} />
      ) : (
        <QuizPlaying
          setCompleted={setCompleted}
          setCorrectCounter={setCorrectCounter}
          isCompleted={isCompleted}
          correctCounter={correctCounter}
          difficulty={difficulty}
        />
      )}
    </div>
  );
}
