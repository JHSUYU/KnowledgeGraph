import { userTokenStorageIndex } from "@/state/hooks/useLoginCheck";
import { message } from "antd";
import axios from "axios";
import { errorSymbol } from "./request";
const config: { token?: string } = {};
export const getToken = () => {
  const token = localStorage.getItem(userTokenStorageIndex);
  if (token) {
    setToken(token);
  }
  return config.token ?? "";
};
export const setToken = (token: string) => {
  localStorage.setItem(userTokenStorageIndex, token);
  config.token = token;
};
export const loginRequest = axios.create({
  baseURL: "http://81.69.173.136:9000/user-service/user",
});
loginRequest.interceptors.request.use((value) => {
  value.headers = {
    ...value.headers,

    token: getToken(),
  };
  return value;
});
loginRequest.interceptors.response.use(
  (value: any) => {
    const { success, errmsg, content } = value.data;
    if (success && content?.code !== 4001) {
      return content?.data;
    } else {
      message.error(content?.msg ?? errmsg);
      return errorSymbol;
    }
  },
  (error) => {
    message.error(error.message ?? "");
    return errorSymbol;
  }
);
export type LoginRequestBody = {
  mobile: string;
  password: string;
};
export type LoginUser = {
  userId: number;
  token: string;
};
export type User = {
  id: number;
  mobile: number;
  username: string;
  password: string;
  avatar: string;
};
export const loginUser = (body: LoginRequestBody) =>
  loginRequest.post<LoginRequestBody, LoginUser>("/login", body);
export type RegisterBody = {
  mobile: string;
  username: string;
  password: string;
};
export const registerUser = (body: RegisterBody) =>
  loginRequest.post<RegisterBody>("/register", body);
export const getUserInfo = () => loginRequest.get<never, User>("/info");
export const modifyUser = (body: User) =>
  loginRequest.post<User, User>("/modify", body);
