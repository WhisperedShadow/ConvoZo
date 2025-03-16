import Home from "../pages/home/Home";
import Roleplay from "../pages/roleplays/Roleplay";
import AI from "../pages/Practice/ai/AI";
import VideoChat from "../pages/Practice/chat/VideoChat";
import Practice from "../pages/Practice/Practice";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/login/login";
import Signup from "../pages/signup/Signup";
import ResetPassword from "../pages/reset/ResetPassword";
import Talk from "../pages/roleplays/plays/Talk";
import { Routes, Route } from "react-router-dom";

const Routings = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/practice/ai" element={<AI />} />
      <Route path="/practice/human" element={<VideoChat />} />
      <Route path="/leaderboard" element={<Dashboard />} />
      <Route path="/roleplay" element={<Roleplay />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword/>} />
      <Route path="/roleplay/:id" element={<Talk/>}/>
    </Routes>
  );
};

export default Routings;
