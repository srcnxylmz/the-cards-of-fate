import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const root=resolve(import.meta.dirname,'..');
const stats=new Set(['population','resources','authority','knowledge','stability','environment']);
const animations=new Set(['normal','success','failure','critical','disaster','secret','leadership','exile','technology','settlement','era','death','fate','diplomacy','war']);
export function validate(cards, eras) {
  const errors=[], warnings=[];
  const assert=(ok,message)=>{if(!ok) errors.push(message);};
  const localized=(value,label)=>assert(value && typeof value.tr==='string' && value.tr.trim().length>0 && typeof value.en==='string' && value.en.trim().length>0,`${label}: missing translation`);
  const flags=new Map(), chains=new Map(), ids=new Set(), titles=new Set(), descriptions=new Set();
  let crossEraLinks=0, stochasticChoices=0, conditionalOutcomeChoices=0, choicesCount=0;
  const effects=cards.flatMap(c=>(c.choices??[]).flatMap(ch=>[ch.immediateEffects,...(ch.outcomes??[]).map(o=>o.effect)])).filter(Boolean);
  const technologies=new Set(effects.flatMap(e=>e.technologies??[]));
  const buildings=new Set(effects.flatMap(e=>e.buildings??[]));
  const eraIDs=new Set(eras.map(e=>e.id));
  assert(eras.length===12 && eraIDs.size===12 && eras.every(e=>Number.isInteger(e.id)&&e.id>=1&&e.id<=12),'Must define all twelve eras exactly once');
  for(const era of eras) {
    localized(era.name,`era ${era.id}`);
    for(const field of ['knowledgeThreshold','stabilityThreshold','populationThreshold']) assert(Number.isInteger(era[field]) && era[field]>=0 && era[field]<=100,`era ${era.id}: invalid ${field}`);
  }
  function conditions(list,label) {
    assert(Array.isArray(list),`${label}: conditions must be array`);
    if(!Array.isArray(list)) return;
    for(const condition of list) {
      assert(Object.keys(condition).every(k=>['stat','minimum','maximum','flag','absentFlag','faction','relationMinimum','relationMaximum','leadership','technology','building','lastDecision','notLastDecision','completedCard'].includes(k)),`${label}: unknown condition key`);
      assert(condition.stat||condition.flag||condition.absentFlag||condition.faction||condition.leadership||condition.technology||condition.building||condition.lastDecision||condition.notLastDecision||condition.completedCard,`${label}: empty condition`);
      if(condition.completedCard!==undefined) assert(cards.some(c=>c.id===condition.completedCard),`${label}: unknown completed card`);
      for(const field of ['lastDecision','notLastDecision']) if(condition[field]!==undefined) {
        const [id,choice,...extra]=String(condition[field]).split('.');
        const source=cards.find(c=>c.id===id);
        assert(extra.length===0&&source?.choices?.some(c=>c.id===choice),`${label}: unknown decision reference`);
      }
      assert(!condition.lastDecision||condition.lastDecision!==condition.notLastDecision,`${label}: contradictory decision reference`);
      if(condition.technology!==undefined) assert(technologies.has(condition.technology),`${label}: unknown technology condition`);
      if(condition.building!==undefined) assert(buildings.has(condition.building),`${label}: unknown building condition`);
      if(condition.faction!==undefined) assert(['hunters','keepers'].includes(condition.faction),`${label}: unknown faction`);
      if(condition.leadership!==undefined) assert(['contender','ruler','exile'].includes(condition.leadership),`${label}: unknown leadership`);
      for(const bound of ['relationMinimum','relationMaximum']) if(condition[bound]!==undefined) {
        assert(['hunters','keepers'].includes(condition.faction),`${label}: relation bounds without faction`);
        assert(Number.isInteger(condition[bound])&&condition[bound]>=-100&&condition[bound]<=100,`${label}: invalid relation bound`);
      }
      assert((condition.relationMinimum??-100)<=(condition.relationMaximum??100),`${label}: impossible relation range`);
      if(condition.stat) assert(stats.has(condition.stat),`${label}: unknown stat`);
      if(condition.minimum!==undefined||condition.maximum!==undefined) assert(stats.has(condition.stat),`${label}: bounds without stat`);
      for(const bound of ['minimum','maximum']) if(condition[bound]!==undefined) assert(Number.isInteger(condition[bound])&&condition[bound]>=0&&condition[bound]<=100,`${label}: invalid bound`);
      assert((condition.minimum??0)<=(condition.maximum??100),`${label}: impossible range`);
      assert(!condition.flag||condition.flag!==condition.absentFlag,`${label}: contradictory flag`);
    }
    for(const stat of stats) {
      const relevant=list.filter(c=>c.stat===stat);
      assert(Math.max(0,...relevant.map(c=>c.minimum??0))<=Math.min(100,...relevant.map(c=>c.maximum??100)),`${label}: mutually impossible bounds`);
    }
    for(const faction of ['hunters','keepers']) {
      const relevant=list.filter(c=>c.faction===faction);
      assert(Math.max(-100,...relevant.map(c=>c.relationMinimum??-100))<=Math.min(100,...relevant.map(c=>c.relationMaximum??100)),`${label}: contradictory faction bounds`);
    }
    assert(new Set(list.map(c=>c.leadership).filter(Boolean)).size<=1,`${label}: contradictory leadership`);
    const present=new Set(list.map(c=>c.flag).filter(Boolean));
    assert(!list.some(c=>present.has(c.absentFlag)),`${label}: mutually contradictory flags`);
  }
  function effect(value,label,era) {
    assert(value && typeof value.stats==='object',`${label}: missing effect`);
    if(!value?.stats) return;
    for(const [stat,delta] of Object.entries(value.stats)) assert(stats.has(stat)&&Number.isInteger(delta)&&Math.abs(delta)<=100,`${label}: invalid stat effect ${stat}`);
    for(const field of ['flags','technologies','buildings']) assert(Array.isArray(value[field])&&value[field].every(v=>typeof v==='string'&&v.length>0),`${label}: invalid ${field}`);
    assert(Number.isInteger(value.rivalRelation)&&Math.abs(value.rivalRelation)<=100,`${label}: invalid rival relation`);
    if(value.removeFlags!==undefined) assert(Array.isArray(value.removeFlags)&&value.removeFlags.every(f=>typeof f==='string'&&f.length>0),`${label}: invalid removed flags`);
    if(value.rivalRelations !== undefined) {
      const valid = value.rivalRelations && typeof value.rivalRelations === 'object' && !Array.isArray(value.rivalRelations);
      assert(valid,`${label}: invalid targeted relations`);
      if(valid) for(const [id,delta] of Object.entries(value.rivalRelations))
        assert(['hunters','keepers'].includes(id)&&Number.isInteger(delta)&&Math.abs(delta)<=100,`${label}: invalid targeted relation ${id}`);
    }
    for(const flag of value.flags??[]) flags.set(flag,Math.min(flags.get(flag)??99,era));
  }
  for(const card of cards) {
    const label=card.id??'<missing id>';
    assert(typeof card.id==='string' && /^[a-z][a-z0-9_]+$/.test(card.id),`${label}: invalid ID`);
    assert(!ids.has(card.id),`${label}: duplicate ID`); ids.add(card.id);
    localized(card.title,label+' title'); localized(card.description,label+' description');
    assert(!titles.has(card.title?.tr),`${label}: duplicate title`); titles.add(card.title?.tr);
    assert(!descriptions.has(card.description?.tr),`${label}: duplicate description`); descriptions.add(card.description?.tr);
    assert(eraIDs.has(card.era),`${label}: invalid era`);
    for(const field of ['category','artAsset','artDirection','rarity','soundCue']) assert(typeof card[field]==='string'&&card[field].trim().length>0,`${label}: missing ${field}`);
    assert(animations.has(card.animationPreset),`${label}: unknown animation`);
    assert(Number.isInteger(card.weight)&&card.weight>0,`${label}: invalid weight`);
    assert(Number.isInteger(card.cooldown)&&card.cooldown>=1,`${label}: invalid cooldown`);
    conditions(card.requirements,label); conditions(card.exclusionConditions,label);
    assert(Array.isArray(card.choices)&&card.choices.length>=2&&card.choices.length<=4,`${label}: expected 2–4 choices`);
    const choiceIDs=new Set(), effects=new Set();
    for(const choice of card.choices??[]) {
      choicesCount++;
      assert(typeof choice.id==='string'&&!choiceIDs.has(choice.id),`${label}: duplicate/missing choice ID`); choiceIDs.add(choice.id);
      localized(choice.text,label+' choice'); localized(choice.risk,label+' risk');
      conditions(choice.requirements,label+' choice');
      conditions([...(card.requirements??[]),...(choice.requirements??[])],label+' combined requirements');
      effect(choice.immediateEffects,label,card.era);
      assert(Array.isArray(choice.outcomes)&&choice.outcomes.length>0,`${label}: no outcomes`);
      if(choice.outcomes?.length>1) { if(choice.outcomes.every(o=>o.requirements?.length)) conditionalOutcomeChoices++; else stochasticChoices++; }
      assert(Math.abs((choice.outcomes??[]).reduce((s,o)=>s+o.probability,0)-1)<1e-9,`${label}: probabilities must total one`);
      const outcomeIDs=new Set();
      for(const outcome of choice.outcomes??[]) {
        assert(typeof outcome.id==='string'&&!outcomeIDs.has(outcome.id),`${label}: duplicate/missing outcome ID`); outcomeIDs.add(outcome.id);
        assert(Number.isFinite(outcome.probability)&&outcome.probability>0&&outcome.probability<=1,`${label}: invalid probability`);
        assert(outcome.affinity==null||stats.has(outcome.affinity),`${label}: unknown affinity`);
        if(outcome.requirements!==undefined) conditions([...(card.requirements??[]),...(choice.requirements??[]),...outcome.requirements],label+': context outcome');
        localized(outcome.text,label+' outcome'); effect(outcome.effect,label,card.era);
        assert(animations.has(outcome.animationPreset),`${label}: unknown outcome animation`);
        assert(Array.isArray(outcome.delayedEffects),`${label}: missing delayedEffects`);
        for(const delayed of outcome.delayedEffects??[]) {
          assert(Number.isInteger(delayed.afterTurns)&&delayed.afterTurns>=1,`${label}: invalid delay`);
          assert(eraIDs.has(delayed.minimumEra)&&delayed.minimumEra>=card.era,`${label}: invalid delayed era`);
          localized(delayed.text,label+' delayed'); effect(delayed.effect,label,delayed.minimumEra);
          if(delayed.minimumEra>card.era) crossEraLinks++;
        }
      }
      const signature=JSON.stringify([choice.immediateEffects,choice.outcomes?.map(o=>[o.probability,o.affinity,o.effect,o.delayedEffects])]);
      assert(!effects.has(signature),`${label}: strategically identical choices`); effects.add(signature);
    }
    const declaredFlags=new Set(card.worldFlags??[]);
    const actualFlags=new Set((card.choices??[]).flatMap(c=>[...(c.immediateEffects?.flags??[]),...(c.outcomes??[]).flatMap(o=>o.effect?.flags??[])]));
    assert(declaredFlags.size===actualFlags.size&&[...actualFlags].every(f=>declaredFlags.has(f)),label+': stale worldFlags');
    if(card.storyChainId) chains.set(card.storyChainId,[...(chains.get(card.storyChainId)??[]),card.id]);
  }
  for(const card of cards) for(const condition of [...(card.requirements??[]),...(card.choices??[]).flatMap(c=>[...(c.requirements??[]),...(c.outcomes??[]).flatMap(o=>o.requirements??[])])]) {
    if(condition.completedCard) {
      const source=cards.find(c=>c.id===condition.completedCard);
      if(source) assert(source.era<=card.era,`${card.id}: history only completed in future era`);
    }
    if(condition.flag) {
      assert(flags.has(condition.flag),`${card.id}: unproduced required flag ${condition.flag}`);
      assert((flags.get(condition.flag)??99)<=card.era,`${card.id}: required flag only produced in future era`);
      if(flags.has(condition.flag)&&flags.get(condition.flag)<card.era) crossEraLinks++;
    }
  }
  for(const [id,members] of chains) if(members.length<2) warnings.push(`Chain ${id} has only ${members.length} authored card(s); incomplete.`);
  // Reachability approximation: condition producers are checked, temporal cycles and strategic viability still require Swift simulation/editorial review.
  const tokens=s=>new Set(s.toLocaleLowerCase('tr').replace(/[^\p{L}\p{N}\s]/gu,'').split(/\s+/));
  for(let i=0;i<cards.length;i++) for(let j=i+1;j<cards.length;j++) {
    const a=tokens(cards[i].description?.tr??''),b=tokens(cards[j].description?.tr??'');
    const overlap=[...a].filter(t=>b.has(t)).length / new Set([...a,...b]).size;
    if(overlap>0.55) warnings.push(`Editorial similarity: ${cards[i].id}, ${cards[j].id} (${overlap.toFixed(2)})`);
  }
  // Era content gates: authored cards never open an era by themselves.
  // 'reform' events are counted in the era total only (never as recurring, conclusion or bridge).
  const roles=new Set(['recurring','conclusion','bridge','reform']);
  for(const card of cards) if(card.eraRole!==undefined) {
    assert(roles.has(card.eraRole),`${card.id}: unknown eraRole`);
    if(card.eraRole==='recurring') assert(!(card.exclusionConditions??[]).some(c=>c.flag===`resolved_${card.id}`),`${card.id}: recurring event closes itself`);
    if(card.eraRole==='conclusion') assert(!!card.storyChainId,`${card.id}: conclusion without story chain`);
    if(card.eraRole==='bridge') assert((card.requirements??[]).length>0,`${card.id}: bridge without historical requirement`);
    if(card.eraRole==='reform') {
      const granted=(card.choices??[]).flatMap(c=>(c.outcomes??[]).flatMap(o=>o.effect?.technologies??[]));
      assert(granted.length>0,`${card.id}: reform grants no technology`);
      assert(granted.every(t=>(card.exclusionConditions??[]).some(c=>c.technology===t)),`${card.id}: reform stays drawable after its technology is granted`);
      assert((card.requirements??[]).some(c=>c.flag||c.technology||c.completedCard),`${card.id}: reform without historical condition`);
    }
  }
  const eraInventory={};
  for(const era of eras) {
    const gate=era.contentGate;
    if(gate===undefined) continue;
    assert(typeof gate.enabled==='boolean',`era ${era.id}: gate enabled must be boolean`);
    for(const field of ['minimumCards','minimumRecurring','minimumConclusions','minimumBridges']) assert(Number.isInteger(gate[field])&&gate[field]>=1,`era ${era.id}: invalid gate ${field}`);
    assert(Array.isArray(gate.requiredRecurringCategories)&&gate.requiredRecurringCategories.every(c=>typeof c==='string'&&c.length>0),`era ${era.id}: invalid gate categories`);
    const inv=inventory(cards,era.id);
    const missing=(gate.requiredRecurringCategories??[]).filter(c=>!inv.recurringCategories.includes(c));
    const satisfied=inv.total>=gate.minimumCards&&inv.recurring>=gate.minimumRecurring&&inv.conclusions>=gate.minimumConclusions&&inv.bridges>=gate.minimumBridges&&missing.length===0;
    eraInventory[era.id]={...inv,missingCategories:missing,enabled:gate.enabled,satisfied,open:gate.enabled&&satisfied};
    assert(!gate.enabled||satisfied,`era ${era.id}: gate enabled before inventory minimums are met`);
  }
  for(const card of cards) if(card.era>1) {
    const gate=eras.find(e=>e.id===card.era)?.contentGate;
    if(gate) assert(card.eraRole!==undefined,`${card.id}: gated-era event needs eraRole`);
  }
  return {errors,warnings,cards:cards.length,eraInventory,choices:choicesCount,stochasticChoices,conditionalOutcomeChoices,eras:Object.fromEntries(eras.map(e=>[e.id,cards.filter(c=>c.era===e.id).length])),authoredChainGroups:chains.size,multiCardChainGroups:[...chains.values()].filter(v=>v.length>=2).length,crossEraLinks};
}

