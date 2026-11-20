// Same-seed invariance check between two directories of simulation-*.json reports.
// Usage: node tools/compare-reference.mjs <reference-dir> <current-dir> <reference-card-count> <current-card-count>
// Only contentCardCount may differ; every other field must be deeply identical. Diagnostic
// (gate-forced) reports are rejected because they are not comparable with baselines.
import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { resolve } from 'node:path';

const [referenceDir, currentDir, fromCount, toCount] = process.argv.slice(2);
if (!referenceDir || !currentDir || !Number.isInteger(+fromCount) || !Number.isInteger(+toCount)) {
  console.error('Usage: node tools/compare-reference.mjs <reference-dir> <current-dir> <reference-card-count> <current-card-count>');
  process.exit(2);
}
const policies = ['random', 'survival', 'knowledge', 'progression', 'recovery', 'survival-council'];
let failed = false;
for (const policy of policies) {
  const load = dir => { const p = resolve(dir, `simulation-${policy}.json`); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; };
  const reference = load(referenceDir), current = load(currentDir);
  if (!reference || !current) { console.log(`${policy}: MISSING ${reference ? currentDir : referenceDir}`); failed = true; continue; }
  if ('diagnosticOpenEra' in reference || 'diagnosticOpenEra' in current) { console.log(`${policy}: REJECTED diagnostic report`); failed = true; continue; }
  const changed = [...new Set([...Object.keys(reference), ...Object.keys(current)])]
    .filter(key => key !== 'contentCardCount' && !isDeepStrictEqual(reference[key], current[key]));
  const countOK = reference.contentCardCount === +fromCount && current.contentCardCount === +toCount;
  if (changed.length || !countOK) { failed = true; console.log(`${policy}: CHANGED ${changed.join(', ')}${countOK ? '' : ' contentCardCount'}`); }
  else console.log(`${policy}: identical except contentCardCount ${fromCount} → ${toCount}`);
}
process.exitCode = failed ? 1 : 0;
