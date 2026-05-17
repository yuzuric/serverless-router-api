/**
 * Core gateway module.
 */
import { MiMoClient } from "./client";

export interface GatewayResult {
    output: string;
    tokensUsed: number;
    durationMs: number;
}

export class Gateway {
    constructor(private client: MiMoClient) {}

    async run(inputs: Record<string, unknown>): Promise<GatewayResult> {
        const start = Date.now();
        const prompt = JSON.stringify(inputs);
        const response = await this.client.chat(prompt, { maxTokens: 512 });

        return {
            output: response.content,
            tokensUsed: response.usage?.totalTokens ?? 0,
            durationMs: Date.now() - start,
        };
    }
}
