import Link from "next/link";

interface QuizFinishedProps {
  correctCounter: number;
}

import { Button } from "@mui/material";

const QuizFinished: React.FC<QuizFinishedProps> = ({ correctCounter }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className={`font-bold text-9xl`}>{correctCounter}/5</p>
      <Link href="/learn/quiz">
        <Button
          variant="contained"
          sx={{
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
          className={`rounded-2xl shadow-xl`}
        >
          Try Again
        </Button>
      </Link>
    </div>
  );
};

export default QuizFinished;
