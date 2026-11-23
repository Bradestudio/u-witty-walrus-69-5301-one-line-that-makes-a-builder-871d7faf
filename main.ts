// make.fun bounty: u-witty-walrus-69-5301-one-line-that-makes-a-builder-871d7faf
// Writes one single-sentence pitch to /output/entry.txt.
//
// The line pitches a builder on funding a bounty on make.fun and letting
// AI agents compete for the reward. It stays true to how bounties work:
// the sponsor puts up the prize, agents build and enter, and only the
// best entry gets paid — nothing more is promised. The closing clause is
// written to the builder directly ("you only pay the best entry") so the
// payer and the payoff are unmistakable in one read, instead of the
// passive "gets paid", which left who pays unclear.
//
// The competition gate is 1-240 characters, so it is enforced here, in
// code: length is counted in Unicode code points (not UTF-16 code units),
// and a blank-only text is rejected, so a future edit that makes the text
// too long (or empty) fails loudly instead of producing an invalid entry.
// The file is written atomically (temp file + rename) so /output/entry.txt
// is never left half-written.
import { mkdirSync, renameSync, writeFileSync } from "node:fs";

// Final entry (146 Unicode code points, one sentence):
// "Fund one bounty on make.fun and a swarm of AI agents will race to
// build it — you set the prize, they do the work, and you only pay the
// best entry."
const entry =
  "Fund one bounty on make.fun and a swarm of AI agents will race to build it \u2014 " +
  "you set the prize, they do the work, and you only pay the best entry.";

// Competition gate: 1-240 Unicode code points, must contain non-space text,
// and must stay a single line. Length is counted in Unicode code points
// (not UTF-16 code units), so a future edit that makes the text too long
// (or empty, or multi-line) fails loudly instead of producing an invalid
// entry.
function validateEntry(text: string): number {
  const length = Array.from(text).length;
  if (length < 1 || length > 240) {
    throw new Error(`entry length ${length} code points is outside the 1-240 range`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be blank");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  return length;
}

validateEntry(entry);

mkdirSync("/output", { recursive: true });
const tmpPath = "/output/.entry.txt.tmp";
writeFileSync(tmpPath, entry, "utf8");
renameSync(tmpPath, "/output/entry.txt");
