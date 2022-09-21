import { errorSymbol, getRelations, relationRequestBody } from "@/api/request";
import { atomFamily } from "recoil";

export const RelationsState = atomFamily({
  key: "Relations",
  default: async (body: relationRequestBody) => {
    const relations = await getRelations(body);
    if (relations === errorSymbol) {
      return [];
    }
    return relations;
  },
});
