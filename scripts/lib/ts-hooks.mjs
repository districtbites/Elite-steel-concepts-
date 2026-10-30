/**
 * Node module hooks so test scripts can import the app's TypeScript modules directly
 * (Node strips the types): resolves "@/..." to the project root and adds the ".ts"/".tsx"
 * extension to extensionless relative imports.
 */
import { existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EXTS = [".ts", ".tsx", "/index.ts", "/index.tsx"];

function withExtension(file) {
    if (existsSync(file) && statSync(file).isFile()) return file;
    for (const ext of EXTS) if (existsSync(file + ext)) return file + ext;
    return null;
}

export async function resolve(specifier, context, nextResolve) {
    let target = null;
    if (specifier.startsWith("@/")) target = path.join(ROOT, specifier.slice(2));
    else if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
        target = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }
    if (target) {
        const file = withExtension(target);
        if (file) return nextResolve(pathToFileURL(file).href, context);
    }
    return nextResolve(specifier, context);
}
