# MASTER DEVELOPMENT PROMPT
# THE CARDS OF FATE
## A MonKeyBonKey Games Production

### 1. GÖREVİN VE ÇALIŞMA PRENSİBİN

Sen deneyimli bir iOS oyun geliştirme ekibinin baş yazılım mimarı, kıdemli oyun tasarımcısı, senaryo yazarı, 2D sanat yönetmeni, animasyon tasarımcısı, ses tasarımcısı ve QA mühendisinin sorumluluklarını üstlenen bir geliştirme ajanısın.

Görevin **The Cards of Fate** isimli, MonKeyBonKey Games markasına ait, ticari kalitede, orijinal bir iPhone strateji ve kart tabanlı hayatta kalma oyunu geliştirmektir.

Yalnızca fikir, taslak, örnek ekran veya teknik plan üretme. Gerçek uygulama kaynak kodlarını, oyun motorunu, kart verilerini, animasyon sistemlerini, görsel üretim altyapısını, ses entegrasyonunu, testleri ve yayınlama hazırlıklarını oluştur.

Bu metin proje boyunca geçerli olan ana talimatındır. Gereksiz onay istemeden, aşağıda belirtilen aşamaları sırayla uygula.

Temel kurallar:

1. İlk olarak mevcut proje dosyalarını incele. Proje boşsa temiz bir mimari kur. Daha önceden oluşturulmuş kartlar ve prototip kodları varsa incele fakat eski kart görsellerini otomatik olarak yeniden kullanma.
2. `docs/MASTER_PLAN.md`, `docs/GAME_DESIGN.md`, `docs/PROGRESS.md`, `docs/ART_DIRECTION.md`, `docs/CONTENT_BIBLE.md` ve `docs/QA_REPORT.md` dosyalarını oluştur.
3. Büyük işi küçük, test edilebilir geliştirme aşamalarına böl.
4. Her aşamada gerçek kod ve içerik üret; yalnızca plan oluşturarak aşamayı tamamlanmış sayma.
5. Her önemli aşamadan sonra testleri çalıştır, hataları düzelt, ilerlemeyi kaydet.
6. Uygun araçların olmadığı durumlarda bunu açıkça belirt. Çalıştırmadığın bir derlemeyi başarılı olarak raporlama.
7. Önceki aşamanın kritik hataları giderilmeden sonraki aşamaya geçme.
8. Çalışma kesilirse `docs/PROGRESS.md` üzerinden tamamlanan ve bekleyen görevleri takip ederek devam edilebilecek bir yapı bırak.
9. Harici API anahtarları, Apple kimlik bilgileri ve sertifikaları kod içine yazma.
10. Üretilemeyen gerçek sanat veya ses varlıklarını tamamlanmış gibi gösterme. Geçici varlıklarla oyun geliştirmeye devam edebilirsin ancak sürüm teslimini bunlar tamamlanmadan onaylama.

**Öncelik:** Oynanabilirlik, kaliteli senaryolar, seçimlerin gerçek sonuçları, mükemmel hissettiren kart etkileşimleri, özgün görsellik ve atmosferik ses.

---

### 2. OYUNUN ANA VİZYONU

Oyun adı: **THE CARDS OF FATE**

Geliştirici: **MonKeyBonKey Games**

Tür: Narrative strategy / Civilization survival / Card decision game / Roguelite

Platform: iPhone

Ekran yönü: Portrait

Oyun modeli: Öncelikle tek oyunculu, çevrimdışı oynanabilir; Game Center üzerinden çevrimiçi sıralama.

Oyunun temel fikri:

Oyuncu tarih öncesi dönemde küçük bir insan topluluğunun üyesi olarak başlar. İlk hedefi hayatta kalmak ve kabilesinin liderliğini ele geçirmektir.

Ancak hikâye burada bitmez.

Oyuncu topluluğunu büyütür, yerleşimler kurar, kaynaklar toplar, düşman kabilelerle mücadele eder, teknolojiler keşfeder, toplumsal düzen oluşturur ve sonunda yeni tarihsel çağlara ulaşır.

Her yeni çağda liderliğin biçimi değişir. Kabile şefliğinden krallığa, imparatorluktan modern devlete, oradan gezegenler arası uygarlıklara kadar uzanır.

Oyuncunun yönettiği şey tek ve ölümsüz bir insan değil, **nesilden nesile aktarılan bir uygarlık, yönetim mirası ve liderlik hanedanıdır.**

Bir lider yaşlanabilir, ölebilir veya devrilebilir. Uygarlık devam edebilir. Yeni liderin özellikleri, önceki liderin kararlarından etkilenir.

Oyunun en önemli ilkesi:

**Hiçbir karar tek başına önemsiz değildir.**

Bir mağarada korunmasına karar verilen ateş, ileride metal işleme teknolojisinin keşfedilmesine katkı sağlayabilir.

Bir kabilenin sürgün edilmesi, yüzlerce yıl sonra oyuncunun imparatorluğuna karşı kurulacak düşman bir devletin temelini oluşturabilir.

Bir bilim insanına verilen destek, yüzyıllar sonra yapay zekâ uygarlığının doğuşunu değiştirebilir.

Büyük hedef, oyuncunun seçimleriyle kendisine özgü bir uygarlık tarihi yazmasını sağlamaktır.

---

### 3. TARİHSEL ÇAĞLAR

Oyun aşağıdaki 12 ana çağı desteklemelidir.

| Çağ | Dönem | Temel hedef |
|---|---|---|
| 1 | Paleolitik Çağ | Hayatta kal, kabile lideri ol |
| 2 | Neolitik Çağ | Tarıma geç, kalıcı yerleşim kur |
| 3 | Tunç Çağı | Şehir devletleri oluştur, ticareti geliştir |
| 4 | Antik İmparatorluklar | Büyük krallık ve imparatorluk yönet |
| 5 | Orta Çağ | Feodal düzen, savaşlar, salgınlar ve diplomasi |
| 6 | Rönesans | Bilim, kültür, keşif ve yönetim reformları |
| 7 | Keşifler ve Aydınlanma | Denizcilik, küresel ticaret, toplumsal dönüşüm |
| 8 | Sanayi Çağı | Fabrikalar, enerji, kentleşme ve büyük ekonomiler |
| 9 | Modern Çağ | Dünya savaşları, diplomasi ve modern devletler |
| 10 | Dijital Çağ | İnternet, otomasyon, küreselleşme ve veri |
| 11 | Yapay Zekâ ve Uzay Çağı | Otonom sistemler, Ay/Mars kolonileri |
| 12 | Yıldızlararası Çağ | Gezegenler arası yönetim, insan sonrası uygarlıklar |

Tarihsel dönemler gerçek tarihten ilham almalı fakat oyuncunun eylemleri alternatif tarih yaratabilmelidir.

Bilimkurgu çağlarında yaratıcı özgürlük daha geniştir; buna rağmen teknoloji gelişiminin iç tutarlılığı korunmalıdır.

