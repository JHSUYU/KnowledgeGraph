import { Button } from "antd";
import React from "react";
export type CheckButtonProps = {
  defaultCheck?: boolean;
  onActive?: (value: string) => void;
  value: string;
};
export default function CheckButton(props: CheckButtonProps) {
  const { defaultCheck, value, onActive } = props;
  return (
    <Button
      type={defaultCheck ? "primary" : "default"}
      onClick={() => {
        onActive?.(value);
      }}
    >
      {value}
    </Button>
  );
}
