import { describe, it, expect, vi, beforeEach } from "vitest";
import React, { useContext } from "react";
import { render, waitFor } from "@testing-library/react";

const {
    getMock,
    postMock,
    putMock,
    disconnectMock,
    onMock,
    connectMock,
} = vi.hoisted(() => ({
    getMock: vi.fn(),
    postMock: vi.fn(),
    putMock: vi.fn(),
    disconnectMock: vi.fn(),
    onMock: vi.fn(),
    connectMock: vi.fn(),
}));

vi.mock("axios", () => ({
    default: {
        defaults: { headers: { common: {} }, baseURL: "" },
        get: getMock,
        post: postMock,
        put: putMock,
    },
}));

vi.mock("socket.io-client", () => ({
    io: vi.fn(() => ({
        connect: connectMock,
        disconnect: disconnectMock,
        on: onMock,
        connected: false,
    })),
}));

vi.mock("react-hot-toast", () => ({
    default: { success: vi.fn(), error: vi.fn() },
}));

import { AuthContext, AuthProvider } from "../context/AuthContext";

const Probe = ({ onReady }) => {
    const ctx = useContext(AuthContext);
    onReady(ctx);
    return null;
};

describe("AuthContext logical behavior", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        getMock.mockResolvedValue({ data: { success: false } });
    });

    it("login stores token and user on success", async () => {
        postMock.mockResolvedValue({
            data: {
                success: true,
                token: "abc",
                userData: { _id: "u1", fullName: "U" },
                message: "ok",
            },
        });

        let ctxRef;
        render(
            <AuthProvider>
                <Probe onReady={(ctx) => (ctxRef = ctx)} />
            </AuthProvider>
        );

        await waitFor(() => expect(ctxRef).toBeTruthy());
        await ctxRef.login("login", { email: "a", password: "b" });

        expect(localStorage.getItem("token")).toBe("abc");
        await waitFor(() => expect(ctxRef.authUser?._id).toBe("u1"));
    });

    it("logout clears local auth state", async () => {
        let ctxRef;
        render(
            <AuthProvider>
                <Probe onReady={(ctx) => (ctxRef = ctx)} />
            </AuthProvider>
        );

        await waitFor(() => expect(ctxRef).toBeTruthy());
        localStorage.setItem("token", "abc");
        await ctxRef.logout();
        expect(localStorage.getItem("token")).toBeNull();
        expect(ctxRef.authUser).toBeNull();
    });

    it("updateProfile updates authUser on success", async () => {
        putMock.mockResolvedValue({
            data: { success: true, user: { _id: "u2", fullName: "Updated" } },
        });

        let ctxRef;
        render(
            <AuthProvider>
                <Probe onReady={(ctx) => (ctxRef = ctx)} />
            </AuthProvider>
        );

        await waitFor(() => expect(ctxRef).toBeTruthy());
        await ctxRef.updateProfile({ fullName: "Updated" });
        await waitFor(() => expect(ctxRef.authUser?.fullName).toBe("Updated"));
    });
});
