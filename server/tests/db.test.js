import { describe, it, expect, vi } from "vitest";
import mongoose from "mongoose";
import connectDB from "../lib/db.js";

describe("connectDB", () => {
    it("calls mongoose.connect with MONGODB_URI", async () => {
        process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/test";
        const spy = vi
            .spyOn(mongoose, "connect")
            .mockResolvedValue({ connection: { host: "127.0.0.1" } });

        await connectDB();
        expect(spy).toHaveBeenCalledWith(process.env.MONGODB_URI);
    });

    it("exits process when connection fails", async () => {
        const connectSpy = vi
            .spyOn(mongoose, "connect")
            .mockRejectedValue(new Error("fail"));
        const exitSpy = vi
            .spyOn(process, "exit")
            .mockImplementation(() => undefined);

        await connectDB();
        expect(connectSpy).toHaveBeenCalled();
        expect(exitSpy).toHaveBeenCalledWith(1);
    });
});
