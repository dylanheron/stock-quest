"use client";

import { Button } from "@mui/material";
import CompanyCarousel from "@/components/game/create/CompanyCarousel";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import Loader from "@/components/shared/Loader";

interface Company {
  _id: string;
  name: string;
  symbol: string;
  description: string;
}

export default function CreatePage() {
  const [currentCompany, setCurrentCompany] = useState(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const router = useRouter();
  const { user } = useClerk();

  useEffect(() => {
    fetch("/api/company")
      .then((response) => response.json())
      .then((data) => setCompanies(data))
      .catch((error) => console.error("Error fetching companies:", error));
  }, []);

  const handleStartGame = async () => {
    // currentCompany is the index of the company in the companies array
    if (companies.length === 0) return;

    const userId = user?.id;

    const response = await fetch("/api/game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        userId: userId || ""
      },
      body: JSON.stringify({
        companyId: companies[currentCompany]._id
      })
    });

    if (response.ok) {
      const game = await response.json();
      router.push(`/game/${game.gameCode}`); // Redirect to game lobby if successful where you will be able to see everyone playing!
    } else {
      console.error("Failed to start game");
    }
  };

  return (
    <div className="w-screen absolute top-0 pointer-events-none">
      {companies.length === 0 ? (
        <Loader />
      ) : (
        <div className="flex flex-row h-screen justify-between items-center ml-[10%] mr-[10%]">
          <div className="flex flex-col mr-10 mt-10 pointer-events-auto">
            <h1 className="text-6xl md:text-8xl font-semibold mb-5">
              {companies[currentCompany]?.name}
            </h1>
            <p className="w-72 md:w-96">
              {companies[currentCompany]?.description}
            </p>
            <Button
              onClick={handleStartGame}
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "black",
                marginTop: "20px",
                border: "1px solid white",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#4d4d4d",
                  color: "white"
                }
              }}
            >
              Start Game
            </Button>
          </div>
          <CompanyCarousel
            companyArray={companies}
            setCurrentCompany={setCurrentCompany}
            currentCompany={currentCompany}
          />
        </div>
      )}
    </div>
  );
}
