import React from "react";

interface ButtonProps {
  text: string;
  selected: boolean;
  correct: boolean;
  onClick: () => void;
  disabled: boolean;
}

const QuizButton: React.FC<ButtonProps> = ({
  text,
  selected,
  correct,
  onClick,
  disabled
}) => {
  // let buttonColor = 'bg-[#262626]';
  let buttonColor = "bg-white";
  let textColor = "text-black";
  let hover = "hover:bg-gray-400";
  if (selected) {
    buttonColor = correct ? "bg-green-500" : "bg-red-500";
  }
  if (disabled) {
    hover = "";
  }

  return (
    <button
      className={`w-full h-full py-2 px-2 rounded-2xl shadow-xl border border-solid ${textColor} ${buttonColor} ${hover} font-bold text-lg`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default QuizButton;
