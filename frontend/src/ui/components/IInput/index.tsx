import React, { HTMLInputTypeAttribute, ReactNode } from "react";

export default function IInput(props: {
  prefix: ReactNode;
  value: string;
  onChange: (value: string) => void;
  inputType?: HTMLInputTypeAttribute;
}) {
  const { prefix, value, onChange, inputType } = props;
  return (
    <span className="rounded-none border-b-2 border-0 border-solid border-black text-black dark:border-white dark:text-white flex items-center">
      <span className="ant-input-prefix">
        <span role="img" aria-label="mobile">
          {prefix}
        </span>
      </span>
      <input
        className="bg-transparent border-0 ant-input ant-input-borderless dark:text-white"
        type={inputType}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </span>
  );
}