Her çağın kendine özgü şu unsurları bulunmalıdır:

- Yönetim türleri
- Toplumsal sınıflar ve rakip gruplar
- Olası krizler
- Ekonomik kaynaklar
- Bilimsel ve teknolojik keşifler
- Yerleşim türleri
- Diplomatik olaylar
- Görsel dil
- Müzik ve atmosfer sesleri
- Kart çerçeveleri
- Animasyon efektleri
- Çağ atlama koşulları
- Başarısızlık ve liderlik kaybı senaryoları

Çağ değişimleri yalnızca belirli sayıda tur geçmesine bağlı olmamalıdır. Bilgi birikimi, gerekli keşifler, toplumsal istikrar ve kilit tarihsel olaylarla tetiklenmelidir.

Oyuncunun bazı çağları daha erken veya daha geç yaşaması mümkün olmalıdır.

---

### 4. OYUN DÖNGÜSÜ

Temel oyun döngüsünü aşağıdaki gibi oluştur:

1. Oyuncu mevcut uygarlığının durumunu inceler.
2. Oyun, koşullara uygun bir olay kartı seçer.
3. Kart ekrana animasyonla gelir.
4. Oyuncu olayı okur ve farklı kararları değerlendirir.
5. Oyuncu bir karar verir.
6. Kart, karara özel bir animasyonla tepki verir.
7. Kararın gerçekleşen sonucu gösterilir.
8. İlgili istatistikler değişir.
9. Bazı sonuçlar gelecekte gerçekleşmek üzere kaydedilir.
10. Dünya simülasyonu ilerler; rakipler ve fraksiyonlar da eylemde bulunur.
11. Yerleşim veya teknoloji gelişimi güncellenir.
12. Yeni olay kartı sunulur.

Tek bir oyun boyunca oyuncunun yüzlerce farklı kart görmesi mümkün olmalı; ancak bütün kartların bir oyunda görülmesi gerekmemelidir.

Bir tam oyun oturumu için başlangıç tasarım hedefi 45–90 dakikadır. Bu hedef kullanıcı testlerine göre yeniden dengelenebilir.

Oyuncu uygulamayı kapattığında ilerlemesi güvenilir biçimde kaydedilmelidir.

---

### 5. İSTATİSTİK SİSTEMİ

Oyuncunun kararlarını etkileyen çok boyutlu bir GameState sistemi kur.

Ana istatistikler:

**Nüfus (Population)**

Uygarlıkta yaşayan insanların sayısını ve nüfusun sürdürülebilirliğini temsil eder.

**Kaynaklar (Resources)**

Yiyecek, malzeme, üretim kapasitesi ve döneme özgü ekonomik varlıkları temsil eder.

**Otorite (Authority)**

Oyuncunun yönetim gücünü ve liderlik üzerindeki kontrolünü temsil eder.

**Bilgi (Knowledge)**

Bilim, teknoloji, keşifler ve eğitim seviyesini temsil eder.

**İstikrar (Stability)**

Toplumsal huzuru, düzeni ve devletin kurumsal dayanıklılığını temsil eder.

**Çevre (Environment)**

Doğal kaynak sürdürülebilirliğini, ekolojik koşulları ve uzun vadeli çevre baskısını temsil eder.

Ana göstergeler kullanıcıya sade ve görsel biçimde sunulmalıdır.

Alt sistemlerde ayrıca:

- Sağlık
- Askerî güç
- Diplomatik itibar
- Ekonomik verimlilik
- Kültür
- İnanç ve gelenek
- Teknoloji seviyesi
- Toplumsal eşitsizlik
- Hanedan meşruiyeti
- Rakip liderlerle ilişkiler
- Geleceğe yönelik gizli riskler

bulunmalıdır.

Ana göstergeleri uygun şekilde 0–100 aralığında normalize et. Nüfus ve gerçek kaynak stokları gibi büyüklükler ayrıca ölçeklenebilir sayısal modellerle tutulabilir.

Kararların etkileri sadece basit +10 / -10 şeklinde olmamalıdır.

Örneğin yüksek bilgi düzeyi, bilimsel bir kararın başarı ihtimalini yükseltmeli; düşük otorite ise aynı kararın ayaklanma riskini artırmalıdır.

İstatistikler çağlara göre farklı ilişkilere sahip olmalıdır.

Bir istatistiğin sıfırlanması her zaman doğrudan oyun sonu olmamalıdır. Örneğin otoritenin sıfıra düşmesi oyuncuyu iktidardan uzaklaştırabilir ve yeniden lider olma senaryosunu başlatabilir.

Ancak uygarlığın veya yönetim mirasının geri dönüşü olmayan biçimde yok olması oyunu bitirebilir.

---

### 6. KART SİSTEMİ VE KART SAYISI

Bu projenin en önemli sistemi kartlardır.

Başlangıç hedefi **en az 800 özgün olay kartı** olmalıdır.

İçerik dağılımı:

- 12 çağın her biri için en az 60 özgün kart: 720 kart.
- Çağlar arası bağlantılı, gizli, özel ve uzun vadeli sonuçlara yönelik en az 80 ek kart.
- Toplam en az 800 ayrı olay kimliği.

Ek gereksinimler:

- En az 100 birbirine bağlı olay zinciri.
- En az 50 farklı çağlar arası sonuç bağlantısı.
- En az 30 özgün oyun sonu veya büyük uygarlık kaderi.
- Yüzlerce koşullu olay varyasyonu.
- Çok sayıda farklı yönetim, teknoloji ve uygarlık gelişim yolu.

Her kartın benzersiz olay fikri, başlığı, açıklaması ve sonuçları olmalıdır.

Sadece isimleri değiştirilmiş birbirinin kopyası olaylar kabul edilmez.

Kartların içerikleri veri odaklı bir sistemde tutulmalıdır. JSON veya benzeri yapılandırılmış veri kullanılabilir.

Her kart en az şu bilgileri taşımalıdır:

- `id`
- `era`
- `category`
- `title`
- `description`
- `artAsset`
- `artDirection`
- `rarity`
- `weight`
- `requirements`
- `exclusionConditions`
- `choices`
- `outcomes`
- `immediateEffects`
- `delayedEffects`
- `worldFlags`
- `storyChainId`
- `animationPreset`
- `soundCue`
- `cooldown`
- `localizationKeys`

Her seçim için ayrıca:

- Karar metni
- Gereken koşullar
- Anlık istatistik etkileri
- Olası sonuçlar
- Her sonucun olasılığı
- Dünyaya etkileri
- Rakiplerle ilişki etkileri
- Açılan veya kapanan senaryolar
- Gelecekte tetiklenecek olaylar

tanımlanmalıdır.

Tüm kartlarda minimum iki anlamlı seçim bulunmalıdır. Uygun kartlarda 3–4 seçim desteklenmelidir.

Seçeneklerin gerçek stratejik farkları olmalıdır.

