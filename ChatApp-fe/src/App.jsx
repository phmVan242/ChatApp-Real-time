import Login from "./pages/AuthPages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/admin" element={<Admin />} /> */}
      </Routes>
  );
}