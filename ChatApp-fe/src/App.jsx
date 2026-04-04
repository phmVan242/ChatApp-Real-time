import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/admin" element={<Admin />} /> */}
      </Routes>
  );
}