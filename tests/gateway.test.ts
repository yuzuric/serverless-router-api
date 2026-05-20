import { describe, it, expect } from "vitest";
import { Gateway } from "../src/gateway";
import { MiMoClient } from "../src/client";

describe("Gateway", () => {
    it("constructs without throwing", () => {
        const client = new MiMoClient({ model: "mimo-7b", apiKey: "test" });
        const engine = new Gateway(client);
        expect(engine).toBeDefined();
    });

    it("client has correct model", () => {
        const client = new MiMoClient({ model: "mimo-7b", apiKey: "test" });
        expect(client.model).toBe("mimo-7b");
    });
});