export function inventory(cards,era) {
  const inv={total:0,recurring:0,conclusions:0,bridges:0,recurringCategories:[]};
  for(const card of cards.filter(c=>c.era===era)) {
    inv.total++;
    if(card.eraRole==='recurring'&&!(card.exclusionConditions??[]).some(c=>c.flag===`resolved_${card.id}`)) { inv.recurring++; if(!inv.recurringCategories.includes(card.category)) inv.recurringCategories.push(card.category); }
    else if(card.eraRole==='conclusion'&&card.storyChainId) inv.conclusions++;
    else if(card.eraRole==='bridge'&&(card.requirements??[]).length) inv.bridges++;
  }
  inv.recurringCategories.sort();
  return inv;
}

export function report() {
  const read=name=>JSON.parse(readFileSync(resolve(root,name),'utf8'));
  const result=validate(read('Sources/FateCore/Content/cards.json'),read('Sources/FateCore/Content/eras.json'));
  const art=read('assets/art_manifest.json'),audio=read('assets/audio_manifest.json');
  result.missingArt=art.filter(a=>!a.file||!existsSync(resolve(root,a.file))).map(a=>a.id);
  result.missingAudio=[...audio.effects,...audio.music,...audio.ambience].filter(a=>!a.file||!existsSync(resolve(root,a.file))).map(a=>a.id);
  result.releaseReady=false;
  result.releaseBlockers=['800 original cards required; current '+result.cards,'Era 4 content gate closed (enabled:false; 40/24/8/8 inventory not met)','At least 60 cards per era and 80 special events required','100 completed chains / 50 cross-era links required','30 distinct endings required','Full asset, localization, accessibility, device and Game Center QA pending','Physical-device and release/signing evidence pending; simulator build and TR/EN smoke flows verified separately'];
  const destination=resolve(root,'docs/content-report.json');mkdirSync(dirname(destination),{recursive:true});writeFileSync(destination,JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
  return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const result=report();
  if(result.errors.length || process.argv.includes('--release')&&!result.releaseReady) process.exitCode=1;
}
