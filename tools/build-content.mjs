import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { addLegacyEvents } from './content/legacy-events.mjs';

// Authoring helpers normalize structure only. Every event below is individually authored.
const root = resolve(import.meta.dirname, '..');
const text = (tr, en) => ({ tr, en });
const effect = (stats = {}, flags = [], technologies = [], buildings = [], rivalRelation = 0, rivalRelations) => ({ stats, flags, technologies, buildings, rivalRelation, ...(rivalRelations ? { rivalRelations } : {}) });
const outcome = (tr, en, stats, options = {}) => ({
  id: options.id ?? 'result', probability: options.probability ?? 1, affinity: options.affinity ?? null,
  text: text(tr, en), effect: effect(stats, options.flags, options.technologies, options.buildings, options.relation, options.relations),
  delayedEffects: options.delayed ?? [], animationPreset: options.animation ?? 'normal'
});
const choice = (id, tr, en, outcomes, requirements = []) => ({ id, text: text(tr, en),
  risk: text(outcomes.length > 1 ? 'Orta risk · koşullara bağlı' : 'Sonucu öngörülebilir', outcomes.length > 1 ? 'Moderate risk · depends on conditions' : 'Predictable outcome'),
  requirements, immediateEffects: effect(), outcomes });
const delayed = (afterTurns, minimumEra, tr, en, stats, flags = []) => ({ afterTurns, minimumEra, text: text(tr, en), effect: effect(stats, flags) });
const cards = [];
function card(id, era, category, titleTR, titleEN, descriptionTR, descriptionEN, artDirection, choices, options = {}) {
  if (options.once) {
    const closed = `resolved_${id}`;
    for (const decision of choices) for (const result of decision.outcomes) result.effect.flags.push(closed);
    options.exclusions = [...(options.exclusions ?? []), { flag: closed }];
  }
  cards.push({ id, era, category, title: text(titleTR, titleEN), description: text(descriptionTR, descriptionEN),
    artAsset: `card_${id}`, artDirection, rarity: options.chain ? 'uncommon' : 'common', weight: 10,
    requirements: options.requirements ?? [], exclusionConditions: options.exclusions ?? [], choices,
    worldFlags: [...new Set(choices.flatMap(c => c.outcomes.flatMap(o => o.effect.flags)))],
    storyChainId: options.chain ?? null, animationPreset: 'normal', soundCue: 'decision', cooldown: 4,
    localizationKeys: [`card.${id}.title`, `card.${id}.description`] });
}

card('sacred_fire', 1, 'ecology', 'Ateşin Bedeli', 'The Price of Fire',
  'Gece uzuyor. Çocukların nefesi mağaranın ağzında beyazlaşıyor. Avcılar son kuru ağaçları da kesmek istiyor; yaşlı bir kadın ilkbaharda tutunacak kök kalmayacağını söylüyor.',
  'Night stretches on. Children breathe white clouds at the cave mouth. Hunters want the last dry trees cut; an elder warns there will be no roots left to hold the spring soil.',
  'Paleolithic cave mouth, child and elder beside small hearth, bare grove in distance; ochre and charcoal, warm light from lower left, portrait composition.', [
    choice('burn', 'Ateşi büyüt; bu geceyi sağ çıkaralım.', 'Feed the fire; survive tonight.', [outcome('Mağara ısındı. Baltaların sesi vadide uzun süre yankılandı.', 'The cave warmed. Axes echoed through the valley.', { population: 9, resources: -4, environment: -12 }, { flags: ['fire_industry'], technologies: ['hearth'], delayed: [delayed(8, 2, 'Çıplak yamaçtan gelen sel, yeni tarlaları çamura gömdü.', 'Floodwater from the bare hillside buried the new fields.', { resources: -9, stability: -3 })] })]),
    choice('conserve', 'Ateşi küçült; dalları dönüşümlü toplayalım.', 'Keep a small fire; gather fallen branches.', [outcome('Herkes sıcak kalamadı; fakat koruluk için ilk ortak kural doğdu.', 'Not everyone stayed warm, but the grove gained its first shared rule.', { population: -3, environment: 8, knowledge: 7 }, { flags: ['forest_stewards'], technologies: ['hearth'] })])
  ], { chain: 'embers' });

card('river_tracks', 1, 'discovery', 'Nehirdeki İzler', 'Tracks by the River',
  'Sular çekilince aynı kıyıda yeniden yeşeren başaklar ortaya çıktı. İzci, göç sürüsünü kaçırmak pahasına burada bir mevsim beklemeyi öneriyor.',
  'Receding water reveals grain sprouting on the same bank again. A scout proposes staying for a season, even if the migrating herd escapes.',
  'Scout crouching beside wild grain on muddy riverbank; cold dawn, green and silt palette; herd small on horizon.', [
    choice('observe', 'Bir grubu bırak; başakların döngüsünü izlesin.', 'Leave a group to watch the grain cycle.', [outcome('Tohumların ne zaman uyandığını öğrendiniz. Göç çantaları ise hafifledi.', 'You learned when seeds awaken. Your travel bags grew lighter.', { knowledge: 14, resources: -9 }, { technologies: ['cultivation'], flags: ['river_observers'], animation: 'technology' })]),
    choice('follow', 'Sürüyü izleyelim; bilgi açlığı doyurmuyor.', 'Follow the herd; knowledge cannot feed us yet.', [outcome('Av paylaşıldı. Kıyının sırrı gelecek mevsime kaldı.', 'The hunt was shared. The river kept its secret for another season.', { resources: 13, knowledge: -2, environment: -3 })])
  ], { chain: 'river_memory' });

