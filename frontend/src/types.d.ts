type INode = {
  id: number;
  label: string;
  properties: {
    [index: string]: unknown;
    name: string;
  };
};

type IRelation = {
  source: string;
  target: string;
  value: number;
  id?: number;
  label?: string;
  properties?: {
    [index: string]: unknown;
    name: string;
    // related value
    value: number;
  };
};
