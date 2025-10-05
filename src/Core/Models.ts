export interface dummyModelsType {
  id: string;
  name: string;
  description?: string;
  icon: string;
  modelNo: string;
  version: string;
  isSelected: boolean;
}

export const dummyModels: dummyModelsType[] = [
  {
    id: "1",
    name: "Gemini Pro",
    description: "Google's most advanced text model",
    icon: "🤖",
    modelNo: "gemini-pro",
    version: "1.0",
    isSelected: true,
  },
  {
    id: "2",
    name: "Gemini Pro Vision",
    description: "Multimodal model for text and image understanding",
    icon: "👁️",
    modelNo: "gemini-pro-vision",
    version: "1.0",
    isSelected: false,
  },
];

export const setSelectedModel = (modelId: string) => {
  dummyModels.forEach((model) => {
    model.isSelected = model.id === modelId;
  });
};

export const getSelectedModel = (): dummyModelsType | undefined => {
  return dummyModels.find((model) => model.isSelected);
};
