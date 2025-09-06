import FeatureCard from "../../../Control/Card/FeatureCard";
import advancedAI from "../../../assets/advancedAI.png";
import easyIntegration from "../../../assets/easyIntegration.png";
import privacy from "../../../assets/privacy.png";
const Features = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <FeatureCard
        header="Advanced AI"
        content="State-of-the-art AI models for diverse application"
        images={advancedAI}
      />
      <FeatureCard
        header="Easy Integration"
        content="Seamlessly connect with your existing workflows"
        images={easyIntegration}
      />
      <FeatureCard
        header="built in security"
        content="Robust security mesaures in your data"
        images={privacy}
      />
    </div>
  );
};

export default Features;
