export interface dummyModelsType {
  id: string;
  name: string;
  description?: string;
  icon: string;
  modelNo: string;
}

export const dummyModels: dummyModelsType[] = [
  {
    id: "1",
    name: "Cerebra v4",
    description: "Cerebra V4 pro is our latest model",
    icon: "",
    modelNo: "v4",
  },
  {
    id: "2",
    name: "Cerebra v3",
    description: "Cerebra v3 is our older model",
    icon: "",
    modelNo: "v3",
  },
  {
    id: "3",
    name: "Cerebra v2",
    description: "Cerebra v2 is one of our older model",
    icon: "",
    modelNo: "v2",
  },
];
