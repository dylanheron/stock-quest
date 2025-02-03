"use client";

import { ToggleButton, ToggleButtonGroup, Button } from "@mui/material";

import Filter1Outlined from "@mui/icons-material/Filter1Outlined";
import Filter2Outlined from "@mui/icons-material/Filter2Outlined";
import Filter3Outlined from "@mui/icons-material/Filter3Outlined";

import Link from "next/link";

import React, { useState } from "react";

export default function QuizDashboard() {
  const [difficulty, setDifficulty] = useState(0);

  const links = ["/learn/quiz/easy", "/learn/quiz/medium", "/learn/quiz/hard"];

  const handleDifficulty = (
    event: React.MouseEvent<HTMLElement>,
    newDifficulty: number
  ) => {
    setDifficulty(newDifficulty);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center w-screen absolute top-0 pointer-events-none">
      <h1 className="font-semibold text-6xl mb-10">Choose Difficulty</h1>
      <ToggleButtonGroup
        color="secondary"
        value={difficulty}
        exclusive
        size="large"
        className="pointer-events-auto"
        onChange={handleDifficulty}
        style={{ width: "1000px", height: "350px", marginBottom: "50px" }}
      >
        <ToggleButton
          value={0}
          aria-label="easy mode"
          style={{
            width: "400px",
            color: "white",
            borderColor: "white",
            backgroundColor: difficulty === 0 ? "#36393b" : "transparent"
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <Filter1Outlined
              style={{
                color: "white",
                width: "150px",
                height: "150px",
                marginBottom: "30px"
              }}
            />
            <h1 className="text-white font-medium text-3xl">Easy</h1>
          </div>
        </ToggleButton>
        <ToggleButton
          value={1}
          aria-label="medium mode"
          style={{
            width: "400px",
            color: "white",
            borderColor: "white",
            backgroundColor: difficulty === 1 ? "#36393b" : "transparent"
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <Filter2Outlined
              style={{
                color: "white",
                width: "150px",
                height: "150px",
                marginBottom: "30px"
              }}
            />
            <h1 className="text-white font-medium text-3xl">Medium</h1>
          </div>
        </ToggleButton>
        <ToggleButton
          value={2}
          aria-label="hard mode"
          style={{
            width: "400px",
            color: "white",
            borderColor: "white",
            backgroundColor: difficulty === 2 ? "#36393b" : "transparent"
          }}
        >
          <div className="flex flex-col justify-center items-center">
            <Filter3Outlined
              style={{
                color: "white",
                width: "150px",
                height: "150px",
                marginBottom: "30px"
              }}
            />
            <h1 className="text-white font-medium text-3xl">Hard</h1>
          </div>
        </ToggleButton>
      </ToggleButtonGroup>

      <Link href={links[difficulty]}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "black",
            border: "1px solid white",
            fontWeight: "bold",
            width: "200px",
            "&:hover": {
              backgroundColor: "#4d4d4d",
              color: "white"
            }
          }}
          className={`rounded-2xl shadow-xl pointer-events-auto`}
        >
          Start Quiz
        </Button>
      </Link>
    </div>
  );
}