card('broken_spear', 1, 'leadership', 'Kırık Mızrak', 'The Broken Spear',
  'Başavcı, mamutun önünde kırılan mızrağını sakladı. Yaralı genç onun hatasını herkesin önünde anlatmak istiyor. Sessizlik de bir karar olacak.',
  'The chief hunter hid the spear that broke before a mammoth. An injured youth wants to tell everyone. Silence will be a decision too.',
  'Broken flint spear between wounded youth and proud hunter, hide tent, restrained amber side lighting.', [
    choice('hearing', 'Avı birlikte sorgulayalım; suçlu aramayalım.', 'Review the hunt together, without a scapegoat.', [outcome('Ustalar sapları yeniden bağladı. Başavcı sözünü kaybetti, gençler söz hakkı kazandı.', 'Craftspeople rebound the shafts. The chief lost his monopoly on speaking.', { knowledge: 7, authority: 6, resources: -3 }, { flags: ['public_hearing'], relations: { hunters: -10, keepers: 8 } })]),
    choice('protect', 'Başavcının itibarını koru; aileye erzak ver.', 'Protect the chief; compensate the family.', [outcome('Avcılar yanında durdu. Yaralı gencin ailesi bunu unutmadı.', 'The hunters backed you. The injured youth’s family did not forget.', { authority: 11, resources: -7, stability: -5 }, { flags: ['protected_elite'], relations: { hunters: 12, keepers: -8 } })])
  ], { chain: 'public_voice' });

card('stranger_child', 1, 'diplomacy', 'Karın Getirdiği Çocuk', 'A Child in the Snow',
  'Yabancı bir kabilenin işaretini taşıyan çocuk kampın sınırına ulaştı. Ardındaki ayak izleri iki yetişkine ait. Onları içeri almak, kampın yerini açığa çıkaracak.',
  'A child bearing a foreign tribe’s mark reaches camp. Two adults’ tracks follow. Taking them in will reveal your hiding place.',
  'Small bundled child at snowy camp boundary, two distant figures, blue dusk and single orange torch.', [
    choice('shelter', 'Üçüne de yer aç.', 'Make room for all three.', [outcome('Konuklar kışı sizinle geçirdi ve geçitlerin adlarını öğretti.', 'The guests shared your winter and taught you the mountain passes.', { population: 7, resources: -8, knowledge: 4 }, { flags: ['sheltered_strangers'], delayed: [delayed(10, 3, 'Bir kervan, atalarının borcunu ödemek için kapınıza geldi.', 'A caravan arrived to repay its ancestors’ debt.', { resources: 14, stability: 5 })] })]),
    choice('supplies', 'Erzak bırak; kampı başka yere taşı.', 'Leave supplies and move the camp.', [outcome('İzler kar altında kayboldu. Güvende kaldınız; yeni sığınak herkese yetmedi.', 'Snow hid the tracks. You stayed safe; the new shelter could not hold everyone.', { resources: -4, population: -3, authority: 5 }, { flags: ['closed_borders'] })])
  ], { chain: 'hospitality' });

card('red_mushrooms', 1, 'health', 'Kızıl Mantarlar', 'Red Mushrooms',
  'Toplayıcılar dolu sepetlerle döndü. Daha önce görülmeyen kızıl mantarları yalnızca bir yaşlı tanıyor; hafızasına güvenmek açlığı bitirebilir.',
  'Gatherers return with full baskets. Only one elder recognizes the red mushrooms. Trusting her memory could end the hunger.',
  'Red mushrooms in woven basket, elder hands sorting, forest floor, diffuse daylight, close composition.', [
    choice('test', 'Önce küçük bir miktarı incele.', 'Study a small amount first.', [outcome('Acı suyu ayrılan mantarlar yenebiliyordu. Bekleyiş bir günlük erzağa mal oldu.', 'The mushrooms were edible after draining bitter liquid. Waiting cost a day’s food.', { knowledge: 8, resources: 3 })]),
    choice('feast', 'Herkese dağıt.', 'Share them immediately.', [outcome('Yaşlı doğru hatırlıyordu. Bu gece kimse aç yatmadı.', 'The elder remembered correctly. Nobody went hungry tonight.', { resources: 17, stability: 4 }, { probability: 0.65, affinity: 'knowledge', id: 'safe', animation: 'success' }), outcome('Kaynatılmayan mantarlar hastalık getirdi. Sepetler doluydu, ocaklar sessizdi.', 'Unboiled mushrooms brought sickness. Baskets were full, hearths silent.', { population: -12, authority: -6 }, { probability: 0.35, id: 'poison', animation: 'failure' })])
  ]);

