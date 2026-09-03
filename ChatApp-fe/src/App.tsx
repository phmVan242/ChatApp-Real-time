import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import RequireAuth from "./components/auth/RequireAuth";
import Home from "./pages/Dashboard/Home";
import FriendRequestsPage from "./pages/FriendRequests/FriendRequestsPage";
import NotificationsPage from "./pages/Notifications/NotificationsPage";
import LoginPage from "./pages/AuthPages/LoginPage";
import RegisterPage from "./pages/AuthPages/RegisterPage";
import Sidebar from "./layout/Sidebar";
import ChatWindow from "./components/chat/ChatWindow";
import ChatLayout from "./layout/ChatLayout";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<RequireAuth />}>
            <Route index path="/" element={<Home />} />

          <Route element={<ChatLayout />}>
            <Route path="/chat/:roomId" element={<ChatWindow />} />
            <Route path="/friend-requests" element={<FriendRequestsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route
              path="/chat"
              element={
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Chon mot cuoc tro chuyen de bat dau
                </div>
              }
            />
          </Route>

          <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/chatwindow" element={<ChatWindow />} />
        </Route>

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
