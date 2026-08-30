import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export interface TermItem {
  term: string;
  def: string;
}

export interface TicketItem {
  q: string;
  a: string;
}

export type Block =
  | { type: "para"; text: string }
  | { type: "math"; tex: string }
  | { type: "figure"; src: string; caption: string }
  | { type: "aside"; text: string }
  | { type: "terms"; items: TermItem[] };

export interface Chunk {
  id: string;
  title: string;
  minutes: number;
  intensity?: "close" | "skim" | "skip";
  blocks: Block[];
  ticket: TicketItem[];
}

export interface Companion {
  id: string;
  title: string;
  venue: string;
  created: string;
  map: string;
  chunks: Chunk[];
  outro: string[];
}

const CONTENT_DIR = path.join(process.cwd(), "content", "papers");

export function listCompanions(): Companion[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".yaml"))
    .sort()
    .map((f) => yaml.load(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8")) as Companion);
}

export function getCompanion(id: string): Companion | null {
  const file = path.join(CONTENT_DIR, `${id}.yaml`);
  if (!fs.existsSync(file)) return null;
  return yaml.load(fs.readFileSync(file, "utf8")) as Companion;
}
