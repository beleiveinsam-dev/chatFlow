import React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import RightSidebar from "../components/RightSidebar";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const HomePage = () => {
    const { selectedUser } = useContext(ChatContext);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black w-full sm:px-[8%] sm:py-[3%] overflow-hidden">
            <div
                className={`backdrop-blur-2xl bg-white/5 border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden h-screen sm:h-[94vh] grid grid-cols-1 relative ${
                    selectedUser
                        ? "md:grid-cols-[320px_1fr_280px] xl:grid-cols-[360px_1fr_320px]"
                        : "md:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]"
                }`}
            >
                <Sidebar />
                <ChatContainer />
                <RightSidebar />
            </div>
        </div>
    );
};

export default HomePage;