card('cave_marks', 1, 'culture', 'Duvara Kazınan Kış', 'Winter on the Wall',
  'Bir genç, kaybettiklerinizi mağara duvarına işaretlemek istiyor. Boya için kullanılan yağ, lambalara ayrılan son stoktan alınacak.',
  'A youth wants to mark the lost on the cave wall. The pigment needs fat from the last lamp reserves.',
  'Hand painting abstract memorial marks on cave wall, bone lamp, red ochre, intimate portrait crop.', [
    choice('record', 'İsimleri unutmayalım.', 'Let us remember their names.', [outcome('Duvar, kabilenin ilk ortak hafızası oldu.', 'The wall became your tribe’s first shared memory.', { knowledge: 8, stability: 6, resources: -6 }, { flags: ['record_keepers'] })]),
    choice('lamps', 'Yağı lambalara ayır; hikâyeyi sözle yaşat.', 'Keep the lamps lit; tell the story aloud.', [outcome('Geceleri yüzler görünür kaldı. Her anlatıcı hikâyeye kendi ayrıntısını kattı.', 'Faces stayed visible at night. Every storyteller added a detail.', { authority: 5, resources: 4, knowledge: -2 }, { flags: ['oral_tradition'] })])
  ], { chain: 'memory' });

card('ice_crossing', 1, 'survival', 'Buzun Sesi', 'The Sound of Ice',
  'Karşı kıyıda av var. Buz, ilk adımda ince bir ses çıkarıyor. Uzun geçit güvenli; ama oraya varana kadar erzak azalacak.',
  'Game waits across the river. Ice sings beneath the first step. The long crossing is safer, but your food may not last.',
  'Hunters paused on fractured frozen river, elk on far shore, slate blue, wide depth within portrait frame.', [
    choice('detour', 'Uzun geçitten dolaş.', 'Take the long crossing.', [outcome('Yorgun döndünüz, fakat herkes döndü. Kıyıdaki yeni izleri haritanıza kattınız.', 'You returned exhausted, but together. New tracks joined your mental map.', { resources: -4, knowledge: 5, stability: 4 })]),
    choice('cross', 'Halat bağla ve buzdan geç.', 'Tie ropes and cross the ice.', [outcome('Halatlar gerildi; av kampa ulaştı.', 'Ropes held; the hunt reached camp.', { resources: 18, authority: 4 }, { probability: 0.6, affinity: 'knowledge', id: 'crossed', animation: 'success' }), outcome('Buz koptu. Halatlar herkesi kurtarmaya yetmedi.', 'The ice broke. Ropes could not save everyone.', { population: -10, resources: -6, stability: -5 }, { probability: 0.4, id: 'broken', animation: 'failure' })])
  ]);

card('empty_seat', 1, 'leadership', 'Boş Post', 'The Empty Hide',
  'Yaşlı önder artık yürüyemiyor. Meclis onun oturduğu postu ortaya serdi. Avcılar güçlü bir ses, toplayıcılar ise paylaşımı denetleyen bir el arıyor.',
  'The old leader can no longer walk. The council lays out her hide. Hunters seek a strong voice; gatherers want someone to guard fair shares.',
  'Empty ceremonial hide in circle of people, sunrise entering cave, bone tokens, dignified earthy palette.', [
    choice('lead', 'Payların hesabını herkesin önünde tutacağıma söz ver.', 'Promise to account for every share publicly.', [outcome('İlk sözün bir ayrıcalık değil, herkesin denetleyebileceği bir yük oldu.', 'Your first promise became a burden everyone could inspect.', { authority: 15, resources: -5, stability: 4 }, { flags: ['accountable_rule'], relation: -3, animation: 'leadership' })]),
    choice('council', 'Postu boş bırak; kararları meclis alsın.', 'Leave the hide empty; let the council decide.', [outcome('Kararlar yavaşladı. Hiç kimse artık tek başına av payını değiştiremiyordu.', 'Decisions slowed. Nobody could change a hunting share alone.', { authority: -5, stability: 12, knowledge: 4 }, { flags: ['council_tradition'], relation: 8 })])
  ]);

card('first_granary', 2, 'settlement', 'Kapısı Olan Bereket', 'Abundance Behind a Door',
  'İlk hasat kuruyor. Ortak bir ambar için saz evlerin bir kısmı sökülecek. Aileler, kapının anahtarını kimin tutacağını soruyor.',
  'The first harvest dries. A shared granary needs reeds from family houses. Everyone asks who will hold its key.',
  'Raised mud granary under construction, families with grain baskets, clay and flax palette, late sunlight.', [
    choice('shared', 'Ambarı kur; anahtarı her ay başka aileye ver.', 'Build it; rotate the key between families.', [outcome('Tahıl artık yağmurdan korunuyor. Bekçilik de hasat kadar ortak bir işe dönüştü.', 'Grain is safe from rain. Guard duty became shared work like harvesting.', { resources: -12, stability: 7, knowledge: 5 }, { buildings: ['granary'], flags: ['shared_stores'], animation: 'settlement' })]),
    choice('households', 'Her aile kendi çukurunu hazırlasın.', 'Let every household dig its own store.', [outcome('Evler ayakta kaldı. İyi hasat alanlarla kötü hasat alanlar arasındaki fark büyüdü.', 'Homes stayed intact. The gap between good and poor harvests widened.', { resources: 8, authority: -4, stability: -3 }, { flags: ['private_stores'] })])
  ], { exclusions: [{ flag: 'shared_stores' }], chain: 'stored_power' });

