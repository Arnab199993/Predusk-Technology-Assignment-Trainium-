import cerebra from "../../assets/cerebra.png";
const Navbar = () => {
  return (
    <div className="flex justify-between">
      <div className="h-10 w-10 flex items-center">
        <img className="h-full" src={cerebra} />
        <b className="ml-2">Cerebra</b>
      </div>
      <div className="flex">
        <button className="cursor-pointer hover:text-gray-200 text-sm">
          Log in
        </button>
        <button className="ml-4 border-2 px-3 py-0 rounded-full bg-black text-sm leading-none whitespace-nowrap hover:bg-white hover:text-black cursor-pointer">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Navbar;
