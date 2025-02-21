import Home from "../pages/home/Home";
import Roleplay from "../pages/roleplays/Roleplay";
import Chat from "../pages/Practice/chat/chat";
import AI from "../pages/Practice/ai/AI";
import Practice from "../pages/Practice/Practice";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/login";
import Signup from "../pages/signup/Signup";
import ResetPassword from "../pages/reset/ResetPassword";
import { Routes, Route } from "react-router-dom";

const Routings = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/practice/ai" element={<AI />} />
      <Route path="/practice/chat" element={<Chat />} />
      <Route path="/leaderboard" element={<Dashboard />} />
      <Route path="/roleplay" element={<Roleplay />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword/>} />
    </Routes>
  );
};

export default Routings;
