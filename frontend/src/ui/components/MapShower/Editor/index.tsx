import {
  dispatchSelecting,
  GraphSelect,
  useSubScribeGraphSelect,
  useSubScribeNodeSelect,
  useSubScribeSelecting,
} from "@/state/graph/select";
import {
  DownOutlined,
  DragOutlined,
  PauseOutlined,
  SelectOutlined,
  UpOutlined,
} from "@ant-design/icons";

import { Button, Empty, Input, Popover, Slider, Space, Tooltip } from "antd";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Drawer } from "../d3Drawer/drawer";
function NameChangeForm({
  update,
  select,
}: {
  update: () => void;
  select: GraphSelect;
}) {
  const [name, setName] = useState(select.data.id);
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
      select.data.id = event.target.value;
      select.data.group = event.target.value;
      update();
    },
    [select.data, update]
  );
  return <Input onChange={onChange} value={name} />;
}
function ColorChangeForm({
  update,
  select,
}: {
  update: () => void;
  select: GraphSelect;
}) {
  const [color, setColor] = useState(select.data.props.color);
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setColor(event.target.value);
      select.data.props.color = event.target.value;
      update();
    },
    [select.data, update]
  );
  return <Input onChange={onChange} value={color} />;
}
function RadiusForm({
  update,
  select,
}: {
  update: () => void;
  select: GraphSelect;
}) {
  const [r, setR] = useState(select.data.props.r);
  const onChange = useCallback(
    (value: number) => {
      setR(value);
      select.data.props.r = value;
      update();
    },
    [select.data, update]
  );
  return <Slider onChange={onChange} value={r} max={15} min={5} />;
}
function OffsetXForm({
  update,
  select,
}: {
  update: () => void;
  select: GraphSelect;
}) {
  const [r, setR] = useState(select.data.props.offsetX);
  const onChange = useCallback(
    (value: number) => {
      setR(value);
      select.data.props.offsetX = value;
      update();
    },
    [select.data, update]
  );
  return <Slider onChange={onChange} value={r} max={30} min={-30} />;
}
function OffsetYForm({
  update,
  select,
}: {
  update: () => void;
  select: GraphSelect;
}) {
  const [r, setR] = useState(select.data.props.offsetY);
  const onChange = useCallback(
    (value: number) => {
      setR(value);
      select.data.props.offsetY = value;
      update();
    },
    [select.data, update]
  );
  return <Slider onChange={onChange} value={r} max={15} min={-15} />;
}
function DescriptionForm({ select }: { select: GraphSelect }) {
  return (
    <Popover
      title="description"
      content={<p className=" max-w-sm">{select.data.props.introduction}</p>}
      arrowPointAtCenter={false}
      autoAdjustOverflow
    >
      <Button type="link" size="small">
        Hover to see
      </Button>
    </Popover>
  );
}
function ItemWrapper({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center">
      <div style={{ flex: "0.5" }}>{title}</div>
      <div className="flex-1 text-center">{children}</div>
    </div>
  );
}
function Editor({
  drawer,
  deleteNode,
  loadMoreNode,
  getRelation,
  getNode,
  deleteRelation,
  addRelation,
}: {
  drawer: React.MutableRefObject<Drawer | null>;
  deleteNode: (id: string) => void;
  loadMoreNode: (startName: string) => Promise<void>;
  getRelation: ({ name1, name2 }: { name1: string; name2: string }) => any;
  getNode: (name: string) => any;
  deleteRelation: ({ name1, name2 }: { name1: string; name2: string }) => void;
  addRelation: ({ name1, name2 }: { name1: string; name2: string }) => void;
}) {
  const { value: select } = useSubScribeGraphSelect();
  const [tName, setTName] = useState("");
  const { value: nodeSelect } = useSubScribeNodeSelect();
  const { value: selecting } = useSubScribeSelecting();
  const addOrDel = useMemo(() => {
    if (tName === select?.data.id) return null;
    const hasRelation = getRelation({ name1: tName, name2: select?.data.id });
    if (hasRelation) {
      return "del";
    }
    const hasNode = getNode(tName);
    if (hasNode) {
      return "add";
    }
    return null;
  }, [getNode, getRelation, select?.data.id, tName]);
  const update = useCallback(() => {
    drawer.current?.update();
  }, [drawer]);
  useEffect(() => {
    if (nodeSelect) {
      setTName(nodeSelect.data.id);
    }
  }, [nodeSelect]);
  return !drawer.current ? (
    <div />
  ) : select?.data ? (
    <div key={select.data.id}>
      <Space className="w-full" direction="vertical" size={"middle"}>
        <ItemWrapper title={"Name"}>
          <NameChangeForm select={select} update={update} />
        </ItemWrapper>
        <ItemWrapper title={"Color"}>
          <ColorChangeForm select={select} update={update} />
        </ItemWrapper>
        <ItemWrapper title={"Radius"}>
          <RadiusForm select={select} update={update} />
        </ItemWrapper>
        <ItemWrapper title={"Description"}>
          <DescriptionForm select={select} />
        </ItemWrapper>
        <ItemWrapper title="Related">
          <span className="overflow-ellipsis whitespace-nowrap">
            {select.data.props.numberOfQuestions} Questions
          </span>
        </ItemWrapper>
        <ItemWrapper title="Text X">
          <OffsetXForm select={select} update={update} />
        </ItemWrapper>
        <ItemWrapper title="Text Y">
          <OffsetYForm select={select} update={update} />
        </ItemWrapper>
        <ItemWrapper title="Operation">
          <Space className="mt-2" size="middle">
            <Tooltip title="Load more related nodes">
              <Button
                block
                type="primary"
                onClick={() => {
                  loadMoreNode(select.data.id);
                }}
              >
                Load
              </Button>
            </Tooltip>
            <Button
              block
              danger
              type="primary"
              onClick={() => {
                deleteNode(select.data.id);
              }}
            >
              Delete
            </Button>
          </Space>
        </ItemWrapper>
        <div className="flex flex-col">
          <div>Relation</div>
          <Space className="mt-2" size="middle">
            <div className="flex items-center">
              <Input
                value={tName}
                onChange={(e) => {
                  const { value } = e.target;
                  setTName(value);
                }}
              />
              <Tooltip title="Select another node">
                <Button
                  onClick={() => {
                    dispatchSelecting(true);
                  }}
                  danger={selecting}
                  type="primary"
                  icon={selecting ? <PauseOutlined /> : <SelectOutlined />}
                />
              </Tooltip>
            </div>
            <Button
              disabled={!addOrDel}
              danger={addOrDel === "del"}
              type="primary"
              onClick={() => {
                if (addOrDel === "add") {
                  addRelation({ name1: tName, name2: select.data.id });
                } else if (addOrDel === "del") {
                  deleteRelation({ name1: tName, name2: select.data.id });
                }
                setTName("");
              }}
            >
              {addOrDel === "add" ? "Connect" : "Delete"}
            </Button>
          </Space>
        </div>
      </Space>
    </div>
  ) : (
    <div className="w-full h-full flex justify-center items-center">
      <Empty description="No Data Selected" />
    </div>
  );
}
export function EditorWrapper({
  drawer,
  deleteNode,
  loadMoreNode,
  getRelation,
  getNode,
  deleteRelation,
  addRelation,
}: {
  drawer: React.MutableRefObject<Drawer | null>;
  deleteNode: (id: string) => void;
  loadMoreNode: (startName: string) => Promise<void>;
  getRelation: ({ name1, name2 }: { name1: string; name2: string }) => any;
  getNode: (name: string) => any;
  deleteRelation: ({ name1, name2 }: { name1: string; name2: string }) => void;
  addRelation: ({ name1, name2 }: { name1: string; name2: string }) => void;
}) {
  const [x, setX] = useState((window.innerWidth * 2) / 3);
  const [y, setY] = useState(window.innerHeight / 3);

  const [dragging, setDragging] = useState(false);
  const [collsed, setCollsed] = useState(false);
  const hGap = useMemo(
    () =>
      document
        .querySelector(
          "#root > div > div > div.h-12.flex.transition-all.duration-500.ease-in-out"
        )
        ?.getBoundingClientRect().height || 0,
    []
  );
  useEffect(() => {
    const onmove = (e: { clientX: number; clientY: number }) => {
      if (dragging) {
        setX(e.clientX);
        setY(e.clientY > hGap ? e.clientY - hGap : 0);
      }
    };

    document.addEventListener("mousemove", onmove);
    return () => {
      document.removeEventListener("mousemove", onmove);
    };
  }, [dragging, hGap]);
  return (
    <div
      onMouseUp={() => setDragging(false)}
      className={`w-80 h-auto font-mono absolute  bg-white dark:bg-gray-700 border-2 ${
        dragging ? "border-blue-200" : "border-gray-200"
      } flex flex-col `}
      style={{ top: y, left: x }}
    >
      <div className="flex items-center border-b-2 border-yellow-100 dark:border-yellow-200">
        <div
          className={`p-1 pb-2 cursor-pointer hover:text-blue-500 ${
            dragging ? "text-blue-500" : ""
          }`}
          onMouseDown={() => setDragging(true)}
        >
          <DragOutlined />
        </div>
        <div className="flex-1 text-center">Node Editor</div>
        <div
          className="p-1 pb-2 cursor-pointer hover:text-blue-500"
          onClick={() => {
            setCollsed((c) => !c);
          }}
        >
          {collsed ? <DownOutlined /> : <UpOutlined />}
        </div>
      </div>
      <div
        className={`pt-1 pl-2 pr-2 overflow-auto transition-all ${
          collsed ? "h-0" : "h-auto"
        } `}
      >
        <div className="w-full h-full pt-2 pb-2">
          <Editor
            drawer={drawer}
            deleteNode={deleteNode}
            loadMoreNode={loadMoreNode}
            getRelation={getRelation}
            getNode={getNode}
            addRelation={addRelation}
            deleteRelation={deleteRelation}
          />
        </div>
      </div>
    </div>
  );
}