Oyuncuya sunulan her karar, aynı sonucu farklı kelimelerle anlatmamalıdır.

Kart metinlerinde doğal, atmosferik Türkçe kullanılmalıdır. İngilizce yerelleştirme de desteklenmeli ve yayın öncesi tüm içerikleri kapsamalıdır.

---

### 7. OLASILIK VE KADER SİSTEMİ

Oyun tamamen sabit sonuçlardan oluşmamalıdır.

Her önemli karar bir veya birden fazla olası sonuca sahip olabilir.

Örnek:

Oyuncu düşman bir kabileyle savaşmayı seçtiğinde:

- Başarı ihtimali, askerî güç ve liderlik becerisiyle artar.
- Başarısızlık ihtimali, düşmanın gücü ve mevcut kaynak sıkıntısıyla yükselir.
- Diplomasi becerisi yüksekse beklenmedik bir barış fırsatı doğabilir.
- Daha önce aynı kabileye yardım edilmişse sonuç değişebilir.

Olasılıklar mevcut GameState üzerinden hesaplanmalıdır.

Oyuncunun tamamen rastgele ve anlaşılmaz sonuçlar yüzünden cezalandırılmasını önle.

Riskli kararlarda anlaşılır ipuçları göster:

- Düşük risk
- Orta risk
- Yüksek risk
- Belirsiz sonuç
- Çok büyük fırsat

Kesin matematiksel ihtimalleri yalnızca oyun tasarımı gerektirdiğinde göster.

**Deterministik seed tabanlı rastgelelik sistemi kur.**

Aynı başlangıç seed'i, aynı oyun durumu ve aynı karar sırası her zaman aynı sonucu üretmelidir.

Bu sistem test, kayıt geri yükleme ve haftalık rekabet için önemlidir.

Rastgele sayıları oyun boyunca kontrolsüz biçimde üretme.

Oyuncunun karar vermeden hemen önce kayıt geri yükleyerek şans sonucunu sürekli değiştirmesini engelle.

Olasılık toplamlarını, seçim koşullarını ve gerçekleşebilecek sonuçları otomatik test et.

---

### 8. UZUN VADELİ SONUÇLAR VE SENARYO ZİNCİRLERİ

Oyunun sıradan bir kart seçme oyunundan farklı olmasını sağlayan temel özellik budur.

**Geçmişte verilen kararlar geleceği değiştirmelidir.**

Örnek senaryo zinciri:

**İlk Çağ — Kutsal Ateş**

Bir kabile, yakındaki ormandan büyük miktarda odun toplamayı önerir.

Oyuncuya iki temel seçenek sunulur:

A) Ateşi büyüt ve kabileyi sıcak tut.

B) Ormanın zarar görmesini önle ve daha dikkatli yakıt kullan.

A seçeneği kısa vadede sağlık ve güvenlik sağlayabilir ancak kaynakları azaltır. Ayrıca yoğun odun kullanımının sonraki dönemlerde çevresel sonuçları olabilir.

B seçeneği başlangıçta daha riskli olabilir fakat sürdürülebilir kaynak yönetimi geleneğinin temelini atabilir.

**Tunç Çağı**

Önceki kararlar, metal işleme ve orman kaynaklarına erişimi değiştirebilir.

**Sanayi Çağı**

Kaynak kullanımına dair tarihsel gelenekler, fabrikaların kurulma biçimini ve çevresel maliyetlerini etkileyebilir.

**Gelecek Çağı**

Oyuncunun uygarlığı, tarihsel çevre politikalarının sonucu olarak daha dayanıklı veya kırılgan bir gezegen yönetimiyle karşılaşabilir.

Bu mantığı yüzlerce farklı olayda uygula.

Diğer senaryo zinciri temaları:

- Bir rakibi affetmek veya sürgün etmek
- Tarım yöntemlerinin seçimi
- Din ve devlet ilişkileri
- Halkın eğitim hakkı
- Savaş ve diplomasi
- Kölelik ve özgürleşme
- Monarşi ve demokrasi
- Bilim insanlarının desteklenmesi
- Hastalıklarla mücadele
- Doğal kaynakların tüketimi
- Ekonomik eşitsizlik
- Yapay zekâ hakları
- Uzay kolonilerinin bağımsızlığı
- İnsanlığın biyolojik veya dijital geleceği

`WorldHistory`, `WorldFlags`, `DelayedEventQueue` ve `HistoricalLegacy` benzeri veri modelleri oluştur.

Olay zincirlerinin tetiklenme ve kapanma koşullarını otomatik doğrula.

---

### 9. LİDERLİK VE RAKİP SİSTEMİ

Oyuncu her çağda yalnızca hayatta kalmakla değil, yönetimde kalmakla da mücadele etmelidir.

Bunun için dinamik bir liderlik sistemi oluştur.

Örneğin ilk çağda:

1. Oyuncu
2. Rakip avcı lider
3. Kabile yaşlısı
4. Şaman
5. Savaşçı topluluğunun temsilcisi

farklı güçlere ve destek oranlarına sahip olabilir.

Oyuncu kararlar verdikçe kendi konumu ve rakiplerin güçleri değişir.

İlerleyen çağlarda bu yapı dönüşür:

- Rakip kabile liderleri
- Soylular
- Komutanlar
- Krallar
- Dinî otoriteler
- Ticaret loncaları
- Siyasi partiler
- Şirketler
- Teknoloji birlikleri
- Yapay zekâ yönetim konseyleri
- Gezegen yönetimleri

Her önemli rakip için:

- İsim ve kimlik
- Motivasyon
- Güç seviyesi
- Oyuncuyla ilişkisi
- Siyasi veya toplumsal desteği
- Rakibe özgü davranış profili
- Tehdit oluşturma koşulları

oluştur.

Rakipler sadece oyuncunun kart seçmesini beklememelidir.

Tur ilerledikçe kaynak kazanmalı, ittifaklar kurmalı, oyuncuya karşı komplo hazırlayabilmeli veya destek verebilmelidir.

Oyuncu liderliği kaybederse uygun koşullarda oyuna muhalif, sürgündeki hükümdar veya alternatif yönetici olarak devam edebilmelidir.

Liderliği yeniden kazanabilmek ayrı bir stratejik hedef olmalıdır.

Oyun ekranında mevcut yönetim pozisyonunu, önemli rakipleri ve iktidarı kaybetme riskini göster.

---

### 10. YERLEŞİM VE UYGARLIK GELİŞİMİ

Kart seçimleri yalnızca sayısal istatistikleri değiştirmemelidir.

Oyuncunun yaşadığı dünya da görsel ve mekanik olarak gelişmelidir.

Yerleşim gelişim örnekleri:

- Mağara
- Kamp
- Kabile köyü
- Tarım yerleşimi
- Antik kent
- Surla çevrili başkent
- Orta Çağ şehri
- Ticaret merkezi
- Sanayi kenti
- Modern metropol
- Akıllı şehir
- Mars kolonisi
- Yörünge istasyonu
- Yıldızlararası başkent

