import D3 from "d3";
// utils
const color = (d3: typeof D3) => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return (d: { group: string }) => scale(d.group);
};
const drag = (simulation: { alphaTarget: any }, d3: typeof D3) => {
  function dragstarted(event: {
    active: any;
    subject: { fx: any; x: any; fy: any; y: any };
  }) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: { subject: { fx: any; fy: any }; x: any; y: any }) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: { active: any; subject: { fx: null; fy: null } }) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};
export type DrawerCanvasInitProps = {
  width: number;
  height: number;
};
export type D3DrawerProps = {
  uniqueId: string;
  nodes: INode[];
  relations: IRelation[];
  initOpts: DrawerCanvasInitProps;
  d3: typeof D3;
};
export class D3Drawer {
  svg: D3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  simulation: D3.Simulation<any, undefined>;
  nodes: any[];
  links: any[];
  d3: typeof D3;
  width: number;
  height: number;
  constructor({
    nodes: dataNodes,
    relations: dataRelations,
    uniqueId,
    initOpts,
    d3,
  }: D3DrawerProps) {
    const { width, height } = initOpts;
    const svg = d3
      .select(`#${uniqueId}`)
      .append("svg")
      .attr("height", height)
      .attr("width", width)
      .attr("class", "select-none");
    const links = dataRelations.map((d) => Object.create(d));
    const nodes = dataNodes.map((d) => Object.create(d));

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-1000))
      .force(
        "link",
        d3.forceLink(links).id((d, i) => {
          return nodes[i].id;
        })
      )
      .force("center", d3.forceCenter(width / 2, height / 2));
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("class", "link")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => {
        return 3 / (1 + Math.pow(Math.E, -links[d.index].value));
      });
    const elem = svg.selectAll(".round").data(nodes);
    const elemEnter = elem
      .enter()
      .append("g")
      .attr("fill", color(d3))
      .attr("class", "round")
      .call((drag as any)(simulation, d3));

    const node = elemEnter
      .append("circle")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("r", (_, i) => {
        // if (i === 1) return 20;
        return 5;
      });

    const text = elemEnter
      .append("text")
      .attr("dx", -10)
      .attr("dy", -10)
      .text((_, i) => nodes[i].id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      text.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });

    this.svg = svg;
    this.simulation = simulation;
    this.nodes = dataNodes;
    this.links = dataRelations;
    this.d3 = d3;
    this.width = width;
    this.height = height;
  }
  addNode() {
    // this.simulation.restart();
    const width = this.width,
      height = this.height,
      d3 = this.d3;
    const links = this.links.map((d) => ({ ...d }));
    const nodes = this.nodes.map((d) => ({ ...d }));
    const newNodes = [...nodes, { id: "a", group: "a" }];
    const newLinks = [
      ...links,
      { source: "a", target: links[0].source, value: 1 },
    ];

    const copyNodes = newNodes.map((d) => ({ ...d }));
    const copyLinks = newLinks.map((d) => ({ ...d }));
    const simulation = d3
      .forceSimulation(newNodes)
      .force("charge", d3.forceManyBody().strength(-1000))
      .force(
        "link",
        d3.forceLink(newLinks).id((d, i) => {
          return newNodes[i].id;
        })
      )
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = this.svg
      .select(".link")
      .selectAll("line")
      .data(newLinks)
      .join("line")
      .attr("stroke-width", (d) => {
        return 3 / (1 + Math.pow(Math.E, -newLinks[d.index].value));
      });
    const elem = this.svg.selectAll(".round").data(newNodes);
    const elemEnter = elem
      .join("g")
      .attr("fill", color(d3))
      .attr("class", "round")
      .call((drag as any)(simulation, d3));
    // const elemExit = elem.exit();
    const node = elemEnter
      .append("circle")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("r", (_, i) => {
        // if (i === 1) return 20;
        return 5;
      });
    const text = elemEnter
      .append("text")
      .attr("dx", -10)
      .attr("dy", -10)
      .text((_, i) => newNodes[i].id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      text.attr("x", (d) => d.x).attr("y", (d) => d.y);
    });
    this.simulation = simulation;
    this.nodes = copyNodes;
    this.links = copyLinks;
  }
}
