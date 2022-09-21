import {
  dispatchGraphSelect,
  dispatchNodeSelect,
  dispatchSelectedLink,
  dispatchSelecting,
  getCurValueSelecting,
  getDelMode,
} from "@/state/graph/select";
import D3 from "d3";

const color = (d3: typeof D3) => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return (d: { group: string; props: { color?: string } }) => {
    const curColor = scale(d.group);
    d.props.color = curColor;
    return curColor;
  };
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
export class Drawer {
  d3: typeof D3;
  svg: D3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  simulation: D3.Simulation<D3.SimulationNodeDatum, undefined>;
  constructor({
    id,
    d3,
    options: { height, width },
  }: {
    id: string;
    d3: typeof D3;
    options: {
      height: number;
      width: number;
    };
  }) {
    const simulation = d3
      .forceSimulation()
      .force("ct", d3.forceCenter(width / 2, height / 2))
      .force(
        "link",
        d3
          .forceLink()
          .id(function (d) {
            return (d as any).id;
          })
          .distance(150)
          .strength(2)
      )
      .force("charge", d3.forceManyBody().strength(-240))
      .force("x", d3.forceX(width / 2))
      .force("y", d3.forceY(height / 2))
      .on("tick", tick);
    const svg = d3
      .select(`#${id}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "select-none");

    svg.append("g").attr("class", "links");
    svg.append("g").attr("class", "nodes");
    function tick() {
      const nodeElements = svg.select(".nodes").selectAll(".node");
      const linkElements = svg.select(".links").selectAll(".link");

      nodeElements
        .attr("transform", function (d) {
          return "translate(" + (d as any).x + "," + (d as any).y + ")";
        })
        .call((drag as any)(simulation, d3));

      linkElements
        .attr("x1", function (d) {
          return (d as any).source.x;
        })
        .attr("y1", function (d) {
          return (d as any).source.y;
        })
        .attr("x2", function (d) {
          return (d as any).target.x;
        })
        .attr("y2", function (d) {
          return (d as any).target.y;
        });
    }
    this.svg = svg;
    this.simulation = simulation;
    this.d3 = d3;
  }
  start(graph: { nodes: any[]; links: any[] }) {
    const svg = this.svg;
    const simulation = this.simulation;
    const d3 = this.d3;
    const linkElements = svg
      .select(".links")
      .selectAll(".link")
      .data(graph.links, (d) => {
        return (d as any).props.id;
      });

    linkElements
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke-width", (d) => {
        return 2;
      })
      .attr("stroke", "#999")
      .on("click", function (_, d) {
        if (getDelMode()) dispatchSelectedLink(d);
      })
      .on("mouseenter", function () {
        d3.select(this).attr("stroke", "#d54a81");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(250).attr("stroke", "#999");
      });
    linkElements.exit().remove();

    const nodeElements = svg
      .select(".nodes")
      .selectAll(".node")
      .data(graph.nodes, function (d) {
        return (d as any).id;
      });
    const enterSelection = nodeElements
      .enter()
      .append("g")
      .attr("class", "node")
      .on("mouseenter", function () {
        d3.select(this).select("text").attr("fill", "#d54a81");
      })
      .on("mouseout", function () {
        d3.select(this)
          .select("text")
          .transition()
          .duration(250)
          .attr("fill", "#999");
      })
      .on("click", (_, d) => {
        if (getCurValueSelecting()) {
          dispatchNodeSelect({
            type: "node",
            data: d,
          });
          dispatchSelecting(false);
        } else {
          dispatchGraphSelect({
            type: "node",
            data: d,
          });
        }
      });
    const geneteColor = color(d3) as any;
    const circles = enterSelection
      .append("circle")
      .attr("id", (d) => {
        return d.id;
      })
      .attr("fill", (d) => d.props.color || geneteColor(d))
      .attr("class", "round")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("r", (d) => {
        return d?.props?.r || 5;
      });

    const labels = enterSelection
      .append("text")
      .text(function (d) {
        return d.id;
      })
      .attr("x", (d) => (d.props.offsetX || 0) + 7)
      .attr("y", (d) => (d.props.offsetY || 0) + 7)
      .attr("fill", "#999");

    nodeElements.exit().remove();

    simulation.nodes(graph.nodes);
    (simulation.force("link") as any).links(graph.links);
    simulation.alphaTarget(0.1).restart();
  }
  update() {
    const d3 = this.d3;
    this.svg
      .select(".nodes")
      .selectAll(".node")
      .each(function () {
        const g = d3.select(this);
        const circle = g.selectChild("circle");
        circle.attr("r", (d: any) => {
          if (d?.props?.color) {
            circle.attr("fill", d.props.color);
          }
          return d?.props?.r || 5;
        });
        g.selectChild("text")
          .text((d: any) => d.id)
          .attr("x", (d: any) => (d.props.offsetX || 0) + 7)
          .attr("y", (d: any) => (d.props.offsetY || 0) + 7);
      });
    this.svg.select(".lines").selectAll(".line");
  }
  stop() {
    this.simulation.stop();
  }
  reStart() {
    this.simulation.alphaTarget(0.1).restart();
  }
  updateWH(width: number, height: number) {
    this.svg.attr("width", width).attr("height", height);
  }
}