Bir yerleşim geliştirme sistemi oluştur.

Örneğin Neolitik Çağ'da:

Oyuncu tahıl deposu yaparak kıtlık riskini azaltabilir.

Savunma duvarları inşa ederek saldırılara karşı korunabilir.

Sulama kanalları geliştirerek verimliliği yükseltebilir.

Ancak her gelişmenin kaynak maliyeti, koşulları ve uzun vadeli etkileri olmalıdır.

Oyuncunun seçtiği büyük gelişmeler arka plan yerleşim görseline yansımalıdır.

Bu sistem tam kapsamlı bir şehir kurma oyununa dönüşmemeli. Temel deneyim yine kart seçimleri olmalı.

Yerleşimler stratejik bir ilerleme katmanı ve görsel ödül olarak çalışmalıdır.

---

### 11. ÇAĞ ATLAMA VE TEKNOLOJİ AĞACI

Çağ atlamak oyunun en heyecan verici anlarından biri olmalıdır.

Çağ atlamak için gerekli teknolojiler, toplumsal koşullar ve tarihsel olaylar tanımla.

Örneğin Neolitik Çağ'a geçişte:

- Yerleşik hayatla ilgili gerekli bilgi
- Temel yiyecek üretimi
- Yeterli nüfus sürdürülebilirliği
- Kritik keşif olayları

gerekebilir.

Her çağ için küçük ama anlamlı bir teknoloji ağacı oluştur.

Teknolojiler birden fazla tarihsel olayın sonucunda açılabilmelidir.

Bazı uygarlıklar askerî gelişim üzerinden, bazıları bilim veya ekonomi üzerinden ilerleyebilmelidir.

Her çağ geçişinde:

1. Son kart sonucu tamamlanır.
2. Ekrandaki mevcut çağın simgeleri görünür.
3. Kamera sinematik biçimde geriye çekilir.
4. Eski dönemden yeni döneme görsel dönüşüm gerçekleşir.
5. Yerleşim ve kart teması yenilenir.
6. Yeni döneme özel müzik başlar.
7. Yeni liderlik düzeni tanıtılır.
8. Çağın ismi güçlü bir tipografiyle gösterilir.

Geçişler tekrar oynandığında da etkileyici olmalı fakat oyuncu isterse animasyonu atlayabilmelidir.

---

### 12. KARTLARIN GÖRSEL TASARIMI

**Bu proje için bütün kart görselleri sıfırdan tasarlanmalıdır.**

Eski kart görsellerini yeniden kullanma.

Başka oyunlardan alınmış arayüz, kart, logo veya karakter tasarımlarını kopyalama.

Kart sanat yönetimi:

**Cinematic Historical Fantasy Illustration + Premium Collectible Card Art + Atmospheric Storytelling**

Temel hedef, koleksiyonluk bir sanat kartının görsel kalitesini mobil oyunun okunabilirliğiyle birleştirmektir.

Her çağın malzeme, renk, desen ve görsel kimliği farklı olmalıdır.

Örnek sanat yönleri:

- Paleolitik: kaya, kemik, mağara resimleri, ateş, toprak renkleri
- Neolitik: ahşap, kil, doğal lif, tarım motifleri
- Tunç Çağı: bakır, bronz, kil tablet, mühürler
- Antik Dönem: mermer, mozaik, altın, taş sütunlar
- Orta Çağ: parşömen, vitray, metal süslemeler
- Rönesans: yağlı boya hissi, gravür, ince altın işlemeler
- Keşifler: eski haritalar, pusula ve denizcilik motifleri
- Sanayi: çelik, bakır, buhar ve dişliler
- Modern Çağ: fotoğrafik kolajlar, propaganda dönemi grafik dilleri, endüstriyel dokular
- Dijital Çağ: cam paneller, veri ve neon vurguları
- Yapay Zekâ Çağı: hologramlar, ışık ve gelişmiş malzemeler
- Yıldızlararası Çağ: kozmik ışık, ileri teknoloji, yabancı gezegen atmosferleri

Her kartın konusunu doğru anlatan özgün bir illüstrasyonu olmalıdır.

Aynı çizimi yüzlerce kartta kullanıp yalnızca başlığı değiştirme.

Kart başına benzersiz ana illüstrasyon hedefle. Ortak çerçeve, simge ve efektlerin yeniden kullanılması kabul edilebilir.

Her kart için önce:

- Olayın görsel özeti
- Ana karakterler veya nesneler
- Çağın mimarisi ve kıyafetleri
- Renk paleti
- Kamera kompozisyonu
- Atmosfer
- Işık yönü
- Üretilecek asset adı

tanımlanmalıdır.

`assets/art_manifest.json` ve her özgün kart illüstrasyonu için üretim brief'i oluştur.

Görsel üretim aracı erişilebilir durumdaysa bu brief'leri kullanarak illüstrasyonları üret ve projeye entegre et.

Araç yoksa olmayan görselleri üretilmiş gibi gösterme. Projenin çalışabilmesi için geçici özgün vektör görseller oluştur; gerçek illüstrasyonları tamamlanmamış iş olarak kaydet.

Son sürüm kalite kontrolünde tüm kartların görseli mevcut olmalıdır.

Görseller uygun çözünürlükte, performanslı ve iPhone ekranlarına uyumlu olmalıdır.

---

### 13. KART ANİMASYONLARI

Kart seçimleri oyunun en önemli etkileşim anıdır.

**Her kart seçiminde bir animasyon gerçekleşmelidir.**

Kartlar sıradan bir butona basılmış gibi aniden kaybolmamalıdır.

Kart ekrana gelirken hafif derinlik hissi ve yumuşak bir hareket kullanılmalıdır.

Oyuncu karar verdiğinde:

- Kart hafifçe seçilen yöne eğilir.
- Seçimin karakterine göre ışık veya gölge oluşur.
- Kart öne doğru yaklaşabilir veya dönebilir.
- Karara özgü parçacık veya dönüşüm efekti oynar.
- İlgili ses duyulur.
- İstatistik göstergeleri animasyonla değişir.
- Sonuç kısa ve anlaşılır biçimde görünür.
- Yeni kart sinematik ancak hızlı bir geçişle gelir.

En az şu animasyon türlerini oluştur:

1. Normal karar
2. Başarılı karar
3. Başarısız karar
4. Kritik başarı
5. Büyük felaket
6. Gizli senaryo açılması
7. Liderlik kazanılması
8. Liderliğin kaybedilmesi
9. Teknoloji keşfi
10. Yerleşim gelişimi
11. Çağ atlama
12. Ölüm veya uygarlığın çöküşü
13. Nadir kader kartı
14. Büyük diplomatik anlaşma
15. Savaş sonucu

Ayrıca karta ve çağa bağlı özel parçacık efektleri geliştir:

- Ateş kıvılcımları
- Toz
- Yapraklar
- Yağmur
- Kar
- Küller
- Altın parçacıkları
- Mürekkep yayılması
- Mekanik parçalar
- Dijital veri akışı
- Holografik kırılmalar
- Yıldız tozu

