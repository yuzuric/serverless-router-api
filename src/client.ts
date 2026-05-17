/**
 * Lightweight client for the Xiaomi MiMo OpenAI-compatible API.
 */
import axios, { AxiosInstance } from "axios";

export interface MiMoOptions {
    model: string;
    apiKey: string;
    baseUrl?: string;
    timeoutMs?: number;
}

export interface ChatResponse {
    content: string;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
}

export class MiMoClient {
    private http: AxiosInstance;
    public readonly model: string;

    constructor(opts: MiMoOptions) {
        this.model = opts.model;
        this.http = axios.create({
            baseURL: (opts.baseUrl ?? "https://platform.xiaomimimo.com/v1").replace(/\/$/, ""),
            timeout: opts.timeoutMs ?? 60_000,
            headers: {
                Authorization: `Bearer ${opts.apiKey}`,
                "Content-Type": "application/json",
            },
        });
    }

    async chat(prompt: string, opts?: { maxTokens?: number; temperature?: number }): Promise<ChatResponse> {
        const r = await this.http.post("/chat/completions", {
            model: this.model,
            messages: [{ role: "user", content: prompt }],
            max_tokens: opts?.maxTokens ?? 512,
            temperature: opts?.temperature ?? 0.7,
        });
        const data = r.data;
        return {
            content: data.choices[0].message.content,
            usage: {
                promptTokens: data.usage?.prompt_tokens,
                completionTokens: data.usage?.completion_tokens,
                totalTokens: data.usage?.total_tokens,
            },
        };
    }
}