card('canal_boundary', 2, 'ecology', 'Suyun Sınırı', 'The Water Boundary',
  'Kanalın son kolu komşu tarlaya ulaşmıyor. Kanalı uzatmak kutsal sayılan koruluğu kesecek. Suyu eşit bölmek kendi hasadınızı azaltacak.',
  'The final canal branch misses your neighbor’s fields. Extending it would cut a sacred grove. Equal sharing would reduce your own harvest.',
  'Forked irrigation ditch between green field and dry field, small sacred grove, overhead oblique view.', [
    choice('extend', 'Kanalı koruluktan geçir.', 'Cut the canal through the grove.', [outcome('İki tarla da sulandı; gölgede yapılan törenler güneş altında kaldı.', 'Both fields received water; shaded ceremonies moved into the sun.', { resources: 12, environment: -13, stability: -3 }, { technologies: ['irrigation'], flags: ['canal_expansion'] })]),
    choice('ration', 'Suyu günlere böl; koruluğu koru.', 'Alternate water days; preserve the grove.', [outcome('Verim düştü ama sınır kavgası sona erdi.', 'Yields fell, but the boundary quarrel ended.', { resources: -4, environment: 8, stability: 9 }, { technologies: ['irrigation'], flags: ['water_compact'] })])
  ]);

card('green_stone', 2, 'technology', 'Yeşil Taşın Damarı', 'The Green Vein',
  'Çömlek fırınında eriyen taş, parlak bir damlaya dönüştü. Usta aynı ateşi günlerce besleyebilirse bunun bıçak olabileceğini söylüyor.',
  'A stone melted into a bright droplet in the pottery kiln. The potter says it could become a blade if the fire burns for days.',
  'Potter holding copper droplet near clay kiln, malachite fragments, warm furnace light, smoke overhead.', [
    choice('kiln', 'Ustaya yakıt ve zaman ayır.', 'Give the potter fuel and time.', [outcome('İlk metal ağız taştan yumuşaktı; fakat yeniden biçim verilebiliyordu.', 'The first metal edge was softer than stone, but it could be reshaped.', { resources: -12, environment: -5, knowledge: 14 }, { technologies: ['smelting'], animation: 'technology' })]),
    choice('pots', 'Önce sızdırmayan su kapları üret.', 'Make watertight vessels first.', [outcome('Yeni kaplarla su taşımak kolaylaştı. Metal damla ustanın cebinde bekliyor.', 'Water became easier to carry. The metal droplet waits in the potter’s pocket.', { population: 5, resources: 7, knowledge: 3 })])
  ], { chain: 'embers' });

card('seed_debt', 2, 'economy', 'Tohum Borcu', 'A Debt in Seeds',
  'Hasadı kötü geçen aileler gelecek yılın tohumlarını yedi. Varlıklı bir hane, onların çocuklarının çalışması karşılığında tohum vermeye hazır.',
  'Families with failed harvests ate next year’s seeds. A wealthy household offers seed in exchange for their children’s labor.',
  'Two hands weighing seeds against small clay labor tokens, worried family in background, muted umber.', [
    choice('commons', 'Ortak stoktan ver; borcu hasatla sınırla.', 'Lend shared seed; cap repayment at harvest.', [outcome('Çocuklar evlerinde kaldı. Ortak stok azaldı; tarlalar boş kalmadı.', 'Children stayed home. Shared stores shrank; fields did not stand empty.', { resources: -10, population: 6, stability: 8 }, { flags: ['debt_limits'] })]),
    choice('contract', 'Anlaşmayı onayla.', 'Approve the contract.', [outcome('Tohum ekildi. Bir ailenin serveti artık başka ailelerin zamanıyla büyüyor.', 'Seeds were sown. One family’s wealth now grows with other families’ time.', { resources: 10, authority: 5, stability: -11 }, { flags: ['bonded_labor'], relation: 8 })])
  ], { chain: 'debt' });

card('reed_fever', 2, 'health', 'Sazlıklardan Gelen Ateş', 'Fever in the Reeds',
  'Yeni kanalların yanındaki evlerde ateşli hastalık başladı. Suyu kapatmak tarlaları kurutacak; evleri taşımak ise hasat işçilerini azaltacak.',
  'Fever spreads beside the new canals. Closing the water would dry fields; moving houses would take workers from the harvest.',
  'Reed huts by stagnant canal, caregiver carrying bowl, humid dusk, gentle green and amber.', [
    choice('move', 'Evleri yüksek zemine taşı.', 'Move homes to higher ground.', [outcome('Hastaların sayısı azaldı. Boşalan evlerin sazları yeni çatıları örttü.', 'Fewer people fell ill. Reeds from empty homes roofed the new ones.', { resources: -8, population: 7, knowledge: 6 }, { flags: ['sanitation_practice'] })]),
    choice('drain', 'Kanalları bir mevsim boşalt.', 'Drain the canals for a season.', [outcome('Sazlık kurudu. Ateş geriledi; azalan hasat kış planını değiştirdi.', 'The reeds dried. Fever receded; a smaller harvest changed your winter plans.', { resources: -14, population: 10, environment: 4 })])
  ]);

