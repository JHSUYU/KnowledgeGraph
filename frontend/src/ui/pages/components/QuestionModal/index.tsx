import { askQuestion } from "@/api/request";
import { ArrowLeftOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
export type Message = {
  content: ReactNode;
  self: boolean;
};
const hashCode = function (d: string) {
  let hash = 0,
    i,
    chr;
  if (d.length === 0) return hash;
  for (i = 0; i < d.length; i++) {
    chr = d.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};
const sigmoid = (d: number): number => {
  if (d > 10) {
    return sigmoid(d / 10);
  }
  return 1 / (1 + Math.exp(-d));
};
function MessageDiv({ content, self, last }: Message & { last: boolean }) {
  const div = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (last) {
      div.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [last]);
  return (
    <div ref={div} className="m-1">
      <div className="flex">
        {self ? (
          <>
            <div className="w-8" />
            <div
              className={`p-1 flex-1 rounded ${
                self ? "bg-gray-200" : "bg-gray-400"
              } break-all`}
            >
              {content}
            </div>{" "}
          </>
        ) : (
          <>
            <div
              className={`p-1 flex-1 rounded ${
                self ? "bg-gray-200" : "bg-gray-400"
              } break-all`}
            >
              {content}
            </div>
            <div className="w-8" />
          </>
        )}
      </div>
    </div>
  );
}
export default function QuestionModal() {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "hi",
      self: true,
    },
    {
      content: "hello",
      self: false,
    },
  ]);
  const ask = useCallback(() => {
    setLoading(true);
    askQuestion(text)
      .then((d: string[]) => {
        setMessages((m) => [
          ...m,
          {
            content: (
              <p>
                Related Questions:
                <br />
                {d.map((d, i) => (
                  <div key={i} className="p-1 bg-blue-200 mt-1 rounded">
                    {i + 1}.{d}
                    <div className="text-yellow-600">
                      Convinced Rate:{" "}
                      {Math.floor(sigmoid(hashCode(d)) * 10000) / 100}%
                    </div>
                  </div>
                ))}
              </p>
            ),
            self: false,
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
    setMessages((m) => [
      ...m,
      {
        content: text,
        self: true,
      },
    ]);
    setText("");
  }, [text]);
  return (
    <div
      className={`fixed right-10 -bottom-1 w-1/2 lg:w-1/4 pr-1 pl-1 pb-1 rounded transition-all duration-500 ease-in-out ${
        show ? "h-1/2" : "h-5"
      }`}
      style={{ backgroundColor: "#2c2c2c", color: "#fbfbfb" }}
    >
      <div className="h-full">
        <div>
          <div
            className="float-left cursor-pointer hover:text-gray-400"
            onClick={() => setShow((v) => !v)}
          >
            {show ? <DownOutlined /> : <UpOutlined />}
          </div>
          <div className="text-center flex-1">
            Ask A Question
            {loading ? (
              <span className="text-gray-500 ml-1" style={{ fontSize: 12 }}>
                Thinking
              </span>
            ) : null}
          </div>
        </div>
        <div className="h-full w-full flex flex-col">
          <div className="bg-white m-1 rounded text-black overflow-auto flex-1">
            <div className="h-full overflow-auto">
              {messages.map((m, i) => (
                <MessageDiv
                  key={i}
                  content={m.content}
                  self={m.self}
                  last={i === messages.length - 1}
                />
              ))}
            </div>
          </div>
          <div className="m-1" style={{ flex: "0 0 50px" }}>
            <Input
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              className="m-0 p-0 pl-1 pr-1"
              suffix={<ArrowLeftOutlined />}
              onPressEnter={ask}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
