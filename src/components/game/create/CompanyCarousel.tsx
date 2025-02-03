"use client";

import right_arrow from "/public/images/right_arrow.png";
import React from "react";
import Image from "next/image";

interface Company {
  _id: string;
  name: string;
  description: string;
  symbol: string;
}

interface CompanyCarouselProps {
  companyArray: Company[];
  setCurrentCompany: React.Dispatch<React.SetStateAction<number>>;
  currentCompany: number;
}

const CompanyCarousel: React.FC<CompanyCarouselProps> = ({
  companyArray,
  setCurrentCompany,
  currentCompany
}) => {
  const handleNextCompany = () => {
    setCurrentCompany((prevCompany) =>
      prevCompany === companyArray.length - 1 ? 0 : prevCompany + 1
    );
  };

  return (
    <div className="flex flex-row items-center pointer-events-auto">
      {companyArray.length > 0 && (
        <Image
          src={`/images/${companyArray[currentCompany].name.toLowerCase()}.png`}
          alt={companyArray[currentCompany].name}
          className="mr-32"
          width={200}
          height={200}
        />
      )}
      <button onClick={handleNextCompany}>
        <Image src={right_arrow} alt="Next Arrow" width="50" height="50" />
      </button>
    </div>
  );
};

export default CompanyCarousel;
