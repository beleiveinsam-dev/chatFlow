import { describe, it, expect, vi, beforeEach } from "vitest";
import User from "../models/User.model.js";
import Message from "../models/message.model.js";
import {
    getUserForSidebar,
    getMessages,
    markMessageAsSeen,
    sendMessage,
} from "../controllers/message.controller.js";
import { createMockRes } from "./helpers.js";

vi.mock("../server.js", () => ({
    io: { to: vi.fn(() => ({ emit: vi.fn() })) },
    userSocketMap: {},
}));

vi.mock("../lib/cloudinary.js", () => ({
    default: {
        uploader: {
            upload: vi.fn().mockResolvedValue({ secure_url: "https://img.test/m.png" }),
        },
    },
}));

describe("message.controller", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getUserForSidebar returns users except requester with unseen counts", async () => {
        const me = await User.create({
            fullName: "Me",
            email: "me@example.com",
            password: "password123",
            bio: "bio",
        });
        const other = await User.create({
            fullName: "Other",
            email: "other@example.com",
            password: "password123",
            bio: "bio",
        });
        await Message.create({
            senderId: other._id,
            receiverId: me._id,
            text: "x",
            seen: false,
        });

        const req = { user: me };
        const res = createMockRes();

        await getUserForSidebar(req, res);
        expect(res.body.success).toBe(true);
        expect(res.body.users).toHaveLength(1);
        expect(res.body.unseenMessages[other._id.toString()]).toBe(1);
    });

    it("getMessages returns conversation and marks selected sender messages seen", async () => {
        const a = await User.create({
            fullName: "A",
            email: "a@example.com",
            password: "password123",
            bio: "bio",
        });
        const b = await User.create({
            fullName: "B",
            email: "b@example.com",
            password: "password123",
            bio: "bio",
        });
        await Message.create({ senderId: a._id, receiverId: b._id, text: "1" });
        const m2 = await Message.create({ senderId: b._id, receiverId: a._id, text: "2" });

        const req = { user: a, params: { id: b._id.toString() } };
        const res = createMockRes();
        await getMessages(req, res);

        expect(res.body.success).toBe(true);
        expect(res.body.messages.length).toBe(2);
        const updated = await Message.findById(m2._id);
        expect(updated.seen).toBe(true);
    });

    it("markMessageAsSeen sets seen=true", async () => {
        const a = await User.create({
            fullName: "A2",
            email: "a2@example.com",
            password: "password123",
            bio: "bio",
        });
        const b = await User.create({
            fullName: "B2",
            email: "b2@example.com",
            password: "password123",
            bio: "bio",
        });
        const m = await Message.create({ senderId: a._id, receiverId: b._id, text: "3" });

        const req = { params: { id: m._id.toString() } };
        const res = createMockRes();
        await markMessageAsSeen(req, res);

        const inDb = await Message.findById(m._id);
        expect(res.body.success).toBe(true);
        expect(inDb.seen).toBe(true);
    });

    it("sendMessage creates and returns message", async () => {
        const sender = await User.create({
            fullName: "S2",
            email: "s2@example.com",
            password: "password123",
            bio: "bio",
        });
        const receiver = await User.create({
            fullName: "R2",
            email: "r2@example.com",
            password: "password123",
            bio: "bio",
        });

        const req = {
            user: sender,
            params: { id: receiver._id.toString() },
            body: { text: "hello", image: "base64" },
        };
        const res = createMockRes();

        await sendMessage(req, res);
        expect(res.body.success).toBe(true);
        expect(res.body.newMessage.text).toBe("hello");
        expect(res.body.newMessage.image).toContain("https://img.test");
    });
});
