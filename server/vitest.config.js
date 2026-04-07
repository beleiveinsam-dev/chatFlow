import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        setupFiles: ["./tests/setup.js"],
        clearMocks: true,
        hookTimeout: 600000,
        testTimeout: 600000,
        fileParallelism: false,
    },
});
