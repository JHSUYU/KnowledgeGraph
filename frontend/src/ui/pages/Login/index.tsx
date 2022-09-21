import {
  LoginUser,
  loginUser,
  registerUser,
  setToken,
} from "@/api/loginRequest";
import { errorSymbol, getUserInfo } from "@/api/request";
import { dispatchLoginState } from "@/state/hooks/useLoginCheck";
import IInput from "@/ui/components/IInput";
import { LockOutlined, MobileOutlined, UserOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./index.less";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [passwd, setPasswd] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [passwdError, setPasswdError] = useState(false);

  const onok = useCallback(async () => {
    setLoading(true);
    const error = {
      username: false,
      mobile: false,
      passwd: false,
    };
    if (username === "" && mode === "register") {
      message.error({
        content: `Username should not be empty!`,
        key: "loginError",
      });
      error.username = true;
      setUsernameError(true);
    }
    if (mobile === "") {
      message.error({
        content: `Mobile should not be empty!`,
        key: "loginError",
      });
      error.mobile === true;
      setMobileError(true);
    }
    if (passwd === "") {
      message.error({
        content: `Password should not be empty!`,
        key: "loginError",
      });
      error.passwd = true;
      setPasswdError(true);
    }
    const hasError = error.mobile || error.passwd || error.username;
    const realLogin = async (d: LoginUser) => {
      if (d !== errorSymbol) {
        setToken(d.token);
        const userInfo = await getUserInfo();
        dispatchLoginState(userInfo);
      }
    };
    if (mode === "login" && !hasError) {
      const d = await loginUser({
        mobile,
        password: passwd,
      });
      await realLogin(d);
    } else if (mode === "register" && !hasError) {
      const register = await registerUser({
        mobile,
        password: passwd,
        username,
      });
      if (register !== errorSymbol) {
        const d = await loginUser({
          mobile,
          password: passwd,
        });
        await realLogin(d);
      }
    }
    setLoading(false);
  }, [mobile, mode, passwd, username]);
  useEffect(() => {
    const enterPress = (e: { code: string }) => {
      if (e.code.toLowerCase() === "enter") {
        onok();
      }
    };
    document.addEventListener("keypress", enterPress);
    return () => document.removeEventListener("keypress", enterPress);
  }, [onok]);
  return (
    <div
      className={`p-5 w-9/12 lg:w-1/3 flex flex-col font-mono ${styles.framesFadeIn}`}
    >
      <div className="text-center text-lg">
        User {mode === "login" ? "Login" : "Register"}
      </div>
      {mode === "register" && (
        <div className={`mt-2 ${styles.framesScaleIn}`}>
          <IInput
            prefix={<UserOutlined />}
            value={username}
            onChange={setUsername}
            inputType="text"
          />
        </div>
      )}
      <div className="mt-2">
        <IInput
          prefix={<MobileOutlined />}
          value={mobile}
          onChange={setMobile}
          inputType="text"
        />
      </div>
      <div className="mt-2">
        <IInput
          prefix={<LockOutlined />}
          value={passwd}
          onChange={setPasswd}
          inputType="password"
        />
      </div>
      <div className="mt-1">
        <Button
          disabled={loading}
          size="small"
          type="link"
          onClick={() => {
            setMode((v) => (v === "login" ? "register" : "login"));
          }}
          className="m-0 p-0"
          style={{ fontSize: 12 }}
        >
          Switch to {mode === "login" ? "Register" : "Login"}
        </Button>
      </div>
      <div className="flex justify-center mt-1">
        <Button type="primary" loading={loading} onClick={onok}>
          {mode === "login" ? (
            <span key="login" className={styles.framesFadeIn}>
              Login
            </span>
          ) : (
            <span key="register" className={styles.framesFadeIn}>
              Register
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
