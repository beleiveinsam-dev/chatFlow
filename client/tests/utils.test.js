import { describe, it, expect } from "vitest";
import { formatMessageTime } from "../src/lib/utils";

describe("formatMessageTime", () => {
    it("formats input date to HH:mm 24-hour", () => {
        const output = formatMessageTime("2026-01-01T09:05:00.000Z");
        expect(output).toMatch(/^\d{2}:\d{2}$/);
    });
});
