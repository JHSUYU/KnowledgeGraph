import React, { useCallback, useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import _ from "lodash";
import { EditorWrapper } from "./Editor";
import { Button, message } from "antd";
import {
  getRelations,
  reationOrigin,
  relationRequestBody,
} from "@/api/request";
import { Drawer } from "./d3Drawer/drawer";
import {
  dispatchGraphSelect,
  dispatchSelectedLink,
  useSubScribeSelectedLink,
} from "@/state/graph/select";
import { useRecoilCallback } from "recoil";
import { RelationsState } from "@/state/core/relations";
import { Controller } from "./Controller";

function ProcessRelations(relaitions: reationOrigin[]) {
  if (relaitions.length === 0) {
    return {
      nodes: [],
      links: [],
    };
  }
  const startNodes = relaitions.map((r) => ({
    id: r.start.properties.name,
    group: r.start.properties.name,
    props: {
      ...r.start.properties,
      r: 5,
      offsetX: 0,
      offsetY: 0,
    },
  }));
  const endNodes = relaitions.map((r) => ({
    id: r.end.properties.name,
    group: r.end.properties.name,
    props: {
      ...r.end.properties,
      r: 5,
      offsetX: 0,
      offsetY: 0,
    },
  }));
  const nodes = _.uniqWith([...startNodes, ...endNodes], (a, b) => {
    return a.id === b.id;
  });
  const links = relaitions.map((r) => ({
    source: r.start.properties.name,
    target: r.end.properties.name,
    value: r.properties.numberOfReference,
    props: {
      ...r.properties,
      id: r.id,
    },
  }));
  return { nodes, links };
}
export type MapShowerProps = {
  showerid?: string;
  uniqueId: string;
  relaitions: reationOrigin[];
};
export default function MapShower(props: MapShowerProps) {
  const drawer = useRef<Drawer | null>(null);
  const { uniqueId, relaitions } = props;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<any[] | null>(null);
  const linksRef = useRef<any[] | null>(null);
  const { value: selectedLink } = useSubScribeSelectedLink();
  const { nodes, links } = useMemo(
    () => ProcessRelations(relaitions),
    [relaitions]
  );

  useEffect(() => {
    const size = wrapperRef.current?.getBoundingClientRect();
    if (!drawer.current && size) {
      drawer.current = new Drawer({
        id: uniqueId,
        d3,
        options: {
          width: size.width,
          height: size.height,
        },
      });
      drawer.current.start({ nodes, links });
      nodesRef.current = nodes;
      linksRef.current = links;
    }
  }, [links, nodes, uniqueId]);
  useEffect(() => {
    const warn = _.debounce(() => {
      const size = wrapperRef.current?.getBoundingClientRect();
      if (drawer.current && size) {
        drawer.current.updateWH(size.width, size.height);
      }
    }, 1000);
    window.addEventListener("resize", warn);
    return () => {
      window.addEventListener("resize", warn);
    };
  }, []);
  const setRelations = useRecoilCallback(
    ({ set }) =>
      (body: relationRequestBody, value: reationOrigin[]) => {
        set(RelationsState(body), value);
      },
    []
  );
  const deleteNode = useCallback(
    (id: string) => {
      const newNodes = (nodesRef.current || nodes).filter((n) => n.id !== id);
      const newLinks = (linksRef.current || links).filter(
        (l) => (l.source as any).id !== id && (l.target as any).id !== id
      );
      nodesRef.current = newNodes;
      linksRef.current = newLinks;
      drawer.current?.start({
        nodes: newNodes,
        links: newLinks,
      });
      dispatchGraphSelect(null);
    },
    [links, nodes]
  );
  const loadMoreNode = useCallback(
    async (startName: string) => {
      const moreRelations = await getRelations({
        startName: [startName],
        relationType: "related",
      });
      if (moreRelations.length > 0) {
        const { nodes: moreNodes, links: moreLinks } =
          ProcessRelations(moreRelations);
        const oldNodes = nodesRef.current || nodes;
        const oldLinks = linksRef.current || links;
        const newNodes = _.uniqWith(
          oldNodes.concat(moreNodes),
          (a, b) => a.id === b.id
        );
        const newLinks = _.uniqWith(
          oldLinks.concat(moreLinks),
          (a, b) => a.props.id === b.props.id
        );
        nodesRef.current = newNodes;
        linksRef.current = newLinks;
        drawer.current?.start({
          nodes: newNodes,
          links: newLinks,
        });
        setRelations(
          { startName: [startName], relationType: "related" },
          moreRelations
        );
      } else {
        message.error(`${startName} has no more node to load.`);
      }
    },
    [links, nodes, setRelations]
  );
  const getRelation = useCallback(
    ({ name1, name2 }: { name1: string; name2: string }) => {
      const relations = linksRef.current || links;
      return relations.find(
        (r) =>
          (r.source.id === name1 && r.target.id === name2) ||
          (r.source.id === name2 && r.target.id === name1)
      );
    },
    [links]
  );
  const getNode = useCallback(
    (name: string) => {
      const newNodes = nodesRef.current || nodes;
      return newNodes.find((n) => n.id === name);
    },
    [nodes]
  );
  const deleteRelation = useCallback(
    ({ name1, name2 }: { name1: string; name2: string }) => {
      const newNodes = nodesRef.current || nodes;
      const relations = linksRef.current || links;
      const index = relations.findIndex(
        (r) =>
          (r.source.id === name1 && r.target.id === name2) ||
          (r.source.id === name2 && r.target.id === name1)
      );
      if (index === -1) return;
      const newRelations = relations;
      newRelations.splice(index, 1);
      nodesRef.current = newNodes;
      linksRef.current = newRelations;
      drawer.current?.start({
        nodes: newNodes,
        links: newRelations,
      });
    },
    [links, nodes]
  );
  const addRelation = useCallback(
    ({ name1, name2 }: { name1: string; name2: string }) => {
      const newNodes = nodesRef.current || nodes;
      const relations = linksRef.current || links;
      const maxId = _.maxBy(relations, (r) => r.props.id) + 1;
      const newRelations = [
        ...relations,
        {
          source: name1,
          target: name2,
          value: 1,
          props: {
            id: maxId,
            numberOfReference: 1,
          },
        },
      ];
      nodesRef.current = newNodes;
      linksRef.current = newRelations;
      drawer.current?.start({
        nodes: newNodes,
        links: newRelations,
      });
    },
    [links, nodes]
  );
  useEffect(() => {
    if (selectedLink !== null) {
      deleteRelation({
        name1: selectedLink.source.id,
        name2: selectedLink.target.id,
      });
      dispatchSelectedLink(null);
    }
  }, [deleteRelation, selectedLink]);
  return (
    <>
      <div id={uniqueId} ref={wrapperRef} className="w-full h-full" />
      <EditorWrapper
        drawer={drawer}
        deleteNode={deleteNode}
        loadMoreNode={loadMoreNode}
        getRelation={getRelation}
        getNode={getNode}
        addRelation={addRelation}
        deleteRelation={deleteRelation}
      />
      <Controller drawer={drawer} nodesRef={nodesRef} linksRef={linksRef} />
    </>
  );
}
