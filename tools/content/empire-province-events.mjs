// Phase 3 second package (195 → 210): fifteen more Ancient Empires events. Era 4 stays closed
// (ERA4_GATE.enabled:false); these raise the authored inventory to 30/40 cards, 17/24 recurring,
// 6/8 conclusions and 6/8 bridges. One legal-reform event grants civil_law conditionally and at a cost.
//
// Ledger additions — still schema-v1 flags only, no new persistent state:
//   garrison wages  garrison_pay_arrears (one open tier; paying clears it, a later rotation is new pay)
//   highways        caravan_insurance_pool | caravan_escort_contract          (mutually exclusive)
//   grain           grain_famine_store | grain_price_ceiling                   (mutually exclusive)
//   customs         river_customs_public | river_customs_farmed                (mutually exclusive)
//   coinage         debased_coinage (one tier; only a paid recoinage clears it)
//   watch           watch_guild_public | watch_guild_private                   (mutually exclusive)
// Same rules as empire-events.mjs: paying choices require the reserve up front; an old right grants a
// hearing, a precedent or a discount and never nets resources; no paid debt is reopened and no earlier
// record is erased.
export const PROVINCE_LEDGER_EXCLUSIVE = [
  ['caravan_insurance_pool','caravan_escort_contract'],
  ['grain_famine_store','grain_price_ceiling'],
  ['river_customs_public','river_customs_farmed'],
  ['watch_guild_public','watch_guild_private']
];