card('ancestor_field', 2, 'culture', 'Ataların Tarlası', 'The Ancestors’ Field',
  'Yeni evlerin temellerinde eski mezarlar bulundu. Kimi aileler buranın atalarının toprağı olduğunu söylüyor; yeni gelenler kalacak yer arıyor.',
  'Old graves lie beneath the new foundations. Some families claim ancestral ownership; newcomers need somewhere to live.',
  'Exposed burial stones beside unfinished clay foundations, settlers keeping respectful distance, dawn haze.', [
    choice('memorial', 'Mezarları ortak anıta kat; evleri küçült.', 'Build a shared memorial and smaller homes.', [outcome('Herkes bir çatı buldu. Yeni meydan, eskilerle yenilerin buluştuğu yer oldu.', 'Everyone found a roof. The square became a meeting place for old and new families.', { population: 6, stability: 7, resources: -7 }, { flags: ['shared_ancestors'] })]),
    choice('owners', 'Eski ailelerin hakkını tanı.', 'Recognize the old families’ claim.', [outcome('Sınırlar kesinleşti. Yeni gelenlerden bazıları vadiden ayrıldı.', 'Boundaries became firm. Some newcomers left the valley.', { authority: 10, population: -5, stability: -3 }, { flags: ['hereditary_land'], relation: 10 })])
  ]);

card('forest_oath', 2, 'legacy', 'Koruluğun Sözü', 'The Grove’s Promise',
  'Kışın korunmuş ağaçlar şimdi köyün çatısını taşıyabilir. Oduncular eski yasağı kaldırmanı istiyor. O yasağı koyanlar artık hayatta değil.',
  'Trees spared in winter could now roof the village. Woodcutters ask you to lift the old ban. Those who made it are gone.',
  'Healthy grove beside reed village, elderly carved marker and young woodcutter, emerald daylight.', [
    choice('renew', 'Yasağı yenile; büyüme daha yavaş olsun.', 'Renew the promise; grow more slowly.', [outcome('Köy küçük kaldı. İlk yasa, onu koyanlardan daha uzun yaşadı.', 'The village stayed small. Its first law outlived its authors.', { environment: 10, stability: 8, resources: -6 }, { flags: ['lasting_forest_law'] })]),
    choice('release', 'Her kesilen ağacın yerine fidan dikilsin.', 'Plant a sapling for every felled tree.', [outcome('Yeni evler kuruldu. Fidanların gölge vermesi yıllar alacak.', 'New homes rose. The saplings will take years to cast shade.', { population: 8, resources: 6, environment: -5 }, { flags: ['managed_forestry'] })])
  ], { chain: 'embers', requirements: [{ flag: 'forest_stewards' }], exclusions: [{ flag: 'lasting_forest_law' }, { flag: 'managed_forestry' }] });

card('market_measures', 2, 'trade', 'Bir Sepet Ne Kadar?', 'How Much Is a Basket?',
  'Pazardaki her sepet farklı büyüklükte. Bir çömlekçi herkese aynı ölçüyü öneriyor. Büyük sepet kullanan tüccar bu fikre karşı çıkıyor.',
  'Every market basket has a different size. A potter proposes one measure for everyone. A merchant with oversized baskets objects.',
  'Different grain baskets surrounding one clay measuring jar, village market, honey sunlight.', [
    choice('standard', 'Ortak ölçüyü mühürle.', 'Seal a common measure.', [outcome('Tartışmalar azaldı; ölçü kabını kırmak artık herkese karşı suç sayılıyor.', 'Disputes declined; breaking the measure became an offense against everyone.', { knowledge: 8, stability: 5, resources: -3 }, { technologies: ['weights'], flags: ['common_measure'] })]),
    choice('bargain', 'Alıcı kendi sepetiyle gelsin.', 'Let buyers bring their own basket.', [outcome('Pazar canlı kaldı. İyi pazarlık yapanlar daha çok taşıdı.', 'The market stayed lively. Skilled bargainers carried more home.', { resources: 8, authority: -4, stability: -3 })])
  ]);

card('tin_caravan', 3, 'trade', 'Kalayın Yolu', 'The Tin Road',
  'Kervanın taşıdığı kalay, bakırınızı sertleştirebilir. Geçit beyleri her yükten pay istiyor. Ustalar bekledikçe ocaklar boş yanıyor.',
  'Caravan tin could harden your copper. Pass lords demand a share of every load. Furnaces burn empty while craftspeople wait.',
  'Pack animals with tin ingots at mountain toll gate, bronze seal foreground, dry gold light.', [
    choice('toll', 'Geçiş payını öde; ustaları çalıştır.', 'Pay the toll and keep the furnaces working.', [outcome('Bronz aletler toprağı daha derin yardı. Geçit beyleri her hasada ortak oldu.', 'Bronze tools cut deeper into the soil. The pass lords gained a stake in every harvest.', { resources: -8, knowledge: 13, authority: 4 }, { technologies: ['bronze'], flags: ['tin_dependency'] })]),
    choice('route', 'Daha uzun bir yol için keşif gönder.', 'Scout a longer independent route.', [outcome('Yeni patika bulundu; ilk yükü taşımak pahalıya geldi.', 'A new trail was found; carrying the first shipment cost dearly.', { resources: -12, knowledge: 8, stability: 5 }, { technologies: ['bronze'], flags: ['independent_trade'] })])
  ]);

