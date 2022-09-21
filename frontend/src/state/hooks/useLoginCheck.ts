import { getToken, User } from "@/api/loginRequest";
import { errorSymbol, getUserInfo } from "@/api/request";
import { message } from "antd";
import { useEffect } from "react";
import { generateSubScribe } from "./useSubScribe";
export const userTokenStorageIndex = "SOCINUSERTOKEN";
export const logOut = () => {
  localStorage.removeItem(userTokenStorageIndex);
  dispatchLoginState(null);
};
export const {
  useSubScribe: useSubScribeLoginState,
  dispatch: dispatchLoginState,
} = generateSubScribe<null | User>(null);
export function useLoginCheck() {
  useEffect(() => {
    if (getToken() !== "")
      getUserInfo().then((d) => {
        if (d !== errorSymbol) {
          message.success(`Login success. Hi, ${d.username}!`);
          dispatchLoginState(d);
        }
      });
  }, []);
}
