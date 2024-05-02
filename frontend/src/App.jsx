import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Signin from "./pages/signin";
import Home from "./pages/home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/sign-in" element={<Signin />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
