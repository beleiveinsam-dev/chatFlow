import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";

const Sidebar = () => {
    const {
        getUser,
        users,
        selectedUser,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
    } = useContext(ChatContext);

    const { logout, onlineUsers } = useContext(AuthContext);

    const [input, setInput] = useState("");

    const navigate = useNavigate();

    const filteredUsers = input
        ? users.filter((user) =>
              user.fullName.toLowerCase().includes(input.toLowerCase())
          )
        : users;

    useEffect(() => {
        getUser();
    }, [onlineUsers]);

    return (
        <div
            className={`bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-xl h-full p-6 border-r border-gray-700/50 overflow-y-scroll text-white ${
                selectedUser ? "max-md:hidden" : ""
            }`}
        >
            <div className="pb-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <img
                            src={assets.logo_icon}
                            alt="logo"
                            className="max-w-12 mr-4"
                        />
                        <p className="max-w-36 text-center">ChatFlow</p>
                    </div>

                    <div className="relative py-2 group">
                        <div className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors cursor-pointer">
                            <img
                                src={assets.menu_icon}
                                alt="Menu"
                                className="w-5 h-5"
                            />
                        </div>

                        <div className="absolute top-full right-0 z-20 w-40 mt-2 p-3 rounded-xl bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 text-gray-100 shadow-xl hidden group-hover:block">
                            <p
                                onClick={() => navigate("/profile")}
                                className="cursor-pointer text-sm py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-colors flex items-center gap-2"
                            >
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Edit Profile
                            </p>
                            <hr className="my-2 border-gray-700/50" />
                            <p
                                onClick={() => logout()}
                                className="cursor-pointer text-sm py-2 px-3 rounded-lg hover:bg-red-900/30 transition-colors flex items-center gap-2"
                            >
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                Logout
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <img
                            src={assets.search_icon}
                            alt="Search"
                            className="w-4 h-4 opacity-60"
                        />
                    </div>
                    <input
                        onChange={(e) => {
                            setInput(e.target.value);
                        }}
                        type="text"
                        className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full py-3 pl-12 pr-4 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        placeholder="Search conversations..."
                    />
                </div>
            </div>

            <div className="space-y-2">
                {filteredUsers.map((user, index) => (
                    <div
                        onClick={() => {
                            setSelectedUser(user);
                            setUnseenMessages((prev) => ({
                                ...prev,
                                [user._id]: 0,
                            }));
                        }}
                        key={user._id}
                        className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-800/30 ${
                            selectedUser?._id === user._id &&
                            "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20"
                        }`}
                    >
                        <div className="relative">
                            <img
                                src={user?.profilePic || assets.avatar_icon}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-700/50"
                            />
                            {onlineUsers.includes(user._id) && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                                {user.fullName}
                            </p>
                            <span
                                className={`text-xs ${
                                    onlineUsers.includes(user._id)
                                        ? "text-green-400"
                                        : "text-gray-400"
                                }`}
                            >
                                {onlineUsers.includes(user._id)
                                    ? "Online"
                                    : "Offline"}
                            </span>
                        </div>
                        {unseenMessages[user._id] > 0 && (
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold">
                                {unseenMessages[user._id]}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;