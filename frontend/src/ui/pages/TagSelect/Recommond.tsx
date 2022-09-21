import { reationOrigin } from "@/api/request";
import { Fallback } from "@/ui/components/Fallback";
import MapShower from "@/ui/components/MapShower";
import _ from "lodash";
import React from "react";

export function Recommond({ relations }: { relations: reationOrigin[] }) {
  return relations.length > 0 ? (
    <MapShower
      uniqueId={"exp"}
      showerid={""}
      relaitions={_.cloneDeep(relations)}
    />
  ) : (
    <Fallback />
  );
}
