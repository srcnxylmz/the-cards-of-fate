import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validate } from './validate-content.mjs';
import { PROVINCIAL_FAMINE_RELIEF } from './content/empire-assembly-events.mjs';

// Static checks for the 240 → 255 package (assemblies, legitimacy, land rights, grain pact; gate closed).
// Engine behavior (famine relief, faction reconciliation, replay): Tests/FateCoreTests/EmpireAssemblyTests.swift.
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const cards = read('Sources/FateCore/Content/cards.json');
const eras = read('Sources/FateCore/Content/eras.json');
const balance = read('Sources/FateCore/Content/balance.json');
const politics = read('Sources/FateCore/Content/politics.json');
const before = read('docs/analysis/milestone255-240-before/cards.json');
const beforeBalance = read('docs/analysis/milestone255-240-before/balance.json');
const beforePolitics = read('docs/analysis/milestone255-240-before/politics.json');
const byId = id => cards.find(c => c.id === id);
const fresh = cards.slice(240, 255);
const earlyFlags = new Set(cards.filter(c => c.era <= 3).flatMap(c => c.choices.flatMap(ch => ch.outcomes.flatMap(o => [...o.effect.flags, ...o.delayedEffects.flatMap(d => d.effect.flags)]))));
const results = c => c.choices.flatMap(ch => ch.outcomes.map(o => ({ c, ch, o })));
const RECURRING = ['representation_reform', 'land_tax_reform', 'grain_pact', 'public_safety_compact', 'legitimacy_oath', 'land_rights_survey', 'seasonal_migration', 'trade_treaty', 'terrace_upkeep'];
const matches = (r, s) => (r.stat ? s.stats[r.stat] >= (r.minimum ?? 0) && s.stats[r.stat] <= (r.maximum ?? 100) : true)
  && (r.flag ? s.flags.has(r.flag) : true) && (r.absentFlag ? !s.flags.has(r.absentFlag) : true);
const open = (list, s) => (list ?? []).every(r => matches(r, s));

test('fifteen new Era 4 events: nine recurring, three bridges, three conclusions; the 240 package is byte-identical', () => {
  assert.equal(cards.length, 270, 'the 255 → 270 package follows (tools/empire-strain-content.test.mjs)');
  assert.deepEqual(cards.slice(0, 240), before);
  assert.deepEqual(fresh.filter(c => c.eraRole === 'recurring').map(c => c.id), RECURRING);
  assert.deepEqual(fresh.filter(c => c.eraRole === 'bridge').map(c => c.id), ['provincial_levy_review', 'barge_silt_league', 'granary_roof_watch']);
  assert.deepEqual(fresh.filter(c => c.eraRole === 'conclusion').map(c => c.id), ['land_registry_record', 'water_court_canal', 'fuel_trade_clause']);
  for (const e of [1, 2, 3]) assert.equal(cards.filter(c => c.era === e).length, 60);
  assert.equal(cards.filter(c => c.era === 4).length, 90);
  assert.equal(cards.filter(c => c.era >= 5).length, 0);
  for (const c of fresh) for (const lang of ['tr', 'en']) for (const ch of c.choices) assert.ok(ch.text[lang].length > 10 && ch.outcomes.every(o => o.text[lang].length > 30), `${c.id}.${ch.id} ${lang}`);
});

