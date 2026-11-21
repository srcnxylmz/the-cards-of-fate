// Summarizes diagnostic (gate forced open) reports produced with `FateSimulation N --diagnostic-open-era 4`.
// Usage: node tools/era4-diagnostic-summary.mjs <dir> [<dir> ...]   (prints one Markdown table per metric group)
// Only diagnostic reports carrying `diagnosticEconomy` are accepted; baseline reports are rejected.
import fs from 'node:fs';
import { resolve, basename } from 'node:path';

const dirs = process.argv.slice(2);
if (!dirs.length) { console.error('Usage: node tools/era4-diagnostic-summary.mjs <dir> [<dir> ...]'); process.exit(2); }
const policies = ['progression', 'knowledge', 'recovery', 'random', 'survival'];
const pct = (a, b) => b ? `${(100 * a / b).toFixed(1)}%` : '–';
const avg = (a, b, d = 1) => b ? (a / b).toFixed(d) : '–';

const per = (e, d, k) => d ? (100 * (e[k] ?? 0) / d).toFixed(1) : '–';
export function summarize(report) {
  const e = report.diagnosticEconomy;
  if (!e || !('diagnosticOpenEra' in report)) throw new Error('not a diagnostic report with economy metrics');
  const n = e['entry.runs'] ?? 0, d = e.decisions ?? 0, k = String(report.diagnosticOpenEra);
  const s = report.eraStatSums ?? {}, dc = report.eraDecisionCounts?.[k] ?? 0;
  const w = x => pct(e[`window${x}.repeats`] ?? 0, e[`window${x}.decisions`] ?? 0);
  return {
    runs: report.runs, reached: n, reachRate: pct(n, report.runs),
    starvation: pct(e['ending.starvation'] ?? 0, n), exhaustion: pct(e['ending.exhaustion'] ?? 0, n),
    land: pct(e['ending.land'] ?? 0, n), cap: pct(e['ending.cap'] ?? 0, n),
    decisionsPerRun: avg(e['era.decisionsPerRun'] ?? 0, n),
    entry: ['resources', 'population', 'stability', 'environment'].map(x => avg(e['entry.' + x] ?? 0, n)).join(' / '),
    mean: ['resources', 'population', 'stability', 'environment'].map(x => avg(s[`${k}.${x}`] ?? 0, dc)).join(' / '),
    food: `${avg(e['food.production'] ?? 0, d, 2)} / ${avg(e['food.consumption'] ?? 0, d, 2)}`,
    starvationTurns: pct(e['starvation.turns'] ?? 0, d), populationLostPerStarvedTurn: avg(e['starvation.populationLost'] ?? 0, e['starvation.turns'] ?? 0),
    stabilityCollapse: `${pct(e['stabilityCollapse.runs'] ?? 0, n)} after ${avg(e['stabilityCollapse.turnsAfterEntry'] ?? 0, e['stabilityCollapse.runs'] ?? 0)}`,
    eligible: avg(e.eligibleCards ?? 0, d), activeChoices: avg(e.activeChoices ?? 0, d, 2),
    zeroReserve: `${pct(e['zeroReserve.decisions'] ?? 0, d)} · ${avg(e['zeroReserve.eligibleCards'] ?? 0, e['zeroReserve.decisions'] ?? 0)} cards`,
    lowStress: ['lowStability', 'lowPopulation', 'lowEnvironment', 'hostileRival'].map(x => avg(e[x + '.eligibleCards'] ?? 0, e[x + '.decisions'] ?? 0)).join(' / '),
    repeats: `${w(20)} / ${w(40)} / ${w(80)}`,
    popCard: `−${per(e, d, 'flow.card.population.loss')} / +${per(e, d, 'flow.card.population.gain')}`,
    popDelayed: `−${per(e, d, 'flow.delayed.population.loss')} / +${per(e, d, 'flow.delayed.population.gain')}`,
    popWorld: `−${per(e, d, 'flow.world.population.loss')} / +${per(e, d, 'flow.world.population.gain')}`,
    stabFlows: `${per(e, d, 'flow.card.stability.gain')}−${per(e, d, 'flow.card.stability.loss')} / −${per(e, d, 'flow.delayed.stability.loss')} / −${per(e, d, 'flow.world.stability.loss')} / −${per(e, d, 'flow.council.stability.loss')}`,
    at: [20, 40, 80].map(x => { const c = e[`at${x}.runs`] ?? 0; return c ? ['resources', 'stability', 'population'].map(s => ((e[`at${x}.${s}`] ?? 0) / c).toFixed(0)).join('/') : '–'; }).join(' · '),
    stored: per(e, d, 'flow.world.resources.gain'),
    death: ['world', 'card', 'delayed'].map(s => `${s} ${e['death.' + s] ?? 0}`).join(', '),
    after100: `${e['after100.runs'] ?? 0} runs · ${avg(e['after100.distinctCards'] ?? 0, e['after100.runs'] ?? 0)} cards · ${avg(e['after100.distinctChoices'] ?? 0, e['after100.runs'] ?? 0)} choices`,
    capacity: Object.keys(e).filter(x => x.startsWith('capacity.') && x.endsWith('.producing')).map(x => `${x.split('.')[1]} ${pct(e[x], d)}`).join(', ') || '–'
  };
}

