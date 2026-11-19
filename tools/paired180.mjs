import fs from'node:fs';import{isDeepStrictEqual}from'node:util';
const read=p=>JSON.parse(fs.readFileSync(p)),rows={};
for(const p of ['survival','survival-council']){
 const a=read('artifacts/milestone180-study/paired-base150-'+p+'/simulation-'+p+'.json'),b=read('artifacts/milestone180-study/paired-base165-'+p+'/simulation-'+p+'.json');
 if(a.seedObservations.length!==1000||b.seedObservations.length!==1000)throw Error('Incomplete paired cohort');
 for(const[v,r]of[['base150',a],['base165',b]]){const prior=read('artifacts/milestone180-study/'+v+'-'+p+'/simulation-'+p+'.json');for(const k of Object.keys(prior))if(!isDeepStrictEqual(prior[k],r[k]))throw Error('New observation changed old result '+v+'/'+p+':'+k);}
 const c={earlierDeath:0,laterDeath:0,sameTurns:0,bothCapped:0,lostCap:0,gainedCap:0,mechanismPairs:{}};
 for(let i=0;i<1000;i++){const x=a.seedObservations[i],y=b.seedObservations[i];if(x.seed!==i||y.seed!==i)throw Error('Seed ordering mismatch');if(x.capped&&y.capped)c.bothCapped++;else if(x.capped)c.lostCap++;else if(y.capped)c.gainedCap++;if(y.decisions<x.decisions)c.earlierDeath++;else if(y.decisions>x.decisions)c.laterDeath++;else c.sameTurns++;const key=x.mechanism+' → '+y.mechanism;c.mechanismPairs[key]=(c.mechanismPairs[key]??0)+1;}
 rows[p]={paired:c,mean:[a.averageTurns,b.averageTurns],caps:[a.cappedRuns,b.cappedRuns],politicalActions:[a.politicalActions,b.politicalActions],actualCouncilChanges:[a.managedCouncilChanges,b.managedCouncilChanges]};
}
fs.writeFileSync('docs/PAIRED_180_SCREENING.json',JSON.stringify({seeds:'0..<1000',cap:500,limits:['Earlier/later are observed durations, not true lifetimes when capped.','Both-capped durations remain censored; gained/lost caps are separate.','Per-seed selection paths differ after content changes; no additive causality.'],rows},null,2)+'\n');console.log(JSON.stringify(rows,null,2));
