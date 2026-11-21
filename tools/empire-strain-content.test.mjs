import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validate } from './validate-content.mjs';
import { LATE_CRISES, CRISIS_COOLDOWN, MILESTONE_RIGHTS, MILESTONE_OBLIGATIONS, enduringEmpireMilestone } from './content/empire-strain-events.mjs';

// Static checks for the 255 → 270 package (late-game strains, the recorded Era 4 milestone; gate closed).
// Engine behavior (milestone conditions, record-once, crises, replay): Tests/FateCoreTests/EmpireStrainTests.swift.
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const cards = read('Sources/FateCore/Content/cards.json');
const eras = read('Sources/FateCore/Content/eras.json');
const balance = read('Sources/FateCore/Content/balance.json');
const politics = read('Sources/FateCore/Content/politics.json');
const before = read('docs/analysis/milestone270-255-before/cards.json');
const beforeBalance = read('docs/analysis/milestone270-255-before/balance.json');
const beforePolitics = read('docs/analysis/milestone270-255-before/politics.json');
const byId = id => cards.find(c => c.id === id);
const fresh = cards.slice(255);
const effects = c => c.choices.flatMap(ch => ch.outcomes.flatMap(o => [o.effect, ...o.delayedEffects.map(d => d.effect)]));
const matches = (r, s) => (r.stat ? s.stats[r.stat] >= (r.minimum ?? 0) && s.stats[r.stat] <= (r.maximum ?? 100) : true)
  && (r.flag ? s.flags.has(r.flag) : true) && (r.absentFlag ? !s.flags.has(r.absentFlag) : true);
const open = (list, s) => (list ?? []).every(r => matches(r, s));

test('fifteen new Era 4 events: nine late-game crises, three bridges, three conclusions; the 255 package is byte-identical', () => {
  assert.equal(cards.length, 270);
  assert.deepEqual(cards.slice(0, 255), before);
  assert.deepEqual(fresh.filter(c => c.eraRole === 'recurring').map(c => c.id), LATE_CRISES);
  assert.deepEqual(fresh.filter(c => c.eraRole === 'bridge').map(c => c.id), ['frontier_wall_muster', 'hostage_envoy_return', 'seed_guarantee_audit']);
  assert.deepEqual(fresh.filter(c => c.eraRole === 'conclusion').map(c => c.id), ['assembly_center_accord', 'veteran_land_charter', 'plague_relief_reckoning']);
  for (const e of [1, 2, 3]) assert.equal(cards.filter(c => c.era === e).length, 60);
  assert.equal(cards.filter(c => c.era === 4).length, 90);
  assert.equal(cards.filter(c => c.era >= 5).length, 0);
  assert.equal(cards.flatMap(c => c.choices).length, 715 + fresh.flatMap(c => c.choices).length);
  for (const c of fresh) for (const lang of ['tr', 'en']) for (const ch of c.choices) assert.ok(ch.text[lang].length > 10 && ch.outcomes.every(o => o.text[lang].length > 30), `${c.id}.${ch.id} ${lang}`);
});

test('every crisis has a visible cause, a cheaper prepared answer and a real cost on every choice; it returns at most every twelve turns', () => {
  const earlier = new Set(before.flatMap(c => c.worldFlags));
  for (const id of LATE_CRISES) {
    const c = byId(id);
    assert.ok(c.requirements.length >= 1, `${id} needs a cause in the province's own state`);
    assert.equal(c.cooldown, CRISIS_COOLDOWN);
    assert.ok(c.choices.some(ch => ch.requirements.some(r => r.flag && earlier.has(r.flag))), `${id} rewards an earlier preparation`);
    for (const ch of c.choices) {
      const costs = ch.outcomes.every(o => Object.values(o.effect.stats).some(v => v < 0)
        || o.delayedEffects.some(d => Object.values(d.effect.stats).some(v => v < 0) || (d.effect.removeFlags ?? []).length)
        || (o.effect.removeFlags ?? []).length);
      assert.ok(costs, `${id}.${ch.id} has a real cost`);
    }
    // Without its cause the crisis cannot be drawn.
    const calm = { stats: { resources: 0, population: 20, stability: 20, authority: 60, knowledge: 40, environment: 50 }, flags: new Set() };
    assert.ok(!open(c.requirements, calm), `${id} is drawable without a cause`);
  }
});

