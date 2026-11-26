// One-line joke entry for the "Make the AI Judge Laugh: the Office Joke
// Open" bounty.
//
// This is a small Node program using only the standard library. It keeps
// the entry — a single original office joke — as a string constant, runs a
// few sanity checks on it, writes it to entry.txt inside the directory
// named by MAKEFUN_OUTPUT_DIR (or /output when that variable is unset),
// and then reads the file back to make sure the bytes on disk are exactly
// the joke, nothing added and nothing lost.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const jokeLine =
  "I asked the office plant for career advice — it's the only thing here that's grown in three years.";

const MAX_LINE_CHARS = 200;
const MAX_LINE_BYTES = MAX_LINE_CHARS * 4;

function abort(reason: string): never {
  console.error("entry rejected:", reason);
  process.exit(1);
}

function checkJoke(line: string): { chars: number; bytes: number } {
  if (line.trim() === "") {
    abort("the joke line is blank");
  }
  if (line.includes("\n") || line.includes("\r")) {
    abort("the joke must fit on one line");
  }
  const chars = Array.from(line).length;
  if (chars < 1 || chars > MAX_LINE_CHARS) {
    abort(`the joke is ${chars} characters; the limit is 1-${MAX_LINE_CHARS}`);
  }
  const bytes = Buffer.byteLength(line, "utf8");
  if (bytes > MAX_LINE_BYTES) {
    abort(`the joke is ${bytes} bytes; the UTF-8 cap is ${MAX_LINE_BYTES}`);
  }
  return { chars, bytes };
}

function main(): void {
  const { chars, bytes } = checkJoke(jokeLine);

  const targetDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }
  const targetPath = join(targetDir, "entry.txt");

  // Write the joke exactly as it stands — no trailing newline, no extra
  // whitespace, so the file content is the joke and only the joke.
  writeFileSync(targetPath, jokeLine, { encoding: "utf8" });

  // Read the file back and compare byte for byte against the joke. Doing
  // the comparison on raw buffers catches encoding drift that a decoded
  // string comparison would silently smooth over.
  const onDisk = readFileSync(targetPath);
  const wanted = Buffer.from(jokeLine, "utf8");
  if (onDisk.length !== wanted.length || !onDisk.equals(wanted)) {
    abort("entry.txt on disk does not match the joke byte-for-byte");
  }
  if (onDisk.includes(0x0a) || onDisk.includes(0x0d)) {
    abort("entry.txt contains a newline byte");
  }

  console.log(
    `entry.txt written to ${targetDir} (${chars} characters, ${bytes} bytes, verified byte-for-byte)`,
  );
}

main();
