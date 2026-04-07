import { describe, it, expect } from "vitest";
import express from "express";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import userRouter from "../routes/userRoutes.js";
import User from "../models/User.model.js";

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use("/api/auth", userRouter);
    return app;
};

describe("route + middleware integration", () => {
    it("blocks protected route when token is invalid", async () => {
        const app = buildApp();
        const response = await supertest(app)
            .get("/api/auth/check")
            .set("token", "bad-token");

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("jwt verifying error");
    });

    it("allows protected route with valid token", async () => {
        const user = await User.create({
            fullName: "Protected",
            email: "protected@example.com",
            password: "password123",
            bio: "bio",
        });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        const app = buildApp();
        const response = await supertest(app)
            .get("/api/auth/check")
            .set("token", token);

        expect(response.body.success).toBe(true);
        expect(response.body.user.email).toBe("protected@example.com");
    });
});
