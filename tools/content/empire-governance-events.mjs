// Phase 3 fourth package (225 → 240): Ancient Empires governance, demography and bounded accumulation.
// Era 4 stays closed (ERA4_GATE.enabled:false, balanceEvidence:null). Nine recurring governance and
// recovery events, three Bronze bridges and three conditional conclusions bring Era 4 to 60 cards:
// 37 recurring, 11 conclusions, 11 bridges and 1 legal reform.
//
// Engine rules read from balance.json (Era 4 only; ignored by older content):
//   provincialStorage  surplus capacity above ordinary consumption is stored, at most 1 per turn, only
//                      with a weighed register or a sealed famine store, never past a reserve of 40
//   provincialGrowth   every 4th turn, a province that fed itself from its own production, paid all its
//                      outlays and keeps stability ≥ 25 regains one household, never past population 60
//
// Controlled rebalance of earlier Era 4 decisions (EMPIRE_REBALANCE). The 225 measurement showed that a few
// cheap decisions removed most card-driven population. IDs, flags, debts and requirements are unchanged;
// each loss now shows up partly as lost production, land or future revenue instead of only lost people.
// Ledger additions (schema-v1 flags only):
//   provincial_tax_deferred   one open deferral; it falls due (−5) six turns later and cannot stack
//   garrison_civil_oversight  the garrison answers to civil magistrates
//   provincial_assembly_seats local councillors share the governor's authority
export const PROVINCIAL_STORAGE = { minimumEra:4, flags:['granary_register_kept','grain_famine_store'], maximumPerTurn:1, reserveCeiling:40 };
export const PROVINCIAL_GROWTH = { minimumEra:4, interval:4, minimumStability:25, populationCeiling:60 };

// card.choice.outcome → measured reason, new stats, optional delayed consequence and new text.
export const EMPIRE_REBALANCE = [
  { card:'quarry_collapse', choice:'push', outcome:'result', reason:'5.4 population per 100 knowledge decisions; the cost moves into damaged output',
    stats:{resources:3,population:-1,stability:-5,environment:-1},
    text:['Taş zamanında çıktı. Ertesi sabah işçiler yarım ekiple geldi; aceleyle kesilen yüz çatladı.','The stone came out on time. The next morning the workers came at half strength; the hurried face had cracked.'],
    delayed:[5,'Çatlayan ocak yüzü onarım için kapandı; taş teslimatı aksadı.','The cracked quarry face closed for repairs; stone deliveries stalled.',{resources:-2}] },
  { card:'garrison_supply', choice:'delay', outcome:'result', reason:'up to 6.8 population per 100 decisions; hungry soldiers now forage the villages’ land',
    stats:{authority:-5,stability:-3,population:-1,environment:-2},
    text:['Ambar dolu kaldı. Aç askerler köylerin bahçelerini yağmaladı; komutan şikâyetini başkente yazdı.','The granary stayed full. Hungry soldiers stripped the villages’ orchards; the commander wrote his complaint to the capital.'] },
  { card:'garrison_supply', choice:'requisition', outcome:'result', reason:'up to 6.2 population per 100 random decisions; requisitioned seed now costs the next harvest',
    stats:{authority:4,stability:-7,population:-1},
    text:['Garnizon doydu. Kasaba ambarları ve tohumluk boşaldı; birkaç aile kış için başka şehirlere göçtü.','The garrison ate. Town granaries and seed stores emptied; a few families left for other cities before winter.'],
    delayed:[4,'Tohumluğu alınan tarlalar eksik ekildi; hasat azaldı.','Fields stripped of seed were sown short; the harvest shrank.',{resources:-3,stability:-1}] },
  { card:'grain_ceiling', choice:'free', outcome:'result', reason:'up to 4.7 population per 100 decisions; emigration now also leaves plots untilled',
    stats:{resources:4,stability:-5,population:-1},
    text:['Vergi geldi. Yoksul haneler ekmeği yarıya böldü; bir aile tarlasını bırakıp göç yoluna çıktı.','The tax came in. Poor households halved their bread; one family left its plot and took the road out.'],
    delayed:[5,'Göç edenlerin tarlası ekilmedi; pazar vergisi azaldı.','The emigrants’ plots went unsown; market dues fell.',{resources:-1}] },
  { card:'aqueduct_quota', choice:'sell', outcome:'result', reason:'largest single stability drain in 225 (−7 each, chosen whenever environment ≥ 20)',
    stats:{resources:7,environment:-5,stability:-5},
    text:['Gümüş kasaya girdi. Aşağı mahalleler kova kuyruklarında beklemeye başladı; şikâyetler deftere yazıldı.','Silver entered the treasury. Lower wards began waiting in bucket queues; their complaints were written down.'] },
  { card:'aqueduct_quota', choice:'ration', outcome:'result', reason:'5.1 population per 100 recovery decisions; rationing now costs authority, not households',
    stats:{population:-1,authority:-2,stability:2,environment:3},
    text:['Herkes aynı kovayla döndü. Bahçeler kurudu, hasat geriledi; zayıf düşenler oldu ama kavga çıkmadı.','Everyone returned with the same bucket. Gardens dried and the harvest fell; some grew weak, but there was no quarrel.'] },
  { card:'irrigation_court', choice:'upstream', outcome:'result', reason:'2.8 population per 100 knowledge decisions; the downstream loss now shows in the land',
    stats:{authority:3,stability:-5,population:-1,environment:-2},
    text:['Yukarı köyler kazandı. Aşağı tarlalar kurudu; bazı aileler hasat beklemeden şehre indi.','The upper villages won. The lower fields dried; some families went down to the city without waiting for harvest.'] }
];