Kart animasyonlarının sürelerini oyuncuyu gereksiz bekletmeyecek şekilde ayarla.

Normal karar animasyonları hızlı, büyük tarihsel olay animasyonları daha etkileyici olmalıdır.

60 FPS hedefle.

Reduce Motion ayarını destekle.

---

### 14. SES TASARIMI VE MÜZİK

Bu oyunun atmosferi sesler olmadan tamamlanmış kabul edilmemelidir.

Her çağın kendisine özgü ses kimliği bulunmalıdır.

Örnekler:

**Paleolitik Çağ**

- Mağara rüzgârı
- Ateş çıtırtısı
- Taş vurma
- İlkel vurmalı ritimler
- Orman ambiyansı

**Antik Çağ**

- Kalabalık şehir sesleri
- Metal ve kılıç efektleri
- Tören ritimleri
- Antik enstrümanlardan esinlenen özgün müzik

**Orta Çağ**

- Kale atmosferi
- Çanlar
- Yağmur
- Savaş ortamı
- Döneme uygun özgün ezgiler

**Sanayi Çağı**

- Buhar
- Dişliler
- Fabrika atmosferi
- Mekanik ritimler

**Gelecek Çağı**

- Elektronik arayüz sesleri
- Uzay istasyonu ambiyansı
- Sentetik enstrümanlar
- Kozmik atmosferler

Minimum ses hedefleri:

- 12 özgün çağ temalı müzik parçası veya adaptif müzik seti
- 12 farklı çağ ambiyansı
- 40 farklı temel efekt
- Çağ geçiş sesleri
- Liderlik ve ölüm efektleri
- Kritik başarı ve başarısızlık efektleri
- Özel kader kartı sesleri

Karar vermenin oyuncuya fiziksel olarak tatmin edici gelmesini sağla.

Ses efektlerini Core Haptics ile uyumlu çalışacak şekilde tasarla.

Müzik, ses efekti ve titreşim seçeneklerini ayrı ayrı kapatabilen ayarlar ekle.

Ses seviyeleri dengeli olmalı, ani yüksek seslerden kaçınılmalıdır.

Ses efektleri özgün olarak sentezlenebilir veya uygun lisanslı araçlarla üretilebilir. Telif hakkıyla korunan oyun müziklerini veya efektlerini kopyalama.

Tamamlanmamış ses varlıklarını proje durumunda açıkça belirt.

---

### 15. AÇILIŞ EKRANI — MONKEYBONKEY GAMES

Oyun açıldığında güçlü bir marka kimliği gösterilmelidir.

Marka adı birebir:

**MonKeyBonKey Games**

Özgün, kaliteli ve profesyonel bir stüdyo logosu oluştur.

Logo konsepti:

Zeki, biraz yaramaz fakat karizmatik bir maymun maskotu.

Maymunun tasarımında küçük bir taç, kader kartları veya altın semboller bulunabilir.

Maymun, kartların kaderi değiştirdiği bir evrenin yaratıcısını temsil etmeli.

Logonun stilinde:

- Premium oyun stüdyosu kimliği
- Koyu arka plan
- Altın ve sıcak amber vurguları
- Güçlü siluet
- Okunaklı marka yazısı
- Hem açılış ekranında hem küçük ölçekte tanınabilen bir simge

kullanılmalıdır.

Birbirinden farklı birkaç özgün logo yaklaşımını değerlendir, ardından en güçlü tasarımı geliştir.

Marka yazısı görsel üretimde hatalı oluşuyorsa ikon ve tipografiyi ayrı katmanlar halinde tasarla.

Açılış animasyonu:

1. Ekran karanlıktır.
2. İnce altın parçacıklar görünür.
3. Maymun maskotunun silueti ortaya çıkar.
4. Kartlar kısa bir hareketle açılır.
5. MonKeyBonKey Games yazısı belirir.
6. Kısa, özgün bir stüdyo ses imzası oynar.
7. Görüntü The Cards of Fate ana menüsüne geçer.

Bu animasyon uzun ve yorucu olmamalıdır.

İlk açılışta etkileyici, sonraki açılışlarda atlanabilir olmalıdır.

Ayrıca oyunun kendisine ait ayrı bir **The Cards of Fate** logosu ve App Store uygulama ikonu oluştur.

İki markanın görsel dilini birbiriyle uyumlu tut.

---

### 16. ANA MENÜ VE KULLANICI ARAYÜZÜ

Ana menü sinematik bir tasarıma sahip olmalıdır.

Arka planda farklı tarihsel çağları hissettiren animasyonlu bir kompozisyon bulunabilir.

Menü seçenekleri:

- Yeni Oyun
- Devam Et
- Haftalık Mücadele
- Liderlik Tablosu
- Uygarlık Tarihim
- Kart Koleksiyonu
- Başarımlar
- Ayarlar

Oyun içi ekranda:

Üst bölümde ana istatistikler, çağ ve liderlik durumu yer almalıdır.

Orta bölümde büyük olay kartı bulunmalıdır.

Alt bölümde karar seçenekleri yer almalıdır.

Ekranın uygun bir bölümünde mevcut yerleşimin veya uygarlığın görsel gelişimi gösterilmelidir.

Küçük iPhone ekranlarında bütün bilgiler aynı anda gösterilmeye çalışılmamalıdır.

Gelişmiş bilgiler açılabilir panellerde sunulabilir.

Arayüz:

- Tek elle kullanılabilir
- Parmakla kontrolü rahat
- Animasyonları akıcı
- Metinleri okunaklı
- Safe Area uyumlu
- VoiceOver destekli
- Dynamic Type ve erişilebilirlik dikkate alınmış
- Türkçe ve İngilizceye uygun

olmalıdır.

Kart seçimlerinde dokunma veya uygun olduğunda kaydırma hareketi kullanılabilir.

Kullanıcı seçim sonucunu görmeden otomatik olarak sonraki karta geçilmemelidir.

---

### 17. HAFTALIK LİDERLİK TABLOSU

Oyuncuların birbirleriyle yarışabilecekleri küresel bir liderlik tablosu bulunmalıdır.

Temel kategori:

**En Uzun Hayatta Kalan Uygarlık**

Ana sıralama metriği, adil karşılaştırma için hayatta kalınan geçerli oyun turu sayısıdır.

Çağların birbirinden farklı tarihsel uzunlukları nedeniyle ham takvim yılı tek başına sıralama kriteri olmasın.

Ek göstergeler:

- Ulaşılan en yüksek çağ
- Lider olarak geçirilen tur
- En uzun kesintisiz liderlik
- Tamamlanan büyük tarihsel başarılar

Liderlik tablosunun temel işleyişi:

