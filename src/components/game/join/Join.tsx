"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; // Corrected import
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";

export default function Join() {
  const { user } = useUser();
  const { push } = useRouter(); // Destructuring push from useRouter

  const [gameCode, setGameCode] = useState("");

  const { mutate } = useMutation({
    onMutate: async (gameCode: string) => {
      const result = await fetch(`/api/game/${gameCode}/join`, {
        method: "POST",
        headers: {
          userId: user?.id || ""
        }
      });

      if (result.ok) {
        toast.success(`Successfully joined the game!`);
        push(`/game/${gameCode}`); // Using push to navigate
      } else if (result.status === 409) {
        // if 409 then game already started (conflict)
        toast.error(
          <>
            Sorry the game has already{" "}
            <span className="font-bold underline">started</span> &#128557;
            please join another game
          </>
        );
      } else if (result.status === 400) {
        // if 400 then game already ended (bad request)
        toast.error(
          <>
            Sorry the game has already{" "}
            <span className="font-bold underline">ended</span> &#128557; please
            join another game
          </>
        );
      } else {
        toast.error("Failed to join the game. Redirecting to join page...");
        console.error("Failed to join the game");
      }
    }
  });

  return (
    <div className="flex flex-col h-screen w-screen absolute top-0 pointer-events-none justify-center items-center">
      <h1 className="text-4xl mb-6">Join Game</h1>
      <div className="flex flex-col bg-[#4d4d4d] rounded-md shadow-md p-4 pointer-events-auto">
        <TextField
          className="rounded-md text-white"
          label="Game Pin"
          variant="outlined"
          InputProps={{ className: "text-white" }}
          InputLabelProps={{ style: { color: "white" } }}
          sx={{
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              borderColor: "white"
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "white"
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "white"
              }
          }}
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "black",
            marginTop: "10px",
            border: "1px solid white",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#4d4d4d",
              color: "white"
            }
          }}
          onClick={() => mutate(gameCode)}
        >
          Enter
        </Button>
      </div>
    </div>
  );
}
