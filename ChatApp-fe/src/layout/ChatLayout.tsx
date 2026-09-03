import React from "react";
import { Outlet } from "react-router";
// import AppSidebar from "../components/chat/AppSidebar"; 
import AppSidebar from "./Sidebar";

const ChatLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet /> 
      </div>
    </div>
  );
};

export default ChatLayout;