// strict:false skips targets absent from an older snapshot (used by the preservation tests).
export function rebalanceEmpireEvents({cards,delayed,strict=true}) {
  for (const r of EMPIRE_REBALANCE) {
    const card = cards.find(c => c.id === r.card);
    const choice = card?.choices.find(c => c.id === r.choice);
    const outcome = choice?.outcomes.find(o => o.id === r.outcome);
    if (!outcome) { if (!strict && !card) continue; throw new Error(`rebalance target missing: ${r.card}.${r.choice}.${r.outcome}`); }
    outcome.effect.stats = { ...r.stats };
    outcome.text = { tr: r.text[0], en: r.text[1] };
    if (r.delayed) outcome.delayedEffects = [delayed(r.delayed[0], 4, r.delayed[1], r.delayed[2], r.delayed[3])];
  }
}

export function addEmpireGovernanceEvents({card,choice,outcome,delayed}) {
  const later=(turns,tr,en,stats,flags=[])=>[delayed(turns,4,tr,en,stats,flags)];
  const drop=(result,flags)=>{result.effect.removeFlags=flags;return result;};
  const context=(result,requirements)=>({...result,requirements});
  const empire='Fictional composite ancient empire, cut limestone and marble, wax tablets and papyrus rolls, bronze and iron hand tools, wool tunics and cloaks, no stirrups, no paper books, no gunpowder; ivory, gold and dusty terracotta palette, portrait composition. ';

  // ——— Nine recurring governance, demography and economy events (37/24 with the earlier packages) ———
  card('assembly_power_share',4,'province','Yerel Meclisle Yetki','Sharing Power with the Local Council',
    'Eyalet kentlerinin ileri gelenleri valinin her kararını başkentten beklemekten yoruldu. Yerel meclis, vergi takvimi ve pazar düzeni üzerinde söz istiyor. Vali yetkisini paylaşırsa kentler sakinleşecek; ama emirleri artık tartışılacak.',
    'The notables of the provincial towns are tired of waiting on the capital for every ruling. The local council wants a voice over the tax calendar and the market order. If the governor shares authority the towns will settle, but his orders will now be debated.',
    empire+'Colonnaded council chamber, provincial notables on stone benches facing the governor’s ivory chair, scribe with wax tablets, petition scrolls on a table, warm afternoon light.',[
      choice('seats','Meclise vergi takviminde oy hakkı ver.','Give the council a vote on the tax calendar.',[
        outcome('Meclis ilk oylamasını yaptı. Kentler sakinleşti; valinin emirleri artık meclis kapısında bekliyor.','The council held its first vote. The towns settled; the governor’s orders now wait at the council door.',{authority:-4,stability:5},{flags:['provincial_assembly_seats'],relation:6})
      ]),
      choice('citizens','Kapı vatandaşlarına da mecliste sıra aç.','Open council benches to the gate citizens as well.',[
        outcome('Eski vatandaşlık kaydı meclis sırasına dönüştü. Göç etmeyi düşünen aileler kaldı; valinin sözü bir kez daha bölündü.','The old citizenship record became a council bench. Families who had thought of leaving stayed; the governor’s word was divided once more.',{authority:-3,stability:6,population:1},{flags:['provincial_assembly_seats'],relation:4})
      ],[{flag:'guest_citizenship'}]),
      choice('loyalists','Meclise valiye bağlı adayları ücretle seçtir.','Pay to have loyal candidates seated in the council.',[
        outcome('Ücretli adaylar meclisi doldurdu. Vali sözünü korudu; kentliler meclisin satın alındığını konuştu.','Paid candidates filled the council. The governor kept his word; townspeople said the council had been bought.',{resources:-5,authority:3,stability:-1},{relation:-4})
      ],[{stat:'resources',minimum:5}]),
      choice('refuse','Meclisin isteğini reddet.','Refuse the council’s request.',[
        outcome('İstek reddedildi. İleri gelenler itirazlarını deftere yazdırdı; pazar günleri sessiz geçti.','The request was refused. The notables had their objections recorded; market days passed in silence.',{authority:2,stability:-4},{flags:['recorded_provincial_dissent'],relation:-5})
      ])
    ],{eraRole:'recurring'});

  const deferralDue=delayed(6,4,'Ertelenen vergiler vadesinde toplandı; kasa bir anda boşaldı.','The deferred taxes fell due and were collected; the treasury emptied at once.',{resources:-5});
  deferralDue.effect.removeFlags=['provincial_tax_deferred'];
  card('tax_deferral',4,'taxation','Vergi Ertelemesi','A Deferral of Taxes',
    'Kötü geçen kıştan sonra köyler vergilerin bahara ertelenmesini istiyor. Tapınaklar, kendi topraklarının muaf tutulması karşılığında halka sabır öğütlemeyi teklif ediyor. Kasa ise bu mevsim de doldurulmak zorunda.',
    'After a hard winter the villages ask for their taxes to be deferred to spring. The temples offer to preach patience to the people if their own lands are exempted. The treasury still has to be filled this season.',
    empire+'Village elders before a tax magistrate at a stone table, a temple priest standing aside with folded hands, tally sticks and a half-empty grain jar, cold early-spring light.',[
      choice('defer','Vergiyi bahara ertele.','Defer the taxes to spring.',[
        outcome('Erteleme meydanda okundu. Köyler rahatladı; borç kasanın takviminde bekliyor.','The deferral was read in the square. The villages breathed easier; the debt waits in the treasury calendar.',{authority:-2,stability:5},{flags:['provincial_tax_deferred'],delayed:[deferralDue]})
      ],[{absentFlag:'provincial_tax_deferred'}]),
      choice('temples','Tapınak topraklarını muaf tut; karşılığında rahipler sabır öğütlesin.','Exempt the temple lands in return for the priests preaching patience.',[
        outcome('Rahipler halka sabır öğütledi. Huzur geldi; tapınak toprakları artık vergi defterinde yok.','The priests preached patience. Calm returned; the temple lands are no longer in the tax ledger.',{authority:-3,stability:3},{relation:3})
      ]),
      choice('collect','Vergiyi olduğu gibi topla.','Collect the taxes as they stand.',[
        outcome('Kasa doldu. Köylüler tohumluklarını satmak zorunda kaldı; homurtu valilik kapısına kadar geldi.','The treasury filled. Villagers had to sell their seed; the grumbling reached the governorate door.',{resources:4,stability:-5,authority:1})
      ]),
      choice('farm','Tahsilatı nehir mültezimine bırak.','Leave the collection to the river tax farmer.',[
        outcome('Mültezim vergiyi kendi adamlarıyla topladı ve payını aldı. Kasaya az, köylere çok yük düştü.','The tax farmer collected with his own men and took his cut. Little reached the treasury; much fell on the villages.',{resources:3,stability:-4,authority:-2})
      ],[{flag:'river_customs_farmed'}])
    ],{eraRole:'recurring'});

  card('governor_recall',4,'province','Valinin Geri Çağrılması','Recalling the Governor',
    'Valinin keyfî cezaları ve geciken kararları yüzünden eyalet kentleri dilekçe üstüne dilekçe gönderiyor. Başkent bir müfettiş yollayabilir, kentler kendi yöneticisini seçebilir ya da vali yerinde kalabilir. Her yolun bir bedeli var.',
    'The provincial towns are sending petition after petition over the governor’s arbitrary fines and delayed rulings. The capital could send an inspector, the towns could elect their own steward, or the governor could stay. Every road has its price.',
    empire+'Governor’s hall with an inspector from the capital holding a sealed bronze tablet, townsmen with petition rolls, the governor standing stiffly by his chair, shafts of dusty light.',[
      choice('inspector','Başkentten ücretli bir müfettiş getir.','Bring a paid inspector from the capital.',[
        outcome('Müfettiş defterleri inceledi ve valinin cezalarını kaldırdı. Masrafı kasa ödedi.','The inspector examined the ledgers and lifted the governor’s fines. The treasury paid his costs.',{resources:-6,stability:5,authority:2,knowledge:1})
      ],[{stat:'resources',minimum:6}]),
      choice('local','Kentlerin kendi yöneticisini seçmesine izin ver.','Let the towns elect their own steward.',[
        drop(outcome('Kentler yerel bir kâhya seçti. Huzur döndü; başkentin sözü eyalette zayıfladı.','The towns elected a local steward. Order returned; the capital’s word weakened in the province.',{authority:-5,stability:6},{flags:['province_local_steward'],relation:4}),['province_central_receiver'])
      ]),
      choice('keep','Valiyi yerinde tut.','Keep the governor in place.',[
        outcome('Vali kaldı. Dilekçeler cevapsız kaldı; kentler bir sonraki vergi gününü bekliyor.','The governor stayed. The petitions went unanswered; the towns are waiting for the next tax day.',{authority:1,stability:-4})
      ]),
      choice('hearing','Kayıtlı itirazları açık duruşmada dinle.','Hear the recorded objections in an open session.',[
        outcome('Kayıtlı itirazlar tek tek okundu. Valinin üç cezası kaldırıldı; itiraz kaydı defterde kaldı.','The recorded objections were read one by one. Three of the governor’s fines were lifted; the record of dissent stayed in the ledger.',{authority:-3,stability:4,knowledge:1})
      ],[{flag:'recorded_provincial_dissent'}])
    ],{eraRole:'recurring'});

  card('garrison_oversight',4,'logistics','Garnizon ve Sivil Denetim','The Garrison under Civil Oversight',
    'Garnizon askerleri pazarda zorla mal alıyor ve geceleri sokakları kendi kurallarıyla tutuyor. Kentliler garnizonun sivil yargıçlara hesap vermesini istiyor. Komutan ise askerin yalnız valiye bağlı olduğunu söylüyor.',
    'Garrison soldiers are taking goods by force in the market and keeping the streets by their own rules at night. The townspeople want the garrison to answer to civil magistrates. The commander says soldiers answer only to the governor.',
    empire+'Market street with soldiers in bronze helmets facing civil magistrates in wool robes, a merchant pointing at an overturned stall, a commander with a staff of office, overcast light.',[
      choice('magistrates','Garnizonu sivil yargıçların denetimine bağla.','Place the garrison under the civil magistrates’ oversight.',[
        outcome('Yargıçlar ilk askerî davayı dinledi. Pazar sakinleşti; komutan yetkisinin bölündüğünü yazdı.','The magistrates heard their first military case. The market calmed; the commander wrote that his authority had been split.',{authority:-4,stability:4},{flags:['garrison_civil_oversight'],relation:3})
      ]),
      choice('arrears','Birikmiş ücreti öde; yağmanın sebebini kapat.','Pay the back wages and remove the cause of the looting.',[
        drop(outcome('Askerler ücretlerini aldı ve pazardan çekildi. Ücret borcu kapandı.','The soldiers received their wages and withdrew from the market. The wage debt was closed.',{resources:-5,stability:3,authority:1}),['garrison_pay_arrears'])
      ],[{flag:'garrison_pay_arrears'},{stat:'resources',minimum:5}]),
      choice('martial','Komutana sıkıyönetim yetkisi ver.','Give the commander martial authority.',[
        outcome('Sokaklar askerle sessizleşti. Kentliler kapılarını erken kapattı; şikâyetler başka eyaletlere ulaştı.','The streets fell silent under the soldiers. Townspeople shut their doors early; complaints reached other provinces.',{authority:4,stability:-5},{relation:-4})
      ]),
      choice('frontier','Birliği ücretli olarak sınır karakollarına gönder.','Send the unit to the frontier posts at a cost.',[
        outcome('Birlik sınıra yürüdü. Yol erzakı kasadan çıktı; kent bir süre rahat nefes aldı.','The unit marched to the frontier. Its rations came from the treasury; the town breathed easier for a while.',{resources:-4,stability:3,authority:-1})
      ],[{stat:'resources',minimum:4}])
    ],{eraRole:'recurring'});

  card('duty_rota',4,'settlement','Kamu Yükümlülüklerinin Bölüşümü','Sharing Out the Public Duties',
    'Yol onarımı, kanal temizliği ve nöbet hep aynı mahallelere düşüyor. Yorgun haneler yükün bütün kente bölünmesini istiyor. Bakım emekçileri ise hasta bakarken nöbete de çağrıldıklarını söylüyor.',
    'Road repair, canal cleaning and watch duty always fall on the same wards. Exhausted households want the burden shared across the whole town. Care workers say they are called to the watch while tending the sick.',
    empire+'Town square with a duty roster carved on a stone stele, households gathering with baskets and tools, a care worker carrying water jars, clerk reading names, morning light.',[
      choice('rota','Yükümlülüğü bütün hanelere sırayla dağıt.','Rotate the duties across every household.',[
        outcome('Yeni çizelge taşa kazındı. Yorgun mahalleler rahatladı; hasat haftasında tarlalar birkaç el eksik kaldı.','The new roster was carved in stone. Exhausted wards were relieved; in harvest week the fields were a few hands short.',{authority:-2,stability:3,environment:1},{delayed:later(4,'Sıra çizelgesi hasat haftasına denk geldi; ürünün bir kısmı tarlada kaldı.','The roster fell on harvest week; part of the crop was left in the field.',{resources:-2})})
      ]),
      choice('carers','Bakım emekçilerini nöbetten muaf tut.','Exempt care workers from the watch.',[
        outcome('Bakım evleri emekçilerini korudu. Diğer haneler nöbeti üstlendi; vali kararın kendisine sorulmadığını not etti.','The care houses kept their workers. Other households took on the watch; the governor noted he had not been asked.',{authority:-3,stability:4})
      ],[{flag:'public_care_settlement'}]),
      choice('hire','Ücretli işçi tut; yükümlülüğü paraya çevir.','Hire paid workers and convert the duty to coin.',[
        outcome('İşçiler tutuldu ve hanelerin yükü kalktı. Ücretleri kasadan çıktı.','Workers were hired and the households’ burden lifted. Their wages came from the treasury.',{resources:-6,stability:4,knowledge:1})
      ],[{stat:'resources',minimum:6}]),
      choice('keep','Düzeni olduğu gibi bırak.','Leave the order as it is.',[
        outcome('Aynı mahalleler yine çalıştı. Bir yaşlı işçi kanal başında yığıldı; homurtu büyüdü.','The same wards worked again. An old labourer collapsed at the canal; the grumbling grew.',{authority:1,stability:-3,population:-1})
      ])
    ],{eraRole:'recurring'});

  card('refugee_settlement',4,'settlement','Sınırdan Gelen Aileler','Families from Across the Border',
    'Komşu eyaletteki kuraklıktan kaçan aileler sınır kapısında bekliyor. Çoğu çiftçi; bir kısmı asker olmaya hazır. Kent ise yeni ağızları doyurup doyuramayacağını tartışıyor.',
    'Families fleeing drought in the neighbouring province are waiting at the border gate. Most are farmers; some are ready to serve as soldiers. The town is arguing whether it can feed new mouths.',
    empire+'Border gate with weary families carrying bundles and leading thin goats, a magistrate counting heads on a wax tablet, soldiers at the gate, dusty evening light.',[
      choice('settle','Aileleri eyalet çiftliklerine yerleştir; ilk tohumu ver.','Settle the families on the provincial estates and give them first seed.',[
        outcome('Aileler çiftliklere yerleşti. Tohum kasadan çıktı; boş tarlalar yeniden sürüldü.','The families settled on the estates. Seed came from the treasury; empty fields were ploughed again.',{resources:-5,population:3,stability:-1},{delayed:later(5,'Yerleşen aileler ilk hasatlarını ambara getirdi.','The settled families brought their first harvest to the granary.',{resources:2})})
      ],[{flag:'estate_fields_worked'},{stat:'resources',minimum:5}]),
      choice('camp','Kent dışında geçici bir kamp kur.','Set up a temporary camp outside the town.',[
        outcome('Kamp kuruldu. Aileler kaldı; kampın çevresindeki korular hızla kesildi ve kentle kamp arasında kavgalar başladı.','The camp was set up. The families stayed; groves around it were quickly cut and quarrels began between town and camp.',{population:2,stability:-3,environment:-2},{delayed:later(3,'Kampla kent arasındaki su kavgası mahkemeye taşındı.','The water quarrel between camp and town went to court.',{stability:-1})})
      ]),
      choice('enlist','Gençleri garnizona yaz; ücretlerini sonra öde.','Enlist the young men in the garrison and pay them later.',[
        outcome('Gençler garnizona yazıldı ve aileleri kente alındı. Ücretleri valilik defterinde borç olarak duruyor.','The young men joined the garrison and their families were let into the town. Their wages stand as a debt in the governorate ledger.',{population:1,authority:2,stability:-2},{flags:['garrison_pay_arrears']})
      ],[{absentFlag:'garrison_pay_arrears'}]),
      choice('turn_away','Kapıyı kapat; aileleri geri gönder.','Shut the gate and send the families back.',[
        outcome('Kapı kapandı. Kent rahatladı; komşu eyaletin yöneticileri bu kararı unutmayacaklarını yazdı, başkent valiyi azarladı.','The gate closed. The town was relieved; the neighbouring governors wrote that they would not forget it, and the capital rebuked the governor.',{authority:-1,stability:1},{relation:-4})
      ])
    ],{eraRole:'recurring'});

  card('surplus_harvest',4,'economy','Bereketli Hasat','A Generous Harvest',
    'Eyalet çiftlikleri bu yıl beklenenden fazla ürün verdi. Fazla tahıl satılabilir, kamu ambarına kapatılabilir, tohum olarak saklanabilir ya da bir hasat şenliğinde dağıtılabilir. Ambar memurları fazlanın bir kısmının zaten fareye gideceğini hatırlatıyor.',
    'The provincial estates yielded more than expected this year. The surplus could be sold, sealed in the public granary, kept as seed or shared out at a harvest feast. Granary officers remind everyone that part of a surplus always goes to the rats.',
    empire+'Overflowing threshing floor with heaped grain, granary officers sealing jars with clay stoppers, merchants bargaining at the edge, villagers preparing a harvest feast, golden late light.',[
      choice('store','Fazlayı kamu ambarına mühürle; fiyat tavanı varsa kaldır.','Seal the surplus in the public granary and lift any price ceiling.',[
        drop(outcome('Tahıl mühürlü küplere kondu. Taşıma ve mühür masrafı ödendi; tavan kaldırıldı.','The grain was put in sealed jars. Carting and sealing were paid for; the ceiling was lifted.',{resources:-2,stability:2,authority:-1},{flags:['grain_famine_store']}),['grain_price_ceiling'])
      ],[{stat:'resources',minimum:2}]),
      choice('sell','Fazlayı pazarda sat.','Sell the surplus at market.',[
        outcome('Tüccarlar tahılı aldı. Kasa doldu; yoksul haneler ucuz ekmeği kaçırdı.','The merchants bought the grain. The treasury filled; poor households missed out on cheap bread.',{resources:4,stability:-1,authority:-1})
      ]),
      choice('seed','Fazlayı gelecek yılın tohumu olarak sakla.','Keep the surplus as next year’s seed.',[
        outcome('Tohum ambara kondu. Bu yıl kimse fazladan doymadı; gelecek ekim güvenceye alındı.','The seed went into the granary. No one ate more this year; next sowing was secured.',{authority:-1,stability:-1},{delayed:later(5,'Saklanan tohumla ekilen tarlalar iyi ürün verdi.','Fields sown with the stored seed yielded well.',{resources:3})})
      ]),
      choice('feast','Hasat şenliği düzenle; fazlayı halka dağıt.','Hold a harvest feast and share the surplus with the people.',[
        outcome('Şenlik üç gün sürdü. Halk valiyi alkışladı; ambar memurları boş küpleri saydı.','The feast lasted three days. The people cheered the governor; the granary officers counted empty jars.',{stability:5,authority:-2})
      ])
    ],{eraRole:'recurring',requirements:[{flag:'estate_fields_worked'}]});

  card('grain_contract',4,'trade','Deniz Aşırı Tahıl Sözleşmesi','A Grain Contract from Overseas',
    'Uzak bir limanın tüccarları sözleşmeli tahıl teslimatı teklif ediyor. Peşin ödeme istiyorlar, ama liman gelirlerini rehin almaya da razılar. Ayarı düşük sikkeyle ödeme yapılırsa sözleşmenin bozulacağını açıkça söylüyorlar.',
    'Merchants from a distant port offer a contracted grain delivery. They want payment in advance, but would also accept the harbor revenues as pledge. They say plainly that payment in debased coin will void the contract.',
    empire+'Harbor office with foreign merchants in striped cloaks presenting a contract on papyrus, a magistrate with a seal ring, grain ships at anchor beyond the arches, bright sea light.',[
      choice('sign','Sözleşmeyi peşin ödeyerek imzala.','Sign the contract and pay in advance.',[
        outcome('Sözleşme mühürlendi ve ödeme yapıldı. Tahıl gemileri dört tur sonra limana girecek.','The contract was sealed and paid. The grain ships will enter the harbor in four turns.',{resources:-6,stability:2},{delayed:later(4,'Sözleşmeli tahıl limana ulaştı; navlun ve kayıp düşülünce ödemenin çoğu geri döndü.','The contracted grain reached the harbor; after freight and losses most of the payment came back.',{resources:5})})
      ],[{stat:'resources',minimum:6}]),
      choice('pledge','Balıkçılık izin gelirlerini rehin ver.','Pledge the fishing licence revenues.',[
        outcome('Liman gelirleri rehin yazıldı. Balıkçılar vergilerinin yabancı tüccarlara gittiğini öğrenince homurdandı.','The harbor revenues were written down as pledge. The fishermen grumbled on learning their dues would go to foreign merchants.',{authority:-2,stability:-1},{delayed:later(4,'Rehinli gelir karşılığında tahıl limana ulaştı.','Grain arrived against the pledged revenues.',{resources:3})})
      ],[{flag:'harbor_fishery_licensed'}]),
      choice('barter','Tahılı eyalet korularının zeytinyağı ve kerestesiyle takas et.','Barter for the grain with olive oil and timber from the provincial groves.',[
        context(outcome('Zeytinyağı küpleri ve kereste gemilere yüklendi. Korular seyreldi; tahıl dört tur sonra gelecek.','Oil jars and timber were loaded on the ships. The groves thinned; the grain will arrive in four turns.',{environment:-3,stability:-1},{id:'barter',probability:0.5,delayed:later(4,'Takas edilen tahıl limana ulaştı.','The bartered grain reached the harbor.',{resources:3})}),[{absentFlag:'debased_coinage'}]),
        context(outcome('Vali önce ayarı düşük sikke önerdi; tüccarlar sikkeleri tartıp reddetti ve takası daha ağır şartlarla yaptı. Limanda valinin sözüne güven azaldı.','The governor first offered debased coin; the merchants weighed it, refused, and struck the barter on harsher terms. Trust in the governor’s word fell in the harbor.',{environment:-4,stability:-2},{id:'debased',probability:0.5,relation:-3,delayed:later(4,'Ağır şartlarla takas edilen tahıl limana ulaştı.','Grain bartered on harsh terms reached the harbor.',{resources:2})}),[{flag:'debased_coinage'}])
      ]),
      choice('refuse','Teklifi geri çevir.','Turn the offer down.',[
        outcome('Tüccarlar başka limana yelken açtı. Ambar dayanacak mı, bunu kış gösterecek.','The merchants set sail for another port. Whether the granary holds, the winter will tell.',{stability:-3,authority:1})
      ])
    ],{eraRole:'recurring'});

  card('well_sanitation',4,'health','Kuyular ve Lağımlar','Wells and Drains',
    'Alt mahallelerde çocuklar ishalden ölüyor. Hekimler kuyuların lağımlara çok yakın olduğunu söylüyor. Kuyuları temizlemek ve lağımları uzaklaştırmak para ve emek istiyor; rahipler ise salgını arınma töreniyle durdurmayı öneriyor.',
    'Children in the lower wards are dying of flux. Physicians say the wells are too close to the drains. Cleaning the wells and moving the drains takes coin and labour; the priests propose stopping the sickness with a purification rite.',
    empire+'Narrow lower-ward street with a stone well beside an open drain channel, a physician pointing, workers with buckets and shovels, a priest with incense, grey morning light.',[
      choice('clean','Kuyuları temizlet, lağımları ücretli işçilerle uzaklaştır.','Have the wells cleaned and the drains moved by paid workers.',[
        outcome('Kuyular kireçlendi, lağımlar sur dışına çevrildi. İşçiler ödendi; hastalık hemen durmadı.','The wells were limed and the drains turned outside the wall. The workers were paid; the sickness did not stop at once.',{resources:-5,stability:2},{delayed:later(6,'Temiz kuyularla çocuk ölümleri azaldı; aileler büyüdü.','With clean wells fewer children died; families grew.',{population:1})})
      ],[{stat:'resources',minimum:5}]),
      choice('rota','Lağım temizliğini mahalle nöbetine bağla.','Make drain cleaning a ward duty.',[
        outcome('Mahalleler sırayla lağım temizledi. Su biraz düzeldi; nöbetten kaçan haneler cezalandırıldı.','The wards cleaned the drains in turn. The water improved a little; households that dodged the duty were fined.',{environment:2,authority:-2,stability:-1})
      ]),
      choice('rite','Rahiplere arınma töreni yaptır.','Have the priests perform a purification rite.',[
        outcome('Tören yapıldı ve mahalle tütsüyle doldu. Halk rahatladı; kuyular olduğu gibi kaldı.','The rite was performed and the ward filled with incense. The people were comforted; the wells stayed as they were.',{authority:-3,stability:2,knowledge:-1})
      ]),
      choice('ignore','Hekimlerin uyarısını yok say.','Ignore the physicians’ warning.',[
        outcome('Kimse kuyulara dokunmadı. Mahalleler bekledi.','No one touched the wells. The wards waited.',{stability:-1},{delayed:later(4,'İshal yayıldı; alt mahallelerde çocuklar öldü.','The flux spread; children died in the lower wards.',{population:-2,stability:-2})})
      ])
    ],{eraRole:'recurring'});

  // ——— Three Bronze bridges (11/8) ———
  card('provincial_seal_charter',4,'legacy','Eyalet Mührü Sözleşmesi','The Provincial Seal Charter',
    'Kentin eski meclis mührü kararı, yetkinin devredilip devredilmeyeceğini kaydetmişti. Şimdi eyalet kentleri aynı kuralın valilik mühürlerine de uygulanmasını istiyor. Vali, mührü tek elde tutmanın düzeni koruduğunu söylüyor.',
    'The city’s old council-seal ruling had recorded whether authority could be delegated. Now the provincial towns want the same rule applied to the governorate seals. The governor says keeping the seal in one hand preserves order.',
    empire+'Council chamber with an old clay seal tablet beside a new bronze governorate seal on a cushion, delegates from several towns, scribes copying a charter, lamplight.',[
      choice('delegated','Devredilmiş yönetim kaydını eyalet mühürlerine uygula; kâtipleri öde.','Apply the delegated-rule record to the provincial seals and pay the clerks.',[
        outcome('Her kente bir mühür kopyası verildi. Kararlar hızlandı; vali yetkisinin bölündüğünü kabul etti.','Each town received a copy of the seal. Rulings sped up; the governor accepted that his authority was divided.',{resources:-4,stability:5,authority:-2},{flags:['provincial_delegated_seal'],relation:4})
      ],[{flag:'delegated_rule'},{stat:'resources',minimum:4}]),
      choice('single','Tek mühür kaydını koru; eyalet mührü valide kalsın.','Keep the single-seal record; the provincial seal stays with the governor.',[
        outcome('Mühür valide kaldı. Kararlar tek elden çıktı; kentler itirazlarını yazıya döktü.','The seal stayed with the governor. Rulings came from one hand; the towns put their objections in writing.',{authority:4,stability:-4},{flags:['provincial_single_seal'],relation:-3})
      ],[{flag:'single_seal'}]),
      choice('council','Mühür kararını eyalet meclisine bırak.','Leave the seal question to the provincial council.',[
        outcome('Meclis tartıştı ve karar bir sonraki toplantıya kaldı. Kentler dinlendiklerini hissetti.','The council debated and the decision was put off to the next session. The towns felt they had been heard.',{authority:-3,stability:3,knowledge:1})
      ])
    ],{once:true,chain:'public_voice',eraRole:'bridge',requirements:[{completedCard:'council_seal'}]});

  card('charcoal_forest_reserve',4,'legacy','Kömür Ormanının Payı','The Charcoal Forest Reserve',
    'İmparatorluk dökümhaneleri her yıl daha fazla kömür istiyor. Tunç Çağı’ndaki ocak odunu kararı ormanların nasıl kesileceğini kaydetmişti. Şimdi eyalet ormanlarının hangi kurala göre kesileceği belirlenmeli.',
    'The imperial foundries want more charcoal every year. The Bronze Age furnace-wood ruling had recorded how the forests would be cut. Now the province must decide by what rule its forests are felled.',
    empire+'Hillside forest with charcoal mounds smoking between stumps, foresters with bronze axes, a magistrate reading an old fuel tablet, foundry smoke in the valley, hazy light.',[
      choice('quota','Eski yakıt kotasını eyalet ormanlarına uygula; ormancıları öde.','Apply the old fuel quota to the provincial forests and pay the foresters.',[
        outcome('Kesim kotası işaretlendi ve ormancılar ödendi. Dökümhaneler daha az kömürle idare etti; orman nefes aldı.','The felling quota was marked and the foresters paid. The foundries made do with less charcoal; the forest breathed.',{resources:-4,environment:4,stability:2},{flags:['imperial_fuel_quota']})
      ],[{flag:'fuel_quota'},{stat:'resources',minimum:4}]),
      choice('expand','Sanayi ormanı kaydını sürdür; kesimi genişlet.','Continue the industrial-forest record and widen the felling.',[
        outcome('Kesim genişledi. Dökümhaneler doydu; yamaçlar çıplaklaştı ve ormancı köyleri itiraz etti.','The felling widened. The foundries were fed; the slopes went bare and the forester villages objected.',{environment:-4,authority:2,stability:-1},{flags:['imperial_forest_cut']})
      ],[{flag:'industrial_forest'}]),
      choice('reserve','Ormanın yarısını korumaya al; kömürü uzaktan satın al.','Protect half the forest and buy charcoal from afar.',[
        outcome('Korunan orman işaretlendi. Uzak kömürün nakli kasaya pahalıya patladı.','The protected forest was marked. Hauling distant charcoal cost the treasury dearly.',{resources:-6,environment:5,stability:1},{flags:['imperial_fuel_quota']})
      ],[{stat:'resources',minimum:6}]),
      choice('auction','Kesim haklarını açık artırmayla sat.','Sell the felling rights at auction.',[
        outcome('Haklar en yüksek teklife satıldı. Kasa doldu; ormancı köyleri geçimlerini kaybetti.','The rights went to the highest bidder. The treasury filled; the forester villages lost their living.',{resources:3,environment:-4,stability:-3})
      ])
    ],{once:true,chain:'embers',eraRole:'bridge',requirements:[{completedCard:'furnace_wood'}]});

  card('estate_bondage_record',4,'legacy','Çiftlikte Borç Kulluğu','Debt Bondage on the Estates',
    'Eyalet çiftliklerine gelen bazı aileler eski borç tabletleri yüzünden kul sayılıyor. Tunç Çağı’ndaki borç tableti kararı bu borçların kaldırılıp kaldırılmadığını kaydetmişti. Toprak sahipleri eski kaydın geçerli olmasını istiyor.',
    'Some families arriving on the provincial estates are counted as bondsmen because of old debt tablets. The Bronze Age debt-tablet ruling had recorded whether such debts were cancelled. The landholders want the old record to stand.',
    empire+'Estate courtyard with a magistrate holding an old clay debt tablet, a family standing before landholders, field workers watching from the threshing floor, harsh noon light.',[
      choice('emancipated','Eski borç affını çiftliklere uygula; aileleri kiracı yaz.','Apply the old cancellation to the estates and register the families as tenants.',[
        outcome('Aileler kiracı olarak deftere girdi. Kâtip masrafı ödendi; toprak sahipleri kayıplarını saydı.','The families entered the roll as tenants. The clerk’s cost was paid; the landholders counted their losses.',{resources:-3,stability:5,population:1,authority:-1},{flags:['estate_free_tenants']})
      ],[{flag:'emancipation'},{stat:'resources',minimum:3}]),
      choice('bondage','Miras kulluk kaydını tanı.','Recognize the inherited-bondage record.',[
        outcome('Aileler kul olarak çalışmaya devam etti. Toprak sahipleri memnun; çiftlikte kaçış söylentileri yayıldı.','The families went on working as bondsmen. The landholders were pleased; rumours of flight spread on the estate.',{authority:3,stability:-5},{flags:['estate_bound_tenants','recorded_provincial_dissent']})
      ],[{flag:'inherited_bondage'}]),
      choice('review','Her tableti ücretli tanıklarla yeniden incele.','Review every tablet with paid witnesses.',[
        outcome('Tabletler tek tek okundu; sahte olanlar kırıldı. Tanıklar ödendi.','The tablets were read one by one; the forged ones were broken. The witnesses were paid.',{resources:-5,stability:3,knowledge:2},{flags:['estate_free_tenants']})
      ],[{stat:'resources',minimum:5}]),
      choice('silence','Konuyu toprak sahiplerine bırak.','Leave the matter to the landholders.',[
        outcome('Vali karışmadı. Aileler belirsizlik içinde çalıştı; bazıları geceleri kaçtı.','The governor did not intervene. The families worked in uncertainty; some fled at night.',{stability:-2,authority:-1,population:-1})
      ])
    ],{once:true,chain:'debt',eraRole:'bridge',requirements:[{completedCard:'debt_tablet'}]});

  // ——— Three conditional conclusions: a Bronze close plus a completed imperial event (11/8) ———
  card('tithe_measure_recall',4,'legacy','Öşürde Sahte Ölçü','The False Measure at the Tithe',
    'Öşür toplanırken köylüler valilik ölçü kaplarının eski mühür kopyasından büyük olduğunu fark etti. Tunç Çağı’nda sahte mühür kopyası bir kez geri çağrılmış ya da sessizce değiştirilmişti. Şimdi aynı soru öşür ambarında soruluyor.',
    'During the tithe, villagers noticed the governorate measures were larger than the old sealed copy. In the Bronze Age a forged seal copy had once been recalled or quietly replaced. Now the same question is asked at the tithe granary.',
    empire+'Tithe granary with two bronze grain measures side by side, a villager pouring grain to show the difference, magistrate and scribes, sacks stacked high, dusty light.',[
      choice('recall','Eski geri çağırma kararını uygula; bütün ölçüleri yeniden damgalat.','Apply the old recall ruling and have every measure restamped.',[
        outcome('Ölçüler toplandı ve yeniden damgalandı. Fazla alınan öşür köylere geri verildi.','The measures were collected and restamped. Over-collected tithe was returned to the villages.',{resources:-4,stability:5,knowledge:2},{flags:['tithe_measures_restamped']})
      ],[{flag:'measure_recall'},{stat:'resources',minimum:4}]),
      choice('quiet','Eskisi gibi ölçüleri sessizce değiştir.','Replace the measures quietly, as before.',[
        outcome('Ölçüler gece değiştirildi. Kimse resmî bir şey duymadı; köylüler ise farkı unutmadı.','The measures were swapped at night. No one heard anything official; the villagers did not forget the difference.',{authority:2,stability:-4},{flags:['recorded_provincial_dissent']})
      ],[{flag:'measure_quiet_replacement'}]),
      choice('public','Ölçüleri halkın önünde karşılaştır.','Compare the measures in front of the people.',[
        outcome('Ölçüler meydanda karşılaştırıldı ve düzeltildi. Kâtip ve ustaların ücreti ödendi.','The measures were compared in the square and corrected. The clerks and smiths were paid.',{resources:-3,stability:3,knowledge:1},{flags:['tithe_measures_restamped']})
      ],[{stat:'resources',minimum:3}])
    ],{once:true,chain:'debt',eraRole:'conclusion',requirements:[{completedCard:'seal_copy'},{completedCard:'harvest_tithe'}]});

  card('governor_succession_rule',4,'legacy','Valiliğin Ardıllığı','The Governorship’s Succession',
    'Vali değişikliğinden sonra eyalet, bir sonraki yöneticinin nasıl seçileceğini soruyor. Tunç Çağı’ndaki ardıllık tableti mührün miras mı kalacağını, seçimle mi verileceğini yoksa geri alınabilir mi olacağını kaydetmişti.',
    'After the change of governor the province asks how the next ruler will be chosen. The Bronze Age succession tablet had recorded whether the seal would be inherited, elected or recallable.',
    empire+'Provincial hall with an old succession tablet on a lectern, candidates in white cloaks, electors holding clay tokens, the outgoing governor handing over a bronze seal, soft light.',[
      choice('elected','Seçimli mühür kaydını valiliğe uygula; seçim masrafını öde.','Apply the elected-seal record to the governorship and pay for the election.',[
        outcome('Eyalet ilk yöneticisini seçti. Seçim masrafı kasadan çıktı; başkent kararı isteksizce onayladı.','The province elected its first governor. The election was paid from the treasury; the capital approved reluctantly.',{resources:-3,stability:6,authority:-3},{flags:['elected_governorship'],relation:4})
      ],[{flag:'elected_seal'},{stat:'resources',minimum:3}]),
      choice('inherited','Miras mühür kaydını sürdür; valiliği aileye bırak.','Continue the inherited-seal record and leave the office to the family.',[
        outcome('Valilik ailede kaldı. Düzen sürdü; kentler yeni valiyi seçmediklerini hatırlattı.','The office stayed in the family. Order continued; the towns reminded everyone they had not chosen the new governor.',{authority:4,stability:-3},{flags:['hereditary_governorship']})
      ],[{flag:'inherited_seal'}]),
      choice('recallable','Geri alınabilir mühür kaydını uygula; meclis valiyi azledebilsin.','Apply the recallable-seal record so the council can dismiss the governor.',[
        outcome('Meclise azil hakkı verildi. Kentler güven duydu; vali her kararında meclisi hesaba katmak zorunda.','The council gained the right of dismissal. The towns felt secure; the governor must now reckon with the council in every ruling.',{authority:-4,stability:4},{flags:['recallable_governorship'],relation:3})
      ],[{flag:'recallable_seal'}]),
      choice('council_vote','Ardıllığı bu kez eyalet meclisinin oyuna bırak; oylama masrafını öde.','Leave the succession to a vote of the provincial council this time and pay for the vote.',[
        outcome('Meclis yeni valiyi oyladı. Eski tablet bir kenarda kaldı; karar yalnız bu ardıllık için geçerli.','The council voted for the new governor. The old tablet was set aside; the ruling holds for this succession only.',{resources:-3,stability:3,authority:-2},{relation:2})
      ],[{stat:'resources',minimum:3}])
    ],{once:true,chain:'public_voice',eraRole:'conclusion',requirements:[{completedCard:'succession_tablet'},{completedCard:'governor_recall'}]});

  card('merchant_grain_rights',4,'legacy','Yabancı Tüccarın Tahıl Hakkı','The Foreign Merchants’ Grain Rights',
    'Deniz aşırı tahıl sözleşmesinden sonra yabancı tüccarlar eyalet pazarında kalıcı haklar istiyor. Tunç Çağı’ndaki kervan sözleşmesi yabancıların pazarda eşit mi yoksa ayrıcalıklı mı olacağını kaydetmişti.',
    'After the overseas grain contract, foreign merchants want lasting rights in the provincial market. The Bronze Age caravan charter had recorded whether foreigners would trade as equals or with privileges.',
    empire+'Provincial market hall with foreign merchants presenting an old caravan charter tablet, local traders frowning, a magistrate weighing the claim, grain sacks and amphorae, bright light.',[
      choice('equal','Eşit pazar kaydını uygula; yabancılara yerli tüccarla aynı hakları ver.','Apply the equal-market record and give foreigners the same rights as local traders.',[
        outcome('Yabancılar yerli tüccarlarla aynı vergiyi ödedi. Kâtip masrafı kasadan çıktı; pazar canlandı.','The foreigners paid the same dues as local traders. The clerk’s cost came from the treasury; the market came alive.',{resources:-3,stability:4},{flags:['provincial_equal_grain_market'],relation:3})
      ],[{flag:'equal_market'},{stat:'resources',minimum:3}]),
      choice('privilege','Konuk ayrıcalığı kaydını sürdür; yabancılara ayrı rıhtım ver.','Continue the guest-privilege record and give the foreigners their own quay.',[
        outcome('Yabancılar kendi rıhtımlarına kavuştu. Yerli tüccarlar ayrıcalığa itiraz etti.','The foreigners got their own quay. Local traders objected to the privilege.',{authority:2,stability:-3},{flags:['provincial_foreign_quay'],relation:2})
      ],[{flag:'guest_privilege'}]),
      choice('local','Kalıcı hakkı reddet; yabancılar yalnız sözleşmeyle gelsin.','Refuse lasting rights; foreigners may come only by contract.',[
        outcome('Kalıcı hak verilmedi. Yerli tüccarlar sevindi; yabancılar bir sonraki sözleşmeyi pahalı yazacaklarını söyledi.','No lasting right was granted. Local traders rejoiced; the foreigners said the next contract would be dearer.',{authority:1,stability:-2},{relation:-3})
      ])
    ],{once:true,chain:'hospitality',eraRole:'conclusion',requirements:[{completedCard:'caravan_charter'},{completedCard:'grain_contract'}]});
}
