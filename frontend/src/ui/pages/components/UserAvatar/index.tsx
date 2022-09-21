import { useSubScribeLoginState } from "@/state/hooks/useLoginCheck";
import { routeKeys } from "@/ui/hooks/useRouteKey";
import { Avatar } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export default function UserAvatar() {
  const { value: user } = useSubScribeLoginState();
  return (
    <Link to={`/${routeKeys.setting}`}>
      <Avatar
        src={user?.avatar}
        shape="circle"
        size="default"
        className="bg-white cursor-pointer transform scale-90"
      />
    </Link>
  );
}
