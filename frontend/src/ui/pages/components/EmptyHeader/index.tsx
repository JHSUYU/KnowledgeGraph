import React from "react";
import DarkModeControlBtn from "@/ui/components/DarkModeControlBtn";
import FeedbackBtn from "@/ui/components/FeedbackBtn";

export function EmptyHeader() {
  return (
    <div
      className="h-12 flex transition-all duration-500 ease-in-out"
      style={{ backgroundColor: "#2c2c2c", color: "#fbfbfb" }}
    >
      <div className="flex-1 flex items-center space-x-5">
        <div className="pl-10 pointer-events-none">SO-COIN</div>
        <div className="flex space-x-5 items-center justify-around font-sans font-light text-sm"></div>
      </div>
      <div className="flex w-24">
        <div className="w-10 flex items-center justify-end pr-2">
          <FeedbackBtn />
        </div>
        <div className="w-10 flex items-center justify-end pr-2">
          <DarkModeControlBtn />
        </div>
      </div>
    </div>
  );
}
