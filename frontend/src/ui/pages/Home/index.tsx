import { errorSymbol, getTags } from "@/api/request";
import { QuestionsState, useQuestionOffset } from "@/state/core/questions";
import { TagsStaredSelector, TagsState } from "@/state/core/tags";
import { Fallback } from "@/ui/components/Fallback";
import { SyncOutlined } from "@ant-design/icons";
import { Button, Input, Radio } from "antd";
import React, { useMemo, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import QuestionCard from "./components/QuestionCard";
import { TagCard } from "./components/TagCard";
function TagsDiv({
  onlyStared,
  filterText,
}: {
  onlyStared?: boolean;
  filterText: string;
}) {
  const tags = useRecoilValue(TagsState(100));
  const staredTags = useRecoilValue(TagsStaredSelector);
  const showTags = useMemo(
    () =>
      onlyStared ? tags.filter((t) => staredTags[t.properties.name]) : tags,
    [onlyStared, staredTags, tags]
  );
  return (
    <div className="overflow-scroll h-full pr-1 pb-2">
      <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4 pb-4">
        {showTags
          .filter((s) => s.properties.name.includes(filterText))
          .map((t) => (
            <TagCard
              key={t.id}
              name={t.properties.name}
              desc={`${t.properties.introduction}`}
              numberOfQuestions={t.properties.numberOfQuestions}
            />
          ))}
      </div>
    </div>
  );
}
function QuestionsDiv() {
  const questions = useRecoilValue(QuestionsState(100));
  return (
    <div className="overflow-scroll h-full pr-1 pb-2">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 pb-4">
        {questions.map((t) => (
          <QuestionCard
            key={t.id}
            name={t.properties.name}
            href={`${t.properties.href}`}
            tags={t.properties.tags}
          />
        ))}
      </div>
    </div>
  );
}
export default function Home() {
  const [stared, setStared] = useState(false);
  const [filterText, setFilterText] = useState("");
  const setTags = useSetRecoilState(TagsState(100));
  const next = useQuestionOffset();
  return (
    <div className="flex items-center justify-center h-full w-full flex-col font-mono pt-8">
      <div className="flex h-1/2 w-full p-2 pl-5 pr-5 flex-col overflow-hidden">
        <div className="h-full">
          <div className="mb-2 flex flex-row items-center">
            <div>Tags</div>
            <div className="flex-1 flex">
              <Radio.Group
                value={stared ? "stared" : "all"}
                className="ml-2"
                size="small"
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setStared(false);
                  } else setStared(true);
                }}
              >
                <Radio.Button value={"all"}>All</Radio.Button>
                <Radio.Button value={"stared"}>Stared</Radio.Button>
              </Radio.Group>
            </div>
            <div className="w-1/3 mr-1">
              <Input
                allowClear
                onChange={(e) => {
                  const { value } = e.target;
                  setFilterText(value);
                  getTags({
                    name: value,
                    isLikeName: true,
                    limit: 100,
                    label: "tag",
                  })
                    .then((d) => {
                      if (d !== errorSymbol) setTags(d);
                    })
                    .catch(() => {
                      setTags([]);
                    });
                }}
              />
            </div>
          </div>
          <React.Suspense fallback={<Fallback />}>
            <TagsDiv onlyStared={stared} filterText={filterText} />
          </React.Suspense>
        </div>
      </div>
      <div className="flex h-1/2 w-full p-2 pl-5 pr-5 flex-col overflow-hidden mt-3">
        <div className="h-full">
          <div>
            Hot Questions
            <Button
              onClick={next}
              type="link"
              className="inline-flex items-center"
              icon={<SyncOutlined />}
            >
              change
            </Button>
          </div>
          <React.Suspense fallback={<Fallback />}>
            <QuestionsDiv />
          </React.Suspense>
        </div>
      </div>
    </div>
  );
}