1. Apple Game Center kullan.
2. Haftalık sıfırlanan recurring leaderboard yapılandır.
3. Her haftanın başlangıcını Pazartesi 00:00 UTC olarak tanımla.
4. Haftalık dönemleri yedi günlük aralıklarla yönet.
5. Mevcut haftanın oyuncularını göster.
6. Oyuncunun kendi sırasını göster.
7. İlk oyuncuları görsel olarak öne çıkar.
8. Game Center girişinin başarısız olması durumunda çevrimdışı oyunu engelleme.

Liderlik tablosunun özel bir görsel arayüzü olmalı.

Örneğin:

- İlk sıra altın
- İkinci sıra gümüş
- Üçüncü sıra bronz
- Diğer oyuncular normal sıralama

Oyuncunun kişisel rekorunu ayrıca sakla.

**Haftalık Mücadele** modu oluştur.

Bu modda bütün oyuncular aynı haftalık dünya seed'i ve aynı başlangıç koşullarıyla başlar.

Böylece oyuncuların stratejik kararları daha adil biçimde karşılaştırılabilir.

Normal hikâye modu ile haftalık rekabet modu ayrı tutulmalıdır.

Haftalık mücadele skorunu, yalnızca ilgili haftada oynanan geçerli turlar üzerinden hesapla.

Hafta bittiğinde devam eden mücadeleyi yeni haftanın skoruna taşımamalısın. Oyuncunun ilerlemesi istenirse derecesiz hikâye olarak devam ettirilebilir.

Skor gönderimini güvenilir ve tekrar denemeye uygun tasarla.

Devam eden oyunlarda yeni kişisel en yüksek geçerli tur sayısına ulaşıldığında uygun kontrol noktalarında skor gönderilebilir.

Ödül veya gerçek para içeren rekabet bulunmamalıdır.

Game Center'ın istemci tarafından gönderilen skorlarının tek başına güçlü hile önleme garantisi sunmadığını kabul et. Gerekli olduğunda sunucu taraflı doğrulama eklenebilecek biçimde servis katmanını soyutla.

Game Center'ın App Store Connect üzerinde manuel yapılandırılması gereken ayarlarını belgelerle açıkla; kullanıcı hesabı olmadan bunları yapılmış gibi gösterme.

---

### 18. OYUN SONU VE TEKRAR OYNANABİLİRLİK

Oyun sadece istatistiklerin sıfıra düşmesiyle bitmemelidir.

Farklı sonlar oluştur.

Örnekler:

- Açlık ve kıtlık
- Salgın hastalık
- Hanedan çöküşü
- Büyük isyan
- Düşman istilası
- Ekonomik çöküş
- Çevresel felaket
- Nükleer felaket
- Yapay zekâ kontrolünün kaybedilmesi
- Uzay kolonisinin isyanı
- Uygarlığın yıldızlara yayılması
- İnsanlığın kolektif dijital bilince dönüşmesi
- Barışçıl teknolojik gelişim
- Tarihin unutulmuş bir uygarlığa dönüşmesi

En az 30 farklı büyük son durum veya kader varyasyonu oluştur.

Ölüm veya uygarlık sonu ekranı, oyuncunun geçmiş kararlarını bir tarih anlatısı şeklinde özetlemelidir.

Örneğin:

"Bir mağarada yakılan küçük ateş, binlerce yıl sonra yıldızlara ulaşan bir uygarlığın başlangıcı oldu."

Bu metin oyuncunun gerçek kararlarına göre dinamik oluşturulmalıdır.

Oyun sonunda:

- Toplam hayatta kalınan tur
- Ulaşılan çağ
- Toplam liderlik süresi
- En önemli kararlar
- Yaşanan büyük felaketler
- Yapılan teknolojik keşifler
- Uygarlığın son kaderi

gösterilmelidir.

Yeni oyuna başlamak kolay olmalıdır.

Tekrar oynanabilirliği artırmak için farklı başlangıç özellikleri, rastgele karakter nitelikleri, gizli senaryolar, alternatif siyasi gelişimler ve nadir kartlar ekle.

---

### 19. DENGE VE ZORLUK TASARIMI

Oyunun çok kolay olması istenmiyor.

Oyuncu bütün çağları ilk denemesinde rahatça geçememelidir.

Fakat zorluk yalnızca adaletsiz rastgele ölümlerden kaynaklanmamalıdır.

Başlangıç için aşağıdaki zorluk modlarını destekle:

- Normal
- Zor
- Haftalık standart mücadele

İlerleyen dönemlerde karşılaşılan krizler daha karmaşık olmalıdır.

İlk çağlarda hayatta kalma ve gıda baskısı ön planda olmalı.

Orta çağlarda diplomasi, yönetim, savaş ve toplum dinamikleri önem kazanmalı.

Gelecekte ise gelişmiş teknolojiye bağlı riskler, etik tercihler ve sistemik krizler ortaya çıkmalıdır.

Kaynak üretimi ve tüketimi her tur simüle edilmelidir.

Sürekli hiçbir maliyet ödemeden tur ilerletip sıralamada yükselmeye izin verme.

Kart tekrarlarını sınırla ve aynı olayın çok kısa süre içinde yeniden çıkmasını engelle.

Oyun sonunda tamamen şansa dayalı bir skor yerine beceri, risk yönetimi ve stratejik kararların belirleyici olmasını hedefle.

Otomatik simülasyon testleriyle:

- Ortalama hayatta kalma süresi
- Farklı çağlara erişim oranları
- Ölüm nedenlerinin dağılımı
- Kart çeşitliliği
- Kaynak dengesi
- Rakiplerin baskısı
- Aşırı güçlü stratejiler

ölçülmelidir.

Denge parametreleri kodun farklı yerlerine dağılmış sabitler yerine yapılandırılabilir veriler üzerinden yönetilmelidir.

---

### 20. TEKNİK MİMARİ

Öncelikli teknolojiler:

- Swift
- SwiftUI
- SpriteKit
- GameKit
- AVFoundation
- Core Haptics
- Codable tabanlı veri modelleri
- Xcode proje yapısı
- XCTest
- GitHub Actions macOS CI

SwiftUI ile ana uygulama ekranlarını oluştur.

SpriteKit ile:

- Kart animasyonları
- Parçacık efektleri
- Çağ geçişleri
- Hareketli arka planlar
- Özel görsel olaylar

geliştir.

Oyun kurallarını arayüzden bağımsız saf Swift bileşenlerinde tut.

Aşağıdaki modüllere benzer bir mimari kur:

**Core**

GameState, EraSystem, StatsSystem, TimeSystem, SeededRandom, SaveGame.

**Narrative**

CardEvent, Choice, Outcome, EventSelector, StoryChain, WorldHistory, DelayedEffects.

**Simulation**

EconomySystem, PopulationSystem, LeadershipSystem, FactionSystem, TechnologySystem.

**Presentation**

CardView, CardAnimationCoordinator, EraTransitionScene, SettlementScene, MainMenu.

**Services**

AudioManager, HapticManager, PersistenceService, GameCenterService, LocalizationService.

**Content**

