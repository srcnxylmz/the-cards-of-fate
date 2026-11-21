// Phase 3 groundwork (180 → 195): the first fifteen Ancient Empires events.
// Era 4 stays closed: these cards sit behind ERA4_GATE (enabled:false) and an inventory minimum.
//
// Provincial ledger — represented with existing schema-v1 flags, no second economy engine:
//   autonomy        province_local_steward | province_central_receiver        (mutually exclusive)
//   tribute         tribute_arrears → tribute_arrears_deep (bounded at two tiers); provincial_default_record
//   roads           imperial_road_maintained | imperial_road_worn               (mutually exclusive)
//   garrison        garrison_supply_contract (funded obligation with dated payments)
//   water           provincial_water_levy_shared | provincial_water_quota_private
//   workshops       guild_workshop_franchise | open_workshop_tender
//   citizenship     provincial_residency_hearing | restricted_provincial_residency
//   legitimacy      recorded_provincial_dissent, lawful_review_precedent
//   old bonds       provincial_bond_registry (carries actual Bronze bond state; never reopens paid debt)
// Every transaction costs resources when it pays; paying choices require the reserve up front.
// balanceEvidence: a complete inventory is not enough. Opening Era 4 also needs a recorded diagnostic
// balance acceptance (report path, source SHA, native CI run) and explicit user approval; the validator
// rejects enabled:true while this stays null. The Swift engine ignores the field.
export const ERA4_GATE = { enabled:false, minimumCards:40, minimumRecurring:24, minimumConclusions:8, minimumBridges:8,
  requiredRecurringCategories:['province','taxation','logistics','roads','water','production','citizenship','law'], balanceEvidence:null };
export const FUTURE_ERA_GATE = { enabled:false, minimumCards:40, minimumRecurring:24, minimumConclusions:8, minimumBridges:8, requiredRecurringCategories:[] };
export const LEDGER_EXCLUSIVE = [
  ['province_local_steward','province_central_receiver'],
  ['imperial_road_maintained','imperial_road_worn'],
  ['provincial_water_levy_shared','provincial_water_quota_private'],
  ['guild_workshop_franchise','open_workshop_tender'],
  ['provincial_residency_hearing','restricted_provincial_residency']
];

