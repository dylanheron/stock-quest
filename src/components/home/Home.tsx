"use client";

import React, { useCallback, useState } from "react";
import Graph from "./Graph";
import Card from "./Card";
import { NewsFeed, NewsItem } from "./NewsFeed";
import { Button, Skeleton } from "@mui/material";

export default function Home() {
  const [newsData, setNewsData] = useState<NewsItem[] | null>(null);

  const onDataLoaded = useCallback((data: NewsItem[]) => {
    setNewsData(data);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-center flex-grow">
        <div>
          <p className="text-6xl">
            Stocks are boring.
            <br />
            <span className="text-[#2AB4E3]">
              Learn them <br /> the right way!
            </span>
          </p>
        </div>
        <Graph />
      </div>
      <div>
        <div className="w-full text-center text-white">
          <h2 style={{ fontSize: "2rem" }}>
            Latest <span className="text-[#2AB4E3]">financial news</span>
          </h2>
        </div>
        <NewsFeed onDataLoaded={onDataLoaded} />
        <div className="grid grid-cols-3 mb-5 mx-5 gap-10 p-4 h-1/3">
          {newsData
            ? newsData.map((item: NewsItem, index: number) => (
                <Card
                  title={item.title}
                  description={item.description.substring(0, 100) + "..."}
                  url={item.url}
                  key={index}
                />
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  sx={{ bgcolor: "rgb(82 82 82)" }}
                  variant="rectangular"
                  height={150}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
