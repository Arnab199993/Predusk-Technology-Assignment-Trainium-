import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import RoutePath from "./Route";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {RoutePath?.map((route) => (
          <>
            <Route path={route?.path} element={route?.element} />
          </>
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
