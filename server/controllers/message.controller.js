import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.model.js";
import Message from "../models/message.model.js";
import { io, userSocketMap } from "../server.js";

// get all the users except the logged in user
export const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: userId } }).select(
            "-password"
        );

        // Initialize unseenMessages as an object
        const unseenMessages = {};

        // Use Promise.all to handle asynchronous operations
        await Promise.all(
            filteredUser.map(async (user) => {
                const messages = await Message.find({
                    senderId: user._id,
                    receiverId: userId,
                    seen: false,
                });

                if (messages.length > 0) {
                    unseenMessages[user._id] = messages.length;
                }
            })
        );

        res.json({ success: true, users: filteredUser, unseenMessages });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// get all the messages for the selected user, i.e. open its chat

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ],
        });

        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId },
            { seen: true }
        );

        res.json({ success: true, messages }); // Add this line
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// api to mark messages as seen message id
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// send messages to selected user

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        // Emit new message to the recievers socket
        const recieversSocketId = userSocketMap[receiverId];
        if (recieversSocketId) {
            io.to(recieversSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage });
    } catch (error) {}
};