# THE CARDS OF FATE — DEVELOPMENT CONTINUATION
## MonKeyBonKey Games | Production Development

The Cards of Fate projesinin mevcut geliştirme sürecine devam ediyoruz.

Bu proje sıfırdan başlamıyor. Daha önce tanımlanan oyun vizyonu, mimari, senaryolar ve geliştirme yol haritası aynen korunacak.

### MEVCUT GITHUB DURUMU

Repository:
https://github.com/srcnxylmz/the-cards-of-fate

Son doğrulanmış commit:
`2287550`

Başarılı GitHub Actions:
https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/42840005380

Doğrulanan durum:

- iOS Simulator build başarılı.
- Uygulama Simulator'da açılıyor.
- Türkçe ve İngilizce arayüz testleri başarılı.
- 19 Swift testi başarılı.
- 18 içerik testi başarılı.
- 30.000 oyun simülasyonu tamamlandı.
- Kart seçimleri ve kayıt geri yükleme test edildi.
- 36 özgün olay kartı mevcut.
- İlk üç çağda oyun içeriği bulunuyor.
- Rakip fraksiyon sistemi geliştirilmeye başlandı.

### TEMEL TALİMATLAR

Önce şu dosyaları oku:

- `docs/MASTER_SPEC.md`
- `docs/MASTER_PLAN.md`
- `docs/PROGRESS.md`
- `docs/BALANCE_REPORT.md`
- `docs/GAME_DESIGN.md`
- `docs/CONTENT_BIBLE.md`
- `docs/ART_DIRECTION.md`
- `docs/UI_TESTING.md`
- `docs/QA_REPORT.md`

Bütün geliştirmeleri mevcut mimari üzerinden sürdür.

Çalışan özellikleri yeniden yazma. Mevcut save formatını, eski kayıtların uyumluluğunu ve deterministik simülasyon yapısını koru.

Yerel Git değişikliklerini incele, gerekirse uzak depoyla güvenli biçimde eşitle. Force push yapma.

Yeni çalışmaların her birini test edilebilir alt görevlere böl.

## AŞAMA 1 — KRİTİK DENGE VE LİDERLİK İYİLEŞTİRMELERİ

Öncelikle son denge raporundaki önemli problemleri çöz.

Mevcut ölçümler:

- Survival tekrar oranı: %84,28
- Knowledge tekrar oranı: %88,19
- Survival sürgün oranı: %18,53
- Önceki survival sürgün oranı: %1,64
- Knowledge stratejisinde 500 tur sınırına ulaşan oyunlar: 1.446 / 10.000

Bu değerleri başlangıç referansı olarak al.

Rakip sisteminin sürgün oranını neden bu kadar artırdığını araştır.

Sadece rakip baskısını düşürerek problemi gizleme.

Önce aşağıdaki sistemleri incele:

- Otorite kazanımı ve kaybı
- Rakip fraksiyon güç artışı
- Dört turda bir gerçekleşen meclis baskısı
- Kararların fraksiyon ilişkilerine etkisi
- Liderlik kaybetme koşulları
- Liderliğe yeniden dönme koşulları
- Nesil değişiminin otorite üzerindeki etkisi
- Stratejilerin bu ilişkileri yönetebilme imkânı

Sorunun nedenlerini ölç ve testlerle doğrula.

### Liderlik sistemini derinleştir

Oyuncunun rakiplerle anlamlı etkileşim kurabilmesini sağla.

Şu mekanikleri geliştir:

1. Fraksiyon desteği kazanma.
2. Fraksiyonlar arasında ittifak kurma.
3. Rakiplerin birbirleriyle anlaşmazlığa düşmesi.
4. Oyuncuya destek veren fraksiyonların avantajları.
5. Oyuncuya karşı birlik oluşturan fraksiyonların etkileri.
6. Halk desteği veya meşruiyetin liderliğe etkisi.
7. İktidardan uzaklaştırılma ve iktidarı geri kazanma.
8. Nesiller değişirken siyasi mirasın korunması.

Yeni sistemler kolayca istismar edilmemeli.

Oyuncunun her dört turda otomatik olarak kaçınılmaz ceza aldığı bir döngü oluşmamalı.

Düşmanlıkları yönetebileceği gerçek stratejik seçenekler bulunmalı.

Bütün kuralları açıklanabilir ve veri odaklı tasarla.

İlk üç çağdaki fraksiyonların farklı motivasyonları bulunmalı.

Yeni modelleri eski kayıtlarla uyumlu şekilde geliştir.

### Denge doğrulaması

Değişikliklerden önce ve sonra aynı seed setleri üzerinde karşılaştırma yap.

Üç politika için 10.000'er simülasyonu tekrar çalıştır.

Sürgün oranı, ortalama hayatta kalma süresi, çağ erişimi, kart çeşitliliği ve 500 tur sınırına ulaşma oranlarını karşılaştır.

Yalnızca simülasyon sayılarına bakarak oyunu dengeli ilan etme; mevcut yapay stratejilerin fraksiyonları aktif yönetmediğini de hesaba kat.

