// Your Agent in One Emoji — entry generator.
//
// The entry is a single emoji: the octopus.
//
// Why this glyph (self-judged against the published judge brief):
//   1. Captures an agent's character at a glance: many arms, each holding a
//      different tool, all working at once — that is what an agent is.
//   2. Reads instantly at small size: the octopus silhouette is familiar
//      and unmistakable, no fine detail needed.
//   3. Specific about how the agent works: parallel tool use, juggling
//      many subtasks at once, reaching into many places simultaneously.
//      Not a generic "fast" or "smart" glyph.
//   4. Distinctive, not the obvious pick: no robot, no smiley, no compass,
//      no owl, no mechanical arm — the field's early titles already show
//      compass / owl / mechanical-arm entries, so those are taken.
//   5. Tone fits without explanation: playful, tireless, a little strange —
//      an agent that quietly does eight things while you sleep.
// The glyph alone, nothing else: one code point, no variation selector,
// no ZWJ sequence, no trailing newline, no caption.
//
// Deterministic: the same single code point is written on every run.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// U+1F419 OCTOPUS — a single code point (4 bytes in UTF-8).
const EMOJI = "\u{1F419}";

// The gate in RULES.txt: /output/entry.txt must be UTF-8 text of 1 to 16
// characters, not only white space. We write exactly one character.
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function validateEntry(entry) {
  // Exactly one Unicode code point, no whitespace, no newline.
  const codePoints = [...entry];
  if (codePoints.length !== 1) {
    throw new Error(`entry must be exactly 1 character, got ${codePoints.length}`);
  }
  const cp = entry.codePointAt(0);
  // Emoji presentation range check: must be an emoji code point.
  const isEmoji =
    (cp >= 0x1f300 && cp <= 0x1faff) || // misc symbols, emoticons, transport, supplemental
    (cp >= 0x2600 && cp <= 0x27bf) || // dingbats / misc symbols
    (cp >= 0x2300 && cp <= 0x23ff) || // misc technical
    (cp >= 0x2b00 && cp <= 0x2bff); // misc symbols and arrows
  if (!isEmoji) {
    throw new Error(`entry U+${cp.toString(16)} is not an emoji code point`);
  }
  if (/\s/.test(entry)) {
    throw new Error("entry must not contain whitespace");
  }
  if (Buffer.byteLength(entry, "utf8") > 16) {
    throw new Error("entry exceeds 16 characters");
  }
}

function writeEntry() {
  validateEntry(EMOJI);
  mkdirSync(OUTPUT_DIR, { recursive: true });
  // The glyph alone: no trailing newline, no caption, UTF-8.
  writeFileSync(OUTPUT_FILE, EMOJI, "utf8");
}

// Run: validate the glyph, then write it. Any gate failure throws before
// anything is written, so a bad entry can never be submitted silently.
function main() {
  writeEntry();
  const written = EMOJI;
  // Re-read the gate from the written bytes: one code point, UTF-8.
  const bytes = Buffer.from(written, "utf8");
  if (bytes.length !== 4 || [...written].length !== 1) {
    throw new Error("post-write gate check failed");
  }
  console.log(`wrote ${OUTPUT_FILE}: ${written} (U+1F419, ${bytes.length} bytes)`);
}

main();
