import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { signup, login, checkAuth, updateProfile } from "../controllers/user.controller.js";
import { createMockRes } from "./helpers.js";

vi.mock("../lib/cloudinary.js", () => ({
    default: {
        uploader: {
            upload: vi.fn().mockResolvedValue({ secure_url: "https://img.test/p.png" }),
        },
    },
}));

describe("user.controller", () => {
    it("signup creates account and returns token", async () => {
        const req = {
            body: {
                fullName: "New User",
                email: "new@example.com",
                password: "password123",
                bio: "bio",
            },
        };
        const res = createMockRes();

        await signup(req, res);

        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        const inDb = await User.findOne({ email: "new@example.com" });
        expect(inDb).toBeTruthy();
        expect(inDb.password).not.toBe("password123");
    });

    it("signup rejects duplicate account", async () => {
        await User.create({
            fullName: "Existing",
            email: "dup@example.com",
            password: await bcrypt.hash("password123", 10),
            bio: "bio",
        });

        const req = {
            body: {
                fullName: "Existing",
                email: "dup@example.com",
                password: "password123",
                bio: "bio",
            },
        };
        const res = createMockRes();

        await signup(req, res);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Account already exists");
    });

    it("login returns token for valid credentials", async () => {
        const password = await bcrypt.hash("password123", 10);
        await User.create({
            fullName: "Login",
            email: "login@example.com",
            password,
            bio: "bio",
        });
        const req = { body: { email: "login@example.com", password: "password123" } };
        const res = createMockRes();

        await login(req, res);

        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
    });

    it("login rejects invalid password", async () => {
        const password = await bcrypt.hash("password123", 10);
        await User.create({
            fullName: "Login2",
            email: "login2@example.com",
            password,
            bio: "bio",
        });
        const req = { body: { email: "login2@example.com", password: "wrong" } };
        const res = createMockRes();

        await login(req, res);
        expect(res.body.success).toBe(false);
    });

    it("checkAuth returns req.user", () => {
        const req = { user: { _id: "1" } };
        const res = createMockRes();

        checkAuth(req, res);
        expect(res.body.success).toBe(true);
        expect(res.body.user._id).toBe("1");
    });

    it("updateProfile updates name and bio without profilePic", async () => {
        const user = await User.create({
            fullName: "Before",
            email: "up@example.com",
            password: "password123",
            bio: "old",
        });

        const req = {
            user: user,
            body: { fullName: "After", bio: "new" },
        };
        const res = createMockRes();

        await updateProfile(req, res);
        expect(res.body.success).toBe(true);
        expect(res.body.user.fullName).toBe("After");
        expect(res.body.user.bio).toBe("new");
    });
});
