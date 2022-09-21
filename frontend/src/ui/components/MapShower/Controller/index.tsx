import {
  CaretRightOutlined,
  DownloadOutlined,
  DragOutlined,
  LoadingOutlined,
  PauseOutlined,
  PictureOutlined,
  ScissorOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { message, Tooltip, Upload } from "antd";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { toPng } from "html-to-image";
import { Drawer } from "../d3Drawer/drawer";
import { dispatchDelMode, useSubScribeDelMode } from "@/state/graph/select";

export function Controller({
  drawer,
  nodesRef,
  linksRef,
}: {
  drawer: React.MutableRefObject<Drawer | null>;
  nodesRef: React.MutableRefObject<any[] | null>;
  linksRef: React.MutableRefObject<any[] | null>;
}) {
  const [x, setX] = useState(10);
  const [y, setY] = useState(10);
  const [dragging, setDragging] = useState(false);
  const [imaging, setImaging] = useState(false);
  const [run, setRun] = useState(false);
  const { value: delMode } = useSubScribeDelMode();
  const runOrStop = useCallback(() => {
    if (drawer.current) {
      if (run) {
        drawer.current.reStart();
      } else {
        drawer.current.stop();
      }
      setRun((r) => !r);
    }
  }, [drawer, run]);
  const hGap = useMemo(
    () =>
      document
        .querySelector(
          "#root > div > div > div.h-12.flex.transition-all.duration-500.ease-in-out"
        )
        ?.getBoundingClientRect().height || 0,
    []
  );
  const toImage = useCallback(() => {
    setImaging(true);
    const svg = document.querySelector(
      "#root > div > div > div.flex-1 > div > div > div.w-full.h-full"
    );
    if (svg) {
      toPng(svg as any, { backgroundColor: "#fff" })
        .then((value) => {
          const a = document.createElement("a");
          a.href = value;
          a.download = `SOCOIN${+new Date()}.png`;
          a.click();
          message.success(`Save ${a.download} success`);
        })
        .finally(() => {
          setImaging(false);
        });
    }
  }, []);
  const toFile = useCallback(() => {
    const jsonData = {
      nodes: nodesRef.current,
      links: linksRef.current?.map((l) => ({
        source: l.source.id,
        target: l.target.id,
        value: l.value,
        props: l.props,
      })),
    };
    const a = document.createElement("a");
    const file = new Blob([JSON.stringify(jsonData)], {
      type: 'application/json"',
    });
    a.href = URL.createObjectURL(file);
    a.download = `SOCOIN${+new Date()}.json`;
    a.click();
    message.success(`File ${a.download} save success`);
  }, [linksRef, nodesRef]);
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
      className={`w-auto h-12 font-mono absolute  bg-white dark:bg-gray-700 border-2 ${
        dragging ? "border-blue-200" : "border-gray-200"
      } flex flex-row`}
      style={{ top: y, left: x }}
    >
      <div className="flex items-center">
        <div
          className={`p-1 pb-2 cursor-pointer hover:text-blue-500 ${
            dragging ? "text-blue-500" : ""
          } transition-all duration-200`}
          onMouseDown={() => setDragging(true)}
        >
          <DragOutlined />
        </div>
        <Tooltip title={run ? `Play` : `Pause`}>
          <div
            className={`p-1 pb-2 cursor-pointer hover:text-blue-500 transition-all duration-200`}
            onClick={runOrStop}
          >
            {run ? <CaretRightOutlined /> : <PauseOutlined />}
          </div>
        </Tooltip>
        <Tooltip title={imaging ? `Saving` : `Save as png`}>
          <div
            className={`p-1 pb-2 cursor-pointer hover:text-blue-500 transition-all duration-200`}
            onClick={toImage}
          >
            {imaging ? <LoadingOutlined /> : <PictureOutlined />}
          </div>
        </Tooltip>
        <Tooltip title={`Save data to json`}>
          <div
            className={`p-1 pb-2 cursor-pointer hover:text-blue-500 transition-all duration-200`}
            onClick={toFile}
          >
            <DownloadOutlined />
          </div>
        </Tooltip>
        <Tooltip title={`Load graph data from file`}>
          <div
            className={`p-1 pb-2 cursor-pointer hover:text-blue-500 transition-all duration-200`}
          >
            <Upload
              accept=".json"
              customRequest={(opt) => {
                try {
                  const reader = new FileReader();
                  reader.onloadend = (e) => {
                    if (e.target?.readyState === reader.DONE) {
                      const { nodes, links } = JSON.parse(
                        e.target.result as any
                      );
                      nodesRef.current = nodes;
                      linksRef.current = links;
                      drawer.current?.start({
                        nodes,
                        links,
                      });
                      message.success(
                        `Load file ${(opt.file as any).name} success`
                      );
                    }
                  };
                  reader.readAsText(opt.file as any);
                } catch {
                  message.error(`File Read Failed`);
                }
              }}
              showUploadList={false}
            >
              <UploadOutlined />
            </Upload>
          </div>
        </Tooltip>
        <Tooltip title={`${delMode ? "End Del Mode" : "Start Del Mode"}`}>
          <div
            className={`p-1 pb-2 cursor-pointer hover:text-blue-500 transition-all duration-200 ${
              delMode ? "text-blue-500" : ""
            } `}
            onClick={() => {
              dispatchDelMode((v) => !v);
            }}
          >
            <ScissorOutlined />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
