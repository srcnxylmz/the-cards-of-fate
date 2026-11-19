// Actual natural inputs, not taxes or permit fees. Preserve IDs, effects and queued saves.
export const productionInputs=[['furnace_wood','expand',15],['roof_beams','timber',12],['smoke_shift','push',6],['roof_cistern','workshops',5]];
const effect=(stats={})=>({stats,flags:[],technologies:[],buildings:[],rivalRelation:0});
const pauses={
 furnace_wood:['Bu nöbet ocağı durdur; teslimatı ertele.','Stop the furnace for this watch and postpone delivery.','Odun kesilmedi, ürün çıkmadı. Ustalar kaybedilen sipariş için itiraz etti.','No wood was cut and no output left the furnace. Craftspeople disputed the lost order.',{environment:2,stability:-4,authority:-2},-3,'Ertelenen siparişin yeni taşıma payı istendi.','The deferred order required another hauling share.'],
 roof_beams:['İnşaatı beklet; bitmemiş depoyu kullanıma açma.','Suspend construction and keep the unfinished store closed.','Yeni kiriş kesilmedi. Meclis depo projesini kapattı; haneler ürünü kendi damlarında tuttu.','No new beams were cut. The council shelved the storehouse project; households kept produce under their own roofs.',{environment:1,stability:-3,authority:-3},-2,'Bekleyen ürünün yeniden taşıma payı ödendi.','Waiting produce required another hauling share.'],
 smoke_shift:['Ateşi söndür; bu siparişi zamanında teslim etme.','Extinguish the fire and miss this order’s deadline.','Duman azaldı ama işçilere yeni ürün payı dağıtılamadı. Sipariş sahibinin itirazı kaldı.','Smoke abated but workers received no new output share. The customer’s claim remained.',{environment:3,stability:-4,authority:-3},-4,'Durdurulan siparişin depolama payı istendi.','Storage for the stopped order required payment.'],
 roof_cistern:['Atölye suyu tahsisini durdur; üretim sırasını ertele.','Suspend the workshop allocation and defer its production turn.','Bu nöbet su üretime ayrılmadı. Atölyelerin geliri durdu; mahalle itirazları sürdü.','No water went to production this watch. Workshop income stopped and neighborhood objections remained.',{environment:2,stability:-3,authority:-2},-3,'Geciken işin yeni teslimat payı istendi.','The delayed work required a new delivery share.']
};
export function withProductionInputs(card) {
 const c=structuredClone(card);
 for(const[id,chID,amount]of productionInputs)if(c.id===id){const ch=c.choices.find(ch=>ch.id===chID);if(!ch)throw Error('Missing authored production choice '+id+'.'+chID);if(!ch.requirements.some(r=>r.stat==='environment'&&r.minimum>=amount))ch.requirements.push({stat:'environment',minimum:amount});
  if(!c.choices.some(ch=>ch.id==='suspend')){const[tr,en,resultTR,resultEN,stats,resources,delayTR,delayEN]=pauses[id];c.choices.push({id:'suspend',text:{tr,en},risk:{tr:'Sonucu öngörülebilir',en:'Predictable outcome'},requirements:[],immediateEffects:effect(),outcomes:[{id:'result',probability:1,affinity:null,text:{tr:resultTR,en:resultEN},effect:{...effect(stats),flags:id==="roof_beams"?["resolved_roof_beams"]:[],rivalRelations:{hunters:-4,keepers:3}},delayedEffects:[{afterTurns:4,minimumEra:3,text:{tr:delayTR,en:delayEN},effect:effect({resources})}],animationPreset:'normal'}]});}
 }
 return c;
}
