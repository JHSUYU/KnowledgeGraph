import { logOut, useSubScribeLoginState } from "@/state/hooks/useLoginCheck";
import { useSubScribeDarkMode } from "@/state/page/drak";
import { Button, Divider, Space } from "antd";
import React from "react";
import { AvatarUploader } from "../components/AvatarUploader";
import UserAvatar from "../components/UserAvatar";

export default function SettingPage() {
  const { value: user } = useSubScribeLoginState();
  const { value: mode } = useSubScribeDarkMode();
  return (
    <div className="w-full h-full overflow-scroll flex justify-center">
      <div className="flex flex-col w-11/12 lg:w-9/12  p-1 font-mono">
        <div>
          <Divider
            orientation="left"
            style={{ borderTopColor: mode === "dark" ? "white" : "black" }}
          >
            <span className="text-black dark:text-white">User Setting</span>
          </Divider>
        </div>
        <div className="p-3">
          <Space direction="vertical" size={20}>
            <div>
              Avatar:
              <span className="ml-1">
                <UserAvatar />
              </span>
              <span className="ml-4">
                <AvatarUploader />
              </span>
            </div>
            <div>Username: {user?.username}</div>
            <div>Mobile: {user?.mobile}</div>
            <div>
              <Button danger type="primary" onClick={logOut}>
                Login Out
              </Button>
            </div>
          </Space>
        </div>
      </div>
    </div>
  );
}
