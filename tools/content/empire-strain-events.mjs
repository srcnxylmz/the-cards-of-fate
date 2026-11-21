// Phase 3 sixth package (255 → 270): the strains of a strong empire and the first recorded historical milestone.
// Era 4 stays closed (ERA4_GATE.enabled:false, balanceEvidence:null); Era 5 stays closed. Nine recurring
// late-game crises, three Bronze bridges and three conditional conclusions bring Era 4 to 90 cards:
// 55 recurring, 17 conclusions, 17 bridges and 1 legal reform.
//
// Every recurring crisis has a visible cause in the province's own earlier choices or condition — a provincial
// assembly, a delegated seal, a dense population, a full registered granary, a rich treasury, a weak personal
// authority, intensively worked land — and at least one cheaper answer that only earlier preparation opens.
// Strength is never punished by a hidden roll: these events become drawable when their cause exists.
//
// Ledger additions (schema-v1 flags only):
//   provincial_charter_rights  a written charter of provincial rights
//   joint_imperial_council     a council shared by the capital and the provinces
//   veteran_land_rights        veterans hold recognized plots
//   tax_farm_contract          tax collection sold to farmers; falls due (−8) eight turns later
//   veteran_debts              veterans' plots financed by lenders; falls due (−3) eight turns later
//   plague_relief_credit       relief borrowed against the next harvest; falls due (−4) six turns later
//   enduring_empire_recorded   the Era 4 historical milestone was recorded (engine, never by a card)

const INSTITUTIONS = ['provincial_assembly_seats', 'garrison_civil_oversight', 'provincial_delegated_seal', 'elected_governorship', 'recallable_governorship', 'province_local_steward'];
export const MILESTONE_RIGHTS = ['household_representation', 'land_rights_registry', 'unified_land_register', 'canal_water_law', 'canal_shared_with_villages',
  'provincial_levy_reviewed', 'guest_citizenship', 'public_care_settlement', 'provincial_infirmary_public', 'provincial_charter_rights', 'joint_imperial_council', 'veteran_land_rights'];
export const MILESTONE_OBLIGATIONS = ['garrison_pay_arrears', 'debased_coinage', 'temple_grain_loan', 'regional_grain_loan', 'provincial_tax_deferred',
  'tax_farm_contract', 'veteran_debts', 'plague_relief_credit'];

/// The Era 4 milestone is a recorded historical turning point, not a victory: the run continues.
export function enduringEmpireMilestone(conclusions) {
  return { id:'enduring_empire', era:4, flag:'enduring_empire_recorded',
    minimumEraDecisions:120, minimumResources:15, minimumStability:50,
    minimumAuthority:25, institutionFlags:INSTITUTIONS, minimumInstitutions:2,
    rightsFlags:MILESTONE_RIGHTS, minimumRights:2, obligationFlags:MILESTONE_OBLIGATIONS, completedAnyOf:conclusions,
    text:{ tr:'Tarihsel dönüm noktası: Eyalet kendi ambarını dolduruyor, borcu yok, farklı toplulukların haklarını yazıya geçirdi ve meşruiyetini koruyor. Kâtipler bu dönemi kalıcı bir imparatorluğun kuruluşu olarak kaydetti. Tarih burada bitmiyor.',
      en:'Historical milestone: the province fills its own granary, owes no debt, has written down the rights of its different communities and keeps its legitimacy. The scribes recorded this age as the founding of an enduring empire. History does not end here.' } };
}

export const CRISIS_COOLDOWN = 12;
export const LATE_CRISES = ['provincial_secession', 'border_campaign', 'empire_epidemic', 'granary_graft', 'tax_farm_privilege', 'legion_loyalty', 'governor_ambition', 'succession_legitimacy', 'soil_exhaustion'];