export function addEmpireEvents({card,choice,outcome,delayed}) {
  const later=(turns,tr,en,stats,flags=[])=>[delayed(turns,4,tr,en,stats,flags)];
  const context=(result,requirements)=>({...result,requirements});
  const drop=(result,flags)=>{result.effect.removeFlags=flags;return result;};
  const empire='Fictional composite ancient empire, cut limestone and marble, wax tablets and papyrus rolls, bronze and iron hand tools, wool tunics and cloaks, no stirrups, no paper books, no gunpowder; ivory, gold and dusty terracotta palette, portrait composition. ';

  // ——— Nine recurring administration / economy crises ———
  card('governor_seat',4,'province','Valinin Kürsüsü','The Governor’s Bench',
    'Başkent yeni eyalet için bir tahsildar atamak istiyor. Kasaba meclisi kendi seçtiği kâhyanın vergiyi daha az ama huzurla toplayacağını söylüyor. Her iki yolun da maaşı, tanığı ve itirazı olacak.',
    'The capital wants to appoint a receiver for the new province. The town council says its own elected steward would collect less tribute, but in peace. Either road carries wages, witnesses and appeals.',
    empire+'Provincial basilica hall, imperial receiver with sealed commission facing elected town steward and seated council, scribes with wax tablets, late afternoon light through columns.',[
      choice('steward','Yerel kâhyayı tanı; vergide yerel onayı öne al.','Recognize the local steward and put local consent ahead of revenue.',[
        drop(outcome('Kâhya kendi mahallelerinden topladı. İlk teslimat küçük kaldı; kasaba kapıları açık kaldı.','The steward collected from familiar wards. The first delivery was small; the town gates stayed open.',{resources:-3,authority:-4,stability:7},{flags:['province_local_steward'],relations:{keepers:5},delayed:later(4,'Yerel kâhyanın teslimatı geldi; başkent eksik payı not etti.','The local steward’s delivery arrived; the capital noted the shortfall.',{resources:4,authority:-2})}),['province_central_receiver'])
      ],[{absentFlag:'tribute_arrears_deep'},{stat:'resources',minimum:3}]),
      choice('receiver','Merkezden tahsildar ata; maaşını ve itiraz kurulunu öde.','Appoint a central receiver and fund his wage and an appeals hearing.',[
        context(drop(outcome('Tahsildar tam payı aldı. Kasaba onu tanımadı ama itiraz kurulu toplanabildi.','The receiver took the full share. The town did not accept him, but the appeals hearing could sit.',{resources:7,authority:5,stability:-6},{id:'firm',probability:0.5,flags:['province_central_receiver'],delayed:later(4,'Tahsildarın maaşı ve tanık ücretleri ödendi.','The receiver’s wage and witness fees were paid.',{resources:-5})}),['province_local_steward']),[{stat:'authority',minimum:45}]),
        context(drop(outcome('Zayıf otorite tahsildarı korumadı. Pay geldi, fakat kapılarda taş atıldı.','Weak authority could not shield the receiver. The share came, but stones were thrown at the gates.',{resources:5,authority:-3,stability:-10,population:-1},{id:'contested',probability:0.5,flags:['province_central_receiver'],relations:{hunters:-6},delayed:later(4,'Tahsildarın maaşı ve korumasının ücreti ödendi.','The receiver’s wage and his guards’ pay came due.',{resources:-7})}),['province_local_steward']),[{stat:'authority',maximum:44}])
      ],[{stat:'resources',minimum:5}]),
      choice('commission','Kâhya ve tahsildarı ortak bir hesap kuruluna bağla.','Bind steward and receiver to a joint accounting board.',[
        outcome('İki taraf aynı defteri tuttu. Kurul pahalıydı; kimse sessizce pay değiştiremedi.','Both sides kept one ledger. The board was costly; nobody could quietly alter a share.',{resources:-6,knowledge:5,stability:4,authority:2},{flags:['lawful_review_precedent']})
      ],[{flag:'accountable_rule'},{stat:'resources',minimum:6}])
    ],{eraRole:'recurring'});

  card('tribute_assessment',4,'taxation','Haraç Takdiri','The Tribute Assessment',
    'Eyalet sayım memurları bu yılın hasadını ölçtü. Haraç geçmiş yıllara göre değil, ambardaki gerçek ürüne göre istenecek. Kasaba bir kısmını şimdi ödeyebilir, tarihli bir senet imzalayabilir ya da ölçüme itiraz edebilir.',
    'Provincial assessors have measured this year’s harvest. Tribute will follow the grain actually in store, not past years. The town can pay part now, sign a dated note or contest the measurement.',
    empire+'Assessors measuring grain heaps with standard bronze measures in a provincial granary courtyard, town elders watching, tally sticks and wax tablets, hot noon light.',[
      choice('pay','Payın bir kısmını şimdi öde; senet açma.','Pay part now and open no note.',[
        outcome('Ambar hafifledi. Kasaba borçsuz kaldı ve memurlar bir sonraki ölçümü erteledi.','The granary emptied somewhat. The town stayed free of debt and the assessors postponed the next measurement.',{resources:-9,stability:5,authority:3})
      ],[{stat:'resources',minimum:9}]),
      choice('note','Tarihli bir haraç senedi imzala.','Sign a dated tribute note.',[
        context(outcome('Senet mühürlendi. Ürün ambarda kaldı; borç defterde açık duruyor.','The note was sealed. Grain stayed in store; the debt stands open in the ledger.',{resources:3,authority:-2},{id:'first',probability:0.5,flags:['tribute_arrears']}),[{absentFlag:'tribute_arrears'}]),
        context(outcome('İkinci senet ilkinin üstüne yazıldı. Memur artık bu kasabaya kredi açmayacağını söyledi.','A second note was written over the first. The assessor said this town would get no further credit.',{resources:2,authority:-4,stability:-3},{id:'second',probability:0.5,flags:['tribute_arrears_deep']}),[{flag:'tribute_arrears'}])
      ]),
      choice('appeal','Ölçüme itiraz et; tanık ve terazi ustası tut.','Contest the measurement and hire witnesses and a scale master.',[
        outcome('Terazi ustası ölçüyü düzeltti. Tanık ücretleri ödendi; tahsildar kasabayı unutmadı.','The scale master corrected the measure. Witness fees were paid; the receiver did not forget the town.',{resources:-4,knowledge:5,stability:3,authority:-3},{flags:['recorded_provincial_dissent']})
      ],[{stat:'resources',minimum:4}]),
      choice('bread_first','Önce ekmek tüccarının açık senedini kapat; haracı ertele.','Settle the open bread bond first and defer the tribute.',[
        drop(outcome('Eski borç ödendi ve kapandı. Haraç için yeni bir senet açıldı; ikisi ayrı defterlerde duruyor.','The old bond was paid and closed. A new note opened for the tribute; the two stand in separate ledgers.',{resources:-10,stability:6,authority:-2},{flags:['bread_bond_repaid','tribute_arrears']}),['bread_bond_open'])
      ],[{flag:'bread_bond_open'},{absentFlag:'tribute_arrears'},{stat:'resources',minimum:10}])
    ],{eraRole:'recurring',requirements:[{absentFlag:'tribute_arrears_deep'}]});

  card('arrears_reckoning',4,'taxation','Gecikmiş Hesap','The Reckoning of Arrears',
    'Tahsildar açık haraç senetlerini meydanda okuyor. Ödenmeyen her satır kasabanın yeni izinlerini bekletiyor. Tamamını ödemek ambarı boşaltır; ödememek ise mühürlü bir temerrüt kaydı demek.',
    'The receiver reads the open tribute notes aloud in the forum. Every unpaid line holds back the town’s new permits. Paying in full empties the granary; refusing means a sealed record of default.',
    empire+'Forum steps with receiver reading wax-tablet ledger aloud, worried households holding grain sacks, armed guard at a distance, overcast morning.',[
      choice('settle','Bütün açık senetleri ödeyip kapat.','Pay and close every open note.',[
        drop(outcome('Defter kapandı. Ambar inceldi; kasaba yeniden izin isteyebilir.','The ledger closed. The granary thinned; the town may request permits again.',{resources:-12,stability:6,authority:4}),['tribute_arrears','tribute_arrears_deep'])
      ],[{stat:'resources',minimum:12}]),
      choice('partial','Yalnız ikinci senedi öde; ilkini açık bırak.','Pay only the second note and keep the first open.',[
        drop(outcome('İkinci senet kapandı. İlk borç defterde açık kaldı ve faiz pazarlığı sürüyor.','The second note closed. The first debt stays open in the ledger while interest is negotiated.',{resources:-6,stability:2}),['tribute_arrears_deep'])
      ],[{flag:'tribute_arrears_deep'},{stat:'resources',minimum:6}]),
      choice('default','Ödemeyi reddet; temerrüt kaydını kabul et.','Refuse payment and accept a record of default.',[
        drop(outcome('Senetler mühürlenip arşive kondu. Muhafızlar iki ambarın kapısını kapattı; kasaba bir sonraki takdirde kredisiz kalacak.','The notes were sealed into the archive. Guards shut two granary doors; the town will face its next assessment without credit.',{authority:-6,stability:-8,population:-2},{flags:['provincial_default_record'],relation:-4}),['tribute_arrears','tribute_arrears_deep'])
      ])
    ],{eraRole:'recurring',requirements:[{flag:'tribute_arrears'}]});

  card('garrison_supply',4,'logistics','Garnizonun Ambarı','The Garrison’s Stores',
    'Sınır garnizonu kış erzağı istiyor. Yük arabaları ya bu kasabanın ambarından ya da başkentin parasıyla tutulan kervandan gelecek. Komutan, gecikmenin sınırdaki köyleri savunmasız bırakacağını söylüyor.',
    'The frontier garrison requests winter rations. The carts must come either from this town’s granary or from a convoy hired with the capital’s silver. The commander warns that delay leaves border villages exposed.',
    empire+'Frontier fort gate with ox carts of grain sacks, centurion-like commander and civilian quartermaster comparing tallies, cold wind, muted iron and straw tones.',[
      choice('contract','Ücretli ikmal sözleşmesi imzala; taşıyıcılara düzenli öde.','Sign a paid supply contract and pay carriers on schedule.',[
        outcome('Sözleşme mühürlendi. İlk kafile yola çıktı; taşıyıcıların taksitleri takvime yazıldı.','The contract was sealed. The first convoy left; the carriers’ installments were entered in the calendar.',{resources:-6,authority:4,stability:3},{flags:['garrison_supply_contract'],delayed:later(4,'İkmal sözleşmesinin ikinci taksiti ödendi.','The supply contract’s second installment was paid.',{resources:-4})})
      ],[{stat:'resources',minimum:10}]),
      choice('road','Bakımlı imparatorluk yolundan küçük kafilelerle gönder.','Send small convoys along the maintained imperial road.',[
        outcome('Yol arabaları taşıdı. Küçük kafileler ucuza geçti; yol aşınması da yazıldı.','The road carried the carts. Small convoys passed cheaply, and the road’s wear was recorded.',{resources:-4,authority:3,stability:2},{delayed:later(5,'Kafilelerin aşındırdığı yol taşları için usta ücreti istendi.','Masons asked to be paid for paving worn by the convoys.',{resources:-2})})
      ],[{flag:'imperial_road_maintained'},{stat:'resources',minimum:4}]),
      choice('delay','Sevkiyatı ertele; garnizona bekleme emri gönder.','Delay the shipment and order the garrison to wait.',[
        outcome('Ambar dolu kaldı. Sınır köyleri yağmacılara karşı yalnız kaldı; komutan şikâyetini başkente yazdı.','The granary stayed full. Border villages faced raiders alone; the commander wrote his complaint to the capital.',{authority:-6,stability:-3,population:-2},{relations:{hunters:-6}})
      ]),
      choice('requisition','Kasabaların ambarından zorla al.','Requisition grain from the towns by force.',[
        outcome('Garnizon doydu. Kasaba ambarları boşaldı; çocuklu haneler kış için başka şehirlere göçtü.','The garrison ate. Town granaries emptied; families with children left for other cities before winter.',{authority:5,stability:-9,population:-3},{flags:['recorded_provincial_dissent'],relations:{keepers:-6}})
      ],[{stat:'population',minimum:4}])
    ],{eraRole:'recurring'});

  card('road_wear',4,'roads','Yolun Aşınması','A Road Wearing Thin',
    'Yük arabaları imparatorluk yolunun taşlarını yerinden oynattı. Taş ustaları yeni dolgu için ücret istiyor. Geçiş vergisi toplayanlar ise bakım paranın zaten kendi kasalarında olduğunu söylüyor.',
    'Freight carts have loosened the imperial road’s paving. Masons want wages for new fill. The toll collectors say the upkeep silver is already in their chests.',
    empire+'Cambered paved road with displaced stones, masons with iron levers and baskets of gravel, toll post and milestone beside it, dusty afternoon.',[
      choice('stonework','Taş ustalarına öde; yolu yeniden döşe.','Pay the masons and relay the road.',[
        drop(outcome('Yol yeniden düzlendi. Kesilen taş ocağı tepede yara bıraktı; arabalar hızlandı.','The road lay level again. The quarry left a scar on the hill; carts moved faster.',{resources:-9,environment:-3,stability:4,authority:2},{flags:['imperial_road_maintained']}),['imperial_road_worn'])
      ],[{stat:'resources',minimum:9}]),
      choice('audit','Geçiş kasasını denetle; bakımı vergi gelirinden karşıla.','Audit the toll chest and fund upkeep from toll revenue.',[
        drop(outcome('Kasa defteri açıldı. Eksik çıkan pay geri alındı, ustalar bu kez toplanan vergiden ödendi.','The toll ledger was opened. Missing silver was recovered and the masons were paid from collected tolls.',{resources:-4,knowledge:4,stability:5,authority:-2},{flags:['imperial_road_maintained']}),['imperial_road_worn'])
      ],[{flag:'quay_public_account'},{stat:'resources',minimum:4}]),
      choice('wear','Bakımı ertele; parayı başka işe ayır.','Postpone upkeep and spend the silver elsewhere.',[
        drop(outcome('Para ambara kaldı. Çukurlar derinleşti; bir sonraki kervan iki gün geç geldi.','The silver stayed in store. Potholes deepened; the next caravan arrived two days late.',{resources:4,stability:-3},{flags:['imperial_road_worn'],delayed:later(4,'Kırık akslar ve geciken yük için ek taşıma bedeli ödendi.','Extra hauling fees paid for broken axles and late cargo.',{resources:-6,stability:-2})}),['imperial_road_maintained'])
      ])
    ],{eraRole:'recurring'});

  card('aqueduct_quota',4,'water','Su Kemerinin Payı','The Aqueduct’s Share',
    'Kuraklık eyalet su kemerini yarıya düşürdü. Valilik bakım vergisi toplayıp suyu nüfusa göre bölmek istiyor. Zengin bağ sahipleri ise kemerin suyunu satın alınabilir bir pay olarak istiyor.',
    'Drought has halved the provincial aqueduct. The governorate wants a maintenance levy and allocation by household. Wealthy vineyard owners want the channel’s water sold as purchasable shares.',
    empire+'Stone aqueduct arches over parched fields, water inspector at a distribution tank with bronze valves, vineyard owners and townspeople with jars, harsh summer light.',[
      choice('levy','Bakım vergisi topla; suyu hane başına böl.','Raise a maintenance levy and divide water by household.',[
        drop(outcome('Vergi ödendi, kanal temizlendi. Bağlar az su aldı ama hiçbir mahalle kuru kalmadı.','The levy was paid and the channel cleaned. Vineyards got little water, but no ward ran dry.',{resources:-8,environment:5,stability:5,population:1},{flags:['provincial_water_levy_shared']}),['provincial_water_quota_private'])
      ],[{stat:'resources',minimum:8}]),
      choice('sell','Su paylarını bağ sahiplerine sat.','Sell water shares to the vineyard owners.',[
        drop(outcome('Gümüş kasaya girdi. Aşağı mahalleler kova kuyruklarında beklemeye başladı.','Silver entered the treasury. Lower wards began waiting in bucket queues.',{resources:9,environment:-6,stability:-7},{flags:['provincial_water_quota_private'],relations:{keepers:-5}}),['provincial_water_levy_shared'])
      ],[{stat:'environment',minimum:20}]),
      choice('ration','Kanalı kapatma; herkese aynı kısıntıyı uygula.','Keep the channel open and impose the same ration on everyone.',[
        outcome('Herkes aynı kovayla döndü. Bahçeler kurudu, hasat geriledi ama kavga çıkmadı.','Everyone returned with the same bucket. Gardens dried and the harvest fell, but there was no quarrel.',{population:-2,authority:-1,stability:3,environment:3})
      ]),
      choice('cistern','Eski sarnıç hesabını göster; geçmiş katkıyı bu vergiye bir kez say.','Present the old cistern account and credit past work once against this levy.',[
        drop(outcome('Eski sarnıç işçilerinin katkısı vergiden düşüldü. Yeni kanal işi yine ödendi; hesap bir kez kullanıldı.','The old cistern workers’ contribution was deducted from the levy. New channel work was still paid; the credit was used once.',{resources:-5,environment:4,stability:7,knowledge:3},{flags:['provincial_water_levy_shared','cistern_credit_used']}),['provincial_water_quota_private'])
      ],[{flag:'cistern_public_closed'},{absentFlag:'cistern_credit_used'},{stat:'resources',minimum:5}])
    ],{eraRole:'recurring',requirements:[{stat:'environment',maximum:75}]});

  card('workshop_tender',4,'production','Atölye İhalesi','The Workshop Tender',
    'Valilik yeni yol işaretleri ve garnizon için bronz levha ısmarlıyor. Eski lonca bütün işi kendine istiyor; açık ihale ise yeni atölyelerin de teklif vermesini sağlayacak. Her iki yolda da maden, kömür ve ücret önceden ödenmeli.',
    'The governorate orders bronze plates for new road markers and the garrison. The old guild wants the whole commission; an open tender would let new workshops bid too. Either way, ore, charcoal and wages are paid up front.',
    empire+'Bronze workshop courtyard with casting pits, guild master and young independent smiths presenting sample plates to a magistrate, charcoal smoke, warm forge light.',[
      choice('guild','Loncaya imtiyaz ver; teslimatı onlar garantilesin.','Grant the guild a franchise to guarantee delivery.',[
        context(drop(outcome('Lonca yeterli işçiyle levhaları zamanında döktü. Yeni ustalar kapıda kaldı.','The guild cast the plates on time with enough hands. Newer smiths were left at the gate.',{resources:-7,authority:3,stability:-3},{id:'staffed',probability:0.5,flags:['guild_workshop_franchise'],delayed:later(4,'Levhalar teslim edildi ve bedeli ödendi.','The plates were delivered and paid for.',{resources:8})}),['open_workshop_tender']),[{stat:'population',minimum:30}]),
        context(drop(outcome('Lonca işçi bulamadı; levhaların yarısı döküldü. Ödeme de yarıya düştü.','The guild could not find workers; half the plates were cast. Payment fell by half too.',{resources:-7,authority:2,stability:-4},{id:'short',probability:0.5,flags:['guild_workshop_franchise'],delayed:later(4,'Eksik teslimat için yarım bedel ödendi.','Half payment arrived for the short delivery.',{resources:4})}),['open_workshop_tender']),[{stat:'population',maximum:29}])
      ],[{stat:'resources',minimum:7}]),
      choice('open','Açık ihale yap; ücretleri ve denetimi kamu karşılasın.','Hold an open tender with publicly paid wages and inspection.',[
        drop(outcome('Üç atölye iş aldı. Denetçiler ücretliydi; yeni ustalar ilk kez kendi damgalarını vurdu.','Three workshops won work. Inspectors were paid; new smiths struck their own stamps for the first time.',{resources:-9,knowledge:4,stability:4},{flags:['open_workshop_tender'],delayed:later(4,'İhalenin levhaları teslim edildi.','The tender’s plates were delivered.',{resources:7})}),['guild_workshop_franchise'])
      ],[{stat:'resources',minimum:9},{stat:'population',minimum:20}]),
      choice('charter','Eski kalıp beratını gösteren ustalara teklif hakkı ver.','Let smiths holding the old mold charter bid.',[
        drop(outcome('Berat sahipleri teklif verdi. Kalıp onlarındı, kömür ve emek yine ödendi.','The charter holders bid. The molds were theirs; charcoal and labor were still paid.',{resources:-6,stability:5,knowledge:2},{flags:['open_workshop_tender'],delayed:later(4,'Berat ustalarının levhaları teslim edildi.','The charter smiths delivered their plates.',{resources:6})}),['guild_workshop_franchise'])
      ],[{flag:'mold_charter_closed'},{stat:'resources',minimum:6}]),
      choice('decline','Siparişi reddet; maden ve kömürü ayırma.','Decline the order and commit no ore or charcoal.',[
        outcome('Kömür ve maden ambarda kaldı. Valilik siparişi başka eyalete verdi.','Charcoal and ore stayed in store. The governorate gave the order to another province.',{authority:-4,stability:-2,environment:2})
      ])
    ],{eraRole:'recurring',requirements:[{technology:'smelting'}]});

  card('residency_hearing',4,'citizenship','Kapıdaki Dilekçe','A Petition at the Gate',
    'Eyalet kapısında yaşayan işçi aileleri vatandaşlık defterine yazılmak istiyor. Memur yalnızca vergi verenlerin oy hakkı olabileceğini söylüyor. Aileler yıllarca yol taşı ve su kovası taşıdıklarını hatırlatıyor.',
    'Laborers’ families living by the provincial gate ask to be entered in the citizens’ roll. The clerk says only taxpayers may vote. The families recall years of hauling paving stones and water jars.',
    empire+'City gate with petitioners holding household tokens before a magistrate’s table, clerk unrolling a papyrus roll, laborers’ tools at their feet, golden evening light.',[
      choice('citizens','Ücretli tanıklarla dinle; çalışanları sınırlı vatandaş yap.','Hear paid witnesses and grant workers limited citizenship.',[
        drop(outcome('Tanıklar ücretini aldı. Aileler deftere yazıldı; vergi yükü ve oy hakkı birlikte geldi.','Witnesses were paid. Families entered the roll; tax burdens and votes arrived together.',{resources:-8,population:4,stability:5,authority:-3},{flags:['provincial_residency_hearing'],delayed:later(5,'Yeni vatandaşların ilk vergisi küçük bir pay getirdi.','New citizens’ first tax brought a small share.',{resources:3})}),['restricted_provincial_residency'])
      ],[{stat:'resources',minimum:8}]),
      choice('restrict','İkamet izni ver; oy hakkı verme.','Grant residence permits but no vote.',[
        context(drop(outcome('İzin harcı kasaya girdi. Aileler kaldı ama meclis kapısı onlara kapalı.','Permit fees entered the treasury. The families stayed, but the assembly door is closed to them.',{resources:6,stability:-6},{id:'new',probability:0.5,flags:['restricted_provincial_residency']}),['provincial_residency_hearing']),[{absentFlag:'guest_citizenship'}]),
        context(drop(outcome('Harç toplandı. Eski kent vatandaşlığına sahip aileler haklarının sessizce kısılmasına itiraz etti; eski kayıt geçerli kaldı.','Fees were collected. Families holding the old city citizenship protested that their rights were being quietly cut; the old record stood.',{resources:5,stability:-9,authority:-2},{id:'contested',probability:0.5,flags:['restricted_provincial_residency','recorded_provincial_dissent']}),['provincial_residency_hearing']),[{flag:'guest_citizenship'}])
      ]),
      choice('testimony','Eski kent kapısı vatandaşlığını emsal göster.','Cite the old city-gate citizenship as precedent.',[
        drop(outcome('Eski kayıt mahkemede okundu. Duruşma kısaldı ama tanıklar ve kâtip yine ödendi.','The old record was read in court. The hearing was shorter, but witnesses and clerk were still paid.',{resources:-5,stability:8,knowledge:3,population:3},{flags:['provincial_residency_hearing']}),['restricted_provincial_residency'])
      ],[{flag:'guest_citizenship'},{stat:'resources',minimum:5}]),
      choice('pasture','Ortak mera uzlaşmasındaki emek kayıtlarını tanık olarak kullan.','Use the work records from the shared pasture settlement as testimony.',[
        drop(outcome('Kuyu ve geçit işçilerinin kayıtları tek tek okundu. Bazı aileler hak kazandı, diğerleri yeni iş için sıraya yazıldı.','Records of well and crossing workers were read one by one. Some families qualified; others were listed for new work.',{resources:-6,stability:6,knowledge:4,population:2},{flags:['provincial_residency_hearing']}),['restricted_provincial_residency'])
      ],[{flag:'pasture_public_settlement'},{stat:'resources',minimum:6}])
    ],{eraRole:'recurring'});

  card('census_dispute',4,'law','Sayımın Ölçüsü','The Measure of the Census',
    'İmparatorluk sayımı vergiyi kişi başına hesaplamak istiyor. Mahalle temsilcileri hasta bakan, su taşıyan ve gece nöbeti tutanların da kamuya hizmet ettiğini söylüyor. Sayım memurları yalnızca baş saymakla görevli.',
    'The imperial census wants to levy by head. Ward representatives say those nursing the sick, carrying water and keeping night watch already serve the public. The census officers are tasked only with counting heads.',
    empire+'Census officials at folding tables in a colonnaded street, families queuing with household tokens, a ward representative holding a list of care duties, cool morning shade.',[
      choice('services','Bakım ve hizmet emeğini vergiden ayrı say.','Count care and service work separately from tax.',[
        outcome('Sayım iki katına uzadı. Hizmet listeleri ayrı tutuldu; vergi yine hane başına alındı.','The census took twice as long. Service rolls were kept apart; tax was still collected per household.',{resources:-7,knowledge:5,stability:6,authority:-2},{flags:['lawful_review_precedent']})
      ],[{stat:'resources',minimum:7}]),
      choice('heads','Yalnız baş say; itirazları sonraki yıla bırak.','Count heads only and leave objections for next year.',[
        outcome('Sayım hızla bitti ve vergi arttı. Nöbetçiler bir gece işi bırakıp meydanda toplandı.','The census finished quickly and tax rose. Watch keepers left their posts one night and gathered in the forum.',{resources:7,stability:-7,authority:2},{flags:['recorded_provincial_dissent'],relations:{keepers:-5}})
      ]),
      choice('care_record','Mahalle bakım hesabını emsal olarak sun.','Present the ward care account as precedent.',[
        outcome('Eski kayıt mahalle bakımını belgeledi. Hizmet bir duruşma hakkı kazandı, vergiden muafiyet değil.','The old record documented ward care. Service earned a right to a hearing, not a tax exemption.',{resources:-4,stability:8,knowledge:3,authority:-2},{flags:['lawful_review_precedent']})
      ],[{flag:'public_care_settlement'},{stat:'resources',minimum:4}])
    ],{eraRole:'recurring',requirements:[{stat:'population',minimum:20}]});

  // ——— Three bridges carrying actual Bronze records into the province ———
  card('bond_ledger_transfer',4,'legacy','Senetler Valiliğe Geçiyor','The Bonds Pass to the Governorate',
    'Yeni valilik kentin eski ekmek senetlerini kendi defterine geçirmek istiyor. Ödenmiş senetler kapalı, ödenmemiş olanlar açık, temerrüde düşenler ise mühürlü duruyor. Tüccar, başkentin borcu satın almasını teklif ediyor.',
    'The new governorate wants to transfer the city’s old bread bonds to its own ledger. Paid bonds stand closed, unpaid ones open, defaulted ones sealed. The merchant offers to sell the debt to the capital.',
    empire+'Archive room with clay tablets and new papyrus registers side by side, governorate scribe copying old bond seals, merchant waiting with abacus counters, lamp light.',[
      choice('carry','Her senedi olduğu gibi aktar; kâtiplere ücret öde.','Transfer each bond exactly as written and pay the scribes.',[
        context(outcome('Açık borç yeni deftere açık olarak geçti. Ne affedildi ne de büyütüldü.','The open debt passed to the new ledger as open. It was neither forgiven nor enlarged.',{resources:-4,knowledge:4,stability:3},{id:'open',probability:0.25,flags:['provincial_bond_registry']}),[{flag:'bread_bond_open'}]),
        context(outcome('Ödenmiş senet kapalı olarak kaydedildi. Tüccarın yeni faiz talebi geri çevrildi.','The paid bond was entered as closed. The merchant’s new interest claim was refused.',{resources:-4,knowledge:4,stability:6},{id:'paid',probability:0.25,flags:['provincial_bond_registry']}),[{flag:'bread_bond_repaid'},{absentFlag:'bread_bond_open'}]),
        context(outcome('Temerrüt kaydı yeni defterde de mühürlü kaldı. Kredi kapıları açılmadı.','The default record stayed sealed in the new ledger. No credit was reopened.',{resources:-4,knowledge:4,authority:-2},{id:'defaulted',probability:0.25,flags:['provincial_bond_registry']}),[{flag:'bread_bond_default'},{absentFlag:'bread_bond_open'},{absentFlag:'bread_bond_repaid'}]),
        context(outcome('Kentin ekmek defterinde hiç senet yoktu; kıtlık yardımla atlatılmıştı. Kâtipler boş sayfayı mühürledi.','The city’s bread ledger held no bond at all; the shortage had been met with relief. Scribes sealed the empty page.',{resources:-4,knowledge:3,stability:2},{id:'none',probability:0.25,flags:['provincial_bond_registry']}),[{absentFlag:'bread_bond_open'},{absentFlag:'bread_bond_repaid'},{absentFlag:'bread_bond_default'}])
      ],[{stat:'resources',minimum:4}]),
      choice('sell','Açık borcu başkente devret; haraç senedine çevir.','Sell the open debt to the capital as a tribute note.',[
        drop(outcome('Tüccar ödendi ve ekmek senedi kapandı. Aynı tutar haraç senedi olarak valiliğe borç kaldı.','The merchant was paid and the bread bond closed. The same sum remains owed to the governorate as a tribute note.',{authority:3,stability:-2},{flags:['bread_bond_repaid','tribute_arrears','provincial_bond_registry']}),['bread_bond_open'])
      ],[{flag:'bread_bond_open'},{absentFlag:'tribute_arrears'}]),
      choice('refuse','Aktarmayı reddet; eski defteri kentte tut.','Refuse the transfer and keep the old ledger in the city.',[
        outcome('Eski tabletler kentte kaldı. Valilik kenti güvenilmez saydı; borçlar olduğu gibi duruyor.','The old tablets stayed in the city. The governorate counted the city unreliable; the debts stand as they were.',{authority:-5,stability:-3,knowledge:-1},{flags:['recorded_provincial_dissent']})
      ])
    ],{once:true,chain:'debt',eraRole:'bridge',requirements:[{completedCard:'bread_bond'}]});

  card('mold_requisition',4,'legacy','Kalıplara El Koyma','The Requisition of Molds',
    'Ordu silah tokası için kentin bronz kalıplarını istiyor. Eski kalıp denetimi hangi kalıbın kime ait olduğunu belirledi. Komutan beratı tanımadan kalıpları ambara kaldırmak istiyor; ustalar emeklerinin ödenmesini bekliyor.',
    'The army wants the city’s bronze molds for buckles and fittings. The old mold audit decided whose molds were whose. The commander wants them carted off regardless of charter; the smiths expect their labor to be paid.',
    empire+'Soldiers with handcarts at a bronze workshop, smiths holding mold halves and a sealed charter tablet, quartermaster with wax tablet, smoky forge light.',[
      choice('commission','Kalıpları alma; ustalara ücretli sipariş ver.','Leave the molds and give the smiths a paid order.',[
        outcome('Ustalar ordu için döktü. Kömür ve ücret ödendi; kalıplar sahiplerinde kaldı.','The smiths cast for the army. Charcoal and wages were paid; the molds stayed with their owners.',{resources:-8,stability:5,knowledge:2},{flags:['imperial_mold_commission'],delayed:later(4,'Ordu teslim aldığı tokaların bedelini ödedi.','The army paid for the buckles it received.',{resources:6})})
      ],[{stat:'resources',minimum:8}]),
      choice('seize','Kalıplara el koy; ordu kendi döksün.','Seize the molds and let the army cast its own.',[
        context(outcome('Kamu beratlı kalıplar arabaya yüklendi. Ustalar meydanda beratı yüksek sesle okudu.','The publicly chartered molds were loaded on carts. The smiths read the charter aloud in the forum.',{resources:6,authority:5,stability:-10},{id:'charter',probability:0.5,flags:['mold_requisitioned','recorded_provincial_dissent'],relations:{keepers:-8}}),[{flag:'mold_charter_closed'}]),
        context(outcome('Özel kiracıların kalıpları alındı. Kiracılar sözleşme bedelini başkentten talep etti.','The private lessees’ molds were taken. The lessees demanded their contract value from the capital.',{resources:6,authority:4,stability:-6},{id:'lease',probability:0.5,flags:['mold_requisitioned'],delayed:later(4,'Kiracıların sözleşme tazminatı ödendi.','The lessees’ contract compensation was paid.',{resources:-6})}),[{flag:'mold_private_closed'}])
      ]),
      choice('charter','Kamu beratını tanı; sipariş sırası ustalar meclisinde belirlensin.','Honor the public charter and let the smiths’ assembly set the order queue.',[
        outcome('Berat bir emsal oldu. Ustalar sırayı kendileri belirledi; maden ve ücret yine valilikten çıktı.','The charter became a precedent. Smiths set their own queue; ore and wages still came from the governorate.',{resources:-5,stability:8,knowledge:4,authority:-2},{flags:['imperial_mold_commission','lawful_review_precedent']})
      ],[{flag:'mold_charter_closed'},{stat:'resources',minimum:5}]),
      choice('lease','Özel kira sözleşmesini sürdür; orduya kiracı aracılığıyla kirala.','Keep the private lease and rent to the army through the lessee.',[
        outcome('Kiracı ordu ile anlaştı. Valilik kira payı aldı; işçiler ücretlerini kiracıdan bekledi.','The lessee struck a deal with the army. The governorate took a rent share; workers waited on the lessee for their wages.',{resources:-3,authority:4,stability:-2},{flags:['imperial_mold_commission'],delayed:later(4,'Kira payı geldi; işçi ücretindeki gecikme itiraz doğurdu.','The rent share arrived; late wages prompted a complaint.',{resources:4,stability:-2})})
      ],[{flag:'mold_private_closed'},{stat:'resources',minimum:3}])
    ],{once:true,chain:'memory',eraRole:'bridge',requirements:[{completedCard:'mold_audit'}]});

  card('ridge_toll_audit',4,'legacy','Sırt Yolu İmparatorluk Yolu Olurken','When the Ridge Road Becomes Imperial',
    'İmparatorluk yolu eski sırt yolunun üstünden geçecek. Kentin yol hesabı geçiş haklarını kimin ödediğini kaydetti. Mühendisler yeni taş döşeme için ücret istiyor; eski geçiş sahipleri ise kendi paylarının sürmesini bekliyor.',
    'The imperial road will follow the old ridge road. The city road account recorded who paid for passage rights. Engineers want wages for new paving; former passage holders expect their shares to continue.',
    empire+'Surveyors with groma and measuring rods on a ridge path, old stepped track beside new road foundation trench, passage holders and engineers arguing, clear hilltop light.',[
      choice('public','Kamu yol hesabını yeni yolun bakım fonuna aktar.','Transfer the public road account into the new road’s upkeep fund.',[
        drop(outcome('Eski hesap yeni fonun ilk satırı oldu. Yeni döşeme yine ücretliydi; kimse iki kez ödemedi.','The old account became the new fund’s first line. New paving was still paid; nobody paid twice.',{resources:-7,stability:7,environment:-2,knowledge:2},{flags:['imperial_road_maintained']}),['imperial_road_worn'])
      ],[{flag:'public_ridge_settlement'},{stat:'resources',minimum:7}]),
      choice('buyout','Özel geçiş haklarını satın al; yolu kamuya aç.','Buy out the private passage rights and open the road to all.',[
        drop(outcome('Geçiş sahipleri ödendi. Yol kamuya geçti; kasa derin bir yara aldı.','Passage holders were paid. The road passed to the public; the treasury took a deep cut.',{resources:-11,stability:5,authority:3},{flags:['imperial_road_maintained','private_ridge_buyout']}),['imperial_road_worn'])
      ],[{flag:'private_ridge_settlement'},{stat:'resources',minimum:11}]),
      choice('postpone','Döşemeyi ertele; eski patikayı ve geçiş düzenini olduğu gibi bırak.','Postpone the paving and leave the old track and its passage terms as they are.',[
        drop(outcome('Kasa bir şey ödemedi. Kervanlar eski patikada yavaşladı; geçiş payı olan yerde pay ödemeye devam etti.','The treasury paid nothing. Caravans slowed on the old track and kept paying shares wherever passage terms applied.',{resources:3,stability:-5,authority:1},{flags:['imperial_road_worn'],delayed:later(4,'Ertelenen döşeme yüzünden kırılan akslar için ek taşıma ücreti ödendi.','Extra hauling fees paid for axles broken on the unpaved track.',{resources:-5})}),['imperial_road_maintained'])
      ]),
      choice('survey','Eski hesabı yok say; yolu baştan ölçüp döşet.','Ignore the old account and survey and pave from scratch.',[
        drop(outcome('Yeni yol düz ve genişti. Eski bakım emeği hiçbir yerde anılmadı; köylüler hesabı kendi aralarında saklıyor.','The new road was straight and wide. Earlier upkeep labor was never acknowledged; villagers keep that account among themselves.',{resources:-9,environment:-4,stability:-3,authority:4},{flags:['imperial_road_maintained','recorded_provincial_dissent']}),['imperial_road_worn'])
      ],[{stat:'resources',minimum:9}])
    ],{once:true,chain:'ridge_route',eraRole:'bridge',requirements:[{completedCard:'ridge_account'}]});

  // ——— Three conditional story conclusions (need both the Bronze close and an imperial crisis) ———
  card('cistern_precedent',4,'legacy','Sarnıcın Emsali','The Cistern Precedent',
    'Su kemeri tartışmasından sonra valilik eski sarnıç hanelerine yeni vergi kâğıdı gönderdi. Hane temsilcileri eski su hesabını mahkemeye getirdi. Hakim, geçmiş emeğin geleceği bedavaya çeviremeyeceğini; ama iki kez de ödenemeyeceğini söylüyor.',
    'After the aqueduct dispute, the governorate sent new levy notices to the old cistern households. Their representatives brought the old water account to court. The judge says past labor cannot make the future free, but cannot be charged twice either.',
    empire+'Provincial courtroom with judge on curule seat, cistern households presenting cracked clay water tablet beside new papyrus levy notice, water jar as exhibit, cool interior light.',[
      choice('precedent','Kamu sarnıç hesabını emsal ilan et; eski işi bir kez düş, yeni bakımı herkese yaz.','Declare the public cistern account a precedent: credit old work once and bill new upkeep to all.',[
        outcome('Mahkeme emsal kaydetti. Eski hane katkısı bir kez sayıldı; yeni bakım herkese yazıldı.','The court recorded a precedent. Old household contributions counted once; new upkeep was billed to all.',{resources:-4,environment:4,stability:8,knowledge:4},{flags:['water_precedent_recorded','lawful_review_precedent']})
      ],[{flag:'cistern_public_closed'},{stat:'resources',minimum:4}]),
      choice('private','Özel sarnıç sahiplerine yeni vergiyi kendileri ödetsin.','Make the private cistern holders pay the new levy themselves.',[
        outcome('Özel hesap sahipleri vergiyi ödedi ve sarnıcı kendileri işletmeye devam etti. Kiracılar fiyat artışından korktu.','Private account holders paid the levy and kept operating their cistern. Tenants feared higher prices.',{resources:5,authority:3,stability:-5},{flags:['water_private_levy']})
      ],[{flag:'cistern_private_closed'}]),
      choice('ignore','Eski hesabı tanıma; herkese tam vergi yaz.','Disregard the old account and bill everyone the full levy.',[
        outcome('Kasa doldu. Eski sarnıç işçileri emeklerinin silindiğini söyleyerek meclise yürüdü.','The treasury filled. Old cistern workers marched to the assembly, saying their labor had been erased.',{resources:8,stability:-9,authority:2},{flags:['water_precedent_ignored','recorded_provincial_dissent'],relations:{keepers:-8}})
      ])
    ],{once:true,chain:'river_memory',eraRole:'conclusion',requirements:[{completedCard:'cistern_account'},{completedCard:'aqueduct_quota'}]});

  card('guard_levy_charter',4,'legacy','Muhafız Vergisinin Beratı','The Guard Levy Charter',
    'Garnizon ikmali tartışılırken valilik kent alarm nöbetini de muhafız vergisine bağlamak istedi. Eski alarm soruşturması hatayı hileden ayırmıştı. Şimdi nöbetçilerin ücretini kimin ödeyeceği ve yanlış alarmın kimin sorumluluğu olduğu yazılı berata girecek.',
    'While garrison supply was argued, the governorate moved to fold the city alarm watch into the guard levy. The old alarm inquest had separated error from fraud. Now a written charter must say who pays the watchers and who answers for a false alarm.',
    empire+'Watchtower above a river quay, watch captain and governorate scribe drafting a charter on a stone table, signal horn and smoke brazier, dusk sky.',[
      choice('public','Kamu alarm uzlaşmasını berata yaz; nöbet ücretini vergiyle öde.','Write the public alarm settlement into the charter and pay the watch from the levy.',[
        outcome('Berat hatayı cezasız, hileyi cezalı saydı. Nöbetçiler düzenli ücret aldı; vergi biraz arttı.','The charter left honest error unpunished and punished fraud. Watchers received regular pay; the levy rose slightly.',{resources:-6,stability:9,knowledge:4},{flags:['guard_accountability_charter']})
      ],[{flag:'public_alarm_settlement'},{stat:'resources',minimum:6}]),
      choice('private','Özel nöbet sözleşmesini sürdür; tüccarlar ödesin.','Keep the private watch contract and let merchants pay.',[
        outcome('Tüccarlar nöbeti kendileri tuttu. Kasa ödemedi; nöbet yalnız onların ambarlarını korudu.','Merchants kept their own watch. The treasury paid nothing; the watch guarded only their stores.',{resources:2,authority:3,stability:-5},{flags:['private_guard_contract'],delayed:later(5,'Korunmayan mahallede çıkan yangın hasar bıraktı.','A fire in an unguarded ward left damage behind.',{resources:-4,population:-1})})
      ],[{flag:'private_alarm_settlement'}]),
      choice('flat','Bütün nöbetçileri garnizona bağla; yanlış alarmı tek ceza ile karşıla.','Attach every watcher to the garrison and punish any false alarm alike.',[
        outcome('Disiplin sertleşti. Nöbetçiler belirsiz işaretleri bildirmekten çekinmeye başladı.','Discipline hardened. Watchers grew reluctant to report uncertain signs.',{authority:5,stability:-4,knowledge:-3},{flags:['guard_flat_penalty'],delayed:later(6,'Bildirilmeyen bir su yükselişi rıhtım ambarlarını ıslattı.','An unreported rise in the water soaked the quay stores.',{resources:-6,stability:-2})})
      ])
    ],{once:true,chain:'warning',eraRole:'conclusion',requirements:[{completedCard:'alarm_inquest'},{completedCard:'garrison_supply'}]});

  card('care_census_hearing',4,'legacy','Bakımın Duruşması','A Hearing for Care',
    'Sayım tartışmasından sonra mahalle bakımcıları ayrı bir duruşma istedi. Eski mahalle bakım hesabı kimlerin yıllarca hasta ve yaşlı baktığını gösteriyor. Valilik vergi muafiyeti vermeyecek, ama bakımın kamu hizmeti sayılıp sayılmayacağına karar verecek.',
    'After the census dispute, ward carers asked for their own hearing. The old ward care account shows who nursed the sick and elderly for years. The governorate will grant no tax exemption, but will rule whether care counts as public service.',
    empire+'Small magistrate’s court in a residential street, carers with an elderly woman and child, clay ward tablets beside papyrus census roll, soft late light.',[
      choice('public','Kamu bakım uzlaşmasını hizmet kaydı olarak tanı.','Recognize the public care settlement as a record of service.',[
        outcome('Bakım kamu hizmeti sayıldı. Bakımcılar vergiden kurtulmadı, fakat duruşma ve atanma önceliği kazandı.','Care was counted as public service. Carers were not exempted from tax, but gained hearing and appointment priority.',{resources:-5,stability:9,knowledge:3,population:2},{flags:['care_service_record','lawful_review_precedent']})
      ],[{flag:'public_care_settlement'},{stat:'resources',minimum:5}]),
      choice('contract','Özel bakım sözleşmelerini koru; kamu kaydına alma.','Keep the private care contracts and leave them off the public roll.',[
        outcome('Sözleşmeler aynen sürdü. Bakımcılar ücretlerini hane sahiplerinden almaya devam etti.','The contracts continued unchanged. Carers kept drawing wages from householders.',{resources:2,authority:2,stability:-3},{flags:['care_contract_kept']})
      ],[{flag:'private_care_settlement'}]),
      choice('dismiss','Duruşmayı reddet; bakımı ev işi say.','Dismiss the hearing and treat care as household work.',[
        outcome('Duruşma kapandı. Bazı bakımcılar kenti terk etti; yaşlıların bakımı ailelere kaldı.','The hearing closed. Some carers left the city; care for the elderly fell back on families.',{resources:3,population:-3,stability:-6},{flags:['care_hearing_dismissed','recorded_provincial_dissent']})
      ])
    ],{once:true,chain:'care_work',eraRole:'conclusion',requirements:[{completedCard:'ward_charter'},{completedCard:'census_dispute'}]});
}
