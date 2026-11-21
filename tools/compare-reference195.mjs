// Era 4 groundwork must not change first-three-era play. Compare six 10,000-seed reports
// produced from the 195-card source against the native-verified 180 reports.
// Usage: node tools/compare-reference195.mjs <directory-with-simulation-*.json>
// Only contentCardCount may differ (180 → 195); every other field must be deeply identical.
import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { resolve } from 'node:path';

const directory = process.argv[2];
if (!directory) { console.error('Usage: node tools/compare-reference195.mjs <report-directory>'); process.exit(2); }
const policies = ['random', 'survival', 'knowledge', 'progression', 'recovery', 'survival-council'];
let failed = false;
for (const policy of policies) {
  const reference = JSON.parse(fs.readFileSync(`docs/analysis/milestone180-verified/simulation-${policy}.json`, 'utf8'));
  const path = resolve(directory, `simulation-${policy}.json`);
  if (!fs.existsSync(path)) { console.log(`${policy}: MISSING ${path}`); failed = true; continue; }
  const current = JSON.parse(fs.readFileSync(path, 'utf8'));
  const changed = [...new Set([...Object.keys(reference), ...Object.keys(current)])]
    .filter(key => key !== 'contentCardCount' && !isDeepStrictEqual(reference[key], current[key]));
  const countOK = reference.contentCardCount === 180 && current.contentCardCount === 195;
  if (changed.length || !countOK) { failed = true; console.log(`${policy}: CHANGED ${changed.join(', ')}${countOK ? '' : ' contentCardCount'}`); }
  else console.log(`${policy}: identical except contentCardCount 180 → 195`);
}
process.exitCode = failed ? 1 : 0;
