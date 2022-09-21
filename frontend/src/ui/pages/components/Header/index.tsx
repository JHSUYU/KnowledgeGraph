import React from "react";
import DarkModeControlBtn from "@/ui/components/DarkModeControlBtn";
import { Link } from "react-router-dom";
import { routeKeys } from "@/ui/hooks/useRouteKey";
import FeedbackBtn from "@/ui/components/FeedbackBtn";
import UserAvatar from "../UserAvatar";

interface HeaderButtonProps {
  text: string;
}
function HeaderButton({ text }: HeaderButtonProps) {
  return (
    <div className=" rounded-sm w-24 text-center p-1 cursor-pointer text-white duration-500 transform hover:text-gray-300 hover:bg-gray-600">
      {text}
    </div>
  );
}
export function Header() {
  return (
    <div
      className="h-12 flex transition-all duration-500 ease-in-out"
      style={{ backgroundColor: "#2c2c2c", color: "#fbfbfb" }}
    >
      <div className="flex-1 flex items-center space-x-5">
        <div className="pl-10 pointer-events-none">SO-COIN</div>
        <div className="flex space-x-5 items-center justify-around font-sans font-light text-sm">
          <Link to={`/${routeKeys.home}`}>
            <HeaderButton text="Home" />
          </Link>
          <Link to={`/${routeKeys.recommond}`}>
            <HeaderButton text="Recommend" />
          </Link>
          <Link to={`/${routeKeys.setting}`}>
            <HeaderButton text="Setting" />
          </Link>
        </div>
      </div>
      <div className="flex w-24 mr-2">
        <div className="w-10 flex items-center justify-end pr-2">
          <FeedbackBtn />
        </div>
        <div className="w-10 flex items-center justify-end pr-2">
          <DarkModeControlBtn />
        </div>
        <div className="w-10 flex items-center justify-end pr-2">
          <UserAvatar />
        </div>
      </div>
    </div>
  );
}
