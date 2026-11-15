import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const args=process.argv.slice(2);
const option=name=>args[args.indexOf(name)+1];
if(!['--before','--after','--output'].every(x=>args.includes(x)))throw Error('Use --before DIR --after DIR --output report.json');
const policies=['random','survival','knowledge','progression','recovery'];
const divide=(x,n)=>n?x/n:null;
function summarize(a){
 const eras={};
 for(const era of ['1','2','3']){
  const decisions=a.eraDecisionCounts[era]??0;
  const stats={};
  for(const stat of ['population','resources','authority','knowledge','stability','environment']){
   const net={};
   for(const stage of ['card','delayed','world','council','succession']){
    const key=era+'.'+stage+'.'+stat;
    net[stage]=divide((a.stageStatGains[key]??0)-(a.stageStatLosses[key]??0),decisions);
   }
   stats[stat]={mean:divide(a.eraStatSums[era+'.'+stat]??0,decisions),netPerDecision:net};
  }
  eras[era]={decisions,repeatRate:divide(a.eraRepeatCounts[era]??0,decisions),
   lateDecisions:a.lateEraDecisions[era]??0,lateRepeatRate:divide(a.lateEraRepeats[era]??0,a.lateEraDecisions[era]??0),stats};
 }
 const capRanges={};
 for(const stat of ['population','resources','authority','knowledge','stability','environment']){
  capRanges[stat]=Object.fromEntries(['minimum','maximum','final'].map(k=>[k,divide(a.cappedLast80StatRangeSums[stat+'.'+k]??0,a.cappedRuns)]));
 }
 return {eraReachCounts:a.eraReachCounts,averageTurns:a.averageTurns,repeatRate:a.repeatRate,cappedRuns:a.cappedRuns,capsByEra:a.capsByEra,
  turnQuantiles:a.turnQuantiles,runsReaching100:a.runsReaching100,endings:a.endings,eras,
  cappedLast80:{meanDistinctCards:divide(a.cappedLast80DistinctCardSum,a.cappedRuns),meanPendingConsequences:divide(a.cappedPendingConsequences,a.cappedRuns),meanStatRanges:capRanges,
   topChoices:Object.entries(a.cappedLast80ChoiceCounts).sort((x,y)=>y[1]-x[1]).slice(0,12)},
  historicalRepeatDecisions:Object.fromEntries(['council_seal','hostage_prince','salt_ship','flint_apprentice'].map(id=>[id,a.repeatDecisionsByCard[id]??0]))};
}
const report={seeds:'0..<10000',turnCap:500,capMeaning:'Alive and censored; not a successful ending',
 warning:'Global repetition is duration-dependent. Compare lifetimes, era/late rates and real historical closure; no causal claim from pooled repeat rate alone.',policies:{}};
for(const policy of policies){
 const load=dir=>{
  const a=JSON.parse(readFileSync(resolve(dir,'simulation-'+policy+'.json')));
  if(a.runs!==10000||a.seedRange!=='0..<10000'||a.turnCap!==500||a.policy!==policy||a.managesCouncil)throw Error('Mismatched comparison cohort: '+dir+' '+policy);
  return a;
 };
 report.policies[policy]={before:summarize(load(option('--before'))),after:summarize(load(option('--after')))};
}
writeFileSync(option('--output'),JSON.stringify(report,null,2)+'\n');
console.log('Wrote duration-aware before/after diagnostics for five policies.');
