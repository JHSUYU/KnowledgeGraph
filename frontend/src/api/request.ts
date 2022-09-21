import { message } from "antd";
import axios from "axios";
import { getToken, User } from "./loginRequest";

export const errorSymbol: unknown = Symbol("error");
export const request = axios.create({
  baseURL: "http://81.69.173.136:9000/",
});
request.interceptors.request.use((value) => {
  value.headers = {
    ...value.headers,

    token: getToken(),
  };
  return value;
});
request.interceptors.response.use(
  (value) => {
    const { success, errmsg, content } = value.data;
    if (success) {
      return content;
    }
    message.error(errmsg);
    return errorSymbol;
  },
  (error) => {
    message.error(error.message ?? "");
    return errorSymbol;
  }
);
export type tagsRequestBody = {
  label?: "tag" | "question";
  limit?: number;
  offset?: number;
  isLikeName?: boolean;
  name?: string;
};
export type tagOrigin = {
  id: number;
  properties: {
    name: string;
    numberOfQuestions: number;
    introduction: string;
  };
};
export type questionOrigin = {
  id: number;
  properties: {
    name: string;
    href: number;
    tags: string[];
  };
};
export const getTags = (body: tagsRequestBody) =>
  request.post<tagsRequestBody, tagOrigin[]>("/neo4j-service/node/query", body);
export const getQuestions = (body: tagsRequestBody) =>
  request.post<tagsRequestBody, questionOrigin[]>(
    "/neo4j-service/node/query",
    body
  );

export const getUserInfo = () =>
  request.get<never, User>("/user-service/user/info");

export type relationRequestBody = {
  startName?: string[];
  relationType?: "related" | "relatedQuestion";
  endName?: string;
  offset?: number;
  limit?: number;
};
export type reationOrigin = {
  id: number;
  properties: {
    numberOfReference: number;
  };
  type: "related" | "relatedQuestion";
  start: tagOrigin;
  end: tagOrigin;
};
export const getRelations = (body: relationRequestBody) =>
  request.post<relationRequestBody, reationOrigin[]>(
    "/neo4j-service/relation/query",
    body
  );

export const askQuestion = (question: string) =>
  request.get<any, string[]>("/user-service/ask/question", {
    params: {
      question,
    },
  });