test('bridges and conclusions continue real Bronze records and stay drawable with any single Bronze outcome', () => {
  const pairs = { frontier_wall_muster: ['city_walls'], hostage_envoy_return: ['hostage_prince'], seed_guarantee_audit: ['famine_receipts'],
    assembly_center_accord: ['gate_ward', 'provincial_secession'], veteran_land_charter: ['debt_insurance', 'border_campaign'], plague_relief_reckoning: ['ration_council', 'empire_epidemic'] };
  for (const [id, sources] of Object.entries(pairs)) {
    const c = byId(id);
    assert.deepEqual(c.requirements.map(r => r.completedCard), sources, id);
    assert.equal(byId(sources[0]).era, 3);
    if (sources[1]) { assert.ok(LATE_CRISES.includes(sources[1])); assert.ok(c.storyChainId, `${id} belongs to a chain`); }
    const left = new Set(byId(sources[0]).choices.flatMap(ch => ch.outcomes.flatMap(o => o.effect.flags)).filter(f => !f.startsWith('resolved_')));
    for (const ch of c.choices) for (const r of ch.requirements.filter(r => r.flag)) assert.ok(left.has(r.flag), `${id}.${ch.id} reads ${r.flag}`);
    for (const flag of left) {
      const s = { stats: { resources: 50, population: 50, stability: 50, authority: 50, knowledge: 50, environment: 50 }, flags: new Set([flag]) };
      assert.ok(c.choices.filter(ch => open(ch.requirements, s)).length >= 2, `${id} with only ${flag}`);
    }
    assert.ok(c.exclusionConditions.some(x => x.flag === `resolved_${id}`), `${id} is one-shot`);
  }
});

test('the Era 4 milestone is a recorded turning point with several independent conditions; nothing else in balance or politics changed', () => {
  const conclusions = cards.filter(c => c.era === 4 && c.eraRole === 'conclusion').map(c => c.id);
  assert.deepEqual(balance.eraMilestones, [enduringEmpireMilestone(conclusions)]);
  const [m] = balance.eraMilestones;
  assert.equal(m.era, 4);
  assert.equal(conclusions.length, 17);
  assert.ok(m.minimumEraDecisions >= 100 && m.minimumRights >= 2 && m.minimumInstitutions >= 2, 'not a single statistic');
  assert.ok(m.minimumAuthority > 0 && m.institutionFlags.length >= m.minimumInstitutions, 'two paths to legitimacy');
  for (const flag of [...m.rightsFlags, ...m.obligationFlags]) assert.ok(cards.some(c => c.worldFlags.includes(flag)), `${flag} can be gained in play`);
  assert.deepEqual(m.rightsFlags, MILESTONE_RIGHTS);
  assert.deepEqual(m.obligationFlags, MILESTONE_OBLIGATIONS);
  assert.ok(!cards.some(c => c.worldFlags.includes(m.flag)), 'only the engine records the milestone');
  assert.ok(!('ending' in m), 'the milestone never ends the run');
  // Every new debt falls due once and closes.
  for (const flag of ['tax_farm_contract', 'veteran_debts', 'plague_relief_credit']) {
    const setters = fresh.flatMap(c => c.choices.flatMap(ch => ch.outcomes.filter(o => o.effect.flags.includes(flag))));
    assert.ok(setters.length >= 1);
    for (const o of setters) assert.ok(o.delayedEffects.some(d => (d.effect.removeFlags ?? []).includes(flag) && (d.effect.stats.resources ?? 0) < 0), `${flag} falls due`);
  }
  const { eraMilestones, ...balanceRest } = balance;
  assert.deepEqual(balanceRest, beforeBalance);
  assert.deepEqual(politics, beforePolitics);
});

test('Era 4 stays closed at ninety cards; Era 5 stays closed; no balance evidence', () => {
  const gate = eras.find(e => e.id === 4).contentGate;
  assert.deepEqual([gate.enabled, gate.balanceEvidence], [false, null]);
  const result = validate(cards, eras);
  assert.deepEqual([result.errors, result.warnings], [[], []]);
  const inv = result.eraInventory[4];
  assert.deepEqual([inv.total, inv.recurring, inv.conclusions, inv.bridges, inv.satisfied, inv.open], [90, 55, 17, 17, true, false]);
  for (const era of eras.filter(e => e.id >= 5)) assert.equal(era.contentGate.enabled, false);
});