test('bridges and conclusions continue real Bronze records and stay drawable with any single Bronze outcome', () => {
  const pairs = { provincial_levy_review: ['levy_hearing'], barge_silt_league: ['silt_charter'], granary_roof_watch: ['roof_beams'],
    land_registry_record: ['archive_dispute', 'land_rights_survey'], water_court_canal: ['water_court', 'canal_extension'], fuel_trade_clause: ['charcoal_embargo', 'trade_treaty'] };
  for (const [id, sources] of Object.entries(pairs)) {
    const c = byId(id);
    assert.deepEqual(c.requirements.map(r => r.completedCard), sources, id);
    assert.equal(byId(sources[0]).era, 3); assert.equal(byId(sources[0]).storyChainId, c.storyChainId);
    if (sources[1]) { assert.equal(byId(sources[1]).era, 4); assert.equal(byId(sources[1]).eraRole, 'recurring'); }
    const left = new Set(byId(sources[0]).choices.flatMap(ch => ch.outcomes.flatMap(o => o.effect.flags)).filter(f => !f.startsWith('resolved_')));
    for (const ch of c.choices) for (const r of ch.requirements.filter(r => r.flag)) assert.ok(left.has(r.flag), `${id}.${ch.id} reads ${r.flag}`);
    for (const flag of left) {
      const s = { stats: { resources: 50, population: 50, stability: 50, authority: 50, knowledge: 50, environment: 50 }, flags: new Set([flag]) };
      assert.ok(c.choices.filter(ch => open(ch.requirements, s)).length >= 2, `${id} with only ${flag}`);
    }
    assert.ok(c.exclusionConditions.some(x => x.flag === `resolved_${id}`), `${id} is one-shot`);
  }
});

test('famine relief and faction reconciliation are bounded Era 4 data; no other balance or political rule changed', () => {
  assert.deepEqual(balance.provincialFamineRelief, PROVINCIAL_FAMINE_RELIEF);
  assert.equal(PROVINCIAL_FAMINE_RELIEF.minimumEra, 4);
  assert.ok(PROVINCIAL_FAMINE_RELIEF.maximumShares <= balance.resourceConsumption);
  assert.ok(!earlyFlags.has(PROVINCIAL_FAMINE_RELIEF.flag), 'the relief needs an Era 4 store that costs reserves to fill');
  for (const { c, ch, o } of cards.flatMap(results).filter(({ o }) => o.effect.flags.includes(PROVINCIAL_FAMINE_RELIEF.flag)))
    assert.ok((o.effect.stats.resources ?? 0) < 0, `${c.id}.${ch.id} fills the store without paying`);
  const { provincialFamineRelief, eraMilestones, ...balanceRest } = balance;
  assert.deepEqual(balanceRest, beforeBalance);
  const rule = politics.institutionDefense;
  assert.ok(rule.reconciliationCeiling < politics.neutralRelation, 'reconciliation ends hostility but never buys loyalty');
  assert.ok(rule.reconciliationPerFlag >= 1 && rule.reconciliationPerFlag <= 2);
  const { reconciliationPerFlag, reconciliationCeiling, ...ruleRest } = rule;
  assert.deepEqual({ ...politics, institutionDefense: ruleRest }, beforePolitics);
  assert.equal(politics.powerStats['4'], undefined, 'Era 4 keeps the default faction power model (measured: era-3 mappings raised council pressure)');
});

test('every new recurring event offers two real choices at zero reserve and under stress, none riskless', () => {
  const base = () => ({ stats: { population: 22, resources: 0, authority: 8, knowledge: 50, stability: 8, environment: 15 }, flags: new Set() });
  const fixtures = [s => s,
    s => { for (const f of ['estate_fields_worked', 'grain_famine_store', 'provincial_assembly_seats', 'watch_guild_public', 'public_archive', 'provincial_residency_hearing']) s.flags.add(f); },
    s => { for (const f of ['regional_grain_loan', 'recorded_provincial_dissent', 'garrison_pay_arrears', 'debased_coinage']) s.flags.add(f); }];
  for (const c of fresh.filter(c => c.eraRole === 'recurring')) for (const edit of fixtures) {
    const s = base(); edit(s);
    if (!open(c.requirements, s)) continue;
    const free = c.choices.filter(ch => open(ch.requirements, s) && ch.outcomes.some(o => open(o.requirements, s)));
    assert.ok(free.length >= 2, `${c.id} locks: ${free.map(ch => ch.id)}`);
    for (const ch of free) for (const o of ch.outcomes) {
      const cost = [o.effect, ...o.delayedEffects.map(d => d.effect)].some(e => Object.values(e.stats).some(v => v < 0)) || (o.effect.removeFlags ?? []).length > 0;
      assert.ok(cost, `${c.id}.${ch.id} is riskless`);
    }
  }
});

