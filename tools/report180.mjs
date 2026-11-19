import fs from 'node:fs';

const read = path => JSON.parse(fs.readFileSync(path));
const reference = 'docs/analysis/milestone180-165-observed';
const final = 'docs/analysis/milestone180-verified';
const old = new Set(read(reference+'/cards.json').map(card => card.id));
const newChoices = read(final+'/cards.json').filter(card => !old.has(card.id))
  .flatMap(card => card.choices.map(choice => card.id+'.'+choice.id));
const policies = ['random','survival','knowledge','progression','recovery','survival-council'];
const fmt = n => Number.isFinite(n) ? n.toFixed(2) : '—';
const crisis = (r, key) => r.crisisDiagnostics[key] ?? 0;
const dev = (r, key) => r.developmentDiagnostics[key] ?? 0;
const policyRows = {};
for (const policy of policies) {
  const before = read(reference+'/simulation-'+policy+'.json');
  const after = read(final+'/simulation-'+policy+'.json');
  for (const [report, count] of [[before,165],[after,180]]) {
    if (report.runs!==10000 || report.contentCardCount!==count ||
        report.seedRange!=='0..<10000' || report.turnCap!==500) throw Error('Wrong cohort '+policy);
  }
  const uncovered = newChoices.filter(id => !after.decisionCounts[id]);
  policyRows[policy] = {before, after, uncovered};
}

let report = '# 180 kart denge karşılaştırması\n\n';
report += 'Her hücre 165 → 180 kartı gösterir. Her politika aynı 10.000 seed ve 500 karar sınırını kullanır. Yaşayan sınır, gözlemin kesildiği noktadır.\n\n';
report += '| Politika | Ortalama karar | Neolitik / Tunç | Tunç açlık kaybı / 100 karar | Tunç çevre ortalaması | Tüm oyun tekrar % | Yaşayan sınır |\n|---|---:|---:|---:|---:|---:|---:|\n';
for (const [policy, {before,after}] of Object.entries(policyRows)) {
  const pair = fn => [before,after].map(fn).join(' → ');
  report += '| '+policy+' | '+[
    pair(r=>fmt(r.averageTurns)),
    pair(r=>(r.eraReachCounts[2]??0)+' / '+(r.eraReachCounts[3]??0)),
    pair(r=>fmt(100*crisis(r,'3.starvationPopulationLoss')/r.eraDecisionCounts[3])),
    pair(r=>fmt(r.eraStatSums['3.environment']/r.eraDecisionCounts[3])),
    pair(r=>fmt(100*r.repeatRate)), pair(r=>r.cappedRuns)
  ].join(' | ')+' |\n';
}
report += '\n## Tunç Çağı karar pencereleri\n\n| Politika / pencere | Gözlem tamamlayan oyun | Tekrar % | Farklı kart | Farklı kart / karar |\n|---|---:|---:|---:|---:|\n';
for (const [policy,{before,after}] of Object.entries(policyRows)) for (const n of [20,40,80,100]) {
  const key = n===100?'bronze.after100':'bronze.first'+n;
  const runs = r=>crisis(r,key+(n===100?'.runs':'.reachedWindow'));
  const prefix = key+(n===100?'':'.complete');
  const pair = fn => [before,after].map(fn).join(' → ');
  report += '| '+policy+' / '+(n===100?'100 sonrası':n)+' | '+[
    pair(r=>runs(r)), pair(r=>fmt(100*crisis(r,prefix+'.repeats')/crisis(r,prefix+'.decisions'))),
    pair(r=>fmt(crisis(r,prefix+'.distinctCardSum')/runs(r))),
    pair(r=>fmt(crisis(r,prefix+'.distinctChoiceSum')/runs(r)))
  ].join(' | ')+' |\n';
}
report += '\nTam ilk pencereler o kadar Tunç turu tamamlayan oyunlardan oluşur. Aşağıdaki fiili kayıplar o pencereye giren tüm kararları içerir. Çevre giderinde kırpılan kısım sayılmaz.\n\n';
report += '| Random Tunç penceresi | Fiili çevre kaybı / 100 karar | Gecikmiş çevre kaybı / 100 karar | Çevre kazanımı / 100 karar |\n|---|---:|---:|---:|\n';
for(const n of [20,40,80]) {
 const {before,after}=policyRows.random;
 const rate = (r, pattern) => fmt(100*Object.entries(r.developmentDiagnostics).filter(([k])=>k.startsWith('bronze.actual.first'+n+'.')&&pattern.test(k)).reduce((sum,[,v])=>sum+v,0)/dev(r,'bronze.prefix'+n+'.decisions'));
 report += '| '+n+' | '+[/environment\.loss$/, /\.delayed\..*environment\.loss$/, /environment\.gain$/].map(pattern=>[before,after].map(r=>rate(r,pattern)).join(' → ')).join(' | ')+' |\n';
}
report += '\n## Doğal zincir kapanışı ve karar kapsamı\n\n| Politika | Yeni kararlar | Yol zinciri ortak / özel | 100 sonrası farklı sonuç anahtarı (toplam) |\n|---|---:|---:|---:|\n';
for(const [p,{before,after,uncovered}] of Object.entries(policyRows)) {
  const outcomes = r=>Object.keys(r.crisisDiagnostics).filter(key=>key.startsWith('bronze.after100.outcome.')).length;
  report += '| '+p+' | '+(newChoices.length-uncovered.length)+' / '+newChoices.length+' | '+crisis(after,'completedChains.ridge.shared')+' / '+crisis(after,'completedChains.ridge.private')+' | '+outcomes(before)+' → '+outcomes(after)+' |\n';
}
report += '\nSonuç anahtarları kart, seçim ve gerçekleşen sonuç kimliğini içerir. Bu sütun tüm kohortun birleşimidir. Oyun başına çeşitlilik üst tablodadır. Tam karar dağılımları, kaynak ve çevre giderleri, gerçek ölüm aşamaları ve eski zincirler ham JSON raporlarında yer alır.\n';
fs.writeFileSync('docs/MILESTONE_180_ANALYSIS.md',report);