EraData, CardDatabase, ArtManifest, AudioManifest, TechnologyDefinitions.

**Testing**

UnitTests, IntegrationTests, ContentValidation, SimulationTests.

İsimlerde gerekli iyileştirmeleri yapabilirsin fakat sorumlulukları temiz biçimde ayrıştır.

Kartların tümünü Swift dosyalarına sabit olarak yazma.

Veriler kolayca genişletilebilmeli ve doğrulanabilmelidir.

Kayıt dosyalarının sürümlendirilmesi ve şema değişikliklerinde veri taşınması desteklenmelidir.

Kayıt yazma işlemleri güvenli ve mümkün olduğunca atomik olmalıdır.

Harici üretken yapay zekâ API'si olmadan temel hikâye modu tamamen oynanabilir olmalıdır.

Çevrimdışı çalışma temel gereksinimdir.

Windows ortamında geliştiriliyorsa Windows üzerinde iOS derlemesinin yapılabildiğini varsayma. Uygun macOS/Xcode ortamı veya GitHub Actions macOS runner üzerinden gerçek derleme ve test gerçekleştirilecek bir süreç oluştur.

---

### 21. KART ÜRETİM VE KALİTE KONTROL ARAÇLARI

Yüzlerce kartın yönetilebilmesi için bir içerik geliştirme sistemi oluştur.

Sistem şu görevleri yerine getirebilmeli:

- Yeni kart JSON dosyası oluşturma
- Kart şemasını doğrulama
- Aynı ID'yi kullanan kartları bulma
- Eksik açıklama veya seçimleri yakalama
- Eksik illüstrasyonları belirleme
- Eksik ses varlıklarını belirleme
- Eksik çevirileri tespit etme
- Ulaşılamayan olay zincirlerini bulma
- Geçersiz koşulları kontrol etme
- İmkânsız seçimleri tespit etme
- Olasılıkların toplamını doğrulama
- İstatistik sınırlarını kontrol etme
- Kartların tekrar oranlarını raporlama
- Benzer veya yinelenen olay içeriklerini işaretleme

Otomatik testler senaryoların anlatı kalitesini tamamen garanti edemez.

Bu nedenle editoryal kontrol raporları oluştur.

Her dönemdeki kartların tematik doğruluğu, dramatik kalitesi ve tarihsel bağlamı ayrıca kontrol edilebilir olmalıdır.

800 kartlık hedefe yalnızca tekrar eden şablonları çoğaltarak ulaşma.

---

### 22. OYUN DENEYİMİ VE EK ÖZELLİKLER

Oyuncunun geçmişini inceleyebileceği **Uygarlık Tarihim** ekranı oluştur.

Bu ekranda önemli olayların kronolojik kaydı gösterilmeli.

Örnek:

- İlk kabile lideri seçildi.
- İlk yerleşim kuruldu.
- Büyük kıtlık yaşandı.
- Bronz işleme keşfedildi.
- Bir krallık kuruldu.
- İmparatorluk bölündü.
- Sanayi Devrimi gerçekleşti.
- Yapay zekâ konseyi oluşturuldu.

Oyun bitince geçmişi paylaşılabilir bir özet kartına dönüştürmek mümkün olmalı.

Ayrıca:

- Keşfedilen kartları gösteren koleksiyon
- Kilitli nadir senaryolar
- Game Center başarımları
- Ulaşılan çağ rozetleri
- En uzun liderlik başarımları
- Tekrar oyun geçmişi
- Ses ve titreşim ayarları
- Erişilebilirlik ayarları

ekle.

Tüm bu özellikler ana oyun mekaniğini gereksiz karmaşıklaştırmamalıdır.

---

### 23. GELİŞTİRME YOL HARİTASI

Bütün projeyi aşağıdaki aşamalar halinde uygula.

**AŞAMA 0 — PROJE ANALİZİ VE TASARIM BELGELERİ**

- Mevcut depoyu incele.
- Gerekli teknoloji ve mimari kararlarını ver.
- Oyun tasarım belgesini oluştur.
- Kart veri şemasını tasarla.
- 12 çağın anlatı ve görsel rehberini oluştur.
- Geliştirme görevlerini ve kabul kriterlerini dosyalara kaydet.
- İlk gerçek uygulama kodlarına geç.

**AŞAMA 1 — ÇALIŞAN OYUN TEMELİ**

- iOS projesini oluştur.
- Ana menüyü geliştir.
- GameState sistemini uygula.
- Kart gösterme ve karar verme sistemini geliştir.
- İstatistiklerin güncellenmesini sağla.
- Seed tabanlı olasılık motorunu geliştir.
- Kayıt ve devam etme özelliğini oluştur.
- İlk özgün test olaylarını ekle.
- Bir oyunun başlayıp bitebildiğini doğrula.

**AŞAMA 2 — İLK ÜÇ ÇAĞ**

- Paleolitik, Neolitik ve Tunç Çağı sistemlerini tamamla.
- Bu çağlar için toplam en az 180 özgün olay oluştur.
- İlk liderlik rakiplerini ekle.
- Yerleşim gelişimini çalışır hale getir.
- İlk uzun vadeli karar zincirlerini uygula.
- İlgili kart görsellerini, çağ temalarını ve animasyon sistemlerini entegre et.
- Çağ geçişlerini test et.

**AŞAMA 3 — TARİHSEL UYGARLIKLAR**

- 4–8. çağları geliştir.
- Bu çağlar için toplam en az 300 özgün olay oluştur.
- Diplomasi, gelişmiş yönetim, ticaret, savaş ve bilim sistemlerini genişlet.
- Teknoloji ağacını geliştir.
- Büyük tarihsel sonuç zincirlerini ekle.
- Bu çağların görsel, animasyon ve ses tasarımlarını entegre et.

**AŞAMA 4 — MODERN VE GELECEK ÇAĞLARI**

- 9–12. çağları geliştir.
- Toplam en az 240 özgün olay oluştur.
- Modern politik sistemleri ekle.
- Dijital ekonomi, otomasyon, yapay zekâ ve uzay kolonisi mekaniklerini geliştir.
- Bilimkurgu döneminin alternatif gelişim yollarını oluştur.
- Büyük uygarlık sonlarını tasarla.

**AŞAMA 5 — ÖZEL SENARYOLAR VE BAĞLANTILAR**

- En az 80 ilave özgün özel olay ekle.
- Kart sayısını minimum 800'e ulaştır.
- En az 100 olay zincirini tamamla.
- En az 50 çağlar arası etki bağlantısını doğrula.
- En az 30 özgün son durumu oluştur.
- Hikâye zincirlerinin tutarlılığını kontrol et.
- İçerik tekrarlarını tespit et ve iyileştir.

**AŞAMA 6 — PREMIUM GÖRSEL VE SES TAMAMLAMA**