test('stability and population never come free; paid investments return later and less', () => {
  for (const { c, ch, o } of fresh.flatMap(results)) {
    const st = o.effect.stats;
    if (((st.stability ?? 0) > 0 || (st.population ?? 0) > 0) && !((st.resources ?? 0) < 0)) {
      const price = ['authority', 'population', 'environment', 'knowledge', 'stability'].some(k => (st[k] ?? 0) < 0)
        || o.delayedEffects.some(d => Object.values(d.effect.stats).some(v => v < 0)) || (o.effect.removeFlags ?? []).length > 0;
      assert.ok(price, `${c.id}.${ch.id}.${o.id} hands out stability or population for nothing`);
    }
    const now = st.resources ?? 0, later = o.delayedEffects.reduce((s, d) => s + (d.effect.stats.resources ?? 0), 0);
    if (now < 0 && later > 0) assert.ok(later < -now, `${c.id}.${ch.id} returns ${later} for ${-now}`);
    const payment = -Math.min(0, now);
    if (payment > 0) assert.ok([...c.requirements, ...ch.requirements].some(r => r.stat === 'resources' && r.minimum >= payment), `${c.id}.${ch.id} pays without the reserve`);
  }
});

test('ledger: the pact loan has its own identity, old records only discount, nothing is erased', () => {
  for (const { c, ch, o } of fresh.flatMap(results)) {
    const r = [...c.requirements, ...ch.requirements, ...(o.requirements ?? [])];
    if (o.effect.flags.includes('regional_grain_loan')) {
      assert.ok(r.some(x => x.absentFlag === 'regional_grain_loan'), 'one pact loan at a time');
      const due = o.delayedEffects.find(d => d.effect.removeFlags?.includes('regional_grain_loan'));
      assert.ok(due && due.effect.stats.resources <= -(o.effect.stats.resources ?? 0), 'the loan repays what it lent');
    }
    for (const debt of ['garrison_pay_arrears', 'temple_grain_loan', 'provincial_tax_deferred', 'bread_bond_open', 'tribute_arrears']) assert.ok(!o.effect.flags.includes(debt), `${c.id}.${ch.id} opens ${debt}`);
    for (const removed of o.effect.removeFlags ?? []) assert.ok(!earlyFlags.has(removed), `${c.id}.${ch.id} erases ${removed}`);
    assert.ok(!(o.effect.removeFlags ?? []).includes('recorded_provincial_dissent'));
    if (r.some(x => x.flag && earlyFlags.has(x.flag))) {
      const net = (o.effect.stats.resources ?? 0) + o.delayedEffects.reduce((s, d) => s + (d.effect.stats.resources ?? 0), 0);
      assert.ok(net <= 0, `${c.id}.${ch.id}.${o.id} nets ${net} from an old record`);
    }
    for (const d of o.delayedEffects) assert.equal(d.minimumEra, 4);
  }
  // Neglected terraces can wash estate capacity away; capacity is not permanent.
  assert.ok(byId('terrace_upkeep').choices.find(ch => ch.id === 'defer').outcomes[0].delayedEffects.some(d => d.effect.removeFlags?.includes('estate_fields_worked')));
});

test('Era 4 stays closed at ninety cards; Era 5 stays closed; no balance evidence', () => {
  const gate = eras.find(e => e.id === 4).contentGate;
  assert.deepEqual([gate.enabled, gate.balanceEvidence], [false, null]);
  const result = validate(cards, eras);
  assert.deepEqual([result.errors, result.warnings], [[], []]);
  const inv = result.eraInventory[4];
  assert.deepEqual([inv.total, inv.recurring, inv.conclusions, inv.bridges, inv.satisfied, inv.open], [90, 55, 17, 17, true, false]);
  assert.equal(result.eraInventory[5].open, false);
  const forced = structuredClone(eras); forced[3].contentGate.enabled = true;
  assert.ok(validate(cards, forced).errors.some(e => e.includes('without recorded balance evidence')));
});
