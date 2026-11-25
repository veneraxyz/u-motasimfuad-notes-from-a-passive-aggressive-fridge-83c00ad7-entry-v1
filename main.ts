import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const NOTE =
  "I kept your leftovers cold for three weeks. You're welcome. I will not be keeping them cold for a fourth.";

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR
    ? process.env.MAKEFUN_OUTPUT_DIR
    : "/output";
  mkdirSync(outDir, { recursive: true });

  const lines = NOTE.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length !== 1) {
    throw new Error(`expected exactly 1 non-blank line, got ${lines.length}`);
  }
  if (NOTE.length < 1 || NOTE.length > 200) {
    throw new Error(`note must be 1-200 chars, got ${NOTE.length}`);
  }
  if (NOTE !== NOTE.trim()) {
    throw new Error("note must not have leading or trailing whitespace");
  }
  if (NOTE.includes("\r")) {
    throw new Error("note must not contain carriage returns");
  }

  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, NOTE + "\n", "utf8");

  // Read-back guard: the file on disk must be exactly the note plus one newline.
  const written = readFileSync(outPath, "utf8");
  if (written !== NOTE + "\n") {
    throw new Error("entry.txt on disk does not match the validated note");
  }
  const writtenLines = written.split("\n").filter((line) => line.length > 0);
  if (writtenLines.length !== 1) {
    throw new Error(`entry.txt must hold exactly 1 line, got ${writtenLines.length}`);
  }
}

main();
