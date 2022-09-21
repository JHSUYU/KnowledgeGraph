import React from "react";
import _ from "lodash";
import { RelationsState } from "@/state/core/relations";
import MapShower from "@/ui/components/MapShower";
import { Empty } from "antd";
import { useParams } from "react-router";
import { useRecoilValue } from "recoil";
function Error({ name }: { name?: string }) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Empty description={`Can't find ${name}`} />
    </div>
  );
}
export function Shower() {
  const { showerid } = useParams<{ showerid: string }>();
  const relations = useRecoilValue(
    RelationsState({ startName: [showerid], relationType: "related" })
  );

  return relations.length > 0 ? (
    <MapShower
      uniqueId={"exp"}
      showerid={showerid}
      relaitions={_.cloneDeep(relations)}
    />
  ) : (
    <Error name={showerid} />
  );
}
