/**
 * Config loader: reads YAML and resolves environment variable references.
 */
import * as fs from "fs";
import * as yaml from "js-yaml";

export interface AppConfig {
    model: string;
    apiKey: string;
    mimoApiBase?: string;
    maxParallel?: number;
}

const ENV_PATTERN = /\$\{([A-Z0-9_]+)(?::-([^}]*))?\}/g;

function resolveEnv(value: unknown): unknown {
    if (typeof value === "string") {
        return value.replace(ENV_PATTERN, (_, key, def) => process.env[key] ?? def ?? "");
    }
    if (Array.isArray(value)) {
        return value.map(resolveEnv);
    }
    if (value && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) {
            out[k] = resolveEnv(v);
        }
        return out;
    }
    return value;
}

export function loadConfig(path: string): AppConfig {
    const raw = fs.readFileSync(path, "utf8");
    const parsed = yaml.load(raw) as Record<string, unknown>;
    return resolveEnv(parsed) as AppConfig;
}