export function addEmpireStrainEvents({cards,card,choice,outcome,delayed}) {
  const later=(turns,tr,en,stats,flags=[])=>[delayed(turns,4,tr,en,stats,flags)];
  const due=(turns,tr,en,stats,flag)=>{const d=delayed(turns,4,tr,en,stats);d.effect.removeFlags=[flag];return [d];};
  const drop=(result,flags)=>{result.effect.removeFlags=flags;return result;};
  const empire='Fictional composite ancient empire, cut limestone and marble, wax tablets and papyrus rolls, bronze and iron hand tools, wool tunics and cloaks, no stirrups, no paper books, no gunpowder; ivory, gold and dusty terracotta palette, portrait composition. ';

  // ——— Nine recurring late-game crises (55/24 with the earlier packages) ———
  card('provincial_secession',4,'province','Eyaletin Ayrılık Talebi','The Province Asks to Stand Alone',
    'Eyalet meclisi güçlendikçe bazı sıralar başkente vergi göndermeyi bırakmayı konuşuyor. Kendi meclisi olan bir eyalet, kendi yasasını da isteyebilir. Talep bugün dilekçe; yarın kapalı bir kapı olabilir.',
    'As the provincial assembly has grown stronger, some benches speak of no longer sending taxes to the capital. A province with its own assembly may also want its own law. Today the demand is a petition; tomorrow it may be a closed gate.',
    empire+'Provincial assembly hall with delegates holding a petition scroll, an imperial envoy standing alone at the door, the province’s own banner beside the imperial standard, tense afternoon light.',[
      choice('charter','Eyalete yazılı bir haklar beratı ver.','Grant the province a written charter of rights.',[
        outcome('Berat okundu ve mühürlendi. Eyalet vergisini göndermeye devam edecek; karşılığında bazı yasalarını kendisi yapacak.','The charter was read and sealed. The province will keep sending its taxes; in return it will make some of its own laws.',{authority:-4,stability:3},{flags:['provincial_charter_rights']})
      ]),
      choice('garrison','Talebi garnizonla bastır.','Suppress the demand with the garrison.',[
        outcome('Askerler meclis kapısını tuttu. Dilekçe geri çekildi; birkaç aile kente küstü ve itirazlarını deftere yazdırdı.','Soldiers held the assembly door. The petition was withdrawn; a few families turned their backs on the town and had their objections recorded.',{authority:2,stability:-5,population:-1},{flags:['recorded_provincial_dissent'],relation:-3})
      ]),
      choice('pact','Tahıl paktındaki komşu eyaletleri arabulucu yap.','Ask the neighbouring pact provinces to mediate.',[
        outcome('Komşu valiler iki tarafı aynı sofraya oturttu. Elçilerin yol masrafı ödendi; talep bir uzlaşıya döndü.','The neighbouring governors sat both sides at one table. The envoys’ travel was paid; the demand turned into a compromise.',{resources:-2,stability:2,authority:-1},{relation:2})
      ],[{flag:'regional_grain_pact'},{stat:'resources',minimum:2}]),
      choice('benches','Hane temsilini hatırlat; yeni sıraları meclise sen öner.','Recall the household benches already granted and propose the new seats yourself.',[
        outcome('Mahalle temsilcileri valinin önerisini destekledi. Ayrılık sözü yerini sıra pazarlığına bıraktı; vali biraz daha yetki paylaştı.','The ward delegates backed the governor’s proposal. Talk of separation gave way to bargaining over seats; the governor shared a little more power.',{authority:-2,stability:2})
      ],[{flag:'household_representation'}])
    ],{eraRole:'recurring',requirements:[{flag:'provincial_assembly_seats'},{stat:'stability',minimum:45}]});

  card('border_campaign',4,'logistics','Sınır Seferi ve İkmal','A Border Campaign and Its Supply',
    'Kalabalık ve zengin eyalet, sınır ötesindeki akıncıların gözünü üstüne çekti. Sınır köyleri yardım istiyor. Bir sefer asker kadar tahıl, araba ve yol ister; ikmali olmayan sefer kendi köylerini yağmalar.',
    'The populous, prosperous province has drawn the eye of raiders beyond the border. The frontier villages ask for help. A campaign needs grain, carts and roads as much as soldiers; a campaign without supply plunders its own villages.',
    empire+'Frontier road with a column of soldiers and ox carts of grain, a burned watchtower on a hill, villagers pointing toward the border, dusty evening light.',[
      choice('granary','Seferi kayıtlı ambardan besle.','Supply the campaign from the registered granary.',[
        outcome('Her araba tartılıp yola çıktı. Askerler köyleri yağmalamadı; ambar hafifledi.','Every cart was weighed and sent off. The soldiers did not plunder the villages; the granary grew lighter.',{resources:-6,stability:1,authority:2})
      ],[{flag:'granary_register_kept'},{stat:'resources',minimum:6}]),
      choice('levy','Köylerden asker topla.','Raise soldiers from the villages.',[
        outcome('Genç adamlar sınıra gitti. Akıncılar geri çekildi; tarlalarda eksik eller hasada kadar hissedildi.','Young men went to the border. The raiders fell back; the missing hands were felt in the fields until harvest.',{population:-2,authority:2,stability:-2},{delayed:later(4,'Sefere giden köylülerin tarlaları geç ekildi.','The fields of villagers who went on campaign were sown late.',{stability:-1})})
      ]),
      choice('garrison','Sivil denetimli garnizonu sınıra kaydır.','Move the civilian-overseen garrison to the frontier.',[
        outcome('Yargıçların denetlediği garnizon sınırı tuttu. Yol masrafı ödendi; askerler köylerden bir şey almadı.','The garrison under the magistrates’ oversight held the border. Their travel was paid; the soldiers took nothing from the villages.',{resources:-2,stability:1,authority:1})
      ],[{flag:'garrison_civil_oversight'},{stat:'resources',minimum:2}]),
      choice('yield','Sınır köylerini kendi hâline bırak.','Leave the frontier villages to themselves.',[
        outcome('Akıncılar birkaç köyü yaktı. Kaçan aileler kente sığındı; vali korumasız bıraktıklarının adını unutmayacak.','The raiders burned a few villages. Fleeing families took refuge in the town; the governor will not forget the names of those he left unprotected.',{population:-2,stability:-3})
      ])
    ],{eraRole:'recurring',requirements:[{stat:'population',minimum:55},{stat:'resources',minimum:20}]});

  card('empire_epidemic',4,'health','İmparatorluk Salgını','An Epidemic across the Empire',
    'Yollar ve kervanlar kalabalık eyaleti başkente bağladı; şimdi aynı yollardan bir ateşli hastalık geliyor. Sık mahallelerde hastalık hızla yayılıyor. Hazırlık yapılmışsa hastalar ayrılabilir; yapılmamışsa her kapı kendi başına kalır.',
    'Roads and caravans tied the crowded province to the capital; now a fever travels the same roads. It spreads quickly through the dense wards. If preparations were made, the sick can be separated; if not, every door is left to itself.',
    empire+'Crowded ward with doors marked in chalk, carers carrying water jars, a physician with a reed mask at a gate, a caravan halted outside the walls, pale morning light.',[
      choice('quarantine','Ücretli bekçilerle mahalleleri kapat.','Close the wards with paid guards.',[
        outcome('Bekçiler mahalle kapılarını tuttu ve ödendi. Hastalık birkaç sokakta kaldı.','Guards held the ward gates and were paid. The fever stayed in a few streets.',{resources:-5,population:-1,stability:1})
      ],[{stat:'resources',minimum:5}]),
      choice('infirmary','Kamu darüşşifasını aç.','Open the public infirmary.',[
        outcome('Darüşşifa hastaları aldı; bakıcıların yiyeceği ambardan çıktı. Ölenler azdı.','The infirmary took in the sick; the carers’ food came from the granary. Few died.',{resources:-2,population:-1,stability:2})
      ],[{flag:'provincial_infirmary_public'},{stat:'resources',minimum:2}]),
      choice('rites','Tapınaklarda arınma törenleri düzenlet.','Order purification rites at the temples.',[
        outcome('Rahipler törenleri yönetti ve halk teselli buldu. Kalabalık törenlerde hastalık yine yayıldı.','The priests led the rites and the people found comfort. In the crowded rites the fever spread again.',{population:-3,stability:1,knowledge:-1},{relations:{keepers:3}})
      ]),
      choice('open','Pazarı ve yolları açık tut.','Keep the market and roads open.',[
        outcome('Ticaret sürdü; hastalık da sürdü. Mahallelerde boş evler çoğaldı.','Trade went on; so did the fever. Empty houses multiplied in the wards.',{population:-4,stability:-2},{delayed:later(3,'Açık yollardan gelen ikinci dalga daha çok can aldı.','A second wave along the open roads took more lives.',{population:-2})})
      ])
    ],{eraRole:'recurring',requirements:[{stat:'population',minimum:60}]});

  card('granary_graft',4,'logistics','Ambar Yolsuzluğu','Theft from the Granary',
    'Dolu ambarın defterleri ile çuvalların sayısı tutmuyor. Bir kâtip, tartı memurlarının fazlayı tüccarlara sattığını fısıldıyor. Ambar ne kadar doluysa, eksik o kadar geç fark edilir.',
    'The full granary’s registers no longer agree with the count of sacks. A clerk whispers that the weighers sell the surplus to merchants. The fuller the granary, the later a shortfall is noticed.',
    empire+'Granary interior with stacked grain sacks, a clerk comparing a register with a tally stick, a weigher looking away, a merchant’s cart at the side door, dim lamplight.',[
      choice('audit','Ücretli denetçilerle her çuvalı yeniden say.','Recount every sack with paid auditors.',[
        outcome('Denetçiler eksiği buldu ve ödendi. Tartı memurları değiştirildi; ambar defteri yeniden güvenilir oldu.','The auditors found the shortfall and were paid. The weighers were replaced; the granary register could be trusted again.',{resources:-3,stability:2,knowledge:1,authority:-1})
      ],[{stat:'resources',minimum:3}]),
      choice('assembly','Denetimi eyalet meclisine bırak.','Leave the audit to the provincial assembly.',[
        outcome('Meclis denetçilerini seçti. Hırsızlık açığa çıktı; vali ambarın anahtarını meclisle paylaşmak zorunda kaldı.','The assembly chose its own auditors. The theft came to light; the governor had to share the granary keys with the assembly.',{authority:-2,stability:3,resources:-1})
      ],[{flag:'provincial_assembly_seats'},{stat:'resources',minimum:1}]),
      choice('quiet','Kâtibi sessizce görevden al.','Quietly dismiss the clerk.',[
        outcome('Söylenti sustu. Tartı memurları işlerine devam etti.','The rumour fell silent. The weighers went on with their work.',{authority:1,stability:-1},{delayed:later(5,'Sessizce süren hırsızlık ambarı boşalttı.','The theft that went on quietly emptied the granary.',{resources:-6})})
      ]),
      choice('ignore','Söylentiyi duymazdan gel.','Ignore the rumour.',[
        outcome('Kimse bir şey yapmadı. Halk ambara güvenmemeye başladı.','No one did anything. The people began to distrust the granary.',{stability:-2},{delayed:(()=>{const d=delayed(4,4,'Hırsızlık ortaya çıkınca ambar defteri itibarını yitirdi; tartı defteri kapandı.','When the theft came out, the granary register lost its credit; the weighing register was closed.',{resources:-4});d.effect.removeFlags=['granary_register_kept'];return [d];})()})
      ])
    ],{eraRole:'recurring',requirements:[{flag:'granary_register_kept'},{stat:'resources',minimum:25}]});

  card('tax_farm_privilege',4,'taxation','Vergi İltizamı ve Ticaret İmtiyazı','Tax Farming and Trade Privileges',
    'Kasa dolu olunca zengin aileler yeni bir teklif getirdi: vergiyi peşin ödesinler, eyaletin vergisini kendileri toplasın. Tüccar loncası da pazar imtiyazı karşılığında katkı sunuyor. Peşin para cazip; toplama işinin kimin elinde olacağı ise bir sonraki kıtlıkta önem kazanacak.',
    'With the treasury full, wealthy families brought a new offer: they will pay the tax in advance and collect the province’s taxes themselves. The merchant guild offers a contribution in exchange for a market privilege. Cash in hand is tempting; who holds the collection will matter in the next famine.',
    empire+'Wealthy bidders in fine cloaks presenting bags of coin before the governor’s table, a tax register open between them, guild masters waiting behind, polished marble and lamplight.',[
      choice('farm','Vergi toplamayı sekiz yıllığına iltizama ver.','Farm out the tax collection for eight years.',[
        outcome('Peşin para kasaya girdi. Mültezimler köyleri dolaşmaya başladı; köylüler yeni yüzlerden şikâyetçi.','The advance entered the treasury. The tax farmers began making their rounds; the villagers complained of the new faces.',{resources:6,stability:-3},{flags:['tax_farm_contract'],relation:-2,delayed:due(8,'İltizamın bedeli doldu: mültezimler aldıklarından fazlasını topladı, kasa açığı kapattı.','The tax farm fell due: the farmers collected more than they had paid, and the treasury covered the gap.',{resources:-8},'tax_farm_contract')})
      ],[{absentFlag:'tax_farm_contract'}]),
      choice('auction','İmtiyazı açık artırmayla sat.','Sell the privilege by open auction.',[
        outcome('Herkesin önünde teklifler verildi. Kasa biraz doldu; kaybeden aileler artırmanın onlara kapalı olduğunu söyledi.','Bids were made in public view. The treasury filled a little; the losing families said the auction had been closed to them.',{resources:3,stability:-1,authority:-1})
      ]),
      choice('refuse','Teklifleri reddet; vergiyi kâtipler toplamaya devam etsin.','Refuse the offers; the clerks keep collecting the tax.',[
        outcome('Kâtipler işlerini sürdürdü. Zengin aileler valinin kendilerini küçümsediğini düşündü.','The clerks went on with their work. The wealthy families felt the governor had slighted them.',{authority:-2,stability:1},{relations:{hunters:-2}})
      ]),
      choice('register','İmtiyazları toprak defterine göre biç.','Assess the privileges against the land register.',[
        outcome('Kâtipler her imtiyazı defterdeki gerçek tarlaya göre hesapladı. Kasa az ama adil doldu; hesaplar uzun sürdü.','The clerks priced each privilege by the real field in the register. The treasury filled a little, but fairly; the reckoning took long.',{resources:2,stability:1,authority:-1,knowledge:-1})
      ],[{flag:'land_rights_registry'}])
    ],{eraRole:'recurring',requirements:[{stat:'resources',minimum:30}]});

  card('legion_loyalty',4,'law','Askerlerin Sadakati','The Loyalty of the Soldiers',
    'Valinin kendi otoritesi zayıfladıkça askerler maaşı ve toprağı kimin vereceğine bakıyor. Bir komutan, adamlarının sadakatinin artık kendisine ait olduğunu açıkça söylüyor. Bu söz bir isyana da dönüşebilir, bir pazarlığa da.',
    'As the governor’s own authority has weakened, the soldiers look to whoever will give them pay and land. A commander says openly that his men’s loyalty now belongs to him. The words may become a mutiny or a bargain.',
    empire+'Soldiers in bronze helmets gathered around their commander in a fort courtyard, a magistrate holding an oath tablet at the gate, a pay chest on a cart, harsh midday light.',[
      choice('donative','Askerlere ikramiye öde.','Pay the soldiers a donative.',[
        outcome('İkramiye dağıtıldı. Askerler valiye selam durdu; kasa boşaldı ve komutan ödemenin bir dahakine de beklendiğini hatırlattı.','The donative was paid out. The soldiers saluted the governor; the treasury emptied, and the commander noted the payment would be expected again.',{resources:-6,authority:3})
      ],[{stat:'resources',minimum:6}]),
      choice('oversight','Sivil denetim yeminini askerlere yeniden okut.','Have the civil-oversight oath read to the soldiers again.',[
        outcome('Yargıçlar yemini okudu; askerler yasaya yeniden el bastı. Subaylar homurdandı.','The magistrates read the oath; the soldiers laid their hands on the law again. The officers grumbled.',{authority:2,stability:-1})
      ],[{flag:'garrison_civil_oversight'}]),
      choice('rotate','Subayları uzak kalelere dağıt.','Scatter the officers to distant forts.',[
        outcome('Komutan ve adamları ayrı kalelere gönderildi. Tehdit dağıldı; birkaç asker firar etti.','The commander and his men were sent to separate forts. The threat dispersed; a few soldiers deserted.',{authority:1,stability:-3,population:-1})
      ]),
      choice('yield','Komutanın sözünü kabul et.','Accept the commander’s word.',[
        outcome('Komutan garnizonun gerçek efendisi oldu. Vali kararlarını önce ona danışmak zorunda.','The commander became the garrison’s true master. The governor must consult him before every decision.',{authority:-3,stability:-2})
      ])
    ],{eraRole:'recurring',requirements:[{stat:'authority',maximum:20},{stat:'resources',minimum:25}]});

  card('governor_ambition',4,'province','Valinin Hırsı','The Governor’s Ambition',
    'Mührü devredilen vali, yetkisini kendi adamlarını kayırmak için kullanıyor. Başkente giden raporlar kısalıyor; eyalet vergileri valinin kendi sarayına harcanıyor. Devredilen mühür kolay geri alınmaz.',
    'The governor to whom the seal was delegated uses his powers to favour his own men. The reports to the capital grow shorter; the province’s taxes are spent on his own palace. A delegated seal is not easily taken back.',
    empire+'Provincial governor on a new marble terrace receiving clients, an imperial inspector waiting below with a short report, workers building a private palace wing, bright afternoon light.',[
      choice('recall','Geri çağrılabilir valilik kuralını işlet.','Invoke the rule that the governorship is recallable.',[
        outcome('Meclis valiyi geri çağırdı ve yerine yenisi seçildi. Eski valinin adamları sessizce çekildi.','The assembly recalled the governor and chose a new one. The old governor’s men withdrew quietly.',{authority:2,stability:-1})
      ],[{flag:'recallable_governorship'}]),
      choice('inspect','Ücretli bir müfettişle mühür defterini denetle.','Audit the seal register with a paid inspector.',[
        outcome('Müfettiş harcamaları birer birer buldu ve ödendi. Vali sarayının yarısını kamuya devretti.','The inspector found the spending item by item and was paid. The governor handed half of his palace over to the public.',{resources:-4,authority:2,knowledge:1})
      ],[{stat:'resources',minimum:4}]),
      choice('concede','Valiyle anlaş; eyaleti o yönetsin.','Come to terms with the governor and let him run the province.',[
        outcome('Vali eyaletin gerçek efendisi oldu. İşler sakinleşti; başkentin sözü bir derece hafifledi.','The governor became the province’s true master. Things calmed down; the capital’s word grew one degree lighter.',{authority:-4,stability:2})
      ]),
      choice('confront','Valiyi açıkça suçla.','Accuse the governor openly.',[
        outcome('Suçlama mecliste okundu. Vali gitti, ama adamları kentte huzursuzluk çıkardı.','The accusation was read in the assembly. The governor went, but his men stirred unrest in the town.',{authority:3,stability:-4},{relation:-2})
      ])
    ],{eraRole:'recurring',requirements:[{flag:'provincial_delegated_seal'},{stat:'stability',minimum:45}]});

  card('succession_legitimacy',4,'law','Ardıllık ve Meşruiyet Krizi','A Crisis of Succession and Legitimacy',
    'Valinin şahsi otoritesi zayıfladı; şimdi kimin ondan sonra geleceği tartışılıyor. Bir taraf eski soydan bir mirasçıyı, bir taraf meclisin seçeceği birini istiyor. Meşruiyet kişiden mi, yasadan mı gelecek?',
    'The governor’s personal authority has weakened; now there is dispute over who will come after him. One side wants an heir of the old lineage, the other someone the assembly will choose. Will legitimacy come from a person or from the law?',
    empire+'Two factions facing each other across a council chamber, one around a young heir with an ancestral seal, the other around an empty chair and a voting urn, an old governor seated between them, low golden light.',[
      choice('assembly','Ardılı eyalet meclisi onaylasın.','Let the provincial assembly confirm the successor.',[
        outcome('Meclis ardılı onayladı ve tören ücreti ödendi. Mirasçının yandaşları kenara çekildi; meclis bir sonraki kararda söz bekliyor.','The assembly confirmed the successor and the ceremony was paid for. The heir’s partisans stepped aside; the assembly expects a say in the next decision.',{authority:4,stability:1,resources:-2})
      ],[{flag:'provincial_assembly_seats'},{stat:'resources',minimum:2}]),
      choice('law','Ardılı hane temsilcilerinin yasasıyla belirle.','Settle the succession by the household delegates’ law.',[
        outcome('Ardıllık yasaya yazıldı. Mahalleler kendi sıralarının söz sahibi olduğunu gördü; tören sade tutuldu.','The succession was written into law. The wards saw their benches had a say; the ceremony was kept plain.',{authority:2,stability:1,resources:-1})
      ],[{flag:'household_representation'},{stat:'resources',minimum:1}]),
      choice('force','Ardılı askerle tahta oturt.','Seat the successor with soldiers.',[
        outcome('Mirasçı askerlerin arasında tahta çıktı. Karşı taraf sustu, ama itirazlarını deftere yazdırdı.','The heir took the seat among soldiers. The other side fell silent, but had its objections recorded.',{authority:5,stability:-5,population:-1},{flags:['recorded_provincial_dissent']})
      ]),
      choice('equals','Eşitler arasında birinci olarak yönet; ardılı belirsiz bırak.','Rule as first among equals and leave the succession open.',[
        outcome('Kimse ardıl ilan edilmedi. Kavga ertelendi; valinin sözü biraz daha hafifledi.','No successor was named. The quarrel was postponed; the governor’s word grew a little lighter.',{authority:-2,stability:1})
      ])
    ],{eraRole:'recurring',requirements:[{stat:'authority',maximum:15},{stat:'stability',minimum:50}]});

  card('soil_exhaustion',4,'production','Tükenen Tarlalar','The Exhausted Fields',
    'Çiftlikler ve kanal tarlaları yıllardır ara vermeden ekiliyor. Başaklar kısaldı; kanal kenarlarında toprak tuzla beyazlaşıyor. Dinlendirilmeyen toprak bir gün hiç vermez.',
    'The estates and canal fields have been sown for years without rest. The ears have grown short; along the canals the soil whitens with salt. Land that is never rested will one day yield nothing.',
    empire+'Wide estate fields with stunted grain, white salt crust along a canal bank, a farmer crumbling dry soil in his hand, a steward and a surveyor looking on, hazy summer light.',[
      choice('fallow','Tarlaların bir kısmını nadasa bırak.','Leave part of the fields fallow.',[
        drop(outcome('Çiftlik tarlalarının bir kısmı bu yıl ekilmedi. Hasat azaldı; toprak dinlenmeye başladı.','Part of the estate fields went unsown this year. The harvest shrank; the soil began to rest.',{environment:3,stability:-1},{delayed:later(5,'Nadastaki tarlalar yeniden ekildi.','The fallow fields were sown again.',{},['estate_fields_worked'])}),['estate_fields_worked'])
      ]),
      choice('manure','Gübre ve yeni toprak taşıt.','Haul manure and fresh soil.',[
        outcome('Arabalar gübre ve toprak taşıdı; arabacılar ödendi. Tarlalar ekilmeye devam etti.','Carts hauled manure and soil; the carters were paid. The fields went on being sown.',{resources:-5,environment:3})
      ],[{stat:'resources',minimum:5}]),
      choice('rotation','Toprak defterine göre köylerle münavebe yap.','Rotate the fields with the villages according to the land register.',[
        outcome('Defterdeki sınırlar sıra çizelgesine döndü. Köy meraları ve çiftlik tarlaları yer değiştirdi; çiftlik kâhyaları yetkilerinin azaldığını yazdı.','The register’s boundaries became a rota. Village pastures and estate fields swapped places; the estate stewards wrote that their powers had shrunk.',{environment:2,stability:1,authority:-2})
      ],[{flag:'land_rights_registry'}]),
      choice('push','Her tarlayı ekmeye devam et.','Keep every field sown.',[
        outcome('Bu yıl da her tarla ekildi ve hasat kaldırıldı. Kanal kenarındaki tuz biraz daha yayıldı.','Every field was sown again this year and the harvest brought in. The salt along the canal spread a little further.',{resources:2,environment:-4},{delayed:(()=>{const d=delayed(6,4,'Tuzlanan kanal tarlaları terk edildi.','The salted canal fields were abandoned.',{stability:-1});d.effect.removeFlags=['canal_fields_open'];return [d];})()})
      ])
    ],{eraRole:'recurring',requirements:[{flag:'estate_fields_worked'},{flag:'canal_fields_open'},{stat:'population',minimum:50}]});

  // ——— Three Bronze bridges (17/8) ———
  card('frontier_wall_muster',4,'legacy','Sınır Surlarının Nöbeti','Mustering the Frontier Walls',
    'Akınlar eyaletin dış surlarına kadar uzandı. Tunç Çağı’nda kent surları yapılırken nöbetin halka mı yoksa tüccarların ücretli muhafızlarına mı bırakılacağı kaydedilmişti. Aynı karar şimdi sınır boyunca verilmeli.',
    'Raids have reached the province’s outer walls. When the Bronze Age city walls were built, it had been recorded whether the watch would be left to the people or to the merchants’ paid guards. The same decision must now be made along the frontier.',
    empire+'Frontier wall with watchtowers at dusk, townspeople and paid guards climbing to the parapet, an old wall-building tablet held by a scribe, signal fires on distant hills.',[
      choice('public','Halk nöbeti kaydını sınıra taşı.','Carry the public-watch record to the frontier.',[
        outcome('Kentliler sırayla sınır surunda nöbet tuttu. Bazı aileler bir kişisini sınıra verdi; surlar halka ait oldu.','Townspeople took turns on the frontier wall. Some families gave one of their own to the frontier; the walls belonged to the people.',{population:-1,stability:2,authority:1})
      ],[{flag:'public_defense'}]),
      choice('merchant','Tüccar muhafız kaydını sürdür; ücretli nöbetçi tut.','Continue the merchant-guard record and hire paid watchmen.',[
        outcome('Tüccarların muhafızları sınır surunu tuttu ve ödendi. Kentliler surların kime hizmet ettiğini sordu.','The merchants’ guards held the frontier wall and were paid. The townspeople asked whom the walls served.',{resources:-4,authority:1,stability:-1})
      ],[{flag:'merchant_defense'},{stat:'resources',minimum:4}]),
      choice('levy','Yeni bir sınır angaryası çıkar.','Proclaim a new frontier levy.',[
        outcome('Köylerden adam toplandı ve surlara gönderildi. Nöbet kuruldu; tarlalar birkaç el eksik kaldı.','Men were gathered from the villages and sent to the walls. The watch was set; the fields were a few hands short.',{population:-2,authority:2,stability:-2})
      ]),
      choice('leave','Surları köylülere bırak.','Leave the walls to the villagers.',[
        outcome('Köylüler surları kendi başına tuttu. Bir gece bir kapı düştü; kimse sorumlu tutulmadı.','The villagers held the walls on their own. One night a gate fell; no one was held responsible.',{stability:-2,population:-1})
      ])
    ],{once:true,chain:'frontier',eraRole:'bridge',requirements:[{completedCard:'city_walls'}]});

  card('hostage_envoy_return',4,'legacy','Emanet Varisin Elçisi','The Envoy of the Entrusted Heir',
    'Tunç Çağı’nda sarayınıza emanet edilen komşu varis, şimdi sınırın ötesindeki krallığın başında. Elçisi geldi. Varisin konuk mu sayıldığı, yoksa sarayın kurallarına mı zorlandığı kayıtlarda yazılı; elçi de bunu biliyor.',
    'The neighbouring heir once entrusted to your palace in the Bronze Age now rules the kingdom beyond the border. His envoy has come. Whether the heir was treated as a guest or forced into the court’s customs is written in the records; the envoy knows it too.',
    empire+'Foreign envoy with a sealed letter in a marble reception hall, an old palace tablet showing the heir’s childhood, guards and scribes, warm evening light.',[
      choice('treaty','Konukluk hatırasına dayanarak bir sınır antlaşması öner.','Propose a border treaty on the memory of hospitality.',[
        outcome('Elçi varisin çocukluğundaki öğretmeni hatırladı. Antlaşma yazıldı; vali sınır vergisinin bir kısmından vazgeçti.','The envoy recalled the heir’s childhood tutor. The treaty was written; the governor gave up part of the border toll.',{authority:-1,stability:2},{relation:4})
      ],[{flag:'honored_hostage'}]),
      choice('reparation','Eski aşağılanmanın tazminatını öde.','Pay reparation for the old humiliation.',[
        outcome('Tazminat ödendi ve elçi bunu kabul etti. Kasa hafifledi; sınırda bir süre sessizlik olacak.','The reparation was paid and the envoy accepted it. The treasury grew lighter; there will be quiet on the border for a while.',{resources:-5,stability:1},{relation:2})
      ],[{flag:'humiliated_heir'},{stat:'resources',minimum:5}]),
      choice('guard','Sınır karakollarını güçlendir.','Strengthen the border posts.',[
        outcome('Karakollara asker gönderildi. Elçi eli boş döndü; sınırda iki taraf birbirini izliyor.','Soldiers were sent to the posts. The envoy left empty-handed; on the border the two sides watch each other.',{population:-1,authority:1,stability:-1})
      ]),
      choice('ignore','Elçiyi oyalayıp geri gönder.','Stall the envoy and send him back.',[
        outcome('Elçi haftalarca bekletildi ve geri döndü. Komşu krallık bunu unutmayacak.','The envoy was kept waiting for weeks and went home. The neighbouring kingdom will not forget it.',{stability:-2},{relation:-3})
      ])
    ],{once:true,chain:'frontier',eraRole:'bridge',requirements:[{completedCard:'hostage_prince'}]});

  card('seed_guarantee_audit',4,'legacy','Tohum Güvencesinin Denetimi','Auditing the Seed Guarantee',
    'Eyalet ambarı köylere tohum ödüncü vermeye başladı. Tunç Çağı’ndaki kıtlık makbuzları, tohum borçlarının uzlaştırılıp uzlaştırılmadığını, ertelenip ertelenmediğini ya da kent güvencesine bağlanıp bağlanmadığını kaydetmişti.',
    'The provincial granary has begun lending seed to the villages. The Bronze Age famine receipts had recorded whether seed debts were reconciled, rolled over or tied to a civic guarantee.',
    empire+'Granary clerks comparing old clay famine receipts with new seed loan registers, villagers holding seed baskets, an auditor counting tokens, morning light through a doorway.',[
      choice('reconciled','Uzlaştırılmış borç kaydını uygula; yeni ödünçleri aynı defterde tut.','Apply the reconciled-debt record and keep the new loans in the same ledger.',[
        outcome('Eski ve yeni borçlar aynı deftere yazıldı. Kâtipler ödendi; köyler hangi borcun kime ait olduğunu bildi.','Old and new debts went into one ledger. The clerks were paid; the villages knew which debt was whose.',{resources:-3,stability:3,knowledge:1})
      ],[{flag:'seed_debts_reconciled'},{stat:'resources',minimum:3}]),
      choice('rollover','Ertelenen borç kaydını sürdür; ödünçleri bir hasat daha ertele.','Continue the rolled-over record and defer the loans one more harvest.',[
        outcome('Köyler bu yıl ödemedi. Ambar boş kalan yerleri bir sonraki hasatta dolduracak.','The villages paid nothing this year. The granary will fill the gaps at the next harvest.',{stability:1,authority:-1},{delayed:later(5,'Ertelenen tohum borçları ödenemedi; ambar kaybı üstlendi.','The deferred seed debts could not be paid; the granary bore the loss.',{resources:-4})})
      ],[{flag:'seed_debt_rollover'}]),
      choice('guarantee','Kent güvencesi kaydını eyalete genişlet.','Extend the civic guarantee record to the province.',[
        outcome('Kentin güvencesi eyalet köylerine de uzatıldı. Kötü hasatta borç silinecek; kasa bu yükü üstlendi.','The town’s guarantee was extended to the provincial villages. In a bad harvest the debt will be forgiven; the treasury took on the burden.',{resources:-4,stability:4},{flags:['public_care_settlement']})
      ],[{flag:'civic_seed_guarantee'},{stat:'resources',minimum:4}]),
      choice('decree','Ödünçleri faizle ver.','Lend the seed at interest.',[
        outcome('Ödünçler faizle verildi. Ambar gelir kazanacak; köylüler borcun büyüdüğünü söyledi.','The loans were given at interest. The granary will earn; the villagers said the debt was growing.',{stability:-3},{delayed:later(4,'Faizli tohum ödünçleri ambara geri döndü.','The seed lent at interest came back to the granary.',{resources:3})})
      ])
    ],{once:true,chain:'debt',eraRole:'bridge',requirements:[{completedCard:'famine_receipts'}]});

  // ——— Three conditional conclusions: a Bronze record plus a completed late-game crisis (17/8) ———
  card('assembly_center_accord',4,'legacy','Başkent ile Meclisin Uzlaşısı','The Accord of Capital and Assembly',
    'Ayrılık talebinden sonra başkent ve eyalet meclisi kalıcı bir düzen arıyor. Tunç Çağı’ndaki kapı nöbeti kararı, ortak işlerin sırayla mı, sözleşmeyle mi yoksa ortak denetimle mi yürütüleceğini kaydetmişti.',
    'After the demand to stand alone, the capital and the provincial assembly seek a lasting order. The Bronze Age gate-watch ruling had recorded whether common duties would run by rotation, by contract or under joint oversight.',
    empire+'Imperial envoy and provincial delegates seated at one long table, an old gate-watch tablet in the centre, a new accord on papyrus being drafted, calm morning light.',[
      choice('rotation','Dönüşümlü nöbet kaydını uygula; ortak meclisin başkanlığı dönsün.','Apply the rotating-watch record: the presidency of a joint council rotates.',[
        outcome('Başkent ve eyalet ortak bir meclis kurdu; başkanlık sırayla geçecek. Vali tek başına karar veremeyecek.','The capital and the province formed a joint council; its presidency will rotate. The governor can no longer decide alone.',{authority:-2,stability:4},{flags:['joint_imperial_council']})
      ],[{flag:'rotating_gate_wards'}]),
      choice('contract','Sözleşmeli nöbet kaydını sürdür; vergi paylarını sözleşmeye yaz.','Continue the contracted-watch record and write the tax shares into a contract.',[
        outcome('Her tarafın vergi payı sözleşmeye yazıldı. Kâtipler ödendi; tartışmalar artık maddelere dayanıyor.','Each side’s tax share was written into a contract. The clerks were paid; disputes now rest on its clauses.',{resources:-3,stability:2},{flags:['provincial_charter_rights']})
      ],[{flag:'contracted_gate_watch'},{stat:'resources',minimum:3}]),
      choice('joint','Ortak denetim kaydını genişlet.','Extend the joint-oversight record.',[
        outcome('Başkent ve meclis ortak denetçiler atadı. Kararlar yavaşladı; iki taraf da diğerinin defterini okuyabiliyor.','The capital and the assembly appointed joint inspectors. Decisions slowed; each side can read the other’s ledger.',{authority:-1,stability:3},{flags:['joint_imperial_council']})
      ],[{flag:'joint_gate_oversight'}]),
      choice('decree','Başkentin emrini meclisin üstünde tut.','Keep the capital’s decree above the assembly.',[
        outcome('Emir okundu: başkentin sözü son söz. Meclis dağılmadı, ama itirazlarını deftere yazdırdı.','The decree was read: the capital’s word is final. The assembly did not disband, but had its objections recorded.',{authority:4,stability:-4},{flags:['recorded_provincial_dissent']})
      ])
    ],{once:true,chain:'public_voice',eraRole:'conclusion',requirements:[{completedCard:'gate_ward'},{completedCard:'provincial_secession'}]});

  card('veteran_land_charter',4,'legacy','Gazilerin Toprak Beratı','The Veterans’ Land Charter',
    'Sınır seferinden dönen askerler toprak istiyor. Tunç Çağı’ndaki borç güvencesi kararı, hasat güvencesinin kurulup kurulmadığını ya da borç sınırlarının kaldırılıp kaldırılmadığını kaydetmişti. Gazilerin tarlası bu kayda göre ya güvenceli ya borçlu olacak.',
    'The soldiers back from the border campaign want land. The Bronze Age debt-insurance ruling had recorded whether a harvest guarantee was founded or the limits on debt were repealed. The veterans’ fields will be either guaranteed or indebted by that record.',
    empire+'Veterans with shields slung on their backs receiving land tokens before a magistrate, surveyors marking plots on a plain, an old debt tablet on the table, clear afternoon light.',[
      choice('guarantee','Hasat güvencesi kaydını gazi tarlalarına genişlet.','Extend the harvest-guarantee record to the veterans’ plots.',[
        outcome('Gazilerin tarlaları güvenceye alındı. Kasa ilk yılın tohumunu verdi; gaziler kötü hasatta borca düşmeyecek.','The veterans’ plots were guaranteed. The treasury gave the first year’s seed; the veterans will not fall into debt in a bad harvest.',{resources:-3,stability:3},{flags:['veteran_land_rights']})
      ],[{flag:'harvest_guarantee'},{stat:'resources',minimum:3}]),
      choice('lenders','Borç sınırsızlığı kaydını sürdür; gazileri tefeciler finanse etsin.','Continue the repealed-limits record and let lenders finance the veterans.',[
        outcome('Tefeciler tohumu verdi. Kasa bir şey ödemedi; gaziler faizin ağırlığını şimdiden konuşuyor.','The lenders provided the seed. The treasury paid nothing; the veterans already talk of the weight of interest.',{resources:2,stability:-3},{flags:['veteran_debts'],delayed:due(8,'Gazi borçları vadesinde ödenmedi; kasa tefecilere ödeme yaptı.','The veterans’ debts were not paid when due; the treasury paid the lenders.',{resources:-3},'veteran_debts')})
      ],[{flag:'repealed_debt_limits'},{absentFlag:'veteran_debts'}]),
      choice('grant','Devlet çiftliklerinden toprak ver.','Grant land from the crown estates.',[
        outcome('Gaziler devlet çiftliklerinden pay aldı. Korular açıldı; çiftlik kâhyaları kayıplarını yazdı.','The veterans received shares of the crown estates. Groves were cleared; the estate stewards wrote down their losses.',{environment:-2,authority:-1,population:1},{flags:['veteran_land_rights']})
      ]),
      choice('deny','Toprak isteğini reddet.','Refuse the request for land.',[
        outcome('Gaziler eli boş döndü. Kentte işsiz askerlerin sayısı arttı.','The veterans went home empty-handed. The number of idle soldiers in town grew.',{authority:1,stability:-3})
      ])
    ],{once:true,chain:'debt',eraRole:'conclusion',requirements:[{completedCard:'debt_insurance'},{completedCard:'border_campaign'}]});

  card('plague_relief_reckoning',4,'legacy','Salgın Sonrası Hesaplaşma','The Reckoning after the Epidemic',
    'Salgın geçti; geride yetimler, boş evler ve ekilmemiş tarlalar kaldı. Tunç Çağı’ndaki tayın meclisi ailelerin göç ettirilip ettirilmediğini, ortak mutfak sırası kurulup kurulmadığını ya da sınırlı kıtlık kredisi verilip verilmediğini kaydetmişti.',
    'The epidemic has passed; it left orphans, empty houses and unsown fields behind. The Bronze Age ration council had recorded whether families were moved, a shared kitchen rota set up or a bounded famine credit granted.',
    empire+'Quiet ward after an epidemic, carers feeding orphans at a long table, empty houses with chalk marks, a clerk reading an old ration tablet, soft evening light.',[
      choice('migration','Tayın göçü kaydını uygula; yetim haneleri boş evlere yerleştir.','Apply the ration-migration record and settle orphaned households in the empty houses.',[
        outcome('Yetimler ve dullar boş evlere yerleştirildi; ilk erzakları ambardan çıktı. Mahalleler yeniden doldu.','Orphans and widows were settled in the empty houses; their first provisions came from the granary. The wards filled again.',{population:2,resources:-3,stability:1})
      ],[{flag:'ration_migration'},{stat:'resources',minimum:3}]),
      choice('kitchens','Ortak mutfak sırasını eyalete yay.','Spread the shared kitchen rota across the province.',[
        outcome('Mahalle mutfakları yetimleri doyurdu. Ambar ödedi; bakım kalıcı bir düzene döndü.','The ward kitchens fed the orphans. The granary paid; care became a lasting arrangement.',{resources:-2,stability:3},{flags:['public_care_settlement']})
      ],[{flag:'shared_kitchen_rota'},{stat:'resources',minimum:2}]),
      choice('credit','Sınırlı kıtlık kredisi kaydını kullan; yardımı gelecek hasada borçlan.','Use the bounded famine-credit record and borrow the relief against the next harvest.',[
        outcome('Yardım bugün dağıtıldı; borcu gelecek hasada yazıldı.','The relief was handed out today; its debt was written against the next harvest.',{resources:3,stability:1},{flags:['plague_relief_credit'],delayed:due(6,'Salgın yardımının borcu hasattan ödendi.','The epidemic relief debt was paid from the harvest.',{resources:-4},'plague_relief_credit')})
      ],[{flag:'bounded_famine_credit'},{absentFlag:'plague_relief_credit'}]),
      choice('decree','Yetimleri tapınaklara ve akrabalara bırak.','Leave the orphans to the temples and their kin.',[
        outcome('Tapınaklar ve akrabalar yetimleri aldı. Kasa bir şey ödemedi; bazı çocuklar sokakta kaldı.','The temples and kin took in the orphans. The treasury paid nothing; some children were left on the streets.',{authority:1,stability:-3,population:-1})
      ])
    ],{once:true,chain:'memory',eraRole:'conclusion',requirements:[{completedCard:'ration_council'},{completedCard:'empire_epidemic'}]});
  // A crisis returns at most once every twelve turns: late-game strain is periodic, not a constant drain.
  for (const crisis of cards.filter(c => LATE_CRISES.includes(c.id))) crisis.cooldown = CRISIS_COOLDOWN;
}
