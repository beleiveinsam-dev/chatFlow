import { describe, it, expect } from "vitest";
import User from "../models/User.model.js";
import Message from "../models/message.model.js";

describe("User model", () => {
    it("creates a user with required fields", async () => {
        const user = await User.create({
            fullName: "John Doe",
            email: "john@example.com",
            password: "password123",
            bio: "hello",
        });

        expect(user._id).toBeDefined();
        expect(user.profilePic).toBe("");
    });

    it("fails when required fields are missing", async () => {
        await expect(User.create({ email: "x@y.com" })).rejects.toThrow();
    });
});

describe("Message model", () => {
    it("creates message and defaults seen=false", async () => {
        const sender = await User.create({
            fullName: "S",
            email: "s@example.com",
            password: "password123",
            bio: "bio",
        });
        const receiver = await User.create({
            fullName: "R",
            email: "r@example.com",
            password: "password123",
            bio: "bio",
        });

        const message = await Message.create({
            senderId: sender._id,
            receiverId: receiver._id,
            text: "Hi",
        });

        expect(message.seen).toBe(false);
        expect(message.text).toBe("Hi");
    });
});
