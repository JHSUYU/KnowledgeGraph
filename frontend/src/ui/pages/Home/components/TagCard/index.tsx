import { TagsStaredSelector } from "@/state/core/tags";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
interface TagCardProps {
  name: string;
  desc: string;
  numberOfQuestions: number;
}
export function TagCard({ name, desc, numberOfQuestions }: TagCardProps) {
  const [staredTags, setStaredTags] = useRecoilState(TagsStaredSelector);
  const toggleStar = useCallback(() => {
    setStaredTags((s) => {
      const copyS = { ...s };
      if (s[name]) {
        delete copyS[name];
      } else {
        copyS[name] = true;
      }
      return copyS;
    });
  }, [name, setStaredTags]);
  return (
    <div className="h-auto border p-3 font-sans text-xs">
      <div>
        <Link to={`/shower/${name}`}>
          <span className=" p-1 bg-blue-100 rounded-sm text-blue-600 cursor-pointer hover:bg-blue-200 hover:text-blue-700">
            {name}
          </span>
        </Link>
        <span className="float-right cursor-pointer" onClick={toggleStar}>
          {staredTags[name] ? (
            <StarFilled className="text-yellow-200" />
          ) : (
            <StarOutlined />
          )}
        </span>
      </div>
      <Tooltip title={desc}>
        <div
          className="mt-2 w-full overflow-hidden overflow-ellipsis"
          style={{
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            display: "-webkit-box",
          }}
        >
          {desc}
        </div>
      </Tooltip>
      <div className="mt-2 text-gray-500">
        numberOfQuestions: {numberOfQuestions}
      </div>
    </div>
  );
}
