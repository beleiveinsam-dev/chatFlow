import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { protectedRoute } from "../middlewares/auth.js";
import { createMockRes } from "./helpers.js";

describe("protectedRoute middleware", () => {
    it("attaches req.user and calls next for valid token", async () => {
        const user = await User.create({
            fullName: "Auth User",
            email: "auth@example.com",
            password: "password123",
            bio: "bio",
        });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        const req = { headers: { token } };
        const res = createMockRes();
        let called = false;
        const next = () => {
            called = true;
        };

        await protectedRoute(req, res, next);

        expect(called).toBe(true);
        expect(req.user.email).toBe("auth@example.com");
        expect(req.user.password).toBeUndefined();
    });

    it("returns user not found when decoded user does not exist", async () => {
        const token = jwt.sign(
            { userId: "507f1f77bcf86cd799439011" },
            process.env.JWT_SECRET
        );
        const req = { headers: { token } };
        const res = createMockRes();

        await protectedRoute(req, res, () => {});
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("user not found");
    });

    it("returns jwt error for invalid token", async () => {
        const req = { headers: { token: "invalid" } };
        const res = createMockRes();

        await protectedRoute(req, res, () => {});
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("jwt verifying error");
    });
});
