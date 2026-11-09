// Distinct authored conflicts, not a combinatorial card generator.
export function addLegacyEvents({ card, choice, outcome, delayed }) {
  card('witness_stones', 1, 'leadership', 'Sözün Ağırlığı', 'The Weight of a Word',
    'Av kazasını açıkça dinlediğiniz günden beri herkes meclise gelmek istiyor. Başavcı, konuşmaların avı geciktirdiğini söylüyor. Yaralı genç bu kez konuşmak yerine tanıkların sözünü saymayı öneriyor.',
    'Since the public hearing about the hunt, everyone wants a voice. The chief says meetings delay the hunt. The injured youth proposes counting witnesses instead of making another speech.',
    'Paleolithic council, hands placing smooth witness stones in a circle; hide clothing, low amber firelight, close portrait composition.', [
      choice('record', 'Her tanığa bir taş ver; söz sırası belli olsun.', 'Give each witness a stone and a turn to speak.', [outcome('Taşlar kimseyi susturmadı; aynı kişinin her sözü ele geçirmesini önledi.', 'The stones silenced nobody; they stopped one person from taking every turn.', { authority: -3, stability: 9, knowledge: 5, resources: -4 }, { flags: ['witness_custom'], relation: -4 })]),
      choice('delegate', 'Her av grubundan tek sözcü seçilsin.', 'Let each hunting group choose one speaker.', [outcome('Av zamanında başladı. Sözcüler artık kimin sesini taşıdıklarını açıklamak zorunda.', 'The hunt began on time. Speakers must now explain whose voices they carry.', { resources: 7, authority: 6, stability: -3 }, { flags: ['hunting_delegates'], relation: 6 })])
    ], { chain: 'public_voice', once: true, requirements: [{ flag: 'public_hearing' }] });

  card('guest_paths', 1, 'diplomacy', 'Konuğun Bildiği Geçit', 'The Guest’s Pass',
    'Karda sığındırdığınız aile gizli bir av geçidini gösterdi. Kendi halkları da bu yolu kullanıyor. Haritayı avcıların hepsine açarsanız konukların sırrı artık korunamayacak.',
    'The family you sheltered in the snow reveals a hidden hunting pass. Their people use it too. Sharing the route with all your hunters would break their confidence.',
    'Guest tracing mountain pass in sand beside two hunters; bone tools, grey dawn, ochre handprints, portrait close-up.', [
      choice('joint', 'Geçidi birlikte kullanalım; av günlerini paylaşalım.', 'Share the pass and agree on hunting days.', [outcome('İlk kez başka bir topluluğun takvimine göre ava çıktınız.', 'For the first time, your hunters followed another community’s calendar.', { resources: 6, stability: 5, authority: -3 }, { flags: ['shared_pass'], relation: -3 })]),
      choice('secret', 'Yolu sakla; yalnızca izcilerimiz bilsin.', 'Keep the route secret among your scouts.', [outcome('İzciler daha çok avla döndü. Konuklar yol tariflerini kısa kesmeye başladı.', 'Scouts returned with more game. Your guests began giving shorter directions.', { resources: 13, knowledge: 3, stability: -6 }, { flags: ['appropriated_pass'], relation: 5 })])
    ], { chain: 'hospitality', once: true, requirements: [{ flag: 'sheltered_strangers' }] });

  card('leaking_skin', 1, 'survival', 'Son Su Tulumu', 'The Last Waterskin',
    'Göçün ortasında büyük su tulumunun dikişi açıldı. Deriyi onarmak için avcının botunu kesmek gerekiyor. Yakındaki suyun üzerinde hayvan izleri ve ağır bir koku var.',
    'The large waterskin splits halfway through the migration. Repair needs leather from a hunter’s boot. Nearby water carries animal tracks and a heavy smell.',
    'Split leather waterskin on parched ground, hunter loosening a boot, distant muddy pool; pale ochre harsh noon light.', [
      choice('repair', 'Botu kes; yürüyüşü yavaşlatalım.', 'Cut the boot and slow the march.', [outcome('Su taşındı. Ayağı sarılan avcı için herkes yükünden biraz aldı.', 'The water was carried. Everyone took some weight from the bandaged hunter.', { resources: -5, population: 4, stability: 5 })]),
      choice('boil', 'Suyu kaynatmak için burada kamp kur.', 'Camp here and boil the water.', [outcome('Duman yerinizi belli etti; temiz suyu nasıl ayırt edeceğinizi öğrendiniz.', 'Smoke revealed your camp; you learned another way to make water safe.', { resources: -3, knowledge: 7, authority: -4 }, { flags: ['boiled_water'] })])
    ]);

  card('ochre_border', 1, 'diplomacy', 'Kızıl Sınır', 'The Ochre Boundary',
    'Komşu avcılar geçide kızıl işaretler çizdi. Bizim çocuklar da aynı rengi törenlerde kullanıyor. Bir yanlış anlama, iki kabilenin kış avını tehlikeye atabilir.',
    'Neighboring hunters mark a pass with ochre. Your children use the same color in ceremonies. A misunderstanding could threaten both tribes’ winter hunt.',
    'Opposing hunters examining ochre boundary on rock, snow behind, open empty hands; dawn red and slate portrait composition.', [
      choice('symbols', 'Ortak işaretler için görüşme düzenle.', 'Meet to agree on shared signs.', [outcome('İşaretler aynı kaldı, anlamları birlikte belirlendi. Bir gün avlanamadınız.', 'The signs stayed, but their meaning was shared. You lost a day of hunting.', { resources: -4, knowledge: 6, stability: 6 }, { flags: ['shared_signs'] })]),
      choice('move', 'Geçidi bırak; bilinmeyen sırtları araştır.', 'Leave the pass and explore the ridges.', [outcome('Kavga çıkmadı. Yeni yol avcıların dizlerini yordu, yeni taş damarları gösterdi.', 'There was no fight. The new path strained knees and revealed stone veins.', { population: -3, resources: 5, knowledge: 4 }, { flags: ['ridge_routes'] })])
    ]);

  card('river_markers', 2, 'legacy', 'Taşkının Hafızası', 'Memory of the Flood',
    'Başakları izleyenlerin bıraktığı taş işaretler yeni evlerin altında kalacak. Ustalar düz kıyıyı istiyor; yaşlı izci taşların suyun en yüksek yerini gösterdiğini hatırlatıyor.',
    'Stone markers left by the grain observers lie beneath planned homes. Builders want the flat bank; an old scout says the stones mark the highest flood.',
    'Neolithic survey stones half buried beside clay home foundations, broad river, sage reeds, cloudy silver side light.', [
      choice('terrace', 'Evleri yamaca taşı; kıyıyı tarla bırak.', 'Build on the slope and leave the bank for crops.', [outcome('Evleri kurmak zorlaştı. Nehrin unutmadığını köy de unutmamaya karar verdi.', 'Building grew harder. The village chose to remember what the river never forgot.', { resources: -10, knowledge: 6, environment: 5 }, { flags: ['flood_memory'], delayed: [delayed(5, 2, 'Nehir yükseldiğinde taş işaretlerin üzerindeki evler kuru kaldı.', 'When the river rose, homes above the markers stayed dry.', { population: 5, stability: 7 })] })]),
      choice('embank', 'Kıyıya set çek; evler yakın kalsın.', 'Raise an embankment and keep homes together.', [outcome('Köy sıkı bir halka oldu. Setteki her çatlak artık ortak nöbet gerektiriyor.', 'The village formed a close circle. Every crack in the embankment now needs a shared watch.', { resources: -5, population: 7, authority: 5, environment: -5 }, { flags: ['embanked_village'] })])
    ], { chain: 'river_memory', once: true, requirements: [{ flag: 'river_observers' }] });

  card('missing_grain', 2, 'leadership', 'Ambarın Eksik Payı', 'The Missing Share',
    'Ortak ambarın anahtarı el değiştirdiğinde bir sepet tahıl eksik çıktı. Eski bekçinin eşi hasta. Yeni bekçi bütün ailelerin önünde hesap sorulmasını istiyor.',
    'When the shared granary key changes hands, a basket is missing. The former keeper’s spouse is ill. The new keeper demands an accounting before every family.',
    'Two village keepers holding wooden key over open grain jar, clay granary, concerned families; warm shaded earth tones.', [
      choice('audit', 'Hesabı aç; hastalık payını ayrıca tanımla.', 'Open the accounts and establish a sickness allowance.', [outcome('Eksik tahıl yerine konmadı; ama gizli yardımın yerini herkesin bildiği bir hak aldı.', 'The missing grain was not replaced, but a public right replaced secret aid.', { resources: -7, stability: 10, authority: 3 }, { flags: ['audited_stores'], relation: -5 })]),
      choice('restore', 'Bekçi çalışarak ödesin; anahtar aynı düzende kalsın.', 'Let the keeper repay through work; retain the key rotation.', [outcome('Ambarın hesabı kapandı. Aile, hastalığını gelecek bekçiden sakladı.', 'The accounts balanced. The family hid its illness from the next keeper.', { resources: 5, authority: 8, stability: -7 }, { flags: ['punitive_stores'], relation: 5 })])
    ], { chain: 'stored_power', once: true, requirements: [{ flag: 'shared_stores' }] });

  card('kiln_crack', 2, 'technology', 'Fırındaki Çatlak', 'The Kiln Crack',
    'Çömlek fırını soğurken çatladı. İç yüzeyde kalan yeşil tortuyu bir çırak saklamış. Usta fırını hemen onarmak, çırak ise kırık parçaları incelemek istiyor.',
    'The pottery kiln cracked while cooling. An apprentice kept green residue from its lining. The master wants repairs now; the apprentice wants to study the broken pieces.',
    'Cracked clay kiln, apprentice with green residue on shard, no anachronistic tools; copper green and clay orange, firelit portrait.', [
      choice('experiment', 'Yedek fırın kur; tortuyu ayrı dene.', 'Build a spare kiln and test the residue separately.', [outcome('Kırık fırın boşa gitmedi. Çırak, taşın içinden metal ayırmanın yolunu buldu.', 'The broken kiln was not wasted. The apprentice learned to draw metal from stone.', { resources: -11, knowledge: 12, environment: -3 }, { technologies: ['smelting'], animation: 'technology' })]),
      choice('repair', 'Önce su kaplarının siparişlerini tamamla.', 'Finish the orders for water vessels first.', [outcome('Kaplar teslim edildi. Çırak yeşil tortuyu bir sonraki deneme için saklıyor.', 'The vessels were delivered. The apprentice keeps the residue for another trial.', { resources: 9, population: 3, knowledge: -2 })])
    ]);

  card('ash_garden', 2, 'ecology', 'Külün Altındaki Bahçe', 'A Garden beneath Ash',
    'Eski ateş yerinin toprağında ürün daha gür. Çiftçiler bütün yamacı yakmayı öneriyor. Kökleri koruyan aileler, ilk yağmurda toprağın gideceğinden korkuyor.',
    'Crops grow taller on the old hearth site. Farmers propose burning the whole slope. Families who protect its roots fear the first rain will carry the soil away.',
    'Ash-dark garden patch next to rooted hillside, farmer holding charred branch; Neolithic reed clothing, overcast green and charcoal.', [
      choice('plots', 'Küçük parseller dene; köklü şeritleri bırak.', 'Test small plots and leave rooted strips.', [outcome('Hasat sınırlı kaldı. Toprağın ne kadar kül kaldırdığını öğrenmeye başladınız.', 'The harvest stayed modest. You began learning how much ash the soil could bear.', { resources: 4, knowledge: 7, environment: 3 }, { flags: ['soil_trials'] })]),
      choice('burn', 'Yamacı yak; bu hasat açlığı bitirsin.', 'Burn the slope; let this harvest end hunger.', [outcome('Başaklar yükseldi. Yağmur geldiğinde onları tutacak kökler kalmamıştı.', 'Grain rose high. When rain came, no roots remained to hold the slope.', { resources: 17, environment: -14 }, { flags: ['ash_expansion'], delayed: [delayed(4, 2, 'Kül bahçesinin toprağı kanalları doldurdu; yeniden kazmak gerekiyor.', 'Soil from the ash garden filled the canals; they must be dug again.', { resources: -10, stability: -3 })] })])
    ]);

  card('caravan_charter', 3, 'legacy', 'Konuğun Torunları', 'The Guest’s Descendants',
    'Atalarını karda ağırladığınız kabilenin tüccarları kalıcı pazar yeri istiyor. Getirdikleri mallar kıymetli; yerli tüccarlar konuklara ayrıcalık verilmesini istemiyor.',
    'Traders descended from the tribe you sheltered in snow ask for a permanent market. Their goods are valuable; local merchants oppose special privileges for guests.',
    'Bronze Age traders presenting an old bone token beside city market stalls; copper clay teal, afternoon diagonal light.', [
      choice('equal', 'Pazarı aç; herkes aynı vergiyi ödesin.', 'Open the market under equal taxes.', [outcome('Eski iyilik yeni bir ayrıcalığa dönüşmedi. Konuklar bu kez kent sakini olarak yer tuttu.', 'An old kindness did not become a new privilege. The guests settled as townspeople.', { resources: 7, stability: 7, authority: -3 }, { flags: ['equal_market'], relation: -3 })]),
      choice('exempt', 'İlk yıl vergiyi kaldır; ticaret büyüsün.', 'Waive the first year’s tax to grow trade.', [outcome('Kervanlar çoğaldı. Yerli tüccarlar kapına kendi eski borçlarını getirdi.', 'Caravans multiplied. Local merchants brought their own old debts to your door.', { resources: 15, knowledge: 4, stability: -8 }, { flags: ['guest_privilege'], relation: -8 })])
    ], { chain: 'hospitality', once: true, requirements: [{ flag: 'sheltered_strangers' }] });

  card('archive_dispute', 3, 'legacy', 'Duvar ile Tablet', 'Wall and Tablet',
    'Yazıcı eski göçün öyküsünü tablete geçirdi. Mağara resimlerini koruyan aile, öyküde kaybolanların adlarının silindiğini söylüyor. Saray kısa ve zaferle biten bir tarih istiyor.',
    'A scribe records the old migration on a tablet. The family guarding the cave paintings says the lost were omitted. The court wants a short history ending in victory.',
    'Scribe with clay tablet facing elder holding cave-mark tracing, Bronze archive shelves, ivory and ochre side light.', [
      choice('names', 'Kaybolanların adları da yazılsın.', 'Record the names of the lost as well.', [outcome('Tablet uzadı; tarih artık yalnızca kazananların soyunu anlatmıyor.', 'The tablet grew longer; history no longer tells only the victors’ lineage.', { knowledge: 9, authority: -5, stability: 6, resources: -4 }, { flags: ['inclusive_archive'] })]),
      choice('two_records', 'Tören metni kısa olsun; aile kaydı ayrıca korunsun.', 'Keep the ceremony short and preserve a separate family record.', [outcome('Saray törende tek ses oldu. Arşivde aynı yolculuğun iki anlatısı yan yana duruyor.', 'The court spoke with one voice. Two accounts of the journey stand together in the archive.', { authority: 8, knowledge: 4, resources: -6 }, { flags: ['parallel_archives'] })])
    ], { chain: 'memory', once: true, requirements: [{ flag: 'record_keepers' }] });

  card('water_court', 3, 'legacy', 'Suyun Mahkemesi', 'The Water Court',
    'Köyken günlere böldüğünüz su şimdi iki mahallenin hakkı sayılıyor. Yeni atölye geceleri su çekiyor. Eski anlaşmada gecelerden söz edilmiyor.',
    'Water once shared by village days now belongs to two city districts. A new workshop draws at night. The old agreement says nothing about nights.',
    'Bronze civic courtyard, clay water schedule and workshop wheel visible through arch; turquoise water, pale stone, morning light.', [
      choice('revise', 'Atölyeyi de görüşmeye çağır; kotayı yenile.', 'Invite the workshop and renegotiate the quota.', [outcome('Anlaşma ilk kez yazıldı. Herkes biraz su kaybetti, hiç kimse bütün geceyi alamadı.', 'The agreement was written for the first time. Everyone lost some water; nobody gained the whole night.', { resources: -5, stability: 10, knowledge: 5 }, { flags: ['water_court_law'], technologies: ['institutions'] })]),
      choice('permit', 'Gece kullanımına ücretli izin ver.', 'Sell permits for nighttime use.', [outcome('Hazine doldu. Gündüzün sonunda kuru kalan mahalleler artık geceyi de izliyor.', 'The treasury filled. Districts left dry by day now keep watch at night.', { resources: 13, authority: 5, stability: -9, environment: -4 }, { flags: ['water_permits'] })])
    ], { chain: 'river_memory', once: true, requirements: [{ flag: 'water_compact' }] });

  card('debt_insurance', 3, 'legacy', 'Borçsuz Hasadın Riski', 'The Risk of a Free Harvest',
    'Atalarınız tohum borcuna sınır koymuştu. Şimdi tüccarlar kötü hasatta borç tahsil edemeyecekleri için çiftçilere tohum satmıyor. Yasayı kaldırmak veya riski paylaşmak gerekiyor.',
    'Your ancestors limited seed debts. Merchants now refuse farmers seed because they cannot collect after a failed harvest. You must repeal the limit or share the risk.',
    'Bronze market seed sacks withheld behind counter, farmer and treasurer with clay tokens; warm muted gold, human-scale portrait.', [
      choice('fund', 'Ortak güvence fonu kur; yasayı koru.', 'Create a shared guarantee fund and keep the law.', [outcome('Tohum yeniden satıldı. Özgürlüğün bedeli bu kez ortak hazineden ödendi.', 'Seed was sold again. This time freedom’s cost came from the shared treasury.', { resources: -12, population: 5, stability: 10 }, { flags: ['harvest_guarantee'], delayed: [delayed(6, 3, 'Güvence fonunun desteklediği hasat, ambara ilk geri ödemeyi getirdi.', 'The guaranteed harvest brought its first repayment to the stores.', { resources: 10, knowledge: 3 })] })]),
      choice('repeal', 'Borç sınırını kaldır; pazarı yeniden aç.', 'Repeal the debt limit and reopen the market.', [outcome('Tohum çuvalları açıldı. Yasayı hatırlayan aileler çocuklarına yeni sözleşmeleri okumayı öğretiyor.', 'Seed sacks opened. Families remembering the law teach their children to read the new contracts.', { resources: 12, authority: 7, stability: -12 }, { flags: ['repealed_debt_limits'], relation: 8 })])
    ], { chain: 'debt', once: true, requirements: [{ flag: 'debt_limits' }] });
}
