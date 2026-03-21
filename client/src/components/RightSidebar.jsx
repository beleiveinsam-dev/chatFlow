import React from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";

const RightSidebar = () => {
    const { selectedUser, messages } = useContext(ChatContext);
    const { logout, onlineUsers } = useContext(AuthContext);
    const [msgImages, setMsgImages] = useState([]);

    //get all img sent by user and put in right sidebar by putting in state

    useEffect(() => {
        setMsgImages(
            messages.filter((msg) => msg.image).map((msg) => msg.image)
        );
    }, [messages]);

    return (
        selectedUser && (
            <div
                className={`bg-gradient-to-b from-gray-900/30 to-black/30 backdrop-blur-xl text-white w-full relative overflow-y-scroll border-l border-gray-700/50 ${
                    selectedUser ? "max-md:hidden" : ""
                }`}
            >
                <div className="pt-8 pb-6 flex flex-col items-center gap-4 px-6">
                    <div className="relative">
                        <img
                            src={selectedUser?.profilePic || assets.avatar_icon}
                            alt=""
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-600/30"
                        />
                        {onlineUsers.includes(selectedUser._id) && (
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900"></div>
                        )}
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-white mb-1">
                            {selectedUser.fullName}
                        </h1>
                        <p
                            className={`text-sm ${
                                onlineUsers.includes(selectedUser._id)
                                    ? "text-green-400"
                                    : "text-gray-400"
                            }`}
                        >
                            {onlineUsers.includes(selectedUser._id)
                                ? "Online"
                                : "Offline"}
                        </p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 w-full">
                        <p className="text-sm text-gray-300 text-center leading-relaxed">
                            {selectedUser.bio || "No bio available"}
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-700/50 mx-6"></div>

                <div className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm font-medium text-gray-300">
                            Shared Media
                        </p>
                        <div className="flex-1 h-px bg-gray-700/50"></div>
                    </div>

                    {msgImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                            {msgImages.map((url, index) => (
                                <div
                                    key={index}
                                    onClick={() => window.open(url)}
                                    className="group relative cursor-pointer rounded-lg overflow-hidden bg-gray-800/50"
                                >
                                    <img
                                        src={url}
                                        alt=""
                                        className="w-full h-20 object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gray-800/50 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <img
                                    src={assets.gallery_icon}
                                    alt=""
                                    className="w-6 h-6 opacity-50"
                                />
                            </div>
                            <p className="text-sm text-gray-400">
                                No media shared yet
                            </p>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        onClick={() => logout()}
                        className="w-full bg-gradient-to-r from-red-600/20 to-red-800/20 hover:from-red-600/30 hover:to-red-800/30 text-red-400 hover:text-red-300 border border-red-600/30 hover:border-red-500/50 py-3 px-6 rounded-full text-sm font-medium transition-all backdrop-blur-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        )
    );
};

export default RightSidebar;