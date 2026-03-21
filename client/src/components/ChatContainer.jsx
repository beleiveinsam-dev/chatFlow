import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = () => {
    const {
        messages,
        selectedUser,
        setSelectedUser,
        sendMessage,
        getMessages,
    } = useContext(ChatContext);
    const { authUser, onlineUsers } = useContext(AuthContext);

    const scrollEnd = useRef();

    const [input, setInput] = useState("");

    // message sending
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return null;
        await sendMessage({ text: input.trim() });
        setInput("");
    };

    // image sending
    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("select an image file");
            return;
        }
        const reader = new FileReader();

        reader.onloadend = async () => {
            await sendMessage({ image: reader.result });
            e.target.value = "";
        };

        reader.readAsDataURL(file);
    };

    // Fetch messages when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        // Only scroll if the container is visible (selectedUser exists)
        if (scrollEnd.current && selectedUser) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedUser]);

    return selectedUser ? (
        <div className="h-full flex flex-col relative bg-gradient-to-b from-gray-900/20 to-black/20 backdrop-blur-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 py-4 px-6 bg-gray-900/50 backdrop-blur-lg border-b border-gray-700/50">
                <img
                    onClick={() => {
                        setSelectedUser(null);
                    }}
                    src={assets.arrow_icon}
                    alt=""
                    className="md:hidden w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                />
                <div className="relative">
                    <img
                        src={selectedUser.profilePic || assets.avatar_icon}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-600/50"
                    />
                    {onlineUsers.includes(selectedUser._id) && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-lg font-medium text-white">
                        {selectedUser.fullName}
                    </p>
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
                <img
                    src={assets.help_icon}
                    alt=""
                    className="max-md:hidden w-6 h-6 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                />
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-scroll p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={msg._id}
                        className={`flex items-end gap-3 ${
                            msg.senderId === authUser._id
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`flex items-end gap-2 max-w-[70%] ${
                                msg.senderId === authUser._id
                                    ? "flex-row-reverse"
                                    : "flex-row"
                            }`}
                        >
                            <div className="text-center">
                                <img
                                    src={
                                        msg.senderId === authUser._id
                                            ? authUser?.profilePic ||
                                              assets.avatar_icon
                                            : selectedUser.profilePic ||
                                              assets.avatar_icon
                                    }
                                    alt=""
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    {formatMessageTime(msg.createdAt)}
                                </p>
                            </div>

                            <div
                                className={`relative ${
                                    msg.senderId === authUser._id
                                        ? "mr-2"
                                        : "ml-2"
                                }`}
                            >
                                {msg.image ? (
                                    <div className="relative group">
                                        <img
                                            src={msg.image}
                                            alt=""
                                            className="max-w-[280px] rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-colors"></div>
                                    </div>
                                ) : (
                                    <div
                                        className={`relative p-3 rounded-2xl shadow-lg ${
                                            msg.senderId === authUser._id
                                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md"
                                                : "bg-gray-800/80 backdrop-blur-sm text-gray-100 rounded-bl-md"
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed break-words">
                                            {msg.text}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={scrollEnd}></div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900/50 backdrop-blur-lg border-t border-gray-700/50">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            onKeyDown={(e) =>
                                e.key === "Enter" ? handleSendMessage(e) : null
                            }
                            type="text"
                            placeholder="Type a message..."
                            className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full py-3 px-4 pr-12 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        />
                        <input
                            onChange={handleSendImage}
                            type="file"
                            id="image"
                            accept="image/png, image/jpeg"
                            hidden
                        />
                        <label
                            htmlFor="image"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer p-1 rounded-full hover:bg-gray-700/50 transition-colors"
                        >
                            <img
                                src={assets.gallery_icon}
                                alt=""
                                className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </label>
                    </div>
                    <button
                        onClick={handleSendMessage}
                        className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <img
                            src={assets.send_button}
                            alt=""
                            className="w-5 h-5"
                        />
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center gap-6 text-gray-400 bg-gradient-to-b from-gray-900/20 to-black/20 backdrop-blur-lg max-md:hidden">
            <div className="relative">
                <img
                    src={assets.logo_icon}
                    alt=""
                    className="w-20 h-20 opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl"></div>
            </div>
            <div className="text-center">
                <p className="text-2xl font-light text-white mb-2">
                    Welcome to ChatFlow
                </p>
                <p className="text-sm text-gray-400">
                    Learn, Chat, Flow - Select a conversation to start chatting
                </p>
            </div>
        </div>
    );
};

export default ChatContainer;