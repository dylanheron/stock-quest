"use client";

import QuizButton from "@/components/learn/quiz/QuizButton";
import Timer from "@/components/learn/quiz/Timer";

import { Button } from "@mui/material";

import questionsEasy from "../../../../public/questions/questions_easy.json";
import questionsMedium from "../../../../public/questions/questions_medium.json";
import questionsHard from "../../../../public/questions/questions_hard.json";

import React, { useEffect, useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctOption: number;
}

interface QuizProps {
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setCorrectCounter: React.Dispatch<React.SetStateAction<number>>;
  correctCounter: number;
  isCompleted: boolean;
  difficulty: string;
}

const QuizPage: React.FC<QuizProps> = ({
  setCompleted,
  setCorrectCounter,
  correctCounter,
  isCompleted,
  difficulty
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRoundFinished, setRoundFinished] = useState(false);

  const [questions, setQuestions] = useState<any[]>([]);

  type SelectedQuestions = Question[];

  useEffect(() => {
    let selectedQuestions: SelectedQuestions = [];
    switch (difficulty) {
      case "easy":
        selectedQuestions = questionsEasy;
        break;
      case "medium":
        selectedQuestions = questionsMedium;
        break;
      case "hard":
        selectedQuestions = questionsHard;
        break;
      default:
        selectedQuestions = [];
    }
    setQuestions(selectedQuestions);
  }, [difficulty]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionClick = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    if (optionIndex == currentQuestion.correctOption) {
      setCorrectCounter(correctCounter + 1);
    }
    setRoundFinished(true);
    setTimerRunning(false);
  };

  const handleContinueClick = () => {
    setSelectedOption(null);
    setTimerRunning(true);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRoundFinished(false);
    } else {
      setCompleted(true);
      setRoundFinished(true);
    }
  };

  const handleTimeOver = () => {
    setRoundFinished(true);
    setTimerRunning(false);
  };

  return (
    <div className="flex flex-col h-screen items-center w-screen absolute top-0 pointer-events-none">
      <div className="flex px-4 w-40 mt-32 justify-center">
        <Timer running={timerRunning} onTimeOver={handleTimeOver} />
      </div>
      <div
        className={`flex w-10/12 items-center justify-center ${!isCompleted ? "visible" : "invisible"}`}
        style={{ height: "15%" }}
      >
        <p className="mt-12 text-4xl font-bold text-center">
          {currentQuestion && currentQuestion.question}
        </p>
      </div>
      <div
        className={`w-10/12 pointer-events-auto grid grid-cols-2 gap-5 mt-12 mb-2 ml-12 mr-12 flex-none ${!isCompleted ? "visible" : "invisible"}`}
        style={{ height: "35%" }}
      >
        {currentQuestion &&
          currentQuestion.options.map((option: string, index: number) => (
            <QuizButton
              key={option}
              text={`${option}`}
              selected={selectedOption === index}
              correct={index === currentQuestion.correctOption}
              onClick={() => handleOptionClick(index)}
              disabled={isRoundFinished}
            />
          ))}
      </div>
      <Button
        variant="contained"
        sx={{
          visibility: isRoundFinished && !isCompleted ? "visible" : "invisible",
          backgroundColor: "white",
          color: "black",
          marginTop: "50px",
          border: "1px solid white",
          fontWeight: "bold",
          width: "200px",
          "&:hover": {
            backgroundColor: "#4d4d4d",
            color: "white"
          }
        }}
        onClick={handleContinueClick}
        className={`${isRoundFinished && !isCompleted ? "visible" : "invisible"} rounded-2xl shadow-xl pointer-events-auto`}
      >
        Next
      </Button>
    </div>
  );
};

export default QuizPage;
