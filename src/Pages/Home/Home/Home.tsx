import Navbar from "../../../Component/Navbar";
import { CustomSize } from "../../../Constant/Constant";
import CustomBtn from "../../../Control/CustomBtn/CustomBtn";
import Features from "../Features/Features";
const Home = () => {
  return (
    <div
      style={{ padding: CustomSize.padding }}
      className=" bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#3B82F6]  text-white min-h-screen "
    >
      <Navbar />
      <div className="mt-[6rem] flex items-center justify-center">
        <h2 className="text-6xl font-medium font-heading">
          Unlock The Future Of<br></br>
          <span className="text-blue-500 flex justify-center items-center">
            AI
          </span>
        </h2>
      </div>
      <div className="flex items-center justify-center mt-4">
        <p>
          Levrage the power of artifical intelligence to solve <br></br> complex
          problems and unleash new opportunities.
        </p>
      </div>
      <div className="flex items-center justify-center mt-4">
        <div>
          <CustomBtn
            hoverBackgroundColor={CustomSize?.hoverColor}
            backgroundColor={CustomSize.primaryColor}
            hoverTextColor="#fff"
          >
            Get Started
          </CustomBtn>
        </div>
        <div className="ml-2 cursor-pointer ">
          <CustomBtn
            hoverTextColor="black"
            hoverBackgroundColor="white"
            border="1px solid #193cb8"
          >
            Learn More
          </CustomBtn>
        </div>
      </div>
      <div className="mt-8">
        <h6 className="text-center font-semi text-2xl">Our Features</h6>
        <div className="flex items-center justify-center mt-4">
          <div>
            <Features />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
