import { Button } from "@mui/material";

import Image from "next/image";
import JoinImage from "/public/images/join.png";
import CreateImage from "/public/images/create.png";
import Link from "next/link";

import React from "react";

export default function GameDashboard() {
  return (
    <div className="flex flex-col h-screen w-screen absolute top-0 pointer-events-none justify-center items-center">
      <h1 className="text-6xl mb-12 tracking-wider">Lets Play!</h1>
      <div className="flex flex-row pointer-events-auto">
        <div className="flex flex-col justify-center items-center mr-10">
          <Image
            src={JoinImage}
            alt="Multiplayer"
            width={250}
            style={{ marginBottom: "25px" }}
          />
          <Link href="/game/join">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid white",
                width: "180px",
                height: "40px",
                fontSize: "15px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#4d4d4d",
                  color: "white"
                }
              }}
            >
              Join Game
            </Button>
          </Link>
        </div>
        <div className="flex flex-col justify-center items-center ml-10">
          <Image
            src={CreateImage}
            alt="Multiplayer"
            width={250}
            style={{ marginBottom: "25px" }}
          />
          <Link href="/game/create">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "black",
                border: "1px solid white",
                width: "180px",
                height: "40px",
                fontSize: "15px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#4d4d4d",
                  color: "white"
                }
              }}
            >
              Create Game
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
