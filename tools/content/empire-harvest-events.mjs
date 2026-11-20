// Phase 3 third package (210 → 225): the Ancient Empires food and production loop. Era 4 stays closed
// (ERA4_GATE.enabled:false). Eleven recurring events (eight on food, land, water and shipping; three on
// plague, fire and river crossings), two Bronze bridges and two conditional conclusions raise the
// authored inventory to 45 cards: 28 recurring, 8 conclusions, 8 bridges and 1 legal reform.
//
// Production capacities (balance.provincialProduction, read by FoodBudget). Each is one food share per
// turn, only from Era 4, only while the flag stands, enough hands remain and the land still bears.
// Total production stays capped at ordinary consumption, so capacity can end hunger but never prints
// reserves. Every capacity is bought (reserve, labour or a political price) and can be lost:
//   estate_fields_worked     provincial estates   population ≥ 20   (lost when the estates are abandoned)
//   canal_fields_open        canal-fed fields     environment ≥ 30  (silt and drought diversion close it)
//   harbor_fishery_licensed  harbor fishery       population ≥ 15, environment ≥ 20
//   granary_register_kept    weighed granaries    population ≥ 10   (less grain rots or goes missing)
// Ledger additions (schema-v1 flags only):
//   temple_grain_loan   one open grain loan; it repays itself (−4, measure for measure) six turns later
//                       and cannot stack; the temple's price is authority, not interest
//   granary_register_kept  a public weighing register; the tithe is then collected with less resentment
// Same rules as the earlier empire packages: paying choices require the reserve up front; an old right
// grants a hearing, a precedent or a discount and never nets resources; no paid debt is reopened; no
// earlier record is erased. Every recurring event offers at least two choices that cost no reserve —
// pausing production, deferring upkeep, a political price or a loan — and none of them is riskless.
export const PROVINCIAL_PRODUCTION = [
  { flag:'estate_fields_worked', minimumEra:4, minimumPopulation:20, minimumEnvironment:0, yield:1 },
  { flag:'canal_fields_open', minimumEra:4, minimumPopulation:0, minimumEnvironment:30, yield:1 },
  { flag:'harbor_fishery_licensed', minimumEra:4, minimumPopulation:15, minimumEnvironment:20, yield:1 },
  { flag:'granary_register_kept', minimumEra:4, minimumPopulation:10, minimumEnvironment:0, yield:1 }
];

