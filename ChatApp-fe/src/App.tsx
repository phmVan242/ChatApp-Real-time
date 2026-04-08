import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}