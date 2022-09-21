import { QuestionOutlined } from "@ant-design/icons";
import React from "react";

export default function Btn() {
  return (
    <div
      className="w-6 h-6 rounded-full flex justify-center items-center cursor-pointer border-2"
      onClick={() => {
        window.open("mailto:1020883511@qq.com", "_blank");
      }}
    >
      <QuestionOutlined />
    </div>
  );
}