card('clay_archive', 3, 'technology', 'Kil Unutmaz', 'Clay Does Not Forget',
  'Yazıcı, tahıl borçlarını tabletlere kazımayı öneriyor. Yaşlılar sözlerinin artık bir kil parçasından daha değersiz sayılmasından korkuyor.',
  'A scribe proposes recording grain debts on tablets. Elders fear their word will count for less than a lump of clay.',
  'Scribe making original abstract wedge marks, shelves of clay tablets, shaft of light, bronze and cream.', [
    choice('archive', 'Kayıtları halka açık bir avluda tut.', 'Keep the records in a public courtyard.', [outcome('Borçlar görünür oldu. Yazıyı öğrenmek, iktidarın kapısına yeni bir anahtar getirdi.', 'Debts became visible. Learning to write opened a new door to power.', { knowledge: 15, resources: -9, stability: 5 }, { technologies: ['writing'], flags: ['public_archive'], animation: 'technology' })]),
    choice('witness', 'Her borca iki tanık iste.', 'Require two witnesses for each debt.', [outcome('Sözler insanların hafızasında kaldı. Tanıklık yeni bir mesleğe dönüştü.', 'Words remained in human memory. Witnessing became a profession.', { authority: 9, stability: 4, knowledge: 2 }, { flags: ['witness_law'] })])
  ], { chain: 'memory' });

card('debt_tablet', 3, 'legacy', 'Kırılmayan Tablet', 'The Unbroken Tablet',
  'Bir aile, dedelerinin tohum borcu yüzünden hâlâ aynı tarlada çalışıyor. Yazıcı tabletin doğru olduğunu söylüyor. Borcun ilk hasatta kapanması gerektiğini kimse yazmamış.',
  'A family still works the same field for their grandfather’s seed debt. The scribe says the tablet is correct. Nobody recorded when the debt should end.',
  'Worn debt tablet held by farm worker before seated scribe, severe side lighting, dusty clay palette.', [
    choice('cancel', 'Borcu sil; emeğin süresine sınır koy.', 'Cancel the debt and limit bonded service.', [outcome('Tablet kırıldı. Özgür kalan eller bu kez kendi hasadı için çalıştı.', 'The tablet broke. Freed hands worked for their own harvest.', { stability: 12, authority: -6, resources: -5 }, { flags: ['emancipation'], relation: -10 })]),
    choice('uphold', 'Kaydı koru; aileye ek pay ver.', 'Uphold the record; increase the family’s ration.', [outcome('Ambarlar düzenli doldu. Tabletin gölgesi çocukların üzerine uzandı.', 'Stores filled reliably. The tablet’s shadow lengthened over the children.', { resources: 12, authority: 6, stability: -12 }, { flags: ['inherited_bondage'] })])
  ], { chain: 'debt', requirements: [{ flag: 'bonded_labor' }], exclusions: [{ flag: 'emancipation' }, { flag: 'inherited_bondage' }] });

card('city_walls', 3, 'settlement', 'Duvarın Dışındakiler', 'Outside the Wall',
  'Yeni sur bütün evleri çevrelemeye yetmiyor. Tüccarlar depoları, çiftçiler kuyuyu içeri almak istiyor. Taş ustaları iki planı birden yapamaz.',
  'The new wall cannot surround every home. Merchants want warehouses inside; farmers want the well. Masons cannot build both plans.',
  'Unfinished mudbrick wall, well outside and storehouses inside marked boundary, high angle afternoon.', [
    choice('well', 'Kuyuyu ve evleri koru.', 'Protect the well and homes.', [outcome('Kuşatmada suyunuz olacak. Tüccarlar mallarını küçük depolara bölmek zorunda kaldı.', 'You will have water under siege. Merchants split their goods among smaller stores.', { population: 7, resources: -10, stability: 6 }, { buildings: ['walls'], flags: ['public_defense'], animation: 'settlement' })]),
    choice('stores', 'Depoları ve atölyeleri koru.', 'Protect stores and workshops.', [outcome('Üretim güvenceye alındı. Dışarıda kalanlar kapının ne zaman açılacağını soruyor.', 'Production was secured. Those outside ask when the gate will open.', { resources: 10, authority: 7, stability: -8 }, { buildings: ['walls'], flags: ['merchant_defense'], animation: 'settlement' })])
  ]);

