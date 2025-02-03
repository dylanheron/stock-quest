"use client";

import { Button, Slider, Stack } from "@mui/material";
import { useState } from "react";

interface BuyButtonProps {
  onClick: (amount: number) => void;
}

export default function Buy({ onClick }: BuyButtonProps) {
  const [buyPercent, setBuyPercent] = useState(100);

  const marks = [
    { value: 25, label: "25%" },
    { value: 50, label: "50%" },
    { value: 75, label: "75%" }
  ];

  return (
    <Stack spacing={2} direction="column">
      <Button
        variant="contained"
        color="success"
        size="large"
        sx={{
          width: { sm: 100, md: 150, lg: 200, xl: 300 },
          fontSize: { sm: "1rem", md: "1.5rem", lg: "2rem", xl: "3rem" }
        }}
        onClick={() => onClick(buyPercent / 100)}
      >
        Buy
      </Button>
      <Slider
        value={buyPercent}
        onChange={(event) =>
          setBuyPercent(Number((event.target as HTMLInputElement).value))
        }
        color="success"
        valueLabelDisplay="auto"
        step={5}
        marks={marks}
        min={0}
        max={100}
        sx={{
          width: { sm: 100, md: 150, lg: 200, xl: 300 },
          "& .MuiSlider-rail": {
            height: 8
          },
          "& .MuiSlider-track": {
            height: 8
          },
          "& .MuiSlider-thumb": {
            height: 24,
            width: 24
          },
          "& .MuiSlider-markLabel": {
            color: "white"
          }
        }}
      />
    </Stack>
  );
}