Sonuçları `BALANCE_REPORT.md` içine kaydet.

## AŞAMA 2 — İLK ÜÇ ÇAĞIN SENARYOLARINI GENİŞLET

Mevcut 36 kartı koru.

İlk ara hedef toplam 90 özgün kart.

Sonraki hedef ilk üç çağ için toplam 180 kart:

- Paleolitik: en az 60 kart
- Neolitik: en az 60 kart
- Tunç Çağı: en az 60 kart

Kartları tek seferde şablon çoğaltarak üretme.

Her geliştirme grubunda 10–15 adet gerçekten özgün kart oluştur, doğrula ve oyuna entegre et.

Her kartın:

- Özgün hikâyesi
- Tarihsel bağlamı
- Anlamlı iki veya daha fazla seçimi
- İstatistik etkileri
- Karar riskleri
- Fraksiyon etkileri
- Gelecekte gerçekleşebilecek sonuçları
- Türkçe ve İngilizce metinleri
- Özgün görsel üretim brief'i
- Ses ve animasyon tanımları

bulunmalıdır.

Özellikle mevcut yedi senaryo zincirini gerçek anlamda tamamlamaya odaklan.

Örneğin Paleolitik Çağ'daki bir karar Neolitik Çağ'da önemli bir olayı açabilmeli, Tunç Çağı'nda yeni bir sonuca neden olabilmelidir.

Aynı karar farklı oyun durumlarında farklı sonuçlara yol açabilmelidir.

Oyuncunun geçmişte verdiği kararları oyun tarihi üzerinden doğru takip et.

Senaryo zincirlerinin erişilebilir olduğunu otomatik testlerle doğrula.

Sadece aynı `storyChainId` değerini paylaşan olayları tamamlanmış hikâye zinciri sayma.

### Kart tekrarlarını azalt

Mevcut unseen-first algoritmasını koruyarak geliştir.

Olay çeşitliliğini artırmak için:

- Daha fazla benzersiz olay
- Fraksiyonlara özel olay havuzları
- Yönetim durumuna özgü olaylar
- Çağa özgü krizler
- Kararlarla açılan gizli olaylar
- Tek seferlik önemli olaylar
- Gecikmeli sonuçların yeni kart tetiklemesi
- Mevcut kaynak durumuna göre değişen olaylar

ekle.

Aynı karta tekrar ulaşmanın yalnızca hikâye açısından anlamlı olduğu durumlarda izin ver.

Kart havuzu yetersiz olduğunda mekanizmanın neden tekrar ürettiğini raporla; tekrarları yalnızca rastgele ağırlıklarla gizleme.

## AŞAMA 3 — PREMIUM KART DENEYİMİ

Oyunun görsel kalitesini artık geliştirme sürecinin aktif bir parçası haline getir.

Bütün görselleri ve animasyonları son aşamaya erteleme.

Öncelikle ilk 12–20 önemli kart üzerinde yüksek kaliteli görsel deneyimi tamamla.

Sanat tarzı:

Cinematic Historical Fantasy Illustration + Premium Collectible Card Art.

Her kartın konusu ile uyumlu özgün bir illüstrasyonu olmalı.

Görsellerin tarihsel dönemi, karakterleri, ışığı, renkleri ve atmosferi doğru temsil etmesini sağla.

Kart metinlerini görselin içine çizme.

Görsel üretim aracı erişimin varsa özgün asset'leri üret, projeye entegre et ve üretim kayıtlarını tut.

Böyle bir araca erişimin yoksa ayrıntılı görsel üretim brief'leri hazırlayıp gerçek asset eksiklerini kaydet. Geçici görselleri tamamlanmış sanat olarak işaretleme.

### Animasyon sistemi

Kart seçiminde oyuncuya fiziksel ve sinematik bir etkileşim hissi vermek istiyorum.

İlk aşamada:

- Kartın ekrana gelişi
- Seçim yönüne eğilmesi
- Karara göre hareket etmesi
- Başarı animasyonu
- Başarısızlık animasyonu
- Liderlik kazanma ve kaybetme animasyonu
- İstatistik değişim animasyonu
- Çağ geçiş animasyonu

gerçek oynanışa bağlanmalı.

Animasyonlar yalnızca dekoratif olmamalı; gerçekleşen olayın türüne göre değişmeli.

SpriteKit ve SwiftUI entegrasyonunu optimize et.

Reduce Motion ayarını destekle.

### Ses sistemi

Temel karar sesinden başlayarak özgün ses efektlerini genişlet.

İlk görsel kalite aşamasında:

- Kart açılış sesi
- Kart seçim sesi
- Başarı sesi
- Başarısızlık sesi
- Liderlik kazanma sesi
- Liderlik kaybı sesi
- Teknoloji keşfi sesi
- Çağ atlama sesi

oluştur ve ilgili animasyonlara bağla.

Gerçek ses dosyaları veya özgün sentez kullan. Henüz üretilmemiş dosyaları teslim edilmiş gibi raporlama.

### MonKeyBonKey Games

Stüdyo kimliğini de aktif geliştirme kapsamına al.

