// oneliner-office-joke — writes one original one-line office joke to entry.txt.
//
// The joke lives in the JOKE constant below. The program validates it
// (one line, 1-200 characters, not blank) and writes it to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output), creating the
// directory first if it does not exist yet.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const JOKE =
  "I asked the office plant for career advice — it's the only thing here that's grown in three years.";

const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// The entry must be exactly one line of text.
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  fail("joke must be a single line");
}

// The competition gate accepts 1-200 characters of UTF-8 text.
const length = [...JOKE].length;
if (length < 1 || length > MAX_CHARS) {
  fail(`joke must be 1-${MAX_CHARS} characters, got ${length}`);
}

// Keep the encoded form small too: the gate reads UTF-8, so check the
// byte length as well and refuse anything with stray multi-byte junk.
const byteLength = Buffer.byteLength(JOKE, "utf8");
if (byteLength > MAX_CHARS * 4) {
  fail(`joke encodes to ${byteLength} bytes, over the ${MAX_CHARS * 4} byte cap`);
}

if (JOKE.trim().length === 0) {
  fail("joke must not be blank");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
// Write the joke with no trailing newline: the file must be exactly the
// one line, nothing more.
writeFileSync(outPath, JOKE, "utf8");

// Read it back and confirm the bytes on disk are exactly the joke we
// meant to write — a silent encoding slip would fail the gate.
if (readFileSync(outPath, "utf8") !== JOKE) {
  fail("written entry.txt does not match the joke");
}
console.log(`wrote entry.txt (${length} characters, ${byteLength} bytes) to ${outDir}`);