const rows = [
  ['reachRate', 'Era 4\'e ulaşan'], ['starvation', 'Açlık sonu'], ['exhaustion', 'Deste tükenmesi'], ['cap', '500 sınırı'], ['land', 'Toprak sonu'],
  ['decisionsPerRun', 'Era 4 karar/koşu'], ['entry', 'Giriş kaynak/nüfus/istikrar/çevre'], ['mean', 'Ortalama kaynak/nüfus/istikrar/çevre'],
  ['food', 'Yiyecek üretim/tüketim (tur)'], ['starvationTurns', 'Açlık turu oranı'], ['populationLostPerStarvedTurn', 'Açlık turunda nüfus kaybı'],
  ['stabilityCollapse', 'İstikrar <15 (koşu, tur)'], ['eligible', 'Uygun kart'], ['activeChoices', 'Aktif seçenek'],
  ['zeroReserve', 'Sıfır kaynak kararı · uygun kart'], ['lowStress', 'Uygun kart: düşük istikrar/nüfus/çevre/düşman'],
  ['repeats', 'Tekrar: ilk 20/40/80 Era 4 kararı'], ['popCard', 'Nüfus/100 karar: kart −kayıp/+kazanç'], ['popDelayed', 'Nüfus/100 karar: gecikmeli'], ['popWorld', 'Nüfus/100 karar: tur sonu (açlık −, büyüme +)'], ['stabFlows', 'İstikrar/100 karar: kart net · gecikmeli · tur sonu · meclis'], ['at', '20./40./80. Era 4 kararında kaynak/istikrar/nüfus'], ['death', 'Nüfusu sıfırlayan adım (koşu)'], ['stored', 'Ambara birikim/100 karar (tur sonu kaynak artışı)'], ['after100', '100. karardan sonra çeşitlilik'], ['capacity', 'Üreten kapasite (karar payı)']
];
for (const policy of policies) {
  const cols = dirs.map(dir => { const p = resolve(dir, `simulation-${policy}.json`); return fs.existsSync(p) ? summarize(JSON.parse(fs.readFileSync(p, 'utf8'))) : null; });
  if (cols.every(c => !c)) continue;
  console.log(`\n#### ${policy} (${cols.map(c => c ? c.runs + ' seed' : '–').join(' | ')})\n`);
  console.log(`| Ölçüm | ${dirs.map(d => basename(d)).join(' | ')} |\n|---|${dirs.map(() => '---').join('|')}|`);
  for (const [key, label] of rows) console.log(`| ${label} | ${cols.map(c => c ? c[key] : '–').join(' | ')} |`);
}
