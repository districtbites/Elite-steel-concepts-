/**
 * GitHub-style markdown tables: parse, render to HTML and generate.
 * Shared by the public blog renderer, the admin preview and the editor's table builder.
 *
 *   | Equipment | Watts |
 *   | --------- | ----: |
 *   | Fryer     | 3000W |
 */

export type TableAlign = "left" | "center" | "right";

export interface MarkdownTable {
    headers: string[];
    aligns: TableAlign[];
    rows: string[][];
}

const SEPARATOR_CELL = /^:?-{3,}:?$/;

/** Splits "| a | b \| c |" into ["a", "b | c"], honouring escaped pipes. */
function splitRow(line: string): string[] {
    let row = line.trim();
    if (row.startsWith("|")) row = row.slice(1);
    if (row.endsWith("|") && !row.endsWith("\\|")) row = row.slice(0, -1);
    return row.split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, "|"));
}

const isRowLine = (line: string) => /^\s*\|.*\|?\s*$/.test(line) && line.includes("|");

function isSeparatorLine(line: string): boolean {
    if (!isRowLine(line)) return false;
    const cells = splitRow(line);
    return cells.length > 0 && cells.every(c => SEPARATOR_CELL.test(c.replace(/\s/g, "")));
}

function alignOf(cell: string): TableAlign {
    const c = cell.replace(/\s/g, "");
    if (c.startsWith(":") && c.endsWith(":")) return "center";
    if (c.endsWith(":")) return "right";
    return "left";
}

/** Parses a table from its lines (header, separator, rows). Returns null if it is not a valid table. */
export function parseMarkdownTable(lines: string[]): MarkdownTable | null {
    if (lines.length < 2 || !isRowLine(lines[0]) || !isSeparatorLine(lines[1])) return null;
    const headers = splitRow(lines[0]);
    const cols = headers.length;
    const aligns = splitRow(lines[1]).map(alignOf);
    const fit = (cells: string[]) => Array.from({ length: cols }, (_, i) => cells[i] ?? "");
    return {
        headers,
        aligns: fit(aligns as string[]).map(a => (a || "left") as TableAlign),
        rows: lines.slice(2).map(l => fit(splitRow(l)))
    };
}

/** Location of every table block in the text, by line index (end exclusive). */
export function findTableBlocks(text: string): { startLine: number; endLine: number }[] {
    const lines = text.split("\n");
    const blocks: { startLine: number; endLine: number }[] = [];
    for (let i = 0; i < lines.length - 1; i++) {
        if (isRowLine(lines[i]) && isSeparatorLine(lines[i + 1])) {
            let end = i + 2;
            while (end < lines.length && isRowLine(lines[end]) && lines[end].trim() !== "") end++;
            blocks.push({ startLine: i, endLine: end });
            i = end - 1;
        }
    }
    return blocks;
}

/**
 * Finds the table containing the given character offset.
 * Returns its character range and parsed data, or null when the offset is not inside a table.
 */
export function findTableAt(text: string, offset: number): { start: number; end: number; table: MarkdownTable } | null {
    const lines = text.split("\n");
    const lineStarts: number[] = [];
    let pos = 0;
    for (const l of lines) {
        lineStarts.push(pos);
        pos += l.length + 1;
    }
    for (const b of findTableBlocks(text)) {
        const start = lineStarts[b.startLine];
        const end = lineStarts[b.endLine - 1] + lines[b.endLine - 1].length;
        if (offset >= start && offset <= end) {
            const table = parseMarkdownTable(lines.slice(b.startLine, b.endLine).map(l => l.replace(/\r$/, "")));
            if (table) return { start, end, table };
        }
    }
    return null;
}

/** Generates a neatly padded markdown table. */
export function buildMarkdownTable({ headers, aligns, rows }: MarkdownTable): string {
    const esc = (c: string) => (c || "").replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim();
    const head = headers.map(esc);
    const body = rows.map(r => headers.map((_, i) => esc(r[i] ?? "")));
    const widths = head.map((h, i) => Math.max(3, h.length, ...body.map(r => r[i].length)));
    const pad = (c: string, i: number) => {
        const a = aligns[i] || "left";
        const gap = widths[i] - c.length;
        if (a === "right") return " ".repeat(gap) + c;
        if (a === "center") return " ".repeat(Math.floor(gap / 2)) + c + " ".repeat(Math.ceil(gap / 2));
        return c + " ".repeat(gap);
    };
    const line = (cells: string[]) => `| ${cells.map(pad).join(" | ")} |`;
    const sep = `| ${widths
        .map((w, i) => {
            const a = aligns[i] || "left";
            if (a === "center") return `:${"-".repeat(w - 2)}:`;
            if (a === "right") return `${"-".repeat(w - 1)}:`;
            return "-".repeat(w);
        })
        .join(" | ")} |`;
    return [line(head), sep, ...body.map(line)].join("\n");
}

export interface TableClasses {
    wrapper: string;
    table: string;
    thead: string;
    th: string;
    tr: string;
    td: string;
    totalRow: string; // applied to a last row whose first cell starts with "Total"
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Renders a parsed table to single-line HTML (so later paragraph/line-break passes leave it intact). */
export function renderTableHtml(table: MarkdownTable, cls: TableClasses, renderCell: (text: string) => string = escapeHtml): string {
    const alignCls = (i: number) => (table.aligns[i] === "right" ? " text-right" : table.aligns[i] === "center" ? " text-center" : " text-left");
    const head = table.headers.map((h, i) => `<th scope="col" class="${cls.th}${alignCls(i)}">${renderCell(h)}</th>`).join("");
    const body = table.rows
        .map((r, ri) => {
            const isTotal = ri === table.rows.length - 1 && table.rows.length > 1 && /^\**total\b/i.test(r[0] || "");
            const cells = r.map((c, i) => `<td class="${cls.td}${alignCls(i)}">${renderCell(c)}</td>`).join("");
            return `<tr class="${cls.tr}${isTotal ? ` ${cls.totalRow}` : ""}">${cells}</tr>`;
        })
        .join("");
    return `<div class="${cls.wrapper}"><table class="${cls.table}"><thead class="${cls.thead}"><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

/**
 * Replaces every markdown table in the text with HTML produced by `toHtml`.
 * Tables are surrounded by blank lines so they become their own block.
 * Expects "\n" line endings.
 */
export function replaceMarkdownTables(text: string, toHtml: (table: MarkdownTable) => string): string {
    const blocks = findTableBlocks(text);
    if (blocks.length === 0) return text;
    const lines = text.split("\n");
    const out: string[] = [];
    let cursor = 0;
    for (const b of blocks) {
        out.push(...lines.slice(cursor, b.startLine));
        const table = parseMarkdownTable(lines.slice(b.startLine, b.endLine));
        out.push(table ? `\n${toHtml(table)}\n` : lines.slice(b.startLine, b.endLine).join("\n"));
        cursor = b.endLine;
    }
    out.push(...lines.slice(cursor));
    return out.join("\n").replace(/\n{3,}/g, "\n\n");
}
