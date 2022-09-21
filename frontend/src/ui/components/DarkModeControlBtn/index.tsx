import { IconFont } from "@/ui/Iconfont";
import React, { useEffect } from "react";
import { toggleDarkMode, useSubScribeDarkMode } from "../../../state/page/drak";

export default function Btn() {
  const { value } = useSubScribeDarkMode();
  const isdrakMode = value === "dark";
  useEffect(() => {
    const html = document.querySelector("html");
    isdrakMode ? html?.classList.add("dark") : html?.classList.remove("dark");
  }, [isdrakMode]);
  return (
    <div
      className="w-6 h-6 rounded-full flex justify-center items-center cursor-pointer border-2"
      onClick={toggleDarkMode}
    >
      {!isdrakMode ? (
        <IconFont type="icon-moon1" />
      ) : (
        <IconFont type="icon-Sun1" />
      )}
    </div>
  );
}
