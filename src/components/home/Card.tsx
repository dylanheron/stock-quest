import React from "react";
import { Card, CardContent } from "@mui/material";

interface CardProps {
  title: string;
  description: string;
  url: string;
}

export default function Home({ title, description, url }: CardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Card className="h-full bg-neutral-600 text-white hover:bg-neutral-500 transition-colors duration-200">
        <CardContent>
          <h1 style={{ paddingBottom: "10px", fontWeight: "bold" }}>{title}</h1>
          <hr />
          <p
            style={{
              fontSize: "0.9rem",
              paddingTop: "10px",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {description}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}