card('furnace_wood', 3, 'ecology', 'Ocağın Açlığı', 'The Furnace’s Hunger',
  'Metal ocakları, bir köyün kışlık odununu bir günde tüketiyor. Ustalar üretimi artırmak için ormanı satın almak istiyor.',
  'The furnaces consume a village’s winter wood in one day. Craftspeople want to buy the forest to increase production.',
  'Bronze foundry beside shrinking forest, stacked logs and small village, ember glow through charcoal haze.', [
    choice('quota', 'Ocaklara yakıt kotası koy.', 'Limit fuel for the furnaces.', [outcome('Aletler daha pahalı oldu. Ormanla yaşayan aileler yerinde kaldı.', 'Tools became more expensive. Forest families kept their homes.', { resources: -6, environment: 12, stability: 4 }, { flags: ['fuel_quota'] })]),
    choice('expand', 'Üretimi büyüt; köylüleri işe al.', 'Expand production and hire the villagers.', [outcome('Daha çok bronz döküldü. Köylüler artık odunlarını ücretleriyle alıyor.', 'More bronze was cast. Villagers now buy firewood with their wages.', { resources: 16, environment: -15, authority: 4 }, { flags: ['industrial_forest'], delayed: [delayed(6, 3, 'Kökleri sökülen yamaç kaydı; fırın yolu kapandı.', 'The stripped hillside slipped, blocking the furnace road.', { resources: -10, population: -3 })] })])
  ], { chain: 'embers' });

card('hostage_prince', 3, 'diplomacy', 'Emanet Varis', 'The Entrusted Heir',
  'Komşu kentin varisi, barışın güvencesi olarak sarayınıza geldi. Kendi dilinde şarkı söylediğinde muhafızlar susmasını istiyor.',
  'A neighboring city’s heir arrives as a pledge of peace. Guards silence him when he sings in his own language.',
  'Young adult foreign heir at bronze palace window, guard beyond curtain, blue and gold twilight.', [
    choice('guest', 'Onu konuk say; kendi öğretmenini getirsin.', 'Treat him as a guest; allow his own tutor.', [outcome('İki sarayın çocukları aynı avluda farklı diller öğrendi.', 'Children of two courts learned different languages in one courtyard.', { knowledge: 7, resources: -5, stability: 5 }, { flags: ['honored_hostage'], relation: 10 })]),
    choice('assimilate', 'Sarayın kurallarını öğrensin.', 'Make him follow the court’s customs.', [outcome('Törenlerde kusur kalmadı. Varis artık yalnızken şarkı söylüyor.', 'Ceremonies became flawless. The heir now sings only when alone.', { authority: 12, stability: -5 }, { flags: ['humiliated_heir'], relation: -12 })])
  ]);

card('salt_ship', 3, 'survival', 'Tuz Yüklü Gemi', 'The Salt Ship',
  'Fırtınadan kaçan gemi limanda bekliyor. Tuz yükü etinizi aylarca koruyabilir. Kaptan, karşılığında şehrinizin tek sağlam yelken bezini istiyor.',
  'A ship shelters from a storm. Its salt could preserve your meat for months. The captain wants your city’s only sound sailcloth.',
  'Storm-battered wooden merchant ship, salt sacks on quay, dark teal water and warm harbor torches.', [
    choice('trade', 'Bezi ver; tuzu al.', 'Trade the sailcloth for salt.', [outcome('Kış erzağı korundu. Kendi geminiz bir süre kıyıdan ayrılamayacak.', 'Winter food was preserved. Your own ship must stay ashore for a while.', { resources: 12, population: 4, knowledge: -3 }, { flags: ['salt_preservation'] })]),
    choice('escort', 'Bezi kirala; dönüş yükünden pay iste.', 'Lend the sail and ask for a share of the return cargo.', [outcome('Gemi döndü; uzak kıyıların malı pazarınızı doldurdu.', 'The ship returned with goods from distant shores.', { resources: 20, knowledge: 5 }, { probability: 0.6, affinity: 'stability', id: 'returned', animation: 'success' }), outcome('Gemi dönmedi. Ufuk günlerce boş kaldı.', 'The ship never returned. The horizon stayed empty for days.', { resources: -10, stability: -5 }, { probability: 0.4, id: 'lost', animation: 'failure' })])
  ]);

card('council_seal', 3, 'leadership', 'Mührün Sahibi', 'Keeper of the Seal',
  'Şehir büyüdü; her anlaşma için seni beklemek ticareti durduruyor. Yazıcılar ikinci bir mühür istiyor. Aynı işaret iki elde olursa son sözü kim söyleyecek?',
  'The city has grown; waiting for your approval delays trade. Scribes request a second seal. Who has the last word when two hands bear the same mark?',
  'Two original cylinder seals on bronze tray between ruler and scribe, sunlit stone hall, crisp gold accents.', [
    choice('delegate', 'Yetkiyi paylaş; kayıtları her ay denetle.', 'Share authority and audit records monthly.', [outcome('Anlaşmalar hızlandı. Yönetim ilk kez bir insanın uyanık kalmasına bağlı olmaktan çıktı.', 'Agreements moved faster. Government no longer depended on one person staying awake.', { authority: -7, knowledge: 10, resources: 7, stability: 5 }, { technologies: ['institutions'], flags: ['delegated_rule'] })]),
    choice('centralize', 'Mühür tek kalsın; yardımcılar rapor hazırlasın.', 'Keep one seal; have assistants prepare reports.', [outcome('Son söz sende kaldı. Kapındaki kuyruk artık şehrin gündelik manzarası.', 'The final word remained yours. The queue at your door became part of city life.', { authority: 13, resources: -4, stability: -3 }, { flags: ['single_seal'] })])
  ], { chain: 'public_voice' });

addLegacyEvents({ card, choice, outcome, delayed });

