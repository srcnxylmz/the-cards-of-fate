// Phase 3 fifth package (240 → 255): assemblies, legitimacy, land rights and inter-provincial grain.
// Era 4 stays closed (ERA4_GATE.enabled:false, balanceEvidence:null); Era 5 stays closed. Nine recurring
// economic and political events, three Bronze bridges and three conditional conclusions bring Era 4 to
// 75 cards: 46 recurring, 14 conclusions, 14 bridges and 1 legal reform.
//
// Engine rule read from balance.json (Era 4 only): provincialFamineRelief — when hunger strikes a province
// that holds a sealed public store (grain_famine_store), the store is opened once, covers up to 4 shares
// of the shortfall and is then empty. Refilling it costs reserves again (grain_ceiling, famine_store_release,
// surplus_harvest).
// Ledger additions (schema-v1 flags only):
//   regional_grain_pact   the province belongs to the neighbouring provinces' grain pact
//   regional_grain_loan   one open pact loan; it falls due (−4) six turns later and cannot stack
//   land_rights_registry  a surveyed register of estate and commons boundaries
export const PROVINCIAL_FAMINE_RELIEF = { minimumEra:4, flag:'grain_famine_store', maximumShares:4 };

export function addEmpireAssemblyEvents({card,choice,outcome,delayed}) {
  const later=(turns,tr,en,stats,flags=[])=>[delayed(turns,4,tr,en,stats,flags)];
  const drop=(result,flags)=>{result.effect.removeFlags=flags;return result;};
  const context=(result,requirements)=>({...result,requirements});
  const empire='Fictional composite ancient empire, cut limestone and marble, wax tablets and papyrus rolls, bronze and iron hand tools, wool tunics and cloaks, no stirrups, no paper books, no gunpowder; ivory, gold and dusty terracotta palette, portrait composition. ';

  // ——— Nine recurring economic and political events (46/24 with the earlier packages) ———
  card('representation_reform',4,'citizenship','Temsil Reformu','A Reform of Representation',
    'Eyalet meclisindeki sıralar hâlâ eski soyların elinde. Kalabalık mahalleler sıraların hane sayısına göre dağıtılmasını istiyor; toprak sahipleri ise yalnız mülk sahiplerinin oy vermesini savunuyor. Kimin sayılacağı, kimin vergi ödeyeceğini de belirleyecek.',
    'The benches of the provincial council are still held by the old lineages. Crowded wards want the benches shared out by household; the landholders argue that only property owners should vote. Who is counted will also decide who pays the taxes.',
    empire+'Provincial council hall with a scribe tallying households on wax tablets, ward delegates and landholders arguing across a marble floor, a bronze ballot urn on a stand, afternoon light through high windows.',[
      choice('households','Sıraları hane sayısına göre dağıt.','Share out the benches by household.',[
        outcome('Kalabalık mahalleler ilk kez sıra kazandı. Eski soylar sözlerinin hafiflediğini yazdı; vali artık daha çok sesi hesaba katmak zorunda.','The crowded wards won benches for the first time. The old lineages wrote that their word had lightened; the governor must now reckon with more voices.',{authority:-3,stability:4},{flags:['household_representation'],relation:3})
      ]),
      choice('property','Oyu mülk şartına bağla.','Tie the vote to a property qualification.',[
        outcome('Yalnız mülk sahipleri oy verdi. Meclis sakin ve hızlı karar aldı; mahalleler dışarıda kaldığını unutmadı.','Only property owners voted. The council decided quickly and calmly; the wards did not forget they had been left outside.',{authority:2,stability:-3},{flags:['property_franchise'],relation:-2})
      ]),
      choice('residents','Vatandaşlık duruşmasından geçen liman ailelerini de say.','Count the harbor families who passed the citizenship hearing as well.',[
        outcome('Duruşma kayıtları sayıma eklendi. Liman mahallesi mecliste sesini buldu; vali bir yetkisini daha paylaştı.','The hearing records were added to the count. The harbor ward found its voice in the council; the governor shared one more of his powers.',{authority:-3,stability:5},{flags:['household_representation']})
      ],[{flag:'provincial_residency_hearing'}]),
      choice('census','Ücretli bir sayım yaptır; sıraları sayım sonucuna göre böl.','Hold a paid census and divide the benches by its result.',[
        outcome('Sayım kâtipleri her kapıyı dolaştı. Ücretleri ödendi; sıralar herkesin itiraz edemeyeceği bir sayıyla bölündü.','Census clerks went from door to door. They were paid; the benches were divided by a count no one could easily dispute.',{resources:-5,stability:3,knowledge:2},{flags:['household_representation']})
      ],[{stat:'resources',minimum:5}])
    ],{eraRole:'recurring'});

  card('land_tax_reform',4,'taxation','Toprak Vergisi Reformu','Reforming the Land Tax',
    'Eski toprak vergisi tarlanın büyüklüğüne değil, sahibinin nüfuzuna göre toplanıyor. Kâtipler arazileri ölçüp yeni bir defter önermekte; tüccarlar ise kişi başı vergiyi daha kolay buluyor. Yoksul köyler vergiyi hasattan pay olarak ödemek istiyor.',
    'The old land tax is levied by the owner’s influence, not by the size of the field. Clerks propose measuring the land and writing a new register; merchants find a head tax simpler. Poor villages want to pay the tax as a share of the harvest.',
    empire+'Surveyors with measuring rods and cords in a terraced field, a clerk writing a new land register on papyrus, villagers and a landholder watching, low golden light.',[
      choice('survey','Arazileri ölçtür; vergiyi yeni deftere göre topla.','Have the land surveyed and levy the tax by the new register.',[
        outcome('Ölçüm ekipleri tarlaları dolaştı ve ödendi. Nüfuzlu aileler ilk kez gerçek paylarını ödeyecek.','The survey teams walked the fields and were paid. Influential families will pay their true share for the first time.',{resources:-6,stability:2,knowledge:2},{delayed:later(6,'Ölçülmüş deftere göre toplanan vergi, kaçağı azalttı.','The tax levied by the surveyed register reduced evasion.',{resources:4})})
      ],[{stat:'resources',minimum:6}]),
      choice('head','Toprak vergisini kişi başı vergiye çevir.','Replace the land tax with a head tax.',[
        outcome('Herkes aynı vergiyi ödedi. Kasa hemen doldu; büyük toprak sahipleri sevindi, kalabalık yoksul aileler homurdandı.','Everyone paid the same tax. The treasury filled at once; great landholders rejoiced, crowded poor families grumbled.',{resources:3,stability:-4,authority:-1})
      ]),
      choice('harvest_share','Vergiyi çiftlik hasadından pay olarak al.','Take the tax as a share of the estate harvest.',[
        outcome('Vergi harmanda tartıldı. Kötü yılda daha az, iyi yılda daha çok ödenecek; tartı memurlarına güvenmeyenler itiraz etti.','The tax was weighed on the threshing floor. Less will be paid in bad years, more in good ones; those who distrust the weighers objected.',{stability:1,authority:-2},{delayed:later(4,'Hasattan pay olarak alınan vergi ambara girdi.','The tax taken as a harvest share entered the granary.',{resources:2})})
      ],[{flag:'estate_fields_worked'}]),
      choice('keep','Eski vergiyi değiştirme.','Leave the old tax unchanged.',[
        outcome('Hiçbir şey değişmedi. Nüfuzlu aileler yine az ödedi; köyler adaletsizliği bir kez daha deftere yazdırdı.','Nothing changed. Influential families again paid little; the villages had the injustice recorded once more.',{authority:-1,stability:-1})
      ])
    ],{eraRole:'recurring'});

  const pactLoanDue=delayed(6,4,'Tahıl paktından alınan ödünç vadesinde geri ödendi.','The loan from the grain pact was repaid when it fell due.',{resources:-4});
  pactLoanDue.effect.removeFlags=['regional_grain_loan'];
  card('grain_pact',4,'logistics','Bölgesel Tahıl Paktı','The Regional Grain Pact',
    'Komşu eyaletler kıtlık yıllarında birbirine tahıl göndermek için bir pakt kuruyor. Pakta katılan her eyalet ambarından ya da kasasından pay koymalı. Kıtlıktaki bir eyalet paktan ödünç tahıl alabilir, ama borcunu ödeyene kadar meclisinde sözü azalır.',
    'The neighbouring provinces are forming a pact to send each other grain in famine years. Every member must contribute from its granary or treasury. A province in famine may borrow grain from the pact, but its voice in the pact council shrinks until it repays.',
    empire+'Envoys from several provinces around a table with grain samples in bronze bowls, a pact tablet being sealed, ox carts loaded with sacks waiting outside the colonnade, clear morning light.',[
      choice('pledge_store','Pakta ambarla ya da emekle katıl.','Join the pact with granary stock or with labour.',[
        context(drop(outcome('Depo pakt ambarı olarak yeniden mühürlendi ve ilk kafileyle komşuya gitti. Komşular sözü unutmayacak.','The store was resealed as a pact granary and left with the first convoy to a neighbour. The neighbours will not forget the pledge.',{stability:2,authority:-1},{flags:['regional_grain_pact'],relation:6,delayed:later(5,'Pakt sırası size geldi; komşu eyaletlerden tahıl kafilesi ulaştı.','The pact’s turn came round to you; a grain convoy arrived from the neighbouring provinces.',{resources:3}),id:'store',probability:0.5}),['grain_famine_store']),[{flag:'grain_famine_store'}]),
        context(outcome('Ambar boştu; eyalet pakta arabacı ve hamal gönderdi. Kendi tarlaları birkaç el eksik kaldı, ama pakt defterine yazıldı.','The granary was empty; the province sent carters and porters to the pact. Its own fields were a few hands short, but it was entered in the pact ledger.',{authority:-2,stability:-1,population:-1},{id:'labour',probability:0.5,flags:['regional_grain_pact'],relation:3}),[{absentFlag:'grain_famine_store'}])
      ]),
      choice('pledge_coin','Pakta kasadan pay koy.','Contribute coin from the treasury to the pact.',[
        outcome('Pay ödendi ve eyalet pakta yazıldı. Kasa hafifledi; ilk karşılık birkaç tur sonra gelecek.','The share was paid and the province entered the pact. The treasury thinned; the first return will come in a few turns.',{resources:-5,stability:1},{flags:['regional_grain_pact'],relation:4,delayed:later(5,'Pakt kafilesi ambara tahıl getirdi.','The pact convoy brought grain to the granary.',{resources:3})})
      ],[{stat:'resources',minimum:5}]),
      choice('borrow','Paktan şimdi ödünç tahıl iste.','Ask the pact for grain on loan now.',[
        outcome('Komşular tahılı gönderdi ve borcu pakt defterine yazdı. Vali pakt meclisinde bir süre sessiz kalmak zorunda.','The neighbours sent the grain and wrote the debt in the pact ledger. The governor must keep quiet in the pact council for a while.',{resources:4,authority:-3},{flags:['regional_grain_loan'],delayed:[pactLoanDue]})
      ],[{absentFlag:'regional_grain_loan'}]),
      choice('stay_out','Pakta katılma.','Stay out of the pact.',[
        outcome('Eyalet kendi ambarına güvendi. Komşular bir sonraki kıtlıkta kapılarını hatırlayacaklarını söyledi.','The province trusted its own granary. The neighbours said they would remember its gates in the next famine.',{authority:1,stability:-1},{relation:-4})
      ])
    ],{eraRole:'recurring'});

  card('public_safety_compact',4,'settlement','Kamu Güvenliği Uzlaşısı','A Compact for Public Safety',
    'Pazar yerinde bir hırsızlık kavgaya, kavga mahalle çatışmasına dönüştü. Mahalleler kendi gönüllü nöbetini kurmak istiyor; komutan sokaklara asker dikmeyi öneriyor. Kimin sopası kimin sırtına ineceği, kentin uzlaşısını belirleyecek.',
    'A theft in the market turned into a brawl, and the brawl into a clash between wards. The wards want to raise their own volunteer watch; the commander proposes posting soldiers in the streets. Whose staff falls on whose back will decide the town’s settlement.',
    empire+'Night street with ward volunteers holding lanterns and staves, a patrol of soldiers at the corner, magistrate between them reading a compact tablet, torchlight on stone walls.',[
      choice('wards','Mahallelere gönüllü nöbet hakkı ver.','Give the wards the right to keep a volunteer watch.',[
        outcome('Mahalleler kendi nöbetçilerini seçti. Kavgalar azaldı; valinin askerleri bazı sokaklara artık giremiyor.','The wards chose their own watchmen. The brawls died down; the governor’s soldiers can no longer enter some streets.',{authority:-2,stability:3})
      ]),
      choice('soldiers','Sokaklara asker dik.','Post soldiers in the streets.',[
        outcome('Askerler köşe başlarını tuttu. Sessizlik geldi; mahalleler askerlerin kime ait olduğunu sordu.','Soldiers held the street corners. Silence came; the wards asked whose soldiers they really were.',{authority:2,stability:-3},{relation:-2})
      ]),
      choice('paid','Ücretli bekçiler tut.','Hire paid watchmen.',[
        outcome('Ücretli bekçiler her mahallede devriye gezdi. Kasa ödedi; sokaklar sakinleşti.','Paid watchmen patrolled every ward. The treasury paid; the streets calmed.',{resources:-5,stability:4})
      ],[{stat:'resources',minimum:5}]),
      choice('guild','Kamu muhafız loncasının nöbetini genişlet.','Extend the public watch guild’s rounds.',[
        outcome('Lonca nöbeti yeni mahallelere uzattı. Nöbet vergi defterinden ödendi; vali loncaya yeni bir söz vermek zorunda kaldı.','The guild extended its rounds to new wards. The watch was paid from the tax ledger; the governor had to make the guild a new promise.',{stability:4,authority:-2})
      ],[{flag:'watch_guild_public'}])
    ],{eraRole:'recurring'});

  card('legitimacy_oath',4,'province','Sadakat Yemini','The Oath of Loyalty',
    'Başkent bütün eyalet görevlilerinden imparatora yemin istiyor. Kentliler yeminin eyalet yasasına edilmesini, köylüler ise yerel tapınaklarda edilmesini istiyor. Yeminin kime edildiği, valinin hangi yetkiye dayandığını gösterecek.',
    'The capital demands an oath to the emperor from every provincial official. The townspeople want the oath sworn to the provincial law, the villagers want it sworn at the local shrines. To whom the oath is sworn will show on what authority the governor rests.',
    empire+'Officials raising their right hands before an altar and a bronze law tablet, a priest of a local shrine and an imperial envoy standing apart, citizens watching from steps, bright ceremonial light.',[
      choice('law','Yemini eyalet yasasına ettir.','Have the oath sworn to the provincial law.',[
        outcome('Görevliler yasa tabletine el bastı. Kentliler kendi yasalarının önemsendiğini gördü; başkent elçisi kaşlarını çattı.','The officials laid their hands on the law tablet. The townspeople saw their law honoured; the capital’s envoy frowned.',{authority:-2,stability:3,knowledge:1})
      ]),
      choice('cult','İmparator kültü için bir tapınak yaptır.','Build a temple to the imperial cult.',[
        outcome('İmparatorluk tapınağı yükseldi ve yemin orada edildi. Başkent memnun; yerel rahipler sunakların boşaldığını söyledi.','The imperial temple rose and the oath was sworn there. The capital was pleased; the local priests said their altars were emptying.',{resources:-4,authority:3,stability:1},{relation:-2})
      ],[{stat:'resources',minimum:4}]),
      choice('shrines','Yemini yerel tapınaklarda ettir.','Have the oath sworn at the local shrines.',[
        outcome('Yeminler köy tapınaklarında edildi. Rahipler ve köylüler memnun; başkent valinin kime bağlı olduğunu sordu.','The oaths were sworn at the village shrines. Priests and villagers were pleased; the capital asked to whom the governor was loyal.',{authority:-3,stability:2},{relation:4})
      ]),
      choice('skip','Yemini erteleyip sessizce geçiştir.','Postpone the oath and let it pass quietly.',[
        outcome('Yemin töreni yapılmadı. Kimse yemin etmedi, kimse de unutmadı.','No oath ceremony was held. No one swore, and no one forgot.',{authority:-1,stability:-2})
      ])
    ],{eraRole:'recurring'});

  card('land_rights_survey',4,'production','Toprak Hakları Ölçümü','Surveying the Land Rights',
    'Eyalet çiftlikleri genişledikçe köylerin ortak meraları daralıyor. Köylüler eski sınır taşlarını gösteriyor; çiftlik kâhyaları yeni sınırların valilik mührüyle onaylandığını söylüyor. Bir kayıt tutulmazsa her hasatta kavga çıkacak.',
    'As the provincial estates widen, the villages’ common pastures shrink. Villagers point to the old boundary stones; estate stewards say the new limits were approved under the governorate seal. Without a record there will be a quarrel every harvest.',
    empire+'Boundary stones in a meadow between ploughed estate fields and village pasture, villagers and estate stewards arguing, a surveyor with a measuring rod, late afternoon light.',[
      choice('commons','Köylerin ortak meralarını onayla.','Confirm the villages’ common pastures.',[
        outcome('Eski sınır taşları yerinde kaldı. Köyler sevindi ve sürüler meraya döndü; çiftlik kâhyaları valinin sözünü geri aldığını yazdı.','The old boundary stones stayed. The villages rejoiced and the flocks returned to the pasture; the estate stewards wrote that the governor had taken back his word.',{stability:3,authority:-2,environment:2})
      ]),
      choice('estates','Çiftlik sınırlarını onayla.','Confirm the estate boundaries.',[
        outcome('Yeni sınırlar mühürlendi. Çiftlikler genişledi; köyler itirazlarını deftere yazdırdı.','The new limits were sealed. The estates widened; the villages had their objections recorded.',{authority:2,stability:-4},{flags:['recorded_provincial_dissent']})
      ]),
      choice('survey','Ücretli ölçüm yaptır; sınırları yeni bir deftere yaz.','Pay for a survey and write the boundaries in a new register.',[
        outcome('Ölçüm ekipleri sınırları yeniden çizdi ve deftere geçirdi. Ücretleri ödendi; iki taraf da bir şey kaybetti.','The survey teams redrew the boundaries and entered them in a register. They were paid; both sides lost something.',{resources:-5,stability:3,knowledge:2},{flags:['land_rights_registry']})
      ],[{stat:'resources',minimum:5}]),
      choice('archive','Kil arşivdeki eski sınır kayıtlarını getir.','Bring the old boundary records from the clay archive.',[
        outcome('Arşivden eski sınır tabletleri getirildi. Ölçüm kısaldı; kâtip yine ödendi.','Old boundary tablets were brought from the archive. The survey was shortened; the clerk was still paid.',{resources:-2,stability:3},{flags:['land_rights_registry']})
      ],[{flag:'public_archive'},{stat:'resources',minimum:2}])
    ],{eraRole:'recurring'});

  card('seasonal_migration',4,'settlement','Mevsimlik Göç','Seasonal Migration',
    'Hasat mevsiminde dağ köylerinden yüzlerce işçi ovaya iniyor. Çiftlikler bu ellere muhtaç, ama kentliler kamplarda çıkan kavgalardan ve kiralardan şikâyet ediyor. Bazı göçmenler kalıcı olarak yerleşmek istiyor.',
    'At harvest time hundreds of labourers come down from the mountain villages to the plain. The estates need these hands, but townspeople complain of brawls in the camps and of rents. Some of the migrants want to settle for good.',
    empire+'Lines of mountain labourers with sickles and bundles descending to golden fields, a temporary camp of reed shelters, a magistrate registering names, dusty late-summer light.',[
      choice('hands','Mevsimlik işçileri çiftliklerde çalıştır.','Put the seasonal labourers to work on the estates.',[
        outcome('İşçiler hasadı kaldırdı. Kampların çevresinde kavgalar çıktı; korulardan odun kesildi.','The labourers brought in the harvest. Brawls broke out around the camps; wood was cut from the groves.',{stability:-2,environment:-1},{delayed:later(3,'Mevsimlik işçilerin kaldırdığı hasat ambara girdi.','The harvest brought in by the seasonal labourers entered the granary.',{resources:3})})
      ],[{flag:'estate_fields_worked'}]),
      choice('settle','İsteyen göçmenlere küçük tarla ver.','Grant small plots to migrants who wish to stay.',[
        outcome('Göçmen aileler tarlalarını aldı. Tohum ve araç kasadan çıktı; kentin yanında yeni bir mahalle doğdu.','The migrant families received their plots. Seed and tools came from the treasury; a new ward grew beside the town.',{resources:-4,population:2,stability:-1})
      ],[{stat:'resources',minimum:4}]),
      choice('bar','Göç yollarını kapat.','Close the migration roads.',[
        outcome('Yollar kapandı. Kent sakinleşti; dağ köyleri ovaya küstü.','The roads were closed. The town calmed; the mountain villages turned their backs on the plain.',{authority:1,stability:-1},{relation:-3})
      ]),
      choice('toll','Göçmenlerden geçiş harcı al.','Charge the migrants a crossing toll.',[
        outcome('Harç kasaya girdi. Daha az işçi geldi; gelenler valiye kızgındı.','The toll entered the treasury. Fewer labourers came; those who did were angry with the governor.',{resources:2,stability:-2},{relation:-2})
      ])
    ],{eraRole:'recurring'});

  card('trade_treaty',4,'trade','Komşu Eyaletle Ticaret Antlaşması','A Trade Treaty with the Neighbouring Province',
    'Komşu eyalet karşılıklı gümrük indirimi içeren bir antlaşma öneriyor. Yerel tüccarlar yabancı malın pazarı dolduracağından korkuyor; bir lonca ise tek başına ayrıcalık istiyor. Antlaşma iki eyaletin meclisinde de tartışılacak.',
    'The neighbouring province proposes a treaty of mutual tariff reductions. Local merchants fear foreign goods will flood the market; one guild wants an exclusive privilege for itself. The treaty will be debated in both provinces’ councils.',
    empire+'Two delegations exchanging sealed treaty tablets across a table under a portico, merchants with amphorae and bolts of wool behind them, a guild master pressing his own petition, warm light.',[
      choice('lower','Gümrükleri karşılıklı indir.','Lower the tariffs on both sides.',[
        outcome('Antlaşma imzalandı. Yerel tüccarlar valiye kızdı; ilk kervanlar birkaç tur sonra gelecek.','The treaty was signed. Local merchants were angry with the governor; the first caravans will come in a few turns.',{authority:-2,stability:-1},{relation:3,delayed:later(5,'Antlaşmayla artan ticaret pazar vergisini yükseltti.','Trade increased by the treaty raised the market dues.',{resources:3})})
      ]),
      choice('exclusive','Ayrıcalığı tek bir loncaya ver.','Grant the privilege to a single guild.',[
        outcome('Lonca ayrıcalığını aldı ve kasaya pay ödedi. Diğer tüccarlar ve komşu eyalet ayrıcalığa itiraz etti.','The guild received its privilege and paid a share to the treasury. Other merchants and the neighbouring province objected.',{resources:3,stability:-3},{relation:-2})
      ]),
      choice('envoys','Ücretli elçilerle dengeli bir antlaşma yaz.','Draft a balanced treaty through paid envoys.',[
        outcome('Elçiler haftalarca pazarlık etti ve ödendi. Antlaşma iki tarafın tüccarını da korudu.','The envoys bargained for weeks and were paid. The treaty protected the merchants of both sides.',{resources:-4,stability:1},{relation:5,delayed:later(5,'Dengeli antlaşmanın ilk ticaret geliri kasaya girdi.','The balanced treaty’s first trade revenue entered the treasury.',{resources:3})})
      ],[{stat:'resources',minimum:4}]),
      choice('refuse','Antlaşmayı reddet.','Refuse the treaty.',[
        outcome('Antlaşma reddedildi. Yerel tüccarlar rahatladı; komşu eyalet kapısını biraz daha kapattı.','The treaty was refused. Local merchants were relieved; the neighbouring province closed its gate a little further.',{authority:1,stability:-1},{relation:-2})
      ])
    ],{eraRole:'recurring'});

  card('terrace_upkeep',4,'production','Teras ve Set Bakımı','Upkeep of the Terraces and Dikes',
    'Kış yağmurları teras duvarlarını ve çiftlik setlerini oydu. Onarılmazsa bahar selleri tarlaları sürükleyecek. Onarım için usta ve taş gerekiyor; köylüler angaryadan bıkmış.',
    'The winter rains have gouged the terrace walls and estate dikes. If they are not repaired, the spring floods will carry the fields away. Repairs need masons and stone; the villagers are tired of corvée.',
    empire+'Collapsed stretch of a stone terrace wall on a hillside of fields, masons resetting stones, villagers carrying baskets of earth, grey spring sky.',[
      choice('repair','Ücretli ustalarla terasları onar.','Repair the terraces with paid masons.',[
        outcome('Ustalar duvarları yeniden ördü. Kasa ödedi; tarlalar bahar sellerine hazır.','The masons rebuilt the walls. The treasury paid; the fields are ready for the spring floods.',{resources:-5,environment:3,stability:1})
      ],[{stat:'resources',minimum:5}]),
      choice('corvee','Onarımı köylülere angaryayla yaptır.','Have the villagers do the repair as corvée.',[
        context(outcome('Köylüler duvarları ücretsiz ördü. Kendi tarlaları beklerken öfkeleri büyüdü.','The villagers rebuilt the walls without pay. Their anger grew while their own fields waited.',{stability:-3,environment:3,authority:-1},{id:'rebuilt',probability:0.5}),[{stat:'population',minimum:25}]),
        context(outcome('Angaryaya yeterli el çıkmadı. Duvarların yalnız yarısı örüldü; köylüler yine de tarlalarını bıraktı.','Too few hands answered the corvée. Only half the walls were rebuilt; the villagers still had to leave their fields.',{stability:-3,environment:1,authority:-1},{id:'half',probability:0.5}),[{stat:'population',maximum:24}])
      ]),
      choice('defer','Onarımı gelecek yıla bırak.','Leave the repair for next year.',[
        outcome('Duvarlar onarılmadı. Köylüler bahar yağmurlarını endişeyle bekliyor.','The walls were not repaired. The villagers await the spring rains with dread.',{stability:-1},{delayed:(()=>{const d=delayed(5,4,'Bahar selleri onarılmayan terasları yıktı; çiftlik tarlaları sürüklendi.','The spring floods broke the unrepaired terraces; the estate fields were washed away.',{stability:-2,environment:-2});d.effect.removeFlags=['estate_fields_worked'];return [d];})()})
      ]),
      choice('council','Onarım masrafını yerel meclisle paylaş.','Share the cost of repair with the local council.',[
        outcome('Meclis masrafın yarısını üstlendi. Ustalar ödendi; meclis bir sonraki vergi kararında söz istedi.','The council took on half the cost. The masons were paid; the council asked for a say in the next tax ruling.',{resources:-2,environment:3,stability:2,authority:-1})
      ],[{flag:'provincial_assembly_seats'},{stat:'resources',minimum:2}])
    ],{eraRole:'recurring'});

  // ——— Three Bronze bridges (14/8) ———
  card('provincial_levy_review',4,'legacy','Eyalet Angaryasının Gözden Geçirilmesi','Reviewing the Provincial Labour Levy',
    'Eyalet, kanal ve yol işleri için yeni bir angarya çizelgesi hazırlıyor. Tunç Çağı’ndaki angarya duruşması yükümlülüğün incelenip incelenmediğini, ertelenip ertelenmediğini ya da kalıtsal olmaktan çıkarılıp çıkarılmadığını kaydetmişti.',
    'The province is drawing up a new levy roster for canal and road works. The Bronze Age levy hearing had recorded whether the obligation was reviewed, deferred or stripped of its hereditary character.',
    empire+'Provincial clerks reading an old clay levy tablet beside a new roster on papyrus, labourers waiting with tools, a magistrate presiding, morning light in a colonnade.',[
      choice('reviewed','İncelenmiş angarya kaydını eyalete uygula; inceleme kâtiplerini öde.','Apply the reviewed-levy record to the province and pay the reviewing clerks.',[
        outcome('Her köyün yükü yeniden hesaplandı. Kâtipler ödendi; ağır yük taşıyanlar rahatladı.','Each village’s burden was recalculated. The clerks were paid; those who bore the heaviest load were relieved.',{resources:-3,stability:4,authority:-1},{flags:['provincial_levy_reviewed']})
      ],[{flag:'reviewed_labor_levy'},{stat:'resources',minimum:3}]),
      choice('deferred','Ertelenmiş angaryanın vadesini şimdi iste.','Call in the deferred levy now.',[
        outcome('Ertelenen angarya çağrıldı. İşler ilerledi; köyler eski erteleme sözünün bozulduğunu söyledi.','The deferred levy was called in. The works went ahead; the villages said the old promise of deferral had been broken.',{authority:-2,stability:-2},{flags:['provincial_levy_called']})
      ],[{flag:'deferred_labor_levy'}]),
      choice('nonhereditary','Kalıtsal olmayan hizmet kuralını eyalete taşı.','Carry the non-hereditary service rule into the province.',[
        outcome('Angarya babadan oğula geçmez oldu. Genç aileler rahatladı; vali bir çalışma gücü kaynağını kaybetti.','The levy no longer passed from father to son. Young families breathed easier; the governor lost a source of labour.',{stability:3,authority:-3},{flags:['provincial_levy_reviewed']})
      ],[{flag:'nonhereditary_city_service'}]),
      choice('decree','Yeni çizelgeyi valilik emriyle uygula.','Impose the new roster by governor’s decree.',[
        outcome('Çizelge emirle uygulandı. İşler başladı; eski kayıtlar hiç okunmadı.','The roster was imposed by decree. Work began; the old records were never read.',{authority:2,stability:-3})
      ])
    ],{once:true,chain:'debt',eraRole:'bridge',requirements:[{completedCard:'levy_hearing'}]});

  card('barge_silt_league',4,'legacy','Mavna ve Çamur Birliği','The Barge and Silt League',
    'Nehir boyundaki eyaletler mavna yolunu tıkayan çamur için bir birlik kurmak istiyor. Tunç Çağı’ndaki çamur sözleşmesi temizliğin ortak mı yapılacağını, yoksa geçen mavnalardan harç mı alınacağını kaydetmişti.',
    'The provinces along the river want to form a league against the silt choking the barge channel. The Bronze Age silt charter had recorded whether the cleaning would be shared or paid for by a toll on passing barges.',
    empire+'Wide river with grain barges stuck on a silt bar, dredging crews with long rakes, envoys from upstream and downstream towns on the bank holding an old charter tablet, hazy light.',[
      choice('joint','Kentler arası çamur sözleşmesini eyaletlere genişlet; payını öde.','Extend the intercity silt charter to the provinces and pay your share.',[
        outcome('Birlik kuruldu ve tarama ekipleri ortak ödendi. Mavna yolu açıldı; komşu eyaletler payınızı kaydetti.','The league was formed and the dredging crews were paid jointly. The barge channel opened; the neighbouring provinces recorded your share.',{resources:-4,environment:3,stability:1},{flags:['provincial_silt_league'],relation:4})
      ],[{flag:'intercity_silt_charter'},{stat:'resources',minimum:4}]),
      choice('toll','Eski geçiş harcı kaydını sürdür.','Keep the old transit-toll record.',[
        outcome('Mavnalardan harç alınmaya devam edildi. Harç tarama işine gitti; komşu eyaletler yükün kendilerine kaldığını söyledi.','The barges went on paying the toll. The toll went to the dredging; the neighbouring provinces said the burden fell on them.',{authority:1,stability:-1},{relation:-3})
      ],[{flag:'silt_transit_levy'}]),
      choice('alone','Kendi kıyınızı kendi ekiplerinizle tarayın.','Dredge your own stretch with your own crews.',[
        outcome('Ekipleriniz kendi kıyınızı taradı ve ödendi. Mavnalar sizin limana ulaştı; yukarı kıyılar tıkalı kaldı.','Your crews dredged your own stretch and were paid. Barges reached your harbor; the upstream banks stayed choked.',{resources:-6,environment:3,stability:2})
      ],[{stat:'resources',minimum:6}]),
      choice('ignore','Çamuru bırak.','Leave the silt.',[
        outcome('Kimse taramadı. Mavnalar daha az yükle yol aldı; kıyılar bataklığa döndü.','No one dredged. The barges sailed with lighter loads; the banks turned to marsh.',{environment:-2,stability:-1})
      ])
    ],{once:true,chain:'river_memory',eraRole:'bridge',requirements:[{completedCard:'silt_charter'}]});

  card('granary_roof_watch',4,'legacy','Ambar Çatılarının Nöbeti','The Watch over the Granary Roofs',
    'Eyalet ambarlarının ahşap çatıları çürümeye başladı; yağmur sızarsa tahıl küflenecek. Tunç Çağı’ndaki çatı kirişi kararı kerestenin ambarda mı saklanacağını, çatıların mı dağıtılacağını yoksa bir çatı nöbeti mi kurulacağını kaydetmişti.',
    'The timber roofs of the provincial granaries have begun to rot; if rain leaks in, the grain will mould. The Bronze Age roof-beam ruling had recorded whether timber would be kept in a storehouse, roofs distributed, or a roof watch set up.',
    empire+'Granary roof with rotten timber beams being replaced, carpenters on ladders, a scribe checking an old roof-beam tablet, sacks of grain covered with hides below, overcast light.',[
      choice('timber','Kereste ambarı kaydını kullan; çatıları yenile ve tartı defteri aç.','Use the timber-store record, renew the roofs and open a weighing register.',[
        outcome('Ambardaki kereste çatılara çıktı; marangozlar ödendi. Yenilenen ambarlarda her çuval tartılıp yazılmaya başlandı.','The stored timber went up onto the roofs; the carpenters were paid. In the renewed granaries every sack began to be weighed and recorded.',{resources:-4,stability:2,knowledge:1},{flags:['granary_register_kept']})
      ],[{flag:'timber_storehouse'},{stat:'resources',minimum:4}]),
      choice('distributed','Dağıtılmış çatı kaydını uygula; her mahalle bir ambar çatısını üstlensin.','Apply the distributed-roof record: each ward takes on one granary roof.',[
        outcome('Mahalleler çatıları paylaştı. Onarım yavaş ama ucuz oldu; vali işi mahallelere bırakmak zorunda kaldı.','The wards shared the roofs. Repair was slow but cheap; the governor had to leave the work to the wards.',{authority:-2,stability:2,environment:1})
      ],[{flag:'distributed_roofs'}]),
      choice('roster','Kent çatı nöbetini ambarlara uygula.','Apply the civic roof watch to the granaries.',[
        outcome('Nöbetçiler yağmurlu gecelerde çatıları kontrol etti. Sızıntılar erken bulundu; nöbet çizelgesi valinin değil kentin oldu.','Watchmen checked the roofs on rainy nights. Leaks were found early; the roster belonged to the town, not the governor.',{stability:3,authority:-2})
      ],[{flag:'civic_roof_watch'}]),
      choice('leave','Çatıları olduğu gibi bırak.','Leave the roofs as they are.',[
        outcome('Çatılara dokunulmadı. Yağmur mevsimi yaklaşıyor.','The roofs were left untouched. The rainy season is approaching.',{stability:-1},{delayed:later(4,'Sızan yağmur ambarda tahılı küflendirdi.','Leaking rain moulded the grain in the granary.',{resources:-2})})
      ])
    ],{once:true,chain:'memory',eraRole:'bridge',requirements:[{completedCard:'roof_beams'}]});

  // ——— Three conditional conclusions: a Bronze close plus a completed imperial event (14/8) ———
  card('land_registry_record',4,'legacy','Toprak Defterinin Kaydı','The Record of the Land Register',
    'Toprak hakları ölçümünden sonra eyalet, sınırların hangi arşivde tutulacağına karar vermeli. Tunç Çağı’ndaki arşiv anlaşmazlığı herkesin adının tek bir arşive mi yazılacağını, yoksa iki ayrı kaydın mı tutulacağını belirlemişti.',
    'After the land-rights survey, the province must decide in which archive the boundaries will be kept. The Bronze Age archive dispute had decided whether everyone’s name would be written in one archive or two separate records kept.',
    empire+'Archive hall with clay tablets and new papyrus land registers on shelves, scribes copying boundary lines, villagers and stewards waiting to see their names, lamplight.',[
      choice('inclusive','Kapsayıcı arşiv kaydını uygula; herkesin toprağını tek deftere yaz.','Apply the inclusive-archive record and write everyone’s land in one register.',[
        outcome('Köy ve çiftlik sınırları aynı deftere girdi. Kâtipler ödendi; kavga eden taraflar aynı sayfada adlarını gördü.','Village and estate boundaries went into the same register. The clerks were paid; the quarrelling parties saw their names on the same page.',{resources:-3,stability:5,knowledge:1},{flags:['unified_land_register']})
      ],[{flag:'inclusive_archive'},{stat:'resources',minimum:3}]),
      choice('parallel','Ayrı arşiv kaydını sürdür; çiftlik ve köy defterleri ayrı kalsın.','Continue the parallel-archive record; estate and village registers stay separate.',[
        outcome('İki defter ayrı tutuldu. Kâhyalar kendi defterlerini korudu; köyler sınır kavgalarının bitmeyeceğini söyledi.','Two registers were kept apart. The stewards kept their own book; the villages said the boundary quarrels would never end.',{authority:1,stability:-3},{flags:['parallel_land_registers']})
      ],[{flag:'parallel_archives'}]),
      choice('fresh','Yeni bir eyalet defteri aç; eski arşivleri bir kenara bırak.','Open a new provincial register and set the old archives aside.',[
        outcome('Yeni defter sıfırdan yazıldı. Kâtipler ve tanıklar ödendi; eski kayıtlar tozlu raflarda kaldı.','The new register was written from scratch. The clerks and witnesses were paid; the old records stayed on dusty shelves.',{resources:-5,stability:3,knowledge:2},{flags:['unified_land_register']})
      ],[{stat:'resources',minimum:5}])
    ],{once:true,chain:'memory',eraRole:'conclusion',requirements:[{completedCard:'archive_dispute'},{completedCard:'land_rights_survey'}]});

  card('water_court_canal',4,'legacy','Kanal Suyunun Mahkemesi','The Court of Canal Water',
    'Yeni kanal tarlaları suyu paylaşmaya başlayınca eski su mahkemesi yeniden konuşuldu. Tunç Çağı’ndaki su mahkemesi suyun yasayla mı paylaşılacağını, yoksa izin belgeleriyle mi satılacağını kaydetmişti.',
    'When the new canal fields began to share the water, the old water court was spoken of again. The Bronze Age water court had recorded whether water would be shared by law or sold by permit.',
    empire+'Canal sluice with farmers queuing for their water turn, a magistrate seated under an awning with an old water-court tablet, permit tokens on a table, bright midday light.',[
      choice('court_law','Su mahkemesi yasasını kanala uygula; kâtip ve nöbetçileri öde.','Apply the water-court law to the canal and pay the clerks and watchmen.',[
        outcome('Kanal suyu yasayla saatlere bölündü. Kâtipler ve nöbetçiler ödendi; aşağı tarlalar da sırasını aldı.','The canal water was divided into hours by law. The clerks and watchmen were paid; the lower fields got their turn too.',{resources:-3,stability:4,environment:2},{flags:['canal_water_law']})
      ],[{flag:'water_court_law'},{stat:'resources',minimum:3}]),
      choice('permits','Su izni kaydını sürdür; kanal saatlerini satarak dağıt.','Continue the water-permit record and distribute canal hours by sale.',[
        outcome('Kanal saatleri izin belgesiyle satıldı. Zengin çiftlikler suyu aldı; küçük tarlalar kurudu.','Canal hours were sold by permit. Rich estates got the water; small fields dried out.',{authority:1,stability:-2,environment:-1},{flags:['canal_water_permits']})
      ],[{flag:'water_permits'}]),
      choice('council','Su dağıtımını yerel meclise bırak.','Leave the water allocation to the local council.',[
        outcome('Meclis suyu oylamayla dağıttı. Kararlar yavaş çıktı; vali kanalın yönetimini meclisle paylaştı.','The council allocated the water by vote. Decisions came slowly; the governor shared the canal’s management with the council.',{authority:-2,stability:2})
      ])
    ],{once:true,chain:'river_memory',eraRole:'conclusion',requirements:[{completedCard:'water_court'},{completedCard:'canal_extension'}]});

  card('fuel_trade_clause',4,'legacy','Antlaşmada Yakıt Maddesi','The Fuel Clause in the Treaty',
    'Ticaret antlaşmasından sonra komşu eyalet kömür ve odun alımı için ayrı bir madde istiyor. Tunç Çağı’ndaki kömür ambargosu yakıtın kaynağının denetlenip denetlenmediğini ve orman bedelinin kimde kaldığını kaydetmişti.',
    'After the trade treaty, the neighbouring province wants a separate clause for buying charcoal and timber. The Bronze Age charcoal embargo had recorded whether the fuel’s origin was inspected and who bore the cost to the forest.',
    empire+'Charcoal sacks and stacked timber at a border customs post, inspectors checking origin tags, envoys holding a treaty tablet and an old embargo record, smoky afternoon light.',[
      choice('provenance','Yakıt kaynağı denetimini antlaşmaya yaz; denetçileri öde.','Write fuel-origin inspection into the treaty and pay the inspectors.',[
        outcome('Her kömür yükünün ormanı kayda geçti. Denetçiler ödendi; kesilen ormanlar dinlenmeye bırakıldı.','The forest of every charcoal load was recorded. The inspectors were paid; felled forests were left to rest.',{resources:-3,environment:3,stability:1},{flags:['treaty_fuel_inspection'],relation:2})
      ],[{flag:'fuel_provenance'},{stat:'resources',minimum:3}]),
      choice('refused','Denetimi reddetme kaydını sürdür.','Continue the record of refusing inspection.',[
        outcome('Denetim yapılmadı. Kömür serbestçe aktı; komşu eyalet ormanlarının sizin için kesildiğini söyledi.','No inspection was made. Charcoal flowed freely; the neighbouring province said its forests were being cut for you.',{authority:1,environment:-2},{relation:-2})
      ],[{flag:'fuel_inspection_refused'}]),
      choice('exported','Orman bedelini yine dışarıya yükle.','Push the cost to the forest abroad again.',[
        outcome('Kömür ucuz kaldı. Bedel komşu ormanlarına yüklendi; kendi tepelerinizde de kesim hızlandı.','Charcoal stayed cheap. The cost fell on the neighbouring forests; felling sped up on your own hills too.',{environment:-3,stability:-1,authority:1})
      ],[{flag:'exported_forest_cost'}]),
      choice('drop','Yakıt maddesini antlaşmadan çıkar.','Drop the fuel clause from the treaty.',[
        outcome('Madde çıkarıldı. Antlaşma sürdü; komşu eyalet bir sonraki görüşmede bunu hatırlatacak.','The clause was dropped. The treaty held; the neighbouring province will bring it up at the next talks.',{stability:-1},{relation:-2})
      ])
    ],{once:true,chain:'embers',eraRole:'conclusion',requirements:[{completedCard:'charcoal_embargo'},{completedCard:'trade_treaty'}]});
}
