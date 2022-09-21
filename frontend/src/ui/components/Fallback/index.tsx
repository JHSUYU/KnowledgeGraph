import { Spin } from "antd";
import React from "react";

export function Fallback() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spin />
    </div>
  );
}