export function addEmpireProvinceEvents({card,choice,outcome,delayed}) {
  const later=(turns,tr,en,stats,flags=[])=>[delayed(turns,4,tr,en,stats,flags)];
  const context=(result,requirements)=>({...result,requirements});
  const drop=(result,flags)=>{result.effect.removeFlags=flags;return result;};
  const empire='Fictional composite ancient empire, cut limestone and marble, wax tablets and papyrus rolls, bronze and iron hand tools, wool tunics and cloaks, no stirrups, no paper books, no gunpowder; ivory, gold and dusty terracotta palette, portrait composition. ';

  // ——— Eight recurring provincial crises (17/24 with the first package) ———
  card('garrison_rotation',4,'logistics','Nöbet Değişimi','The Changing of the Garrison',
    'Sınır garnizonunun nöbet süresi doldu. Yeni birlik yola çıkmadan önce eski askerler birikmiş üç aylık ücretlerini istiyor. Komutan, ödenmeyen askerlerin kasaba kapısında bekleyeceğini söylüyor.',
    'The frontier garrison’s tour has ended. Before the relief column marches, the outgoing soldiers demand three months of back pay. The commander says unpaid men will wait at the town gate.',
    empire+'Two files of soldiers passing each other at a stone frontier gate, paymaster’s table with bronze scales and coin bags, tired veterans with rolled cloaks, grey dawn light.',[
      choice('pay','Birikmiş ücreti öde; nöbeti zamanında değiştir.','Pay the back wages and change the watch on time.',[
        drop(outcome('Askerler ücretlerini sayıp yürüdü. Kasa hafifledi; yeni birlik kapıyı boş buldu.','The soldiers counted their pay and marched off. The treasury thinned; the relief column found the gate clear.',{resources:-8,authority:4,stability:3}),['garrison_pay_arrears'])
      ],[{stat:'resources',minimum:8}]),
      choice('note','Ücreti tarihli bir senede bağla.','Bind the wages to a dated note.',[
        context(outcome('Askerler senedi kabul etti ve ayrıldı. Ücret borcu valilik defterinde açık duruyor.','The soldiers accepted the note and left. The wage debt stands open in the governorate ledger.',{authority:-2,stability:-3},{id:'first',probability:0.5,flags:['garrison_pay_arrears']}),[{absentFlag:'garrison_pay_arrears'}]),
        context(outcome('İkinci senet geri çevrildi. Askerler kapıyı tuttu; kasabalılar pazar gününü evde geçirdi.','A second note was refused. The soldiers held the gate; townspeople spent market day indoors.',{authority:-5,stability:-8,population:-1},{id:'refused',probability:0.5,flags:['recorded_provincial_dissent']}),[{flag:'garrison_pay_arrears'}])
      ]),
      choice('militia','Yerel gençleri ücretli yedek olarak yaz; eski birliği eve gönder.','Enlist local youths as paid reserves and send the old unit home.',[
        outcome('Gençler nöbeti devraldı. Tarlalar iki çift el kaybetti; ücretleri kasabadan ödendi.','The youths took over the watch. The fields lost hands; their pay came from the town.',{resources:-5,population:-2,authority:3,stability:2})
      ],[{stat:'resources',minimum:5},{stat:'population',minimum:10}]),
      choice('contract','İkmal sözleşmesinin taksit takvimine ücreti de ekle.','Add the wages to the supply contract’s installment calendar.',[
        drop(outcome('Ücretler taksitlere bağlandı. Muhasebeci iki defteri tek takvimde birleştirdi.','The wages were tied to the installments. The accountant merged two ledgers into one calendar.',{resources:-6,authority:3,stability:4,knowledge:1}),['garrison_pay_arrears'])
      ],[{flag:'garrison_supply_contract'},{stat:'resources',minimum:6}])
    ],{eraRole:'recurring'});

  card('caravan_bandits',4,'roads','Yol Haydutları','Bandits on the Highway',
    'Doğu yolunda iki kervan soyuldu. Tüccarlar ya ücretli muhafız ya da ortak bir kervan sigortası istiyor. Sigorta sandığına her kervan pay koyacak; yağmalanan yük o sandıktan ödenecek.',
    'Two caravans were robbed on the eastern road. Merchants want either paid guards or a shared caravan insurance. Every caravan would pay into the chest, and plundered cargo would be paid out of it.',
    empire+'Plundered ox cart on a hillside road with scattered amphorae, merchants and a magistrate counting losses on a wax tablet, distant rocky pass, harsh afternoon light.',[
      choice('insurance','Ortak sigorta sandığı kur; ilk katkıyı kamu koysun.','Found a shared insurance chest and make the first contribution from the treasury.',[
        drop(outcome('Sandık mühürlendi. Tüccarlar pay yazdı; ilk kayıp sandıktan ödendi.','The chest was sealed. Merchants pledged shares; the first loss was paid from the chest.',{resources:-7,stability:4,knowledge:2},{flags:['caravan_insurance_pool'],delayed:later(5,'Kervan payları sandığa girdi; kamu katkısının bir kısmı geri döndü.','Caravan shares entered the chest; part of the public contribution came back.',{resources:3})}),['caravan_escort_contract'])
      ],[{stat:'resources',minimum:7}]),
      choice('escort','Kervanlara ücretli silahlı muhafız ver.','Give the caravans paid armed escorts.',[
        drop(outcome('Muhafızlar kafilelerle yürüdü. Haydutlar geri çekildi; ücret bordrosu kabardı.','Guards marched with the convoys. The bandits fell back; the payroll swelled.',{resources:-9,authority:4,stability:2},{flags:['caravan_escort_contract']}),['caravan_insurance_pool'])
      ],[{stat:'resources',minimum:9}]),
      choice('towers','Bakımlı yolda gözcü kuleleri kur.','Build watch posts along the maintained road.',[
        outcome('Kuleler taşla yükseldi. Bakımlı yol işaret ateşleriyle birbirine bağlandı.','The posts rose in stone. Signal fires linked the maintained road from end to end.',{resources:-5,authority:2,stability:3,environment:-1})
      ],[{flag:'imperial_road_maintained'},{stat:'resources',minimum:5}]),
      choice('ignore','Tüccarları kendi başlarına bırak.','Leave the merchants to fend for themselves.',[
        outcome('Kasa ödemedi. Kervanlar yolu terk etti; pazar vergisi azaldı.','The treasury paid nothing. Caravans abandoned the road; market tolls shrank.',{authority:-3,stability:-5},{delayed:later(4,'Yolu terk eden kervanlar yüzünden pazar geliri düştü.','Market revenue fell as caravans avoided the road.',{resources:-5})})
      ])
    ],{eraRole:'recurring'});

  card('grain_ceiling',4,'economy','Tahıl Fiyatının Tavanı','A Ceiling on Grain',
    'Kıtlık söylentisiyle tahıl fiyatı bir haftada iki katına çıktı. Halk fiyat tavanı istiyor; tüccarlar tavan konursa ambarlarını kapatacaklarını söylüyor. Valilik ayrıca bir kıtlık deposu kurmayı düşünüyor.',
    'On rumors of famine the price of grain doubled in a week. The people want a price ceiling; merchants say they will shut their granaries if one is imposed. The governorate is also weighing a famine store.',
    empire+'Crowded grain market under a stone portico, price tablet chalked twice over, merchants guarding sacks, magistrate with a bronze grain measure, dusty yellow light.',[
      choice('store','Kıtlık deposu kur; tahılı piyasa fiyatından satın al.','Found a famine store and buy grain at market price.',[
        drop(outcome('Depo doldu ve kapısı mühürlendi. Kasa boşaldı; fiyat yavaşça geriledi.','The store filled and its door was sealed. The treasury emptied; prices slowly eased.',{resources:-10,stability:5,population:1},{flags:['grain_famine_store'],delayed:later(6,'Depodaki tahıl kıtlıkta maliyetine satıldı.','The stored grain was sold at cost during the shortage.',{resources:4,stability:2})}),['grain_price_ceiling'])
      ],[{stat:'resources',minimum:10}]),
      choice('ceiling','Fiyat tavanı ilan et.','Proclaim a price ceiling.',[
        drop(outcome('Tavan meydanda okundu. Halk rahatladı; tüccarlar ambar kapılarını yarı kapattı.','The ceiling was read in the forum. People were relieved; merchants half-closed their granary doors.',{stability:4,authority:-2},{flags:['grain_price_ceiling'],delayed:later(4,'Tavanın altında satmayan tüccarlar ambarlarını kapattı; pazar boşaldı.','Merchants unwilling to sell under the ceiling shut their stores; the market emptied.',{resources:-4,stability:-5})}),['grain_famine_store'])
      ]),
      choice('free','Fiyatı serbest bırak; tüccarlardan pazar vergisi al.','Leave prices free and tax the merchants’ sales.',[
        outcome('Vergi geldi. Yoksul haneler ekmeği yarıya böldü; birkaç aile göç yoluna çıktı.','The tax came in. Poor households halved their bread; a few families took the road out.',{resources:5,stability:-6,population:-2})
      ]),
      choice('measure','Ortak ölçü kabıyla tartıları denetlet; hileli tüccarı cezalandır.','Check the scales against the common measure and fine cheating merchants.',[
        outcome('Ölçü kabı pazara getirildi. Hileli tartılar kırıldı; denetçiler ücretlerini aldı.','The common measure was brought to market. False scales were broken; the inspectors were paid.',{resources:-4,knowledge:3,stability:5})
      ],[{flag:'common_measure'},{stat:'resources',minimum:4}])
    ],{eraRole:'recurring'});

  card('river_customs',4,'taxation','Nehir Gümrüğü','The River Customs',
    'Nehirden inen mavnalar artık eyalet sınırını geçiyor. Valilik her yükten gümrük almak istiyor. Gümrüğü kamu memurları da toplayabilir, en yüksek teklifi veren bir mültezime de kiralanabilir.',
    'Barges coming downriver now cross the provincial border. The governorate wants customs on every cargo. Public officers could collect it, or it could be leased to the highest-bidding tax farmer.',
    empire+'River customs post on a stone jetty, flat-bottomed barges with jars and timber, customs officer weighing cargo on bronze balance, boatmen arguing, bright water reflections.',[
      choice('public','Kamu gümrükçüsü ata; ücretini ve terazisini öde.','Appoint a public customs officer and pay for his wage and scales.',[
        drop(outcome('Gümrükçü yemin etti. Terazi damgalandı; ilk mavnalar sırayla tartıldı.','The officer took his oath. The scales were stamped; the first barges were weighed in turn.',{resources:-6,knowledge:3,stability:3},{flags:['river_customs_public'],delayed:later(4,'İlk gümrük geliri kasaya girdi.','The first customs revenue entered the treasury.',{resources:5})}),['river_customs_farmed'])
      ],[{stat:'resources',minimum:6}]),
      choice('farm','Gümrüğü mültezime kirala.','Lease the customs to a tax farmer.',[
        drop(outcome('Mültezim peşin ödedi. Mavnacılar her yük için pazarlık etmek zorunda kaldı.','The tax farmer paid in advance. Boatmen had to haggle over every cargo.',{resources:6,authority:2,stability:-5},{flags:['river_customs_farmed'],delayed:later(5,'Mültezimin baskısından kaçan mavnalar başka nehir koluna döndü.','Barges fleeing the farmer’s squeeze turned to another branch of the river.',{resources:-3,stability:-2})}),['river_customs_public'])
      ]),
      choice('waive','Gümrük alma; nehir ticaretini serbest bırak.','Levy no customs and leave river trade free.',[
        outcome('Mavnalar durmadan geçti. Valilik, kasabanın payını vermediğini kaydetti.','Barges passed without stopping. The governorate recorded that the town had withheld its share.',{authority:-4,stability:2,knowledge:-1})
      ]),
      choice('quay','Rıhtım hesabının kayıt usulünü gümrüğe uygula.','Apply the quay account’s recording method to the customs.',[
        drop(outcome('Rıhtım kâtipleri gümrük defterini aynı usulle açtı. Kurulum ucuzladı; yeni bir hak doğmadı.','Quay clerks opened the customs ledger with the same method. Setup was cheaper; no new privilege arose.',{resources:-4,knowledge:4,stability:4},{flags:['river_customs_public'],delayed:later(4,'Gümrük geliri kurulum masrafını karşıladı.','Customs revenue covered the setup cost.',{resources:4})}),['river_customs_farmed'])
      ],[{flag:'quay_public_account'},{stat:'resources',minimum:4}])
    ],{eraRole:'recurring'});

  card('irrigation_court',4,'water','Sulama Mahkemesi','The Irrigation Court',
    'Kurak bir yazda yukarı köyler su arkını erken kapattı; aşağıdaki tarlalar çatladı. İki taraf valilik mahkemesine geldi. Yargıç su saatlerini yeniden bölebilir, ama ölçüm, tanık ve bekçi ücretli.',
    'In a dry summer the upper villages closed the channel early and the lower fields cracked. Both sides came to the governorate court. The judge can redivide the water hours, but measuring, witnesses and watchmen must be paid.',
    empire+'Open-air court beside an irrigation sluice, judge on a stone bench, farmers from upper and lower villages with clay water-hour tablets, cracked fields beyond, white summer glare.',[
      choice('hours','Su saatlerini mahkemede yeniden böl; ark bekçisi tut.','Redivide the water hours in court and hire a channel watchman.',[
        outcome('Saatler taş levhaya kazındı. Bekçi ücretini aldı; aşağı tarlalar yeniden sulandı.','The hours were carved on a stone tablet. The watchman was paid; the lower fields were watered again.',{resources:-7,environment:3,stability:5,knowledge:2})
      ],[{stat:'resources',minimum:7}]),
      choice('upstream','Yukarı köylerin eski önceliğini onayla.','Confirm the upper villages’ old priority.',[
        outcome('Yukarı köyler kazandı. Aşağıdaki aileler hasat beklemeden şehre indi.','The upper villages won. Lower families went down to the city without waiting for harvest.',{authority:3,stability:-6,population:-2})
      ]),
      choice('levy','Ortak su vergisi kaydını delil say.','Accept the shared water-levy record as evidence.',[
        outcome('Vergiyi birlikte ödeyenler suyu da birlikte aldı. Karar emsal olarak yazıldı.','Those who paid the levy together received the water together. The ruling was written as precedent.',{resources:-4,stability:6,environment:3},{flags:['lawful_review_precedent']})
      ],[{flag:'provincial_water_levy_shared'},{stat:'resources',minimum:4}]),
      choice('compact','Eski su günleri anlaşmasını emsal göster.','Cite the old water-day compact as precedent.',[
        outcome('Eski anlaşma okundu. Duruşma kısaldı; bekçi yine ücretle tutuldu.','The old compact was read. The hearing was shorter; the watchman was still hired for a wage.',{resources:-3,stability:7,knowledge:3})
      ],[{flag:'water_compact'},{stat:'resources',minimum:3}])
    ],{eraRole:'recurring'});

  card('quarry_collapse',4,'production','Taş Ocağında Göçük','Collapse at the Quarry',
    'Su kemeri ve yol için taş kesilen ocakta bir galeri çöktü; iki işçi yaralandı. Ocak kâhyası kazıya hemen devam etmek istiyor. İşçiler destek kirişi, su pompası ve yaralılar için tazminat bekliyor.',
    'A gallery collapsed in the quarry cutting stone for the aqueduct and road; two workers were injured. The quarry steward wants to resume at once. The workers expect timber props, a water lift and compensation for the injured.',
    empire+'Limestone quarry face with a collapsed gallery, workers carrying an injured man on a plank, timber props stacked nearby, steward with tally stick, choking pale dust.',[
      choice('props','Destek kirişi ve tazminat öde; kazıyı yavaşlat.','Pay for props and compensation and slow the cutting.',[
        outcome('Kirişler yerine çakıldı. Yaralıların ailesi tazminatını aldı; taş daha yavaş geldi.','The props were wedged in place. The injured men’s families were compensated; stone came more slowly.',{resources:-8,stability:5,environment:-2},{flags:['quarry_safety_rule']})
      ],[{stat:'resources',minimum:8}]),
      choice('push','Kazıya devam et; yaralıları ailelerine gönder.','Keep cutting and send the injured home to their families.',[
        outcome('Taş zamanında çıktı. İşçiler ertesi sabah ocağa yarım ekiple geldi.','The stone came out on time. The next morning the workers came to the quarry at half strength.',{resources:4,population:-2,stability:-6},{flags:['recorded_provincial_dissent'],relations:{keepers:-4}})
      ]),
      choice('close','Galeriyi kapat; taşı uzaktaki ocaktan taşı.','Close the gallery and haul stone from a distant quarry.',[
        outcome('Galeri mühürlendi. Uzak ocağın taşı pahalı ama sağlamdı.','The gallery was sealed. Stone from the distant quarry was costly but sound.',{resources:-5,authority:-2,environment:3},{delayed:later(4,'Uzak ocaktan gelen taşın taşıma bedeli ödendi.','The haulage for stone from the distant quarry was paid.',{resources:-3})})
      ],[{stat:'resources',minimum:5}]),
      choice('care','Mahalle bakım hesabıyla yaralılara bakım ve tazminat düzenle.','Use the ward care account to arrange care and compensation.',[
        outcome('Bakımcılar yaralıları kayıtlı sırayla gördü. Tazminat ödendi; kazı bir hafta durdu.','Carers saw the injured in their recorded order. Compensation was paid; cutting paused for a week.',{resources:-4,stability:6,population:1},{flags:['quarry_safety_rule']})
      ],[{flag:'public_care_settlement'},{stat:'resources',minimum:4}])
    ],{eraRole:'recurring'});

  card('coin_assay',4,'law','Sikkenin Ayarı','The Weight of the Coin',
    'Pazarda gümüşü az, bakırı çok sikkeler dolaşıyor. Darphane ustası ayarı düşürmenin kasayı rahatlatacağını söylüyor. Tüccarlar ise sahte paranın kimin damgasıyla basıldığının bulunmasını istiyor.',
    'Coins thin in silver and heavy in copper circulate in the market. The mint master says lowering the standard would ease the treasury. Merchants want to know whose die struck the false money.',
    empire+'Small provincial mint with anvil and coin dies, assayer cutting a suspect coin on a touchstone, merchants leaning over a table of silver and copper pieces, lamp and furnace light.',[
      choice('assay','Sikkeleri tarttır; sahte damgayı bulmak için ayarcı tut.','Weigh the coins and hire an assayer to trace the false die.',[
        outcome('Ayarcı sahte kalıbı bir kuyumcu atölyesinde buldu. Güven döndü; ücreti kasadan çıktı.','The assayer found the false die in a goldsmith’s shop. Trust returned; his fee came from the treasury.',{resources:-6,knowledge:4,stability:4,authority:2})
      ],[{stat:'resources',minimum:6}]),
      choice('debase','Ayarı düşür; aynı gümüşten daha çok sikke bas.','Lower the standard and strike more coins from the same silver.',[
        outcome('Kasa sikkeyle doldu. Pazarda fiyat etiketleri aynı hafta yeniden yazıldı.','The treasury filled with coin. Market prices were rewritten that same week.',{resources:7,stability:-6,knowledge:-1},{flags:['debased_coinage'],delayed:later(5,'Fiyatlar yükseldi; garnizon ücretini eski ayarla istedi.','Prices rose; the garrison demanded its pay at the old standard.',{resources:-5,stability:-3})})
      ],[{absentFlag:'debased_coinage'}]),
      choice('recoin','Bozuk sikkeleri topla; tam ayarla yeniden bas.','Call in the debased coins and reissue them at full standard.',[
        drop(outcome('Eski sikkeler eritildi. Gümüş açığı kasadan kapatıldı; pazar yeniden tartıyla güvendi.','The old coins were melted. The silver shortfall was made good from the treasury; the market trusted the scales again.',{resources:-10,stability:6,authority:3}),['debased_coinage'])
      ],[{flag:'debased_coinage'},{stat:'resources',minimum:10}]),
      choice('measure','Ortak ölçü kabını sikke tartısına emsal yap.','Make the common measure the precedent for weighing coin.',[
        outcome('Ölçü kabının kuralı sikkeye uygulandı. Tartı ustası ücretini aldı; hileli sikke pazardan çekildi.','The measure’s rule was applied to coin. The weigh master was paid; false coin was pulled from the market.',{resources:-4,knowledge:5,stability:5})
      ],[{flag:'common_measure'},{stat:'resources',minimum:4}])
    ],{eraRole:'recurring'});

  card('governor_petition',4,'province','Valiye Karşı Dilekçe','A Petition Against the Governor',
    'Kasabanın itiraz kayıtları tek bir dilekçede toplandı: zorla alınan tahıl, sayılmayan emek, tanınmayan berat. Dilekçe imparatorluk müfettişine gidebilir. Vali ise dilekçe sahiplerinin adlarını istiyor.',
    'The town’s recorded objections were gathered into a single petition: grain taken by force, labor left uncounted, charters ignored. The petition could go to the imperial inspector. The governor wants the petitioners’ names.',
    empire+'Ward representatives sealing a long papyrus petition in a dim colonnade, governor’s messenger waiting at the steps, wax seals and a courier’s satchel, cool evening shadows.',[
      choice('inspector','Dilekçeyi ücretli bir haberciyle müfettişe gönder.','Send the petition to the inspector with a paid courier.',[
        outcome('Müfettiş dilekçeyi kabul etti ve duruşma tarihi verdi. Vali kasabaya soğuk davrandı.','The inspector accepted the petition and set a hearing date. The governor turned cold toward the town.',{resources:-6,stability:6,authority:-4,knowledge:2},{flags:['lawful_review_precedent','governor_petition_heard']})
      ],[{stat:'resources',minimum:6}]),
      choice('names','Valiye adları ver; dilekçeyi geri çek.','Give the governor the names and withdraw the petition.',[
        outcome('Vali memnun kaldı. Dilekçeyi imzalayanlar kapıda sorgulandı; itiraz kayıtları yerinde duruyor.','The governor was satisfied. The signatories were questioned at the gate; the records of objection still stand.',{authority:4,stability:-9},{relations:{keepers:-6}})
      ]),
      choice('mediate','Valiyle mahalle temsilcilerini ortak bir duruşmada yüzleştir.','Bring the governor and ward representatives to a joint hearing.',[
        outcome('Duruşma uzun ve masraflıydı. İki taraf da kendi defterini masaya koydu.','The hearing was long and costly. Both sides laid their ledgers on the table.',{resources:-4,stability:4,authority:-1,knowledge:2})
      ],[{stat:'resources',minimum:4}]),
      choice('precedent','Önceki duruşma emsalini göster; dilekçeyi hızlı yola al.','Cite the earlier hearing’s precedent and put the petition on the quick track.',[
        outcome('Emsal sayesinde dilekçe sıraya girmeden okundu. Kâtip ücreti yine ödendi.','Thanks to the precedent the petition was read without waiting its turn. The clerk’s fee was still paid.',{resources:-3,stability:7,knowledge:2},{flags:['governor_petition_heard']})
      ],[{flag:'lawful_review_precedent'},{stat:'resources',minimum:3}])
    ],{eraRole:'recurring',requirements:[{flag:'recorded_provincial_dissent'}]});

  // ——— Three bridges carrying Bronze records into the province (6/8) ———
  card('customs_house_ledger',4,'legacy','Rıhtımdan Gümrük Evine','From Quay to Customs House',
    'Eski rıhtım vergisi artık bir imparatorluk gümrük evine dönüşüyor. Rıhtım hesabını tutan kâtipler aynı defterin gümrükte de açık tutulmasını istiyor. Valilik ise yeni bir mültezim getirmeyi düşünüyor.',
    'The old quay levy is becoming an imperial customs house. The clerks who kept the quay account want the same ledger kept open at customs. The governorate is considering bringing in a new tax farmer.',
    empire+'New customs house with a marble threshold beside an older wooden quay, quay clerks carrying clay tablets into the hall, tax farmer with sealed bid, morning mist on the river.',[
      choice('account','Rıhtım hesabını gümrük defterine taşı; kâtiplere öde.','Carry the quay account into the customs ledger and pay the clerks.',[
        drop(outcome('Eski hesap gümrük defterinin ilk sayfası oldu. Kâtipler ücretini aldı; her yük görünür kaldı.','The old account became the first page of the customs ledger. The clerks were paid; every cargo stayed visible.',{resources:-5,knowledge:4,stability:5},{flags:['river_customs_public']}),['river_customs_farmed'])
      ],[{flag:'quay_public_account'},{stat:'resources',minimum:5}]),
      choice('clerks','Yeni kamu kâtipleri ata; eski kaydı yalnız danış.','Appoint new public clerks and consult the old record only.',[
        drop(outcome('Yeni kâtipler deftere baştan başladı. Kurulum pahalıydı ama gümrük kamuda kaldı.','The new clerks started the ledger afresh. Setup was costly, but customs stayed public.',{resources:-7,knowledge:3,stability:3},{flags:['river_customs_public']}),['river_customs_farmed'])
      ],[{stat:'resources',minimum:7}]),
      choice('farm','Gümrüğü mültezime kirala; rıhtım hesabı kentte kalsın.','Lease the customs to a tax farmer and leave the quay account in the city.',[
        drop(outcome('Mültezim peşin ödedi. Rıhtım kâtipleri eski defteri kent arşivine kaldırdı.','The tax farmer paid in advance. The quay clerks moved the old ledger to the city archive.',{resources:5,authority:2,stability:-5},{flags:['river_customs_farmed']}),['river_customs_public'])
      ])
    ],{once:true,chain:'river_memory',eraRole:'bridge',requirements:[{completedCard:'quay_levy'}]});

  card('harbor_ward_roll',4,'legacy','Liman Mahallesinin Vatandaşları','Citizens of the Harbor Ward',
    'Liman mahallesinde doğan çocuklar eyalet vatandaşlık defterine yazılmak istiyor. Eski liman ikamet kaydı kimin hangi mevsim kaldığını gösteriyor. Valilik mevsimlik kampları vatandaş saymak istemiyor.',
    'Children born in the harbor ward want to be entered in the provincial citizens’ roll. The old harbor residency record shows who stayed in which season. The governorate does not want to count the seasonal camps as citizens.',
    empire+'Harbor ward street with fishing nets and storehouses, families presenting household tokens to a provincial registrar, old residency tablets on a crate, gulls and salt light.',[
      choice('ward','Kalıcı mahalle kaydını vatandaşlık duruşmasında delil say.','Accept the permanent ward record as evidence in a citizenship hearing.',[
        drop(outcome('Kayıt okundu ve aileler deftere yazıldı. Tanık ücretleri ödendi; vergi de birlikte geldi.','The record was read and the families entered the roll. Witness fees were paid; taxes came with it.',{resources:-5,stability:7,population:3,knowledge:2},{flags:['provincial_residency_hearing']}),['restricted_provincial_residency'])
      ],[{flag:'harbor_resident_ward'},{stat:'resources',minimum:5}]),
      choice('gate','Eski kent kapısı vatandaşlığını limana da uygula.','Extend the old city-gate citizenship to the harbor.',[
        drop(outcome('Kapı emsali limana taşındı. Duruşma kısaldı; kâtip ve tanık yine ödendi.','The gate precedent was carried to the harbor. The hearing was short; clerk and witnesses were still paid.',{resources:-4,stability:6,population:2},{flags:['provincial_residency_hearing']}),['restricted_provincial_residency'])
      ],[{flag:'guest_citizenship'},{stat:'resources',minimum:4}]),
      choice('hearing','Ücretli tanıklarla genel bir duruşma aç.','Open a general hearing with paid witnesses.',[
        drop(outcome('Her aile tek tek dinlendi. Duruşma haftalarca sürdü; sonunda çoğu deftere girdi.','Every family was heard one by one. The hearing ran for weeks; in the end most entered the roll.',{resources:-8,stability:4,population:2,authority:-2},{flags:['provincial_residency_hearing']}),['restricted_provincial_residency'])
      ],[{stat:'resources',minimum:8}]),
      choice('permits','Yalnız ikamet izni ver; oy hakkını sonraya bırak.','Grant residence permits only and leave the vote for later.',[
        drop(outcome('İzin harcı kasaya girdi. Liman aileleri kaldı, ama meclis kapısı onlara kapalı.','Permit fees entered the treasury. The harbor families stayed, but the assembly door is closed to them.',{resources:4,stability:-6},{flags:['restricted_provincial_residency']}),['provincial_residency_hearing'])
      ])
    ],{once:true,chain:'hospitality',eraRole:'bridge',requirements:[{completedCard:'harbor_residency'}]});

  card('watch_guild_charter',4,'legacy','Muhafız Loncasının Sözleşmesi','The Watch Guild’s Contract',
    'Kentin eski gece devriyesi eyalet muhafız loncasına bağlanmak istiyor. Lonca ücretli nöbet, yemin ve hesap defteri teklif ediyor. Gece nöbetini kamunun mu tüccarların mı ödediği eski kayıtta yazılı.',
    'The city’s old night patrol wants to join the provincial watch guild. The guild offers paid watches, an oath and an account book. The old record states whether the public or the merchants paid for the night watch.',
    empire+'Guildhall courtyard at dusk, night watchmen with lanterns and bronze-tipped staves taking an oath, guild scribe with account book, old patrol tablet on a lectern.',[
      choice('public','Kamu nöbetini loncaya taşı; ücreti vergi defterinden öde.','Carry the public watch into the guild and pay it from the tax ledger.',[
        drop(outcome('Nöbetçiler loncaya yemin etti. Ücret vergiden çıktı; her mahalle aynı devriyeyi aldı.','The watchmen swore to the guild. Pay came from taxes; every ward got the same patrol.',{resources:-6,stability:7,authority:-1,knowledge:2},{flags:['watch_guild_public']}),['watch_guild_private'])
      ],[{flag:'public_night_watch'},{stat:'resources',minimum:6}]),
      choice('private','Özel nöbeti sözleşmeye çevir; tüccarlar lonca payını ödesin.','Turn the private watch into a contract and let merchants pay the guild share.',[
        drop(outcome('Tüccarlar lonca payını ödedi. Devriye yine onların sokaklarında yoğunlaştı.','The merchants paid the guild share. The patrol still crowded their own streets.',{authority:3,stability:-4},{flags:['watch_guild_private']}),['watch_guild_public'])
      ],[{flag:'private_night_watch'}]),
      choice('oath','Loncaya yemin ettir; ücreti valilikle yarı yarıya öde.','Have the guild swear its oath and split the wages with the governorate.',[
        drop(outcome('Valilik ücretin yarısını üstlendi. Lonca hem kente hem valiye hesap verir oldu.','The governorate took on half the wages. The guild now answers to both city and governor.',{resources:-5,authority:3,stability:3},{flags:['watch_guild_public']}),['watch_guild_private'])
      ],[{stat:'resources',minimum:5}]),
      choice('garrison','Loncayı reddet; nöbeti garnizona bağla.','Refuse the guild and attach the watch to the garrison.',[
        outcome('Askerler nöbeti devraldı. Mahalleler kendi nöbetçilerini kaybettiklerini yazdı.','Soldiers took over the watch. The wards recorded that they had lost their own watchmen.',{authority:4,stability:-5,knowledge:-2},{flags:['recorded_provincial_dissent']})
      ])
    ],{once:true,chain:'public_voice',eraRole:'bridge',requirements:[{completedCard:'night_patrol'}]});

  // ——— Three conditional conclusions: a Bronze close plus a completed imperial crisis (6/8) ———
  card('pasture_gate_levy',4,'legacy','Meranın Eyalet Kapısı','The Pasture at the Provincial Gate',
    'Sulama mahkemesinden sonra çobanlar da sürülerinin eyalet kapısından geçerken vergilendirileceğini öğrendi. Eski otlak uzlaşması mevsimlik geçişleri ve kuyu nöbetlerini kaydetmişti. Vergi memuru her başı aynı saymak istiyor.',
    'After the irrigation court, herders learned their flocks would be taxed at the provincial gate. The old grazing settlement had recorded seasonal crossings and well watches. The tax officer wants every head counted alike.',
    empire+'Flocks of sheep and goats funneling through a stone provincial gate, herders with crooks and a clay grazing tablet, tax officer counting with tally sticks, dusty pastoral light.',[
      choice('season','Ortak otlak uzlaşmasını emsal say; geçiş vergisini mevsime göre böl.','Treat the shared grazing settlement as precedent and divide the crossing levy by season.',[
        outcome('Kuyu nöbeti tutanların payı mevsime göre hesaplandı. Vergi düşmedi, ama doğru zamana bölündü.','Well watchers’ shares were reckoned by season. The levy was not reduced, but fell due at the right times.',{resources:-4,stability:7,environment:3,knowledge:2},{flags:['pasture_gate_precedent','lawful_review_precedent']})
      ],[{flag:'pasture_public_settlement'},{stat:'resources',minimum:4}]),
      choice('lease','Özel kira sözleşmelerini tanı; vergiyi kiracılar ödesin.','Recognize the private leases and make the leaseholders pay the levy.',[
        outcome('Kiracılar vergiyi ödedi ve sürüleri öne geçirdi. Küçük çobanlar kapıda bekledi.','The leaseholders paid and moved their flocks to the front. Small herders waited at the gate.',{authority:2,stability:-4},{flags:['pasture_gate_leasehold']})
      ],[{flag:'pasture_private_settlement'}]),
      choice('heads','Her başı aynı say; tam vergi al.','Count every head alike and take the full levy.',[
        outcome('Kasa doldu. Çobanlar sürüleri yan vadilere sürdü; otlak aşırı yüklendi.','The treasury filled. Herders drove their flocks into side valleys; the grazing was overloaded.',{resources:6,stability:-7,environment:-3},{flags:['recorded_provincial_dissent']})
      ])
    ],{once:true,chain:'pasture',eraRole:'conclusion',requirements:[{completedCard:'grazing_appeal'},{completedCard:'irrigation_court'}]});

  card('guest_assembly_bench',4,'legacy','Konukların Meclisteki Sırası','A Bench for the Guests',
    'Vatandaşlık duruşmalarından sonra kapı mahallesinin aileleri eyalet meclisinde bir sıra istiyor. Eski kapı vatandaşlığı onları kent defterine yazmıştı. Meclis, yeni sıranın bedelinin ve oy ağırlığının kimde olacağını tartışıyor.',
    'After the citizenship hearings, families of the gate ward ask for a bench in the provincial assembly. The old gate citizenship had entered them in the city roll. The assembly is arguing over who bears the new bench’s cost and voting weight.',
    empire+'Provincial assembly hall with tiered stone benches, gate-ward delegates holding citizenship tokens at the threshold, presiding magistrate and seated councillors, shafts of high window light.',[
      choice('seat','Kapı vatandaşlığını meclis temsiline çevir; seçim masrafını kamu ödesin.','Turn gate citizenship into assembly representation and fund the election publicly.',[
        outcome('Kapı mahallesi ilk temsilcisini seçti. Seçim masrafı kamudan çıktı; vergi yükü değişmedi.','The gate ward elected its first delegate. The election was publicly funded; the tax burden stayed the same.',{resources:-5,stability:8,population:2,authority:-2},{flags:['guest_assembly_seat']})
      ],[{flag:'guest_citizenship'},{stat:'resources',minimum:5}]),
      choice('advisory','Dış pazar ailelerine yalnız danışma hakkı ver.','Give the outer-market families advisory rights only.',[
        outcome('Pazar temsilcisi mecliste konuşabildi ama oy veremedi. Kâtip masrafı küçüktü.','The market delegate could speak in the assembly but not vote. The clerk’s cost was small.',{resources:-2,stability:2,authority:1},{flags:['guest_market_advisory']})
      ],[{flag:'guest_outer_market'},{stat:'resources',minimum:2}]),
      choice('deny','Sırayı reddet; temsil için yeniden vergi şartı koy.','Refuse the bench and reimpose a tax test for representation.',[
        outcome('Meclis kapısı kapandı. Eski vatandaşlık kaydı geçerli kaldı, fakat sesi meclise ulaşmadı.','The assembly door closed. The old citizenship record stood, but its voice did not reach the assembly.',{authority:3,stability:-7},{flags:['recorded_provincial_dissent']})
      ])
    ],{once:true,chain:'hospitality',eraRole:'conclusion',requirements:[{completedCard:'guest_gate'},{completedCard:'residency_hearing'}]});

  card('assembly_seal_appeal',4,'legacy','Eyalet Meclisinde Mühür','The Seal in the Provincial Assembly',
    'Valiye karşı dilekçeden sonra kentin eski mühür itirazı yeniden okundu. Mühür kararlarına itiraz hakkı artık eyalet meclisine gelen her vergi kararında istenebilir. Valilik bu hakkın yalnızca kent içinde geçerli olduğunu söylüyor.',
    'After the petition against the governor, the city’s old seal appeal was read again. The right to appeal sealed decisions could now be claimed against every tax ruling before the provincial assembly. The governorate says the right holds only inside the city.',
    empire+'Assembly floor with an old clay seal tablet held aloft beside a governor’s bronze decree, scribes and councillors leaning in, red wax seals on a table, warm lamplight.',[
      choice('appeal','Kentin itiraz hakkını eyalet meclisine taşı; kâtip ve tanık masrafını öde.','Carry the city’s right of appeal to the provincial assembly and pay clerk and witness costs.',[
        outcome('Hak meclis kayıtlarına girdi. İlk itiraz duruşması ücretli kâtiplerle görüldü.','The right entered the assembly records. The first appeal was heard with paid clerks.',{resources:-5,stability:8,authority:-3,knowledge:3},{flags:['provincial_appeal_right','lawful_review_precedent']})
      ],[{flag:'civic_appeal'},{stat:'resources',minimum:5}]),
      choice('precedence','Mühür önceliğini koru; itirazı yalnız mühür sahiplerine aç.','Keep seal precedence and open appeals only to seal holders.',[
        outcome('Mühür sahipleri yeni hakkı kendilerine ayırdı. Diğer aileler itiraz kapısını kapalı buldu.','Seal holders kept the new right for themselves. Other families found the appeal door shut.',{authority:4,stability:-5},{flags:['provincial_seal_precedence']})
      ],[{flag:'sealed_precedence'}]),
      choice('local','Hakkı kent içinde bırak; meclise taşıma.','Leave the right inside the city and do not carry it to the assembly.',[
        outcome('Eski hak kent mahkemesinde geçerli kaldı. Eyalet vergilerine karşı kullanılamadı.','The old right stayed valid in the city court. It could not be used against provincial taxes.',{authority:2,stability:-3,knowledge:-1},{flags:['provincial_appeal_local']})
      ])
    ],{once:true,chain:'public_voice',eraRole:'conclusion',requirements:[{completedCard:'seal_appeal'},{completedCard:'governor_petition'}]});

  // ——— Legal reform: civil_law is granted only with written precedent, knowledge and a paid drafting ———
  card('civil_code_draft',4,'law','Medeni Yasanın Taslağı','Drafting the Civil Code',
    'Mahkemelerde biriken emsaller artık tek bir yasa metninde toplanabilir. Hukukçular yazım, kopya ve tanık kurulları için ücret istiyor. Yasa herkese aynı usulü verecek; vali ve tüccarlar ise kendi ayrıcalıklarının da yazılmasını bekliyor.',
    'The precedents piling up in the courts could now be gathered into a single code. Jurists want fees for drafting, copying and witness boards. The code would give everyone the same procedure; the governor and merchants expect their own privileges to be written in as well.',
    empire+'Jurists at a long marble table compiling a code from stacks of wax tablets and papyrus rolls, copyists at side desks, governor’s envoy and merchants watching, clear morning light.',[
      choice('codify','Emsalleri tek yasada topla; yazıcıları ve kurulu öde.','Gather the precedents into one code and pay the copyists and the board.',[
        outcome('Yasa meydanda okundu. Herkes aynı usule bağlandı; yazım masrafı kasayı derinden kesti.','The code was read in the forum. Everyone was bound to the same procedure; drafting cut deep into the treasury.',{resources:-12,knowledge:8,stability:5,authority:-3},{technologies:['civil_law'],flags:['civil_code_public'],animation:'technology'})
      ],[{stat:'resources',minimum:12}]),
      choice('privileged','Yasayı yaz ama ayrıcalıkları ayrı maddelere koy.','Write the code but set privileges apart in separate articles.',[
        outcome('Yasa yürürlüğe girdi. Ayrıcalık maddeleri valiyi ve tüccarları memnun etti; mahallelerde itiraz yazıldı.','The code came into force. The privilege articles pleased the governor and merchants; objections were written in the wards.',{resources:-9,knowledge:5,authority:4,stability:-5},{technologies:['civil_law'],flags:['civil_code_privileged'],animation:'technology'})
      ],[{stat:'resources',minimum:9}]),
      choice('defer','Taslağı ertele; emsaller mahkemelerde kalsın.','Postpone the draft and leave the precedents in the courts.',[
        outcome('Hukukçular dağıldı. Her mahkeme kendi emsaline göre karar vermeye devam etti.','The jurists dispersed. Each court kept ruling by its own precedent.',{knowledge:-2,authority:-2})
      ])
    ],{eraRole:'reform',requirements:[{technology:'writing'},{flag:'lawful_review_precedent'},{stat:'knowledge',minimum:70}],exclusions:[{technology:'civil_law'}]});
}
