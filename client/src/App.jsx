import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Team from "./pages/Team";
import Invites from "./pages/Invites";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Tournaments from "./pages/Tournaments";
import ViewTeam from "./pages/ViewTeam";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search" element={<Search />} />
        <Route path="/team" element={<Team />} />
        <Route path="/invites" element={<Invites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/view-team/:teamId" element={<ViewTeam />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;