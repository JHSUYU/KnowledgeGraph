import { errorSymbol, getTags } from "@/api/request";
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useSetRecoilState,
} from "recoil";
export const staredTagsIndex = "SOCOINSTAREDTAGS";
export const userStaredTagsIndex = "SOCOINUSERSTAREDTAGS";

export const TagsState = atomFamily({
  key: "Tags",
  default: async (limit: number) => {
    const nodes = await getTags({ label: "tag", limit });
    if (nodes === errorSymbol) {
      return [];
    }
    return nodes;
  },
});

const staredTagsLocalStorageItem = localStorage.getItem(staredTagsIndex);
export const TagsStaredState = atom({
  key: "TagsStared",
  default: staredTagsLocalStorageItem
    ? JSON.parse(staredTagsLocalStorageItem)
    : {},
});
export const TagsStaredSelector = selector<{
  [index: string]: true;
}>({
  key: "TagsStaredSelector",
  get: ({ get }) => get(TagsStaredState),
  set: ({ set }, newValue) => {
    set(TagsStaredState, newValue);
    localStorage.setItem(staredTagsIndex, JSON.stringify(newValue));
  },
});

const userStaredTagsLocalStorageItem =
  localStorage.getItem(userStaredTagsIndex);
export const UserTagsStaredState = atom({
  key: "UserTagsStared",
  default: userStaredTagsLocalStorageItem
    ? JSON.parse(userStaredTagsLocalStorageItem)
    : {},
});
export const UserTagsStaredSelector = selector<{
  [index: string]: true;
}>({
  key: "UserTagsStaredSelector",
  get: ({ get }) => get(UserTagsStaredState),
  set: ({ set }, newValue) => {
    set(UserTagsStaredState, newValue);
    localStorage.setItem(userStaredTagsIndex, JSON.stringify(newValue));
  },
});

export const UserTagsOffsetState = atom({
  key: "UserTagsOffsetState",
  default: 100,
});
export const UserTagsState = selectorFamily({
  key: "UserTagsState",
  get:
    (limit: number) =>
    async ({ get }) => {
      const offset = get(UserTagsOffsetState);
      const nodes = await getTags({ label: "tag", limit, offset });
      if (nodes === errorSymbol) {
        return [];
      }
      return nodes;
    },
});

export function useUserTagsOffset() {
  const setUserTagsOffset = useSetRecoilState(UserTagsOffsetState);
  return function () {
    setUserTagsOffset((o) => o + 100);
  };
}