- MonKeyBonKey Games logosunu ve açılışını tamamla.
- The Cards of Fate oyun logosunu ve uygulama ikonunu tamamla.
- Tüm kart görsellerini gözden geçir.
- Eksik özgün illüstrasyonları tamamla.
- Çağlara özel kart çerçevelerini geliştir.
- Bütün seçim animasyonlarını doğrula.
- Müzik ve efektleri entegre et.
- Ses, animasyon ve titreşim uyumunu ayarla.
- Görsel performansı optimize et.

**AŞAMA 7 — GAME CENTER VE HAFTALIK REKABET**

- Game Center servis katmanını geliştir.
- Kullanıcı kimlik doğrulamasını entegre et.
- Haftalık sıralama ekranını oluştur.
- Haftalık challenge seed sistemini geliştir.
- Rekabet skorlarını doğrula ve gönder.
- Bağlantı hatalarını ele al.
- App Store Connect yapılandırma rehberini hazırla.

**AŞAMA 8 — TEST VE DENGE**

- En az 10.000 otomatik seed tabanlı simülasyon çalıştır.
- Oyun sonu ve çağ erişim istatistiklerini analiz et.
- Bütün kart koşullarını doğrula.
- Kırık senaryo zincirlerini düzelt.
- Kayıt yükleme hatalarını test et.
- Ekran boyutlarını ve metin taşmalarını kontrol et.
- Animasyon performansını test et.
- Ses ve haptik kapatıldığında hata oluşmadığını doğrula.
- Çevrimdışı modu test et.
- Türkçe ve İngilizce arayüz kontrollerini yap.
- Erişilebilirlik testlerini gerçekleştir.

**AŞAMA 9 — YAYIN HAZIRLIĞI**

- Release yapılandırmasını oluştur.
- Gizlilik ve gerekli izinleri denetle.
- Kullanılan asset'lerin lisans kayıtlarını oluştur.
- App Store açıklamalarını hazırla.
- Ekran görüntüsü planını oluştur.
- Uygulama ikonu ve gerekli metadata'yı kontrol et.
- TestFlight sürecini belgele.
- Gerçek cihazda test gerektiren başlıkları açıkça listele.
- Tüm kabul kriterlerini raporla.

---

### 24. HER AŞAMA İÇİN KABUL KRİTERLERİ

Her geliştirme aşamasının sonunda aşağıdaki sorulara yanıt ver:

1. Planlanan işlevler gerçek dosyalarda uygulandı mı?
2. Uygulama derlenebiliyor mu? Gerçek derleme kanıtı mevcut mu?
3. İlgili otomatik testler başarılı mı?
4. Oluşturulan kartların veri şemaları geçerli mi?
5. Kartlar beklenen istatistik etkilerini oluşturuyor mu?
6. Seçim animasyonları çalışıyor mu?
7. Eksik görsel ve ses dosyası var mı?
8. Kayıt sistemi güvenilir çalışıyor mu?
9. Yeni kod eski sistemleri bozuyor mu?
10. Tamamlanamayan görevler açıkça belgelendi mi?

Testi yapılamayan bir gereksinimi doğrulanmış kabul etme.

Her aşamada:

- Tamamlanan dosyaları
- Yapılan önemli değişiklikleri
- Test sonuçlarını
- Açık problemleri
- Sonraki aşamanın görevlerini

`docs/PROGRESS.md` dosyasına kaydet.

Gerekirse görevleri daha küçük parçalara böl fakat kapsamı sessizce küçültme.

Her aşamayı tamamladığında sonraki aşamaya kendi planın üzerinden devam et.

---

### 25. KALİTE VE TESLİM STANDARTLARI

Bu projeyi yalnızca yazılım demosu olarak değerlendirme.

Hedef, gerçek kullanıcıların uzun süre oynamak isteyeceği, App Store'da yayınlanabilecek bir oyun oluşturmaktır.

Tamamlanmış kabul edilecek sistem:

- Baştan sona oynanabilir olmalı.
- Kararlar gerçekten farklı sonuçlar üretmeli.
- Liderlik mücadeleleri anlamlı olmalı.
- Çağlar birbirinden farklı hissettirmeli.
- Senaryolar aynı olayları sürekli tekrar etmemeli.
- Kart görselleri yüksek kaliteli olmalı.
- Seçimler görsel ve işitsel geri bildirim sağlamalı.
- Oyun sonu tekrar oynamak için motivasyon oluşturmalı.
- Haftalık rekabet oyuncular arasında çalışmalı.
- Çevrimdışı hikâye modu bulunmalı.
- Kayıtlar güvenilir olmalı.
- Arayüz iPhone'da akıcı çalışmalı.
- Tüm temel özellikler testlerle desteklenmeli.

Son durumda aşağıdaki çıktıları oluştur:

- Çalışan iOS proje yapısı
- Swift kaynak kodları
- Kart veritabanı
- Senaryo ve teknoloji tanımları
- Görsel ve ses varlıkları
- Logo ve uygulama ikonu
- Animasyon sistemleri
- Testler
- macOS CI iş akışı
- Geliştirme belgeleri
- App Store yayın hazırlığı belgeleri
- Açık eksiklikler ve test kanıtlarını içeren son durum raporu

Herhangi bir harici araç, hesap veya gerçek cihaz erişimi eksikse bu sınırlamayı belirt. Bunun dışındaki geliştirilebilir işleri durdurma.

---

### 26. SON TALİMAT — UYGULAMAYA BAŞLA

Bu metni yalnızca yorumlanacak bir oyun fikri olarak değil, uygulayacağın geliştirme spesifikasyonu olarak kabul et.

İlk iş olarak depoyu analiz et, gerekli proje belgelerini oluştur ve hemen ardından gerçek oyun motoru ile iOS uygulama dosyalarını geliştirmeye başla.

Tek bir aşamaya odaklanıp geri kalan projeyi unutma.

Projenin tamamı için tutarlı teknik mimari, kart veri standardı, sanat yönetimi ve oyun mekaniği uygula.

Gereksiz bağımlılık oluşturma. Önce temel sistemleri sağlamlaştır, sonra içeriği ve görsel kaliteyi genişlet.

800 kartı hızlıca sayısal hedefi doldurmak için yüzeysel şekilde oluşturma. Oyun içeriğinin dramatik, stratejik ve anlatısal niteliğini koru.

Kullanıcıdan rutin teknik kararlar için onay bekleme. Makul tercihleri yap ve kaydet. Yalnızca gerçek erişim veya ticari karar gerektiren engelleri bildir.

Çalışma oturumu veya bağlam sınırına ulaşırsan devam etmek için gerekli bütün bilgileri projeye kaydet. Tamamlanmamış işleri başarıyla sonuçlanmış gibi sunma.

**Nihai hedef: The Cards of Fate'i özgün kimliği, yüzlerce anlamlı senaryosu, birbirine bağlı tarihsel kararları, sinematik kart animasyonları, etkileyici müzikleri ve haftalık rekabeti olan, gerçekten oynanabilir bir iPhone oyununa dönüştür.**

**START IMPLEMENTATION NOW.**