Özgün maymun maskotu, profesyonel MonKeyBonKey Games logosu, açılış animasyonu ve kısa stüdyo ses imzası için asset üretim çalışmalarını başlat.

Oyunun kendi The Cards of Fate logosu ayrı olmalıdır.

Debug derlemesinde AppIcon eksikliğini geçici olarak aşan yapılandırma mevcut. Gerçek uygulama ikonunun hazırlanması ve Release yapılandırmasında doğrulanması hâlâ yapılmalıdır.

## AŞAMA 4 — iPHONE ARAYÜZÜ VE OTOMATİK TESTLER

Mevcut başarılı GitHub Actions altyapısını kullanmaya devam et.

Her önemli geliştirmede iOS Simulator derlemesi ve arayüz testlerini doğrula.

Test kapsamını genişlet:

1. Liderlik/meclis panelinin açılması.
2. Fraksiyon bilgilerinin doğru gösterilmesi.
3. Liderlik kaybı ve yeniden kazanılması.
4. Uzun kart açıklamalarının küçük ekranlarda düzgün gösterilmesi.
5. Karar seçeneklerinin her zaman erişilebilir olması.
6. Çağ geçişi ekranı.
7. Türkçe ve İngilizce metinler.
8. Save/load uyumluluğu.
9. Dynamic Type ve Reduce Motion davranışları.
10. Hata durumunda kullanıcının ilerlemesinin korunması.

Mevcut iPhone UI testlerinde yalnızca ana oyun döngüsünün doğrulandığını unutma.

Özellikle meclis paneli ve uzun metinli kartlar için yeni ekran görüntüleri üret.

GitHub Actions artifact çıktılarında:

- Ana menü
- Olay kartı
- Seçim sonucu
- Liderlik paneli
- Çağ geçişi
- Oyun sonu

ekranları uygun test koşulları oluştuğunda yer alsın.

Küçük ekranlarda ikinci karar seçeneğinin ulaşılabilirliğini ayrıca kontrol et.

Gerçek ekran görüntülerini incelemeden görsel kaliteyi onaylama.

## AŞAMA 5 — ANA PLANA DEVAM

İlk üç çağın oynanış kalitesi doğrulandıktan sonra ana geliştirme belgesi olan `MASTER_SPEC.md` üzerinden diğer çağlara geç.

Nihai kapsam değişmiyor:

- 12 farklı çağ
- Minimum 800 özgün olay kartı
- Minimum 100 tamamlanmış senaryo zinciri
- Minimum 50 çağlar arası bağlantı
- Minimum 30 farklı uygarlık sonu
- Kaliteli kart illüstrasyonları
- Çağlara özgü müzik ve ses efektleri
- Liderlik ve rakip sistemi
- Uygarlık ve yerleşim gelişimi
- Haftalık Game Center liderlik tablosu
- MonKeyBonKey Games açılışı

Haftalık rekabet için oyun sürümü ve denge parametrelerinin aynı hafta boyunca bütün oyuncular için adil karşılaştırma sağlamasına dikkat et.

Game Center gerçek bağlantısının Apple Developer/App Store Connect yapılandırması gerektirdiğini unutma.

## GELİŞTİRME VE DOĞRULAMA PROSEDÜRÜ

Her anlamlı görev grubunda:

1. Gerçek kaynak kodlarını ve verileri değiştir.
2. İçerik doğrulama testlerini çalıştır.
3. Swift testlerini çalıştır.
4. Gerekli simülasyonlarla önceki durumu karşılaştır.
5. Git commit oluştur.
6. Yetkin varsa GitHub'a push et.
7. GitHub Actions sonucunu doğrula.
8. macOS/iOS test hatalarını düzelt.
9. İlerlemeyi `docs/PROGRESS.md` içine kaydet.
10. Sıradaki görev grubuna geç.

Mevcut kullanıcı değişikliklerini kaybetme.

Çalışmayan özellikleri tamamlanmış olarak işaretleme.

Kaynak kodu ve içerik sayısını artırırken kaliteyi düşürme.

Özellikle denge testlerini bozmadan ilerle.

Bir aşama tamamlanmadan diğerine kontrolsüz biçimde geçme. Ancak yalnızca plan üretip uygulamayı erteleme.

### İLK YAPMAN GEREKEN İŞ

Mevcut GitHub HEAD durumunu doğrula.

Ardından son `BALANCE_REPORT.md` dosyasındaki sürgün oranı artışını araştır.

Rakip liderlik sistemindeki problemi çöz, fraksiyonların oyuncu tarafından yönetilebilmesini sağlayan ilk destek/ittifak mekaniğini uygula ve gerekli regresyon testlerini ekle.

Sonra ilk üç çağ için senaryo genişletme çalışmalarına devam et.

Her önemli aşamada gerçek iOS derlemesini doğrula.

**Ana hedefimiz yalnızca çalışan kod değil; oyuncunun kararlarını gerçekten önemsediği, görsel ve işitsel olarak kaliteli, derinlikli bir uygarlık ve kader oyunu geliştirmek.**

Şimdi mevcut depoda gerçek geliştirmeye başla.