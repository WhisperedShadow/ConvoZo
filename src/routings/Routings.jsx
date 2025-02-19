import Home from "../pages/home/Home";
import Roleplay from "../pages/roleplays/Roleplay";
import Chat from "../pages/chat/chat";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/login";
import { Routes, Route } from "react-router-dom";

const Routings = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/roleplay" element={<Roleplay />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default Routings;