import { getRelations, reationOrigin } from "@/api/request";
import {
  TagsStaredSelector,
  UserTagsStaredSelector,
  UserTagsState,
  useUserTagsOffset,
} from "@/state/core/tags";
import CheckButton from "@/ui/components/CheckButton";
import { Fallback } from "@/ui/components/Fallback";
import { ClearOutlined, StarOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Col, Row, Tag } from "antd";
import _ from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Recommond } from "./Recommond";
const colorMap: { [index: string]: string } = {};
const randomColor = (() => {
  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return () => {
    const h = randomInt(0, 360);
    const s = randomInt(42, 98);
    const l = randomInt(40, 90);
    return `hsl(${h},${s}%,${l}%)`;
  };
})();
function getRandomColor(d: string) {
  if (colorMap[d]) return colorMap[d];
  const color = randomColor();
  colorMap[d] = color;
  return color;
}
function Tags({ userTags, onSelect }: { userTags: any; onSelect: any }) {
  const allUserTags = useRecoilValue(UserTagsState(20));
  return (
    <Row gutter={[8, 8]} justify="center">
      {allUserTags.map((a) => (
        <Col key={a.id}>
          <CheckButton
            value={a.properties.name}
            defaultCheck={userTags[a.properties.name]}
            onActive={onSelect}
          />
        </Col>
      ))}
    </Row>
  );
}
export default function TagSelect() {
  const [userTags, setUserTags] = useRecoilState(UserTagsStaredSelector);
  const offset = useUserTagsOffset();
  const userTagsArr = useMemo(() => Object.keys(userTags), [userTags]);
  const staredTags = useRecoilValue(TagsStaredSelector);
  const [relations, setRelations] = useState<reationOrigin[] | null>(null);
  const [loading, setLoading] = useState(false);
  const onSelect = useCallback(
    (value: string) => {
      setUserTags((o) => {
        const v = { ...o };
        if (v[value]) {
          delete v[value];
        } else {
          v[value] = true;
        }
        return v;
      });
    },
    [setUserTags]
  );
  const onRecommond = useCallback(() => {
    setLoading(true);
    getRelations({
      startName: _.uniq([...userTagsArr, ...Object.keys(staredTags)]),
      relationType: "related",
      limit: 10000000,
    })
      .then((d) => {
        setRelations(d);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [staredTags, userTagsArr]);
  return relations ? (
    <Recommond relations={relations} />
  ) : (
    <div className="w-full h-full flex flex-col justify-center items-center font-mono pt-16">
      <div className="flex-1 flex flex-col w-2/3">
        <div className="text-center mb-3">
          Your Interested Tags
          <Button
            icon={<ClearOutlined />}
            onClick={() => setUserTags({})}
            type="link"
            className="flex items-center"
            style={{ display: "inline" }}
          >
            Clear
          </Button>
        </div>

        <Row gutter={[8, 8]} justify="center">
          {userTagsArr.map((r) => (
            <Col key={r}>
              <Tag
                className="flex items-center"
                closable
                onClose={() => onSelect(r)}
                color={getRandomColor(r)}
              >
                {r}
              </Tag>
            </Col>
          ))}
        </Row>
      </div>
      <div className="flex-1 flex flex-col w-2/3">
        <div className="text-center mb-3">What Are You Interested In? </div>
        <React.Suspense fallback={<Fallback />}>
          <Tags userTags={userTags} onSelect={onSelect} />
        </React.Suspense>
        <div className="flex justify-center mt-3">
          <Button
            type="link"
            className="flex items-center"
            onClick={offset}
            icon={<SyncOutlined />}
          >
            Change
          </Button>
          <Button
            icon={<StarOutlined />}
            type="link"
            className="flex items-center"
            onClick={onRecommond}
            loading={loading}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
