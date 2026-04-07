import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";
import { generateToken } from "../generateToken.js";

describe("generateToken", () => {
    it("generates a signed token containing userId", () => {
        const token = generateToken("507f1f77bcf86cd799439011");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded.userId).toBe("507f1f77bcf86cd799439011");
    });
});
