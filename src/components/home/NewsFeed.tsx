"use client";

import React, { useEffect } from "react";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  description: string;
  url: string;
  image_url: string;
}

export function NewsFeed({
  onDataLoaded
}: {
  onDataLoaded: (data: NewsItem[]) => void;
}) {
  useEffect(() => {
    fetch(
      "https://api.marketaux.com/v1/news/all?language=en&api_token=v9PtixhBTnJ4Mreht2YDu1LKqj3661OTBYoUVc7j"
    )
      .then((response) => response.json())
      .then((data) => {
        onDataLoaded(data.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [onDataLoaded]);

  return null;
}
