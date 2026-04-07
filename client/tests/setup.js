import { vi } from "vitest";

vi.stubGlobal("scrollTo", vi.fn());

const storage = {};
vi.stubGlobal("localStorage", {
    getItem: vi.fn((key) => storage[key] ?? null),
    setItem: vi.fn((key, value) => {
        storage[key] = String(value);
    }),
    removeItem: vi.fn((key) => {
        delete storage[key];
    }),
    clear: vi.fn(() => {
        Object.keys(storage).forEach((key) => delete storage[key]);
    }),
});