export function addEmpireHarvestEvents({card,choice,outcome,delayed}) {
  const later=(turns,tr,en,stats,flags=[])=>[delayed(turns,4,tr,en,stats,flags)];
  const context=(result,requirements)=>({...result,requirements});
  const drop=(result,flags)=>{result.effect.removeFlags=flags;return result;};
  const empire='Fictional composite ancient empire, cut limestone and marble, wax tablets and papyrus rolls, bronze and iron hand tools, wool tunics and cloaks, no stirrups, no paper books, no gunpowder; ivory, gold and dusty terracotta palette, portrait composition. ';

  // ——— Eight recurring food and production events ———
  card('provincial_estates',4,'production','Eyalet Çiftlikleri','The Provincial Estates',
    'Vergi kaçkınlığı ve salgın yüzünden ovadaki üç köy boşaldı. Valilik bu tarlaları eyalet çiftliği olarak yeniden ektirmek istiyor; tohum, saban öküzü ve yerleşecek aileler gerekiyor. Büyük toprak sahipleri ise araziyi uzun kiraya almayı teklif ediyor.',
    'Tax flight and fever have emptied three villages on the plain. The governorate wants their fields sown again as provincial estates, which needs seed, plough oxen and families to settle. The great landholders offer to take the land on a long lease instead.',
    empire+'Abandoned mud-brick village beside overgrown wheat strips, surveyors with measuring cords and boundary stones, a yoke of oxen being led in, wide plain under hazy morning light.',[
      choice('clear','Tohum ve öküz al; yerleşen ailelere ilk yılın payını ver.','Buy seed and oxen and give the settling families their first year’s share.',[
        outcome('Aileler kentten ovaya taşındı. Kasa ve kent sokakları boşaldı; tarlalar ilk kez sürüldü.','Families moved from the town to the plain. The treasury and the town streets thinned; the fields were ploughed for the first time.',{resources:-10,population:-2,stability:2,knowledge:1},{flags:['estate_fields_worked'],delayed:later(5,'Eyalet çiftliklerinin ilk hasadı ambara girdi.','The first harvest of the provincial estates entered the granary.',{resources:3})})
      ],[{absentFlag:'estate_fields_worked'},{stat:'resources',minimum:10},{stat:'population',minimum:30}]),
      choice('lease','Araziyi toprak sahiplerine uzun kiraya ver.','Lease the land to the great landholders for a long term.',[
        outcome('Toprak sahipleri kira peşinatını ödedi ve kendi kiracılarını getirdi. Tarlalar ekildi; köylüler artık başkasının payına çalışıyor.','The landholders paid the lease deposit and brought their own tenants. The fields were sown; the villagers now work for another man’s share.',{resources:3,authority:-3,stability:-4},{flags:['estate_fields_worked','estate_landlord_lease']})
      ],[{absentFlag:'estate_fields_worked'}]),
      choice('wait','Yeni tohum atma; toprağı ölçtür ve dinlendir.','Sow no new ground; have the land measured and rested.',[
        context(outcome('Ölçüm ipleri gerildi, sınır taşları dikildi. Ova bir yıl daha boş kaldı; aç aileler bekledi.','Measuring cords were stretched and boundary stones set. The plain lay empty another year while hungry families waited.',{knowledge:2,stability:-2,authority:-1},{id:'survey',probability:0.5}),[{absentFlag:'estate_fields_worked'}]),
        context(outcome('Çiftlik tarlalarının üçte biri nadasa bırakıldı. Toprak dinlendi; ekili kalan tarlalarda çalışan aileler fazla mesai yaptı.','A third of the estate fields were left fallow. The soil rested; families on the sown fields worked longer days.',{environment:3,stability:-2},{id:'rotation',probability:0.5,flags:['estate_fields_fallow']}),[{flag:'estate_fields_worked'}])
      ]),
      choice('glean','Hasat artığını yoksullara aç; başak toplamaya izin ver.','Open the stubble to the poor and allow gleaning.',[
        outcome('Yoksullar tarlaya döküldü. Kimse aç kalmadı, göç eden aile azaldı; ama toprak sahipleri payın eksildiğini söyledi.','The poor spread over the fields. No one went hungry and fewer families left, but the landholders said their share had shrunk.',{population:1,stability:2,authority:-2,environment:-1})
      ],[{flag:'estate_fields_worked'}])
    ],{eraRole:'recurring'});

  card('crop_share_dispute',4,'economy','Kiracının Payı','The Tenant’s Share',
    'Hasat harmanda bekliyor. Kiracı çiftçiler yarı payı istiyor; toprak sahibi ise tohumu ve öküzü kendisinin verdiğini, üçte ikinin hakkı olduğunu söylüyor. Harman başında iki taraf da sopasını hazırlamış.',
    'The harvest waits on the threshing floor. The tenant farmers want half; the landholder says he gave the seed and the oxen and is owed two thirds. Both sides have their staves ready at the floor’s edge.',
    empire+'Circular stone threshing floor heaped with grain, tenant farmers with winnowing forks facing a landholder’s steward and scribe, measure jars lined up, golden late-summer dust.',[
      choice('half','Yarı payı ilan et; valilik kendi öşrünü kiracıdan alsın.','Proclaim the half share and let the governorate take its tithe from the tenants.',[
        context(outcome('Kiracılar yarıyı aldı ve aileleri toprakta kaldı. Toprak sahibi valiye şikâyet yazdı; ambara düzenli tahıl geldi.','The tenants took half and their families stayed on the land. The landholder wrote to the governor in complaint; grain reached the granary steadily.',{resources:2,population:1,authority:-2,stability:1},{id:'worked',probability:0.5}),[{stat:'population',minimum:30}]),
        context(outcome('Yarı pay ilan edildi ama tarlada yeterli el yoktu; harman küçük kaldı.','The half share was proclaimed, but there were not enough hands in the fields; the threshing was small.',{resources:1,authority:-2,stability:1},{id:'thin',probability:0.5}),[{stat:'population',maximum:29}])
      ]),
      choice('landlord','Toprak sahibinin üçte ikisini tanı.','Recognize the landholder’s two thirds.',[
        outcome('Toprak sahibi payını ve valinin öşrünü birlikte ödedi. Kiracılar harmandan aç döndü.','The landholder paid his share and the governor’s tithe together. The tenants went home hungry from the floor.',{resources:4,authority:2,stability:-6},{id:'stayed',probability:0.5,flags:['recorded_provincial_dissent']}),
        drop(outcome('Toprak sahibi payını aldı; kiracılar gece çiftliği terk edip kente indi. Gelecek yıl tarlaları ekecek kimse yok.','The landholder took his share; that night the tenants abandoned the estate for the town. No one is left to sow the fields next year.',{resources:4,authority:2,stability:-6},{id:'abandoned',probability:0.5,flags:['recorded_provincial_dissent']}),['estate_fields_worked'])
      ]),
      choice('arbiter','Ücretli bir hakem getir; payı tohum ve emeğe göre hesaplat.','Bring a paid arbiter and reckon the share by seed and labour.',[
        outcome('Hakem tohum çuvallarını ve iş günlerini saydı. Pay ikiye değil üçe bölündü; kimse tamamen kazanmadı.','The arbiter counted seed sacks and workdays. The share was split three ways, not two; no one won outright.',{resources:-4,stability:5,knowledge:2},{flags:['estate_share_ruling']})
      ],[{stat:'resources',minimum:4}]),
      choice('archive','Eski kil arşivdeki tarla defterini emsal göster.','Cite the field register in the old clay archive as precedent.',[
        outcome('Arşivden eski pay kaydı getirildi. Hakem masrafı yarıya indi; pay kayıtla bağlandı.','The old share record was brought from the archive. The arbiter’s fee was halved; the share was bound to the record.',{resources:-2,stability:4,knowledge:1},{flags:['estate_share_ruling']})
      ],[{flag:'public_archive'},{stat:'resources',minimum:2}])
    ],{eraRole:'recurring',requirements:[{flag:'estate_fields_worked'}]});

  card('harvest_tithe',4,'taxation','Hasat Öşrü','The Harvest Tithe',
    'Öşür memurları köylere indi. Tahılın onda biri valilik ambarına girecek; ama tartı, taşıma ve kayıt herkesin kuşkusunda. Kötü yıl geçiren köyler öşrün ertelenmesini istiyor.',
    'The tithe collectors have come down to the villages. A tenth of the grain will enter the governorate granary, but weighing, carting and recording are suspected by all. Villages that had a bad year ask for the tithe to be deferred.',
    empire+'Village granary yard with grain sacks on a bronze balance beam, tithe collector reading from a wax tablet, farmers watching suspiciously, ox carts waiting, warm dusty light.',[
      choice('tithe','Öşrü olduğu gibi topla.','Collect the tithe in full.',[
        context(outcome('Arabalar dolu döndü. Köylüler tohumluğa dokunulduğunu söyledi.','The carts came back full. Villagers said their seed grain had been touched.',{resources:4,stability:-3},{id:'full',probability:0.4}),[{stat:'population',minimum:30},{absentFlag:'debased_coinage'}]),
        context(outcome('Az nüfuslu köylerden yarım arabalar geldi; öşür memuru yine de bütün köyü yazdı.','Half-empty carts came from the thinned villages; the collector still recorded the whole village.',{resources:1,stability:-3},{id:'thin',probability:0.3}),[{stat:'population',maximum:29},{absentFlag:'debased_coinage'}]),
        context(outcome('Köylüler tahılı pazarda satıp öşrü ayarı düşük sikkeyle ödedi. Kasaya giren paranın değeri yazıldığından azdı.','Villagers sold their grain at market and paid the tithe in debased coin. The money entering the treasury was worth less than recorded.',{resources:1,stability:-2,authority:-2},{id:'debased',probability:0.3}),[{flag:'debased_coinage'}])
      ]),
      choice('remit','Kötü yıl geçiren köylerin öşrünü bağışla.','Remit the tithe for villages that had a bad year.',[
        outcome('Bağış meydanda okundu. Köylüler tohumluklarını korudu; ambar memuru eli boş döndü.','The remission was read in the square. The villagers kept their seed; the granary officer came back empty-handed.',{stability:4,authority:-3})
      ]),
      choice('register','Ambar kapısına ücretli bir tartı kâtibi koy.','Station a paid weighing clerk at the granary gate.',[
        outcome('Her çuval tartılıp yazıldı. Kâtibin ücreti kasadan çıktı; kayıp ve hile azaldı.','Every sack was weighed and written down. The clerk’s pay came from the treasury; losses and cheating fell.',{resources:-3,knowledge:2,stability:1},{flags:['granary_register_kept'],delayed:later(4,'Ambar kaydı sayesinde çürüyen ve kaybolan tahıl azaldı.','Thanks to the granary register, less grain rotted or went missing.',{resources:2})})
      ],[{absentFlag:'granary_register_kept'},{stat:'resources',minimum:3}]),
      choice('ledger','Öşrü ambar defterine göre tart; herkese makbuz ver.','Weigh the tithe against the granary register and give everyone a receipt.',[
        outcome('Makbuzlar dağıtıldı. Köylüler kendi paylarını defterde gördü; öşür daha az kavgayla toplandı.','Receipts were handed out. Villagers saw their own shares in the register; the tithe came in with fewer quarrels.',{resources:3,stability:-1,knowledge:1})
      ],[{flag:'granary_register_kept'}])
    ],{eraRole:'recurring'});

  const loanRepaid=delayed(6,4,'Tapınak ambarı ödünç verdiği tahılı aynen geri aldı.','The temple granary took back the grain it had lent, measure for measure.',{resources:-4});
  loanRepaid.effect.removeFlags=['temple_grain_loan'];
  card('famine_store_release',4,'economy','Kıtlık Deposunun Kapısı','The Door of the Famine Store',
    'Bahar yağmurları gecikti ve fırınların önünde kuyruk uzadı. Valilik kıtlık deposunu açabilir, tahılı karneye bağlayabilir ya da tapınak ambarından ödünç alabilir. Her yol birinin sabrına ya da kasasına dokunuyor.',
    'The spring rains are late and the bread lines are growing at the ovens. The governorate can open the famine store, ration grain, or borrow from the temple granary. Every road touches someone’s patience or someone’s treasury.',
    empire+'Long bread line before stone bakeries, sealed granary door with a magistrate holding its bronze key, temple priests with grain jars at the side, pale overcast light.',[
      choice('release','Ambar kapılarını aç; tahılı maliyetine sattır.','Open the granary doors and have the grain sold at cost.',[
        context(drop(outcome('Kıtlık deposunun mührü kırıldı ve tahıl maliyetine satıldı. Kuyruklar kısaldı, açlıktan ölen olmadı; depo boşaldı.','The famine store’s seal was broken and the grain sold at cost. The lines shortened and no household starved; the store stood empty.',{resources:3,population:1,stability:3},{id:'store',probability:0.5,flags:['grain_store_drawn']}),['grain_famine_store']),[{flag:'grain_famine_store'}]),
        context(outcome('Kamu deposu yoktu; askerler tüccar ambarlarını zorla açtı. Tahıl satıldı, tüccarlar şikâyetlerini yazdırdı.','There was no public store; soldiers forced the merchants’ granaries open. The grain was sold and the merchants had their complaints written down.',{resources:3,stability:-5,authority:-2},{id:'requisition',probability:0.5,flags:['recorded_provincial_dissent']}),[{absentFlag:'grain_famine_store'}])
      ]),
      choice('restock','Depoyu yeniden doldur; fiyat tavanı varsa kaldır.','Refill the store and lift any price ceiling.',[
        drop(outcome('Tahıl piyasa fiyatından alındı ve depo yeniden mühürlendi. Tavan kaldırıldı; kasa boşaldı.','Grain was bought at market price and the store sealed again. The ceiling was lifted; the treasury emptied.',{resources:-8,stability:2},{flags:['grain_famine_store']}),['grain_price_ceiling'])
      ],[{absentFlag:'grain_famine_store'},{stat:'resources',minimum:8}]),
      choice('ration','Ekmeği karneye bağla; kuyruğa asker koy.','Put bread on the ration and post soldiers at the lines.',[
        context(outcome('Her haneye günlük pay yazıldı. Ambar dayandı; fırın önlerinde öfkeli sesler yükseldi.','Each household was written down for a daily share. The granary held; angry voices rose before the ovens.',{resources:2,stability:-4},{id:'ration',probability:0.5}),[{absentFlag:'grain_price_ceiling'}]),
        context(outcome('Tavan korundu, kuyruk askerle düzenlendi. Tüccarlar tavanın altında satmadı; karne yalnız ambardaki tahılı böldü.','The ceiling held and soldiers kept order in the lines. The merchants would not sell under it; the ration divided only the granary’s grain.',{resources:1,authority:1,stability:-4},{id:'ceiling',probability:0.5}),[{flag:'grain_price_ceiling'}])
      ]),
      choice('temple','Tapınak ambarından altı ay vadeyle ödünç tahıl al.','Borrow grain from the temple granary for six months.',[
        outcome('Tapınak tahılı verdi ve borcu taş levhaya kazıdı; rahiplerin sözü valininkine ağır basıyor. Kuyruk bugün kısaldı; borç vadeyi bekliyor.','The temple handed over the grain and carved the debt on a stone tablet; the priests’ word now weighs on the governor’s. The lines shortened today; the debt waits for its term.',{resources:4,authority:-3},{flags:['temple_grain_loan'],delayed:[loanRepaid]})
      ],[{absentFlag:'temple_grain_loan'}])
    ],{eraRole:'recurring'});

  card('canal_extension',4,'water','Kanal ve Yeni Tarlalar','The Canal and the New Fields',
    'Mühendisler ana kanalı ovanın kuru yarısına uzatmayı öneriyor. Su gelirse tarlalar genişleyecek; ama kazı için işçi, taş ve her yıl temizlik gerekiyor. Su azalırsa yeni tarlalar ilk kuruyan yer olacak.',
    'Engineers propose extending the main canal into the dry half of the plain. If the water comes, the fields will widen, but digging needs workers, stone and a cleaning every year. When water runs short, the new fields will be the first to dry.',
    empire+'Workers with bronze mattocks and baskets cutting a canal trench across dry fields, engineer with a leveling frame and plumb line, stone sluice blocks stacked, hard noon light.',[
      choice('dig','Ücretli işçilerle kanalı uzat.','Extend the canal with paid workers.',[
        context(outcome('Kanal ovaya uzandı ve ilk su kuru tarlalara aktı. Kazı iki işçinin canına ve kasaya mal oldu.','The canal reached the plain and the first water ran into the dry fields. The dig cost two workers’ lives and the treasury.',{resources:-9,population:-1,environment:-2,stability:2},{id:'new_line',probability:0.5,flags:['canal_fields_open'],delayed:later(6,'Kanal tarlaları ilk ürününü verdi.','The canal fields gave their first crop.',{resources:2})}),[{absentFlag:'canal_expansion'}]),
        context(outcome('İşçiler atalardan kalan hendek hattını izledi; kazı kısaldı. İşçi ve taş yine ödendi.','The workers followed the ancestors’ ditch line and the dig was shortened. Workers and stone were still paid for.',{resources:-6,population:-1,environment:-1,stability:2},{id:'old_line',probability:0.5,flags:['canal_fields_open'],delayed:later(6,'Eski hat üzerindeki kanal tarlaları ürün verdi.','The canal fields on the old line bore a crop.',{resources:2})}),[{flag:'canal_expansion'}])
      ],[{absentFlag:'canal_fields_open'},{stat:'resources',minimum:9},{stat:'population',minimum:25}]),
      choice('corvee','Kanal işini angaryayla köylülere yaptır.','Have the peasants do the canal work as corvée labour.',[
        context(outcome('Kanal ücretsiz kazıldı; köylüler kendi tarlalarını yarım bıraktı. Hasta düşenler sayılamadı.','The canal was dug without pay; the peasants left their own fields half-tended. Those who fell sick were not counted.',{population:-3,stability:-6,authority:-2},{id:'dug',probability:0.4,flags:['canal_fields_open','recorded_provincial_dissent']}),[{absentFlag:'canal_fields_open'},{stat:'population',minimum:30}]),
        context(outcome('Angaryaya yeterli el çıkmadı. Kazı yarıda kaldı; köylüler valinin adını lanetle andı.','Too few hands answered the corvée. The dig was abandoned halfway; the villagers cursed the governor’s name.',{stability:-4,authority:-2},{id:'abandoned',probability:0.3}),[{absentFlag:'canal_fields_open'},{stat:'population',maximum:29}]),
        context(outcome('Köylüler kanalı ücretsiz temizledi. Su yeniden aktı; kendi tarlaları bir hafta bekledi.','The villagers cleaned the canal without pay. Water ran again; their own fields waited a week.',{population:-1,stability:-4,environment:2},{id:'dredged',probability:0.3}),[{flag:'canal_fields_open'}])
      ]),
      choice('dredge','Kanalı ücretli işçilerle temizlet; çamuru tarlalara ser.','Have the canal dredged by paid workers and spread the silt on the fields.',[
        outcome('Kanal yeniden aktı. Çamur tarlaları besledi; temizlikçilerin ücreti ödendi.','The canal ran clear again. The silt fed the fields; the dredgers were paid.',{resources:-4,environment:3,stability:2})
      ],[{flag:'canal_fields_open'},{stat:'resources',minimum:4}]),
      choice('spare','Bu yıl kanala para harcama.','Spend nothing on the canal this year.',[
        context(outcome('Kanal bu yıl temizlenmedi. Su yavaşladı; kenarlarda saz bitmeye başladı.','The canal was not cleaned this year. The water slowed; reeds began to grow along its banks.',{stability:-1},{id:'defer',probability:0.5,delayed:(()=>{const d=delayed(5,4,'Temizlenmeyen kanal çamurla tıkandı; yeni tarlalara su gitmiyor.','The uncleaned canal silted shut; no water reaches the new fields.',{stability:-2});d.effect.removeFlags=['canal_fields_open'];return [d];})()}),[{flag:'canal_fields_open'}]),
        context(outcome('Valilik kazmadı; komşu köyler kendi hendeklerini ovaya açtı. Karşılığında su günlerini ve ortak mecliste söz hakkını aldılar.','The governorate dug nothing; the neighbouring villages opened their own ditch to the plain. In return they took the water days and a voice in the common council.',{authority:-4},{id:'shared_ditch',probability:0.5,flags:['canal_fields_open','canal_shared_with_villages']}),[{absentFlag:'canal_fields_open'}])
      ])
    ],{eraRole:'recurring'});

  card('harbor_fishery',4,'trade','Liman Balıkçılığı','The Harbor Fishery',
    'Liman ağzında sardalya sürüleri görüldü. Balıkçı aileleri tekne ve tuz için izin istiyor; tüccarlar tuzlanmış balığı iç pazarlara taşımak için hazır. Yaşlı balıkçılar ise sürünün her yıl gelmeyeceğini hatırlatıyor.',
    'Shoals of sardines have been sighted at the harbor mouth. Fishing families want licences for boats and salt; merchants are ready to carry salted fish to inland markets. Old fishermen remind everyone that the shoals do not come every year.',
    empire+'Busy stone harbor with small oared fishing boats, women gutting fish and packing them in salt jars, harbor master with a licence tablet, gulls over glittering water at dawn.',[
      choice('license','Tekne izinlerini sat; tuz ambarını kamu kursun.','Sell boat licences and build a public salt store.',[
        context(outcome('Tekneler kayda girdi ve tuz ambarı kuruldu. Kasa harcadı; balıkçı aileleri yerleşti ve liman canlandı.','The boats were registered and the salt store built. The treasury spent; fishing families settled and the harbor came alive.',{resources:-7,population:2,stability:2},{id:'licensed',probability:0.5,flags:['harbor_fishery_licensed'],delayed:later(5,'Tuzlanmış balığın ilk yükü iç pazara satıldı.','The first load of salted fish was sold at inland markets.',{resources:2})}),[{absentFlag:'fish_passage_rule'}]),
        context(outcome('Eski balık geçidi kuralı limana uygulandı; sürünün yarısına geçit bırakıldı. Kural izni ucuzlattı, tuz ambarı yine ödendi.','The old fish-passage rule was applied to the harbor and half the shoal was left free passage. The rule made licences cheaper; the salt store was still paid for.',{resources:-5,population:2,environment:3,stability:2},{id:'passage_rule',probability:0.5,flags:['harbor_fishery_licensed'],delayed:later(5,'Geçit kuralıyla avlanan balık iç pazara ulaştı.','Fish caught under the passage rule reached inland markets.',{resources:2})}),[{flag:'fish_passage_rule'}])
      ],[{absentFlag:'harbor_fishery_licensed'},{stat:'resources',minimum:7}]),
      choice('open_waters','Limanı herkese aç; izin isteme.','Open the harbor to all and ask for no licence.',[
        outcome('Her aile ağını attı. İlk hafta sofralar doldu; sürü her gün biraz daha küçüldü.','Every family cast its nets. The first week tables were full; the shoal shrank a little each day.',{environment:-5,stability:2,authority:-2},{flags:['harbor_fishery_licensed','harbor_fishery_open']})
      ],[{absentFlag:'harbor_fishery_licensed'}]),
      choice('salt','Tuzlu balığı iç pazara gönder.','Ship salted fish to the inland markets.',[
        outcome('Kervanlar tuzlu balıkla yola çıktı. Kasa doldu; liman sularında balık seyreldi.','Caravans left laden with salted fish. The treasury filled; fish grew scarce in the harbor waters.',{resources:3,environment:-2,stability:-2})
      ],[{flag:'harbor_fishery_licensed'}]),
      choice('ashore','Bu mevsim tekneleri kıyıda tut.','Keep the boats ashore this season.',[
        context(drop(outcome('Yumurtlama mevsiminde av yasaklandı. Balıkçı aileleri bir mevsim gelirsiz kaldı; sürü dinlendi.','Fishing was banned for the spawning season. Fishing families went a season without income; the shoal recovered.',{environment:5,stability:-3,authority:-1},{id:'closed_season',probability:0.5}),['harbor_fishery_open']),[{flag:'harbor_fishery_licensed'}]),
        context(outcome('Yalnız kıyıdan ağ atıldı ve az balık geldi. Tekne sahipleri valiliğin onları görmezden geldiğini söyledi.','Only shore nets were cast and few fish came in. Boat owners said the governorate had ignored them.',{resources:1,environment:-1,authority:-2},{id:'shore_nets',probability:0.5}),[{absentFlag:'harbor_fishery_licensed'}])
      ])
    ],{eraRole:'recurring'});

  card('grain_convoy',4,'logistics','Tahıl Kafilesi','The Grain Convoy',
    'Hasat fazlası taşra ambarlarından kente taşınmalı. Yol üç günlük ve son geçitte iki kafile kaybedildi. Kafileyi kimin koruyacağı, kimin taşıyacağı ve kaybı kimin ödeyeceği kararlaştırılmalı.',
    'The surplus harvest must move from the country granaries to the city. The road is three days long and two convoys were lost at the last pass. Someone must decide who guards the convoy, who carries it and who pays for losses.',
    empire+'Long line of ox carts loaded with grain sacks winding through a rocky pass, escorts with bronze spears, convoy master checking a wax tablet manifest, late afternoon shadows.',[
      choice('escort','Ücretli muhafız tut.','Hire paid guards.',[
        context(outcome('Muhafızlar kafileyle yürüdü. Ücret ödendi; geçit sessizdi.','The guards marched with the convoy. Their wages were paid; the pass was quiet.',{resources:-6,stability:2},{id:'guarded',probability:0.5,delayed:later(3,'Tahıl kafilesi kente eksiksiz ulaştı.','The grain convoy reached the city intact.',{resources:3})}),[{absentFlag:'caravan_insurance_pool'}]),
        context(outcome('Kafile kervan sigortası sandığına da yazıldı; muhafız payı sandıkla bölüşüldü. Bir araba kaybedildi; bedelinin bir kısmını sandık karşılayacak.','The convoy was also entered in the caravan insurance chest and the guards’ cost shared with it. One cart was lost; the chest will cover part of it.',{resources:-3,stability:1},{id:'insured',probability:0.5,delayed:later(3,'Sigortalı kafile kente ulaştı; kaybın bir kısmı sandıktan ödendi.','The insured convoy reached the city; part of the loss was paid from the chest.',{resources:2})}),[{flag:'caravan_insurance_pool'}])
      ],[{stat:'resources',minimum:6}]),
      choice('soldiers','Garnizon askerlerine kafileyi korut; erzaklarını ver.','Have garrison soldiers guard the convoy and give them rations.',[
        context(outcome('Ücretleri ödenmiş askerler kafileyi korudu. Erzakları kasadan çıktı.','Soldiers whose wages were paid guarded the convoy. Their rations came from the treasury.',{resources:-4,authority:2},{id:'paid_garrison',probability:0.5,delayed:later(3,'Asker korumasındaki tahıl kente ulaştı.','The soldier-guarded grain reached the city.',{resources:3})}),[{absentFlag:'garrison_pay_arrears'}]),
        context(drop(outcome('Askerler yola çıkmadan birikmiş ücretlerini tahıl olarak istedi; ücret ödendi ve borç kapandı. Kafile korundu.','Before marching, the soldiers demanded their back pay in grain; it was paid and the debt closed. The convoy was guarded.',{resources:-5,stability:3,authority:1},{id:'arrears_paid',probability:0.5,delayed:later(3,'Askerlerin koruduğu kafile kente ulaştı.','The convoy the soldiers guarded reached the city.',{resources:2})}),['garrison_pay_arrears']),[{flag:'garrison_pay_arrears'}])
      ],[{stat:'resources',minimum:5}]),
      choice('cheap','Kafileyi en ucuz yoldan gönder.','Send the convoy the cheapest way.',[
        context(outcome('Kafile korumasız geçitten sağ çıktı. Bu sefer şans yanındaydı.','The unguarded convoy came through the pass. This time luck was on its side.',{resources:3,stability:-1},{id:'arrived',probability:0.35}),[{absentFlag:'river_customs_farmed'}]),
        context(outcome('Haydutlar korumasız kafileyi geçitte bastı. Arabacılar öldü, tahıl dağlara taşındı.','Bandits fell on the unguarded convoy in the pass. Carters died and the grain was carried into the hills.',{population:-2,stability:-4},{id:'raided',probability:0.35}),[{absentFlag:'river_customs_farmed'}]),
        context(outcome('Nehir mültezimi tahılı kendi teknelerinde taşıdı ve navlunu kendi koydu. Kente az tahıl, çok şikâyet ulaştı.','The river tax farmer carried the grain in his own boats and set his own freight. Little grain and many complaints reached the city.',{resources:2,stability:-4,authority:-2},{id:'tax_farmer',probability:0.3}),[{flag:'river_customs_farmed'}])
      ]),
      choice('hold','Tahılı taşra ambarında beklet.','Keep the grain in the country granary.',[
        outcome('Tahıl taşrada kaldı. Kent fırınları bekledi; ambar fareleri payını aldı.','The grain stayed in the country. The city ovens waited; the granary rats took their share.',{stability:-3,authority:-1},{delayed:later(4,'Taşra ambarında bekleyen tahılın bir kısmı çürüdü.','Part of the grain waiting in the country granary rotted.',{resources:-2})})
      ])
    ],{eraRole:'recurring'});

  card('drought_year',4,'ecology','Kurak Yıl','The Dry Year',
    'Kış yağmurları gelmedi ve nehir yatağı taşlarını gösteriyor. Kentin kuyuları, kanal tarlaları ve sürüler aynı suya muhtaç. Hangi susuzluğun önce giderileceğine karar verilmeli.',
    'The winter rains failed and the riverbed shows its stones. The city wells, the canal fields and the herds all need the same water. Someone must decide whose thirst is answered first.',
    empire+'Cracked riverbed with a thin channel of water, women queuing at a stone well, withered canal fields beyond, herders driving thin cattle, white-hot sky.',[
      choice('cisterns','Kent sarnıçlarını onar ve doldur.','Repair and fill the city cisterns.',[
        outcome('Sarnıçlar onarıldı ve son yağmurla doldu. Kent kurak yazı atlattı.','The cisterns were repaired and filled by the last rain. The city came through the dry summer.',{resources:-6,stability:3,environment:1})
      ],[{stat:'resources',minimum:6}]),
      choice('compact','Eski su uzlaşmasını emsal göster; suyu sıra ile böl.','Cite the old water compact and share the water by turns.',[
        outcome('Uzlaşma okundu ve su günleri yeniden yazıldı. Kâtipler ve nöbetçiler ödendi.','The compact was read and the water days rewritten. Clerks and watchmen were paid.',{resources:-3,stability:4,environment:2})
      ],[{flag:'water_compact'},{stat:'resources',minimum:3}]),
      choice('city_first','Suyu önce kente ver.','Give the water to the city first.',[
        context(drop(outcome('Kanal suyu kentin kuyularına çevrildi. Kent suya kavuştu; kanal tarlaları bu mevsim kuru kalacak.','The canal water was diverted to the city wells. The city got its water; the canal fields will stay dry this season.',{stability:2,environment:-1},{id:'divert',probability:0.5,delayed:later(3,'Yağmur döndü; kanal yeniden tarlalara açıldı.','The rains returned and the canal was opened to the fields again.',{},['canal_fields_open'])}),['canal_fields_open']),[{flag:'canal_fields_open'}]),
        context(outcome('Çevrilecek kanal yoktu; su kova ile karneye bağlandı. Hastalar ve yaşlılar dayanamadı.','There was no canal to divert; water was rationed by the bucket. The sick and the old could not endure it.',{population:-1,stability:-5},{id:'buckets',probability:0.5}),[{absentFlag:'canal_fields_open'}])
      ]),
      choice('herds','Sürüleri dağ otlaklarına gönder.','Send the herds to the mountain pastures.',[
        outcome('Çobanlar sürülerle dağa çıktı. Ova dinlendi; çoban ailelerinin bir kısmı dönmedi.','The herders took the flocks to the mountains. The plain rested; some herding families did not return.',{population:-2,environment:3,stability:-2})
      ])
    ],{eraRole:'recurring'});

  // ——— Three recurring city events ———
  card('plague_quarantine',4,'health','Salgın ve Karantina','Plague and Quarantine',
    'Limandan gelen bir gemide ateşli hastalık görüldü ve iki mahallede ölümler başladı. Hekimler karantina istiyor; tüccarlar kapılar kapanırsa pazarın öleceğini söylüyor.',
    'A fever was found aboard a ship from the harbor and deaths have begun in two wards. Physicians want a quarantine; merchants say the market will die if the gates are closed.',
    empire+'Narrow stone street sealed with a rope barrier, physicians in wool hoods burning herbs in bronze braziers, watchmen turning back a cart, smoky grey light.',[
      choice('quarantine','Hasta mahalleleri ücretli bekçilerle karantinaya al.','Quarantine the sick wards with paid watchmen.',[
        context(outcome('Mahalleler kırk gün kapalı kaldı. Bekçiler ödendi; salgın başka sokağa geçmedi.','The wards stayed closed forty days. The watchmen were paid; the fever reached no other street.',{resources:-5,population:-1,stability:3,knowledge:2},{id:'watchmen',probability:0.5}),[{absentFlag:'public_care_settlement'}]),
        context(outcome('Kamu bakım evlerinin hemşireleri karantinaya girdi. Bekçi masrafı azaldı; hemşirelerin emeği büyüktü.','Nurses from the public care houses went into the quarantine. The watch cost less; the nurses’ labour was great.',{resources:-3,population:-1,stability:4,knowledge:1},{id:'nurses',probability:0.5}),[{flag:'public_care_settlement'}])
      ],[{stat:'resources',minimum:5}]),
      choice('gates','Kent kapılarını kapat.','Close the city gates.',[
        outcome('Kapılar kapandı. Salgın içeride yavaşladı; kervanlar dışarıda bekledi.','The gates closed. The fever slowed inside; the caravans waited outside.',{population:-1,stability:-4},{delayed:later(3,'Kapalı kapılar yüzünden pazar vergisi düştü.','Market dues fell because of the closed gates.',{resources:-3})})
      ]),
      choice('temple','Hastaları tapınak avlusuna kapat.','Shut the sick into the temple courtyard.',[
        outcome('Rahipler hastaları ayırdı, az kişi öldü. Halk tapınağa yöneldi; valinin sözü zayıfladı.','The priests separated the sick and few died. People turned to the temple; the governor’s word weakened.',{population:-1,authority:-4})
      ]),
      choice('ignore','Pazarı açık tut; hastalığı yok say.','Keep the market open and ignore the fever.',[
        outcome('Ateş birkaç evde kaldı ve söndü.','The fever stayed in a few houses and burned out.',{population:-1,stability:-2},{id:'contained',probability:0.5}),
        outcome('Ateş pazar yoluyla bütün kente yayıldı.','The fever spread through the market to the whole city.',{population:-5,stability:-4},{id:'spread',probability:0.5})
      ])
    ],{eraRole:'recurring'});

  card('insula_fire',4,'settlement','Kiralık Evlerde Yangın','Fire in the Tenements',
    'Ahşap çatılı kiralık evlerden birinde çıkan yangın üç sokağı sardı. Yangın söndü ama ev sahipleri aynı ahşapla yeniden yapmak istiyor. Kiremit çatı zorunluluğu herkes için pahalı olacak.',
    'A fire in a timber-roofed tenement swept three streets. It is out now, but the landlords want to rebuild with the same timber. Requiring tiled roofs would be costly for everyone.',
    empire+'Blackened tenement blocks with collapsed timber roofs, bucket chain of residents, tile makers stacking fired roof tiles, smoke drifting across a pale sky.',[
      choice('tiles','Kiremit çatıyı zorunlu kıl; kiremit ocaklarına ödeme yap.','Make tiled roofs compulsory and pay the tile kilns.',[
        outcome('Yeni çatılar kiremitle kapandı. Kasa ödedi; sokaklar artık yangına dayanıklı.','The new roofs were closed with tiles. The treasury paid; the streets now resist fire.',{resources:-7,stability:3},{flags:['tile_roof_ordinance']})
      ],[{absentFlag:'tile_roof_ordinance'},{stat:'resources',minimum:7}]),
      choice('tiled','Kiremit çatılı sokaklarda yangını kes.','Stop the fire at the tiled streets.',[
        outcome('Yangın kiremit çatılara dayanınca durdu. Bir sokak yandı ama ölen olmadı; ailelerine yeni ev bulunmalı.','The fire stopped when it met the tiled roofs. One street burned, but no one died; its families must be rehoused.',{stability:1,authority:-1})
      ],[{flag:'tile_roof_ordinance'}]),
      choice('watch','Nöbetçileri ve mahalleliyi yangına çağır.','Call the watch and the residents to the fire.',[
        context(outcome('Kamu muhafız loncası kova zincirini kurdu; nöbet ücreti zaten vergi defterindeydi. Mahalleler korundu.','The public watch guild formed the bucket chain; its pay was already in the tax ledger. The wards were saved.',{stability:3,authority:-1},{id:'public_guild',probability:0.4}),[{flag:'watch_guild_public'}]),
        context(outcome('Özel lonca yalnız tüccar sokaklarını korudu. Kiracıların evleri sabaha kadar yandı.','The private guild guarded only the merchant streets. The tenants’ houses burned until morning.',{authority:2,stability:-5,population:-1},{id:'private_guild',probability:0.3}),[{flag:'watch_guild_private'}]),
        context(outcome('Lonca yoktu; komşular sabaha kadar su taşıdı. Yangın söndü, dumandan boğulanlar oldu.','There was no guild; neighbours carried water until morning. The fire went out; some choked on the smoke.',{population:-1,stability:-1,authority:1},{id:'buckets',probability:0.3}),[{absentFlag:'watch_guild_public'},{absentFlag:'watch_guild_private'}])
      ]),
      choice('rebuild_later','Yeniden yapımı ev sahiplerine bırak.','Leave the rebuilding to the landlords.',[
        outcome('Ev sahipleri aynı ahşapla yeniden yaptı. Kiracılar sokakta kışı bekledi.','The landlords rebuilt with the same timber. The tenants waited out the winter in the street.',{stability:-3},{delayed:later(4,'Ahşap çatılı yeni evlerde bir yangın daha çıktı.','Another fire broke out in the new timber-roofed houses.',{resources:-4,stability:-2})})
      ])
    ],{eraRole:'recurring'});

  card('ferry_upkeep',4,'roads','Feribot ve Köprü Bakımı','Upkeep of the Ferry and Bridge',
    'Nehir geçidindeki feribot halatları çürüdü ve taş köprünün iki ayağında çatlak var. Tahıl arabaları, askerler ve tüccarlar aynı geçide bağlı. Bakım pahalı; ertelemek daha pahalı olabilir.',
    'The ferry ropes at the river crossing have rotted and two piers of the stone bridge are cracked. Grain carts, soldiers and merchants all depend on the same crossing. Upkeep is expensive; putting it off may cost more.',
    empire+'Wide river crossing with a rope-drawn ferry raft and a stone bridge with cracked piers, masons on scaffolds, carts queuing on the bank, muddy brown water.',[
      choice('repair','Halatları değiştir, ayakları onart.','Replace the ropes and repair the piers.',[
        context(outcome('Ustalar ayakları sardı, feribota yeni halat çekildi. Geçit yeniden güvenli.','Masons bound the piers and the ferry got new ropes. The crossing is safe again.',{resources:-6,stability:3},{id:'masons',probability:0.5,delayed:later(4,'Onarılan geçitten geçiş ücretleri toplandı.','Crossing fees were collected at the repaired ford.',{resources:2})}),[{absentFlag:'civic_ferry_rule'}]),
        context(outcome('Ortak feribot kuralına göre kıyı aileleri sırayla halat ördü. Taş ve usta yine ödendi.','Under the common ferry rule, riverside families took turns braiding rope. Stone and masons were still paid for.',{resources:-3,stability:4},{id:'rota',probability:0.5,delayed:later(4,'Ortak bakım nöbetiyle geçit ücreti düzenli toplandı.','With the shared rota, crossing fees came in regularly.',{resources:2})}),[{flag:'civic_ferry_rule'}])
      ],[{stat:'resources',minimum:6}]),
      choice('household','Feribotu kiracı aileye bırak; bakım onların olsun.','Leave the ferry to the leaseholding family and its upkeep to them.',[
        outcome('Aile feribotu onardı ama geçiş ücretini kendisi belirledi.','The family repaired the ferry but set the crossing fee itself.',{authority:-2,stability:1})
      ],[{flag:'household_ferry_lease'}]),
      choice('toll','Geçiş ücretini artır.','Raise the crossing toll.',[
        outcome('Ücret arttı. Kasa doldu; arabacılar sığ yerden geçmeyi denedi.','The toll went up. The treasury filled; carters tried the shallows instead.',{resources:2,stability:-3,authority:-1})
      ]),
      choice('defer','Bakımı gelecek yıla ertele.','Defer the upkeep to next year.',[
        outcome('Geçit bir yıl daha çürük halatla çalıştı.','The crossing worked another year on rotten rope.',{stability:-1},{delayed:later(5,'Çürük halat koptu; feribot bir araba tahılla battı.','The rotten rope snapped; the ferry sank with a cart of grain.',{resources:-5,stability:-2})})
      ])
    ],{eraRole:'recurring'});

  // ——— Two Bronze bridges (8/8) ———
  card('infirmary_ward',4,'legacy','Eyalet Darüşşifası','The Provincial Infirmary',
    'Kentin bakım evleri artık eyaletin bütün köylerinden hasta kabul ediyor. Eski bakım sözleşmesi kimin bakacağını ve kimin ödeyeceğini kaydetmişti. Valilik bu kaydı eyalet ölçeğine taşıyıp taşımamaya karar verecek.',
    'The city’s care houses now take in the sick from every village of the province. The old care charter had recorded who would tend and who would pay. The governorate must decide whether to carry that record to the scale of the province.',
    empire+'Colonnaded infirmary courtyard with sick villagers on straw pallets, nurses carrying water jars, a physician reading the old care charter tablet, soft afternoon light.',[
      choice('public','Kamu bakım sözleşmesini eyalet darüşşifasına taşı.','Carry the public care charter into a provincial infirmary.',[
        outcome('Darüşşifa kamu kaydıyla açıldı. Masraf vergi defterine yazıldı; köyler hastasını gönderdi.','The infirmary opened under the public record. Its cost was written into the tax ledger; villages sent their sick.',{resources:-6,stability:6,population:2},{flags:['provincial_infirmary_public']})
      ],[{flag:'public_care_settlement'},{stat:'resources',minimum:6}]),
      choice('fees','Özel bakım düzenini koru; darüşşifa ücret alsın.','Keep the private care order and let the infirmary charge fees.',[
        outcome('Ücret ödeyenler yatak buldu. Yoksul köylüler kapıdan döndü.','Those who paid found beds. Poor villagers were turned away at the door.',{authority:2,stability:-4},{flags:['provincial_infirmary_fees']})
      ],[{flag:'private_care_settlement'}]),
      choice('temple','Darüşşifayı tapınağa bırak.','Leave the infirmary to the temple.',[
        outcome('Rahipler hastaları kabul etti. Bakım sürdü; valinin sözü tapınak kapısında bitti.','The priests took in the sick. Care went on; the governor’s word ended at the temple door.',{authority:-3,stability:2},{flags:['provincial_infirmary_temple']})
      ]),
      choice('isolation','Yalnız bir tecrit evi kur.','Build only an isolation house.',[
        outcome('Kent dışına küçük bir tecrit evi yapıldı. Salgınlar ayrılacak; diğer hastalar köylerinde kalacak.','A small isolation house was built outside the city. Epidemics will be separated; other patients stay in their villages.',{resources:-4,stability:3,knowledge:2},{flags:['provincial_isolation_house']})
      ],[{stat:'resources',minimum:4}])
    ],{once:true,chain:'care_work',eraRole:'bridge',requirements:[{completedCard:'ward_charter'}]});

  card('granary_tally_office',4,'legacy','Ambar Kayıt Dairesi','The Granary Tally Office',
    'Eyalet ambarlarının sayısı arttı ve hesaplar karıştı. Kentin eski kil arşivi tahıl teslimlerini ve tanıklarını kaydetmişti. Valilik bu usulü eyalet ambarlarının hepsine yaymak istiyor.',
    'The province’s granaries have multiplied and the accounts are tangled. The city’s old clay archive had recorded grain deliveries and their witnesses. The governorate wants to extend that practice to every provincial granary.',
    empire+'Archive room lined with clay tablet shelves beside a granary weighing hall, scribes copying tallies onto wax tablets, a sack on a bronze balance, lamplight and dust.',[
      choice('public','Kamu arşivinin usulünü ambarlara taşı; kâtipleri öde.','Carry the public archive’s method to the granaries and pay the scribes.',[
        outcome('Her ambara bir kâtip ve bir kopya defter verildi. Kayıp tahıl ilk yıl azaldı.','Each granary got a scribe and a copy of the register. Missing grain fell in the first year.',{resources:-5,knowledge:3,stability:3},{flags:['granary_register_kept'],delayed:later(5,'Ambar kayıtları kaybolan tahılı geri getirdi.','The granary registers recovered grain that had gone missing.',{resources:2})})
      ],[{flag:'public_archive'},{stat:'resources',minimum:5}]),
      choice('witness','Tanık yasasını tartıya uygula.','Apply the witness law to the weighing.',[
        outcome('Her teslime iki tanık yemin etti. Kâtip ücreti az oldu; kayıt güvenildi.','Two witnesses swore at each delivery. The scribe’s fee was small; the record was trusted.',{resources:-3,stability:4,knowledge:1},{flags:['granary_register_kept']})
      ],[{flag:'witness_law'},{stat:'resources',minimum:3}]),
      choice('merchants','Kaydı tüccar kâtiplerine bırak.','Leave the register to the merchants’ scribes.',[
        outcome('Tüccar kâtipleri ambarları yazdı. Kayıt tutuldu, ama kimin lehine tutulduğu tartışıldı.','The merchant scribes registered the granaries. A record was kept, but whose favour it served was argued over.',{authority:-3,stability:-3},{flags:['granary_register_kept']})
      ]),
      choice('tallies','Çetele çubuklarıyla saymaya devam et.','Keep counting with tally sticks.',[
        outcome('Çeteleler ambarda kaldı. Kimse ödemedi; hesaplar karışık kaldı.','The tally sticks stayed in the granaries. No one paid; the accounts stayed tangled.',{knowledge:-1,stability:-1})
      ])
    ],{once:true,chain:'memory',eraRole:'bridge',requirements:[{completedCard:'clay_archive'}]});

  // ——— Two conditional conclusions: a Bronze close plus a completed imperial crisis (8/8) ———
  card('quarry_stone_granary',4,'legacy','Ocak Taşından Ambar','A Granary of Quarry Stone',
    'Ocak göçüğünden sonra imparatorluk ambarlarının taş duvarları için yeni taş gerekiyor. Tunç Çağı’ndaki ocak hakemliği taşın kimin hakkı olduğunu ve kimin taşıyacağını karara bağlamıştı. Valilik bu kararın ambar inşaatında da geçerli olup olmayacağını soruyor.',
    'After the quarry collapse, new stone is needed for the walls of the imperial granaries. The Bronze Age quarry arbitration had settled whose right the stone was and who would carry it. The governorate asks whether that ruling holds for the granary works too.',
    empire+'Half-built granary of large dressed limestone blocks, quarrymen hauling stone on sledges, an old arbitration tablet set on a block, foreman with a measuring rod, clear morning light.',[
      choice('audited','Denetlenmiş taş yükümlülüğünü ambar inşaatına uygula.','Apply the audited stone obligation to the granary works.',[
        outcome('Taş yükümlülüğü kayıtla dağıtıldı. Taşıyıcıların ücreti ödendi; ambar duvarı yükseldi.','The stone obligation was shared out by the record. The haulers were paid; the granary wall rose.',{resources:-5,stability:4,knowledge:2},{flags:['stone_granary_public']})
      ],[{flag:'stone_obligation_audited'},{stat:'resources',minimum:5}]),
      choice('lease','Yol kiracılarına taş getirt; karşılığında ambarda pay iste.','Have the road leaseholders bring stone in return for a share of the granary.',[
        outcome('Kiracılar taşı getirdi ve ambarın bir köşesini kendi tahılına ayırdı.','The leaseholders brought the stone and set aside a corner of the granary for their own grain.',{authority:2,stability:-4},{flags:['stone_granary_leased']})
      ],[{flag:'stone_road_lease'}]),
      choice('covenant','Kent yolu sözleşmesine göre mahalle işçileri çağır.','Call ward workers under the civic road covenant.',[
        outcome('Mahalleler sırayla taş taşıdı. Ustaların ücreti ödendi; ambar ortak emekle bitti.','The wards hauled stone in turns. The masons were paid; the granary was finished by common labour.',{resources:-3,stability:5},{flags:['stone_granary_public']})
      ],[{flag:'civic_road_covenant'},{stat:'resources',minimum:3}]),
      choice('refuse','Eski hakemliği tanıma; taşı valilik ocağından al.','Ignore the old arbitration and take stone from the governorate quarry.',[
        outcome('Valilik ocağı taşı verdi. Eski hak sahipleri kararın unutulduğunu yazdı.','The governorate quarry supplied the stone. The old right-holders wrote that the ruling had been forgotten.',{authority:1,stability:-3,knowledge:-1},{flags:['recorded_provincial_dissent']})
      ])
    ],{once:true,chain:'stored_power',eraRole:'conclusion',requirements:[{completedCard:'quarry_arbitration'},{completedCard:'quarry_collapse'}]});

  card('furnace_fire_law',4,'legacy','Ocakların Yangın Yasası','The Furnace Fire Law',
    'Kiralık evlerdeki yangından sonra suçlu olarak kent içindeki demir ve kiremit ocakları gösterildi. Tunç Çağı’ndaki ocak birliği yakıt ve nöbetin nasıl paylaşılacağını kaydetmişti. Şimdi ocakların surların içinde kalıp kalmayacağı tartışılıyor.',
    'After the tenement fire, the iron and tile furnaces inside the city were blamed. The Bronze Age furnace cooperative had recorded how fuel and watch were shared. Now the city argues whether the furnaces may stay inside the walls.',
    empire+'Row of brick furnaces in a walled craft quarter, smiths and tile makers facing magistrates, a charred roof beam displayed, old cooperative tablet on a bench, ember glow and evening haze.',[
      choice('shared','Ortak ocak düzenini yangın yasasına çevir; nöbeti birlikte öde.','Turn the shared furnace order into a fire law and pay the watch together.',[
        outcome('Ocaklar ortak nöbete bağlandı. Kül ve kıvılcım her gece denetlendi; nöbet ücretini birlik ve kamu paylaştı.','The furnaces were bound to a shared watch. Ash and sparks were checked every night; guild and public split the watch’s pay.',{resources:-4,stability:5,environment:2},{flags:['furnace_fire_law_shared']})
      ],[{flag:'shared_furnace_access'},{stat:'resources',minimum:4}]),
      choice('leased','Ocak kiracılarına yangın nöbetini kendi parasıyla tutturt.','Make the furnace lessees keep a fire watch at their own cost.',[
        outcome('Kiracılar nöbeti tuttu ama masrafı kiremit fiyatına ekledi.','The lessees kept the watch but added its cost to the price of tiles.',{authority:2,stability:-3,environment:-1},{flags:['furnace_fire_law_leased']})
      ],[{flag:'leased_furnace_order'}]),
      choice('outside','Ocakları surların dışına taşı.','Move the furnaces outside the walls.',[
        outcome('Ocaklar sur dışına taşındı. Kent rahatladı; ustalar uzun yolu ve kaybettikleri müşteriyi saydı.','The furnaces moved beyond the walls. The city breathed easier; the craftsmen counted the long walk and the lost customers.',{authority:-2,environment:2,knowledge:1},{flags:['furnace_fire_law_outside']})
      ])
    ],{once:true,chain:'embers',eraRole:'conclusion',requirements:[{completedCard:'furnace_coop'},{completedCard:'insula_fire'}]});
}
