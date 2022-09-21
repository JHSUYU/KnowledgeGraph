import { errorSymbol, getQuestions } from "@/api/request";
import { atom, selectorFamily, useSetRecoilState } from "recoil";

export const QuestionsOffsetState = atom({
  key: "QuestionOffset",
  default: 100,
});
export const QuestionsState = selectorFamily({
  key: "Questions",
  get:
    (limit: number) =>
    async ({ get }) => {
      const offset = get(QuestionsOffsetState);
      const nodes = await getQuestions({ label: "question", limit, offset });
      if (nodes === errorSymbol) {
        return [];
      }
      return nodes;
    },
});

export function useQuestionOffset() {
  const setQuestionOffset = useSetRecoilState(QuestionsOffsetState);
  return function () {
    setQuestionOffset((o) => o + 100);
  };
}
