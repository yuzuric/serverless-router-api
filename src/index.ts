/**
 * serverless-router-api - Secure API proxy with automatic failover, request deduplication, and cost-aware routing for Xiaomi MiMo endpoints.
 */
import { MiMoClient } from "./client";
import { Gateway } from "./gateway";
import { loadConfig } from "./config";

async function main(): Promise<void> {
    const config = loadConfig("config.yaml");
    const client = new MiMoClient({
        model: config.model,
        apiKey: config.apiKey,
    });

    const engine = new Gateway(client);
    const result = await engine.run({ topic: "MiMo capabilities" });

    console.log("Completed:", JSON.stringify(result, null, 2));
}

main().catch((err) => {
    console.error("fatal:", err);
    process.exit(1);
});
