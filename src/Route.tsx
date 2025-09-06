import Chat from "./Pages/Chat/Chat";
import Home from "./Pages/Home/Home/Home";

const RoutePath = [
  {
    path: "/",
    element: <Home />,
    showList: false,
  },
  {
    path: "/chat",
    element: <Chat />,
    showList: true,
  },
];

export default RoutePath;
