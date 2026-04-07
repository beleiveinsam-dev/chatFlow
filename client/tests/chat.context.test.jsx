import { describe, it, expect, vi } from "vitest";
import React, { useContext } from "react";
import { render, waitFor } from "@testing-library/react";
import { ChatContext, ChatProvider } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const socketOn = vi.fn();
const socketOff = vi.fn();

const axiosMock = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
};

const AuthWrapper = ({ children }) => (
    <AuthContext.Provider
        value={{
            axios: axiosMock,
            socket: { on: socketOn, off: socketOff },
        }}
    >
        {children}
    </AuthContext.Provider>
);

const Probe = ({ onReady }) => {
    const ctx = useContext(ChatContext);
    onReady(ctx);
    return null;
};

describe("ChatContext logical behavior", () => {
    it("getUser loads sidebar users and unseen messages", async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: {
                success: true,
                users: [{ _id: "u1" }],
                unseenMessages: { u1: 2 },
            },
        });

        let ctx;
        render(
            <AuthWrapper>
                <ChatProvider>
                    <Probe onReady={(v) => (ctx = v)} />
                </ChatProvider>
            </AuthWrapper>
        );

        await waitFor(() => expect(ctx).toBeTruthy());
        await ctx.getUser();
        await waitFor(() => expect(ctx.users).toHaveLength(1));
        expect(ctx.unseenMessages.u1).toBe(2);
    });

    it("getMessages sets message list", async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: { success: true, messages: [{ _id: "m1", text: "hi" }] },
        });

        let ctx;
        render(
            <AuthWrapper>
                <ChatProvider>
                    <Probe onReady={(v) => (ctx = v)} />
                </ChatProvider>
            </AuthWrapper>
        );

        await waitFor(() => expect(ctx).toBeTruthy());
        await ctx.getMessages("u1");
        await waitFor(() => expect(ctx.messages).toHaveLength(1));
        expect(ctx.messages[0].text).toBe("hi");
    });

    it("sendMessage appends new message", async () => {
        axiosMock.post.mockResolvedValueOnce({
            data: { success: true, newMessage: { _id: "m2", text: "new" } },
        });

        let ctx;
        render(
            <AuthWrapper>
                <ChatProvider>
                    <Probe onReady={(v) => (ctx = v)} />
                </ChatProvider>
            </AuthWrapper>
        );

        await waitFor(() => expect(ctx).toBeTruthy());
        ctx.setSelectedUser({ _id: "u2" });
        await waitFor(() => expect(ctx.selectedUser?._id).toBe("u2"));
        await ctx.sendMessage({ text: "new" });
        await waitFor(() => expect(ctx.messages).toHaveLength(1));
        expect(ctx.messages[0].text).toBe("new");
    });
});
