import { CustomSize } from "../../Constant/Constant";

interface customCardProps {
  images?: string;
  content: string;
  header?: string;
}

const FeatureCard = (props: customCardProps) => {
  return (
    <div
      style={{
        padding: CustomSize.cardPadding,
        height: CustomSize.cardHeight,
        width: CustomSize.cardWidth,
      }}
      className="bg-slate-900/45 border border-transparent rounded-xl"
    >
      <div className="flex justify-center items-center h-10 w-full ">
        <img src={props?.images} className="h-full" />
      </div>
      <div className="flex justify-center items-center ">
        <h6>{props?.header}</h6>
      </div>
      <div className="mt-2">
        <p className="text-xs text-center">{props?.content}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
