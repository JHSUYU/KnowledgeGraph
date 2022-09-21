import { LinkOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
export type QuestionCardProps = {
  name: string;
  href: string;
  tags: string[];
};
function Tag({ name }: { name: string }) {
  return (
    <Link to={`/shower/${name}`}>
      <span className="mr-1">{name}</span>
    </Link>
  );
}
export default function QuestionCard({ name, href, tags }: QuestionCardProps) {
  return (
    <div className="h-auto border p-3 font-sans text-xs">
      <div>
        <a
          href={`https://stackoverflow.com${href}`}
          target="_blank"
          className="p-1 bg-blue-100 rounded-sm text-blue-600 cursor-pointer hover:bg-blue-200 hover:text-blue-700 flex items-center"
          rel="noreferrer"
        >
          <LinkOutlined className="mr-2" />
          {name}
        </a>
        <div
          className="mt-2 w-full overflow-hidden overflow-ellipsis text-gray-500"
          style={{
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            display: "-webkit-box",
          }}
        >
          tags:{" "}
          {tags.map((t) => (
            <Tag name={t} key={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
