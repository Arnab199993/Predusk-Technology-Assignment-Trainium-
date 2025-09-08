import { dummyModels, type dummyModelsType } from "../../Core/Models";
import { useAppDispatch } from "../../Hooks/Hooks";
import ModelSelectorSlice from "../../Redux/ModelSelectorSlice";

const Models = () => {
  const dispatch = useAppDispatch();
  const handleSelectedModel = (id: string) => {
    dispatch(ModelSelectorSlice?.actions?.setSelectedModal(id));
  };
  return (
    <div className="p-2 border bg-white border-gray-300 rounded-xl ">
      {dummyModels.map((model: dummyModelsType) => (
        <div
          onClick={() => handleSelectedModel(model.id)}
          key={model.id}
          className={
            "flex justify-between gap-1 p-2 rounded-lg cursor-pointer hover:bg-gray-100 "
          }
        >
          <div>
            <b className="text-sm font-medium dark:text-black">{model.name}</b>
            <p className="text-xs dark:text-black">{model.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Models;