const eraRows = [
  ['Paleolitik Çağ','Paleolithic','Mağara Kampı','Cave Camp','Kabile Meclisi','Tribal Council','cultivation',55,'#B07845','Kaya, kemik, ateş; ochre charcoal; cave wind and stone percussion.'],
  ['Neolitik Çağ','Neolithic','Tarım Köyü','Farming Village','Köy Meclisi','Village Council','smelting',68,'#9DAD74','Kil, keten, saz; sage clay; water and wooden rhythm.'],
  ['Tunç Çağı','Bronze Age','Surlu Kent','Walled City','Kent Devleti','City State','writing',78,'#C49952','Bronz, mühür, tablet; bronze teal; workshop and strings.'],
  ['Antik İmparatorluklar','Ancient Empires','Taş Başkent','Stone Capital','İmparatorluk','Empire','civil_law',82,'#D8C3A1','Mermer, mozaik; ivory gold; crowds and ceremonial drums.'],
  ['Orta Çağ','Middle Ages','Kale Şehri','Castle City','Feodal Taç','Feudal Crown','printing',84,'#84617F','Parşömen, vitray; plum silver; rain bells and bowed strings.'],
  ['Rönesans','Renaissance','Akademi Kenti','Academy City','Kent Cumhuriyeti','Civic Republic','navigation',86,'#A67752','Yağlı boya, gravür; sienna gold; workshop lute.'],
  ['Keşifler ve Aydınlanma','Exploration and Enlightenment','Dünya Limanı','World Port','Meclisli Krallık','Parliamentary Crown','steam',88,'#3F8192','Harita, pusula; ocean parchment; rigging and chamber ensemble.'],
  ['Sanayi Çağı','Industrial Age','Sanayi Kenti','Industrial City','Sanayi Devleti','Industrial State','electricity',90,'#9A7962','Çelik, buhar; rust charcoal; machinery and low pulse.'],
  ['Modern Çağ','Modern Age','Metropol','Metropolis','Modern Cumhuriyet','Modern Republic','computing',92,'#7F968B','Özgün fotoğrafik kolaj; muted green; radio texture and orchestra.'],
  ['Dijital Çağ','Digital Age','Akıllı Şehir','Smart City','Ağ Cumhuriyeti','Network Republic','autonomy',94,'#4FA8BB','Cam, veri; cyan graphite; restrained electronic pulse.'],
  ['Yapay Zekâ ve Uzay Çağı','AI and Space Age','Yörünge İstasyonu','Orbital Station','Gezegen Konseyi','Planetary Council','stellar_drive',96,'#9791D0','Hologram, seramik; violet white; habitat hum and synthesis.'],
  ['Yıldızlararası Çağ','Interstellar Age','Yıldız Başkenti','Stellar Capital','Yıldızlar Birliği','Stellar Union','continuity',100,'#D6B781','Kozmik ışık; indigo gold; stellar ambience and spacious harmonics.']
];
const eras = eraRows.map((r,i) => ({ id:i+1, name:text(r[0],r[1]), settlement:text(r[2],r[3]), government:text(r[4],r[5]), requiredTechnology:r[6], knowledgeThreshold:r[7], stabilityThreshold:35, populationThreshold:25, palette:r[8], artDirection:r[9] }));
const balance = { startingStats:{population:55,resources:55,authority:40,knowledge:28,stability:55,environment:70}, resourceConsumption:4, hardExtraConsumption:2, farmProduction:2, starvationLoss:8, successionTurns:24, rivalPressure:5 };
function write(relative, data) { const destination=resolve(root,relative); mkdirSync(resolve(destination,'..'),{recursive:true}); writeFileSync(destination, JSON.stringify(data,null,2)+'\n'); }
write('Sources/FateCore/Content/cards.json',cards);
write('Sources/FateCore/Content/eras.json',eras);
write('Sources/FateCore/Content/balance.json',balance);
const previousArt = existsSync(resolve(root,'assets/art_manifest.json')) ? JSON.parse(readFileSync(resolve(root,'assets/art_manifest.json'),'utf8')) : [];
write('assets/art_manifest.json', cards.map(c=>({...{id:c.artAsset,cardID:c.id,status:'missing',file:null,brief:c.artDirection,license:null}, ...previousArt.find(a=>a.id===c.artAsset), brief:c.artDirection})));
write('assets/audio_manifest.json', { status:'production-incomplete', effects:[{id:'decision',status:existsSync(resolve(root,'App/Resources/decision.wav'))?'prototype':'missing',file:existsSync(resolve(root,'App/Resources/decision.wav'))?'App/Resources/decision.wav':null}], music:eras.map(e=>({id:`era_${e.id}`,status:'missing',file:null,brief:e.artDirection})), ambience:eras.map(e=>({id:`ambience_${e.id}`,status:'missing',file:null})) });
write('Sources/FateCore/Content/technologies.json', eras.map(e=>({id:e.requiredTechnology,era:e.id,unlockedBy:cards.filter(c=>c.choices.some(ch=>ch.outcomes.some(o=>o.effect.technologies.includes(e.requiredTechnology)))).map(c=>c.id),status:e.id<=3?'implemented':'planned'})));
console.log(`Authored ${cards.length} cards, ${eras.length} era definitions. Production artwork/audio remain missing.`);
