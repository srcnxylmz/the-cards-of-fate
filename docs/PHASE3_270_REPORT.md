# Phase 3 — 255 → 270 paketi: güçlü imparatorluğun geç oyun krizleri ve ilk tarihsel dönüm noktası (Era 4 hâlâ kapalı)

Tarih: 2026-11-21 · Yazar: Claude · Dal: `phase3-era4-270` (taban: birleştirilmiş `main` `065e39a`). SHA'lar, CI ve PR için: [HANDOFF_270.md](HANDOFF_270.md). Birleştirme raporu: [PHASE3_MAIN_INTEGRATION.md](PHASE3_MAIN_INTEGRATION.md). Açılış değerlendirmesi: [ERA4_LAUNCH_CANDIDATE.md](ERA4_LAUNCH_CANDIDATE.md).

## 1. Özet

- **Kart ve karar:**
  - 270 kart (60/60/60/90), 775 karar (+60).
  - 245 statik çağlar arası bağlantı (+15).
  - Doğrulayıcı 0 hata, 0 uyarı.
- **Era 4 envanteri:** 90 olay; 55 tekrarlanabilir, 17 sonuç, 17 köprü, 1 reform.
- **Kapılar:** `ERA4_GATE.enabled:false` ve `balanceEvidence:null` değişmedi. Era 5 kapalı.
- **Kanıt düzeni:**
  - 255 paketinin 255 kartı birebir korundu.
  - Eski kart, politika puanlaması, `powerStats` ve 500 karar sınırı değişmedi.
  - `balance.json`'a yalnız `eraMilestones` eklendi; `politics.json` aynı.
- **Normal oyun:** değişmedi. Altı politika × 10.000 seed, 255 ile birebir aynı; tek fark kart sayısı. İlk üç çağın değişmezliğini bir Swift testi de doğruluyor.
- **Yeni:**
  - Dokuz geç oyun krizi. Her biri görünür bir nedenle açılıyor ve önceden hazırlık yapanlara daha ucuz bir cevap sunuyor.
  - İlk koşullu tarihsel dönüm noktası: "Kalıcı imparatorluk". Kayda geçiyor ama oyunu bitirmiyor.
- **Düzeltme:** 255'te kamu ambarı geçmiş kaydı "(food.relieved)" diye yazılıyordu, yani Swift string interpolasyonu bozuktu. Artık karşılanan pay sayısını yazıyor; bunu bir test doğruluyor.
- **Dürüst sonuç:**
  - Krizler yatırım politikasıyla heuristik politikalar arasındaki farkı **daraltmadı**. Investment'ın sonuçları neredeyse aynı: istikrar 85, %92 500 sınırında.
  - Heuristik politikalar hafif kötüleşti: 500 sınırına ulaşma progression'da −3, recovery'de −3,5, knowledge'da −2, random'da −7 puan.
  - Asıl zorluk kaldıracının **otorite tabanı** olduğu ölçüldü (bölüm 2). Bu, sonraki pakete kanıtlı bir öneri olarak bırakıldı.

## 2. Araştırma: Antik İmparatorlukların zorluk eğrisi (255 referans, 2.000 seed)

Ölçüm `FateSimulation --diagnostic-open-era 4`'e eklendi:
- 40., 80., 160. ve 240. Era 4 kararlarında otorite, meclis savunması, en güçlü rakip, en düşük ilişki, üreten kapasite ve kurum sayısı.
- 160. karardaki yatırım bileşimi ve bu bileşimin 500 sınırına ulaşma oranı.
- Az yatırımla siyaseten istikrarlı kalan koşular.

Tablolar: [SUMMARY.md](analysis/milestone270-era4-diagnostic/SUMMARY.md).

| Soru | Ölçülen cevap |
|---|---|
| Hangi yatırım bileşimleri çok avantajlı? | Dört üretim kapasitesi ve en az üç kurum. Investment koşularının 1694/1791'i 160. kararda bu bileşimde ve hepsi 500 sınırına ulaştı. Heuristik politikalarda da bu bileşim %100 hayatta kalıyor, ama 160. karara ulaşan koşuların ancak %4–8'i oraya varıyor. |
| Bütün kurumları kurmak tek baskın strateji mi? | **Kurumlar herkesin stratejisi.** 160. kararda bütün politikalar ortalama 2,4–3,2 kuruma sahip. Ayıran şey kapasite sayısı: investment 3,9, diğerleri 2,1–2,6. |
| Neden kurum bu kadar ucuz? | **Otorite tabanı.** 80. Era 4 kararından sonra otorite investment'ta 2–3, diğer politikalarda 1 civarında. Kurumların ve tavizlerin bedeli otorite. Otorite sıfıra dayandıktan sonra bu bedel fiilen ödenmiyor. Bu, ölçülen en büyük denge açığı. |
| Üretim ve nüfus büyümesi birbirini fazla mı besliyor? | Sınırlı. Investment'ta tur sonu büyüme 100 kararda +8,7, açlık −1,3. Büyüme tavanı ve üretimin tüketimi geçmemesi korunuyor. Nüfus ortalaması 59; 62'den hafif düştü. |
| Kamu ambarı riski tamamen ortadan kaldırıyor mu? | Hayır. Tek seferlik ve her doldurma kaynak istiyor. Random'da nüfus sıfırlanması hâlâ %90. |
| İyi oyuncu 100. karardan sonra yeni risklerle karşılaşıyor mu? | 270'te evet: investment koşusu başına 54,7 kriz kararı. Hazırlıklı cevaplar ucuz olduğu için riskler sonuçta küçük kalıyor. |
| Yatırım yapmayan ama siyaseten başarılı oyuncunun yolu var mı? | Evet. Recovery'de 160. kararda en çok bir kapasitesi olup istikrarı 40 ve üzeri olan 316 koşu var; bunların 269'u 500 sınırına ulaştı. Recovery dönüm noktasını da %11 oranında kaydetti. |
| Güç dengesi 40/80/160/240'ta nasıl değişiyor? | Rakip gücü investment'ta 55 → 76 artıyor; savunma da 50 → 63 izliyor ve ilişkiler 13 → 36 iyileşiyor. Heuristiklerde otorite 40. kararda 8–36 iken 160. kararda 1'e iniyor; knowledge'da en düşük ilişki −30'dan 17'ye çıkıyor (yatıştırma). |

**Sonuç:** Investment'ın başarısı otomatik olarak "oyun kolay" demek değil; politika tutarlı ve bilgili oynuyor. Ölçülen yapısal açık ise şu: Era 4'te otorite fiilen bir kaynak olmaktan çıkıyor. Bu yüzden yetki paylaşan seçimler bedelsiz kalıyor.

Önerilen düzeltme bu pakette **uygulanmadı**. Öneri: yalnız Era 4'te, otoritenin karşılayamadığı bedel istikrardan ödensin ("meşruiyet açığı"). Bu kural heuristik politikaların zaten düşük olan istikrarını (17–25) da düşürür; politikalar ve hedefler birlikte değerlendirilmeli. Bkz. bölüm 8.

## 3. Geç oyun krizleri (dokuz tekrarlanabilir olay)

Her kriz ancak nedeni varsa çekilebiliyor. Her krizde önceki bir kararla açılan, daha ucuz bir hazırlıklı cevap ve her seçenekte gerçek bir bedel var. Kriz en fazla 12 turda bir dönüyor (`cooldown: 12`); kalıcı bir sızıntı değil, dönemsel bir baskı.

| Kart | Neden (gereksinim) | Hazırlıklı cevap | Alan |
|---|---|---|---|
| `provincial_secession` | eyalet meclisi + istikrar ≥ 45 | tahıl paktı arabuluculuğu; hane temsili | Bağımsızlık talebi |
| `border_campaign` | nüfus ≥ 55 + kaynak ≥ 20 | sivil denetimli garnizon (ambar ikmalinden ucuz, köylü harcamaz) | Sınır savaşı ve ikmal |
| `empire_epidemic` | nüfus ≥ 60 | kamu darüşşifası | İmparatorluk salgını |
| `granary_graft` | ambar defteri + kaynak ≥ 25 | meclis denetimi | Ambar yolsuzluğu |
| `tax_farm_privilege` | kaynak ≥ 30 | toprak defterine göre biçme | Vergi ve ticaret imtiyazı (iltizam 8 tur sonra −8 ile kapanır) |
| `legion_loyalty` | otorite ≤ 20 + kaynak ≥ 25 | sivil denetim yemini | Askerî sadakat |
| `governor_ambition` | devredilmiş mühür + istikrar ≥ 45 | geri çağrılabilir valilik | Valinin güç kazanması |
| `succession_legitimacy` | otorite ≤ 15 + istikrar ≥ 50 | meclis onayı; hane temsilcilerinin yasası | Ardıllık ve meşruiyet |
| `soil_exhaustion` | çiftlik + kanal + nüfus ≥ 50 | toprak defteriyle münavebe | Tarım arazisinin tükenmesi |

Merkez ile yerel meclis çatışması bir sonuç kartında işleniyor (`assembly_center_accord`).

**Köprüler** (bir Tunç Çağı kaydı → Era 4):
- `frontier_wall_muster` ← `city_walls`.
- `hostage_envoy_return` ← `hostage_prince`.
- `seed_guarantee_audit` ← `famine_receipts`.

**Sonuçlar** (bir Tunç kaydı ve tamamlanmış bir kriz):
- `assembly_center_accord` ← `gate_ward` + `provincial_secession`.
- `veteran_land_charter` ← `debt_insurance` + `border_campaign`.
- `plague_relief_reckoning` ← `ration_council` + `empire_epidemic`.

**Yeni ledger bayrakları:**
- **Haklar:** `provincial_charter_rights`, `joint_imperial_council`, `veteran_land_rights`.
- **Vadeli borçlar:** `tax_farm_contract` (−8, 8 tur), `veteran_debts` (−3, 8 tur), `plague_relief_credit` (−4, 6 tur).

**Ayar süreci (500 seed):**
- İlk sürümde krizler zayıf politikaları da vuruyordu; random'da açlık sonu +7 puandı.
- Nedenleri güç işaretlerine bağladım: istikrar, kaynak, nüfus.
- Bekleme süresini 4'ten 12'ye çıkardım.
- Nüfus kayıplarını 1'er azalttım: salgında 5 → 4 ve 4 → 3, seferde 3 → 2.
- Kart kümesini ayırarak ölçtüm. Krizsiz 255 + köprü/sonuç ve yalnız krizler, ikisi de 500 sınırını düşürüyor. Kalan etki, yeni kartların her seçeneğinin bedelli olmasından geliyor.

## 4. Tarihsel dönüm noktası: "Kalıcı imparatorluk"

**Mimari:**
- Bu bir **galibiyet değil**, kayda geçen bir çağ başarısı. Era 4 başarısı 12 çağlık oyunun tamamlandığı anlamına gelmiyor.
- Mevcut `ending` sistemi kullanılmadı; oyun sürüyor.
- Tanım veri olarak `balance.eraMilestones` içinde, isteğe bağlı bir alan: eski içerik ve kayıtlar okunabiliyor.
- Motor, tur sonunda (Era 4'te) bütün koşullar sağlanırsa iki şeyi bir kez yazıyor: v1 bayrağı `enduring_empire_recorded` ve bir geçmiş kaydı.
- Kayıt şeması değişmedi.
- Gerçek galibiyet ekranı ayrı tasarlanmalı ve henüz yok.

**Koşullar** (`GameEngine.milestoneConditions`; her biri ayrı ayrı gerekli):

| Koşul | Tanım |
|---|---|
| residence | Era 4'te en az 120 karar |
| economy | kendi üretimi tüketimi karşılıyor ve kaynak ≥ 15 |
| legitimacy | istikrar ≥ 50 ve (otorite ≥ 25 **ya da** altı kurumdan en az ikisi). İki ayrı yol var. |
| accord | hiçbir rakiple ilişki düşmanca değil (≤ −20 değil) |
| rights | on iki hak kaydından en az ikisi: hane temsili, toprak hakları defteri, ortak kanal suyu, darüşşifa, gazi toprakları… |
| obligations | açık borç veya ödenmemiş söz yok: maaş borcu, ayarı bozulmuş sikke, tapınak ve pakt ödünçleri, vergi ertelemesi, iltizam, gazi ve salgın borçları |
| history | 17 Era 4 sonucundan en az biri kararlaştırılmış |

**Doğrulama:**
- **Swift testleri** (`EmpireStrainTests`):
  - Her koşul tek tek bozulduğunda kayıt oluşmuyor.
  - Bütün istatistikler 100 olsa da tek başına bir şey kaydedilmiyor.
  - Kurum yerine otoriteyle de meşruiyet sağlanıyor.
  - Kayıt bir kez yapılıyor ve oyun bitmiyor.
  - Era 3'te kayıt oluşmuyor.
  - Kaydetme/yükleme sonrası tekrar oynatma aynı sonucu veriyor.
- **Teşhis** (2.000 seed):

| Politika | Kaydeden | Engel |
|---|---|---|
| investment | %32 (ortalama 122. kararda) | 1169 koşuda engel; neredeyse hepsinde ayarı bozulmuş sikke açık kalmış |
| recovery | %11 (az yatırımlı yol dahil) | – |
| random | %1,7 | – |
| progression | %0,7 | istikrar 50'nin altında |
| knowledge | %0 | istikrar 50'nin altında |

  - Politikalar dönüm noktasını bilmiyor; bu sonuçlar ulaşılabilirliğin alt sınırı.
  - Oyunda koşulların görünür bir ilerleme ekranında gösterilmesi gerekiyor; bu henüz yapılmadı.

## 5. Siyasi istikrar

Ölçüm 255 → 270 (2.000 seed, aynı ikili):

| Politika | Ortalama istikrar | Toplantı başına itiraz | Meclis istikrar kaybı / 100 karar |
|---|---|---|---|
| progression | 25,1 → 25,0 | 0,26 → 0,24 | −27,4 → −24,0 |
| knowledge | 17,4 → 17,4 | 0,30 → 0,29 | −31,0 → −29,9 |
| recovery | 56,0 → 56,2 | – | −12,4 → −9,7 |
| random | 29,2 → 30,7 | – | – |

- `powerStats` değiştirilmedi. 255'te üç eşleme meclis baskısını artırmıştı; yeni bir kanıt yok.
- Yeni kartlarda istikrarı kaynak, otorite, temsil veya gelecekteki yükümlülükle takas eden gerçek seçenekler var: berat, ortak meclis, iltizam, gazi borcu, salgın kredisi.
- Knowledge'ın düşük istikrarı politikanın puanlamasından geliyor (bilgiyi istikrara tercih ediyor). Hedef 30 hâlâ **tutmadı**.

## 6. Denge karşılaştırması (2.000 seed, kapı zorla açık)

| Politika | Açlık sonu 210 / 225 / 240 / 255 / 270 | 500 sınırı 255 → 270 | Ortalama istikrar 255 → 270 |
|---|---|---|---|
| progression | %60,0 / 99,8 / 83,5 / 58,1 / **61,0** | %41,8 → %38,9 | 25,1 → 25,0 |
| knowledge | %73,2 / 86,6 / 54,4 / 43,3 / **45,3** | %56,7 → %54,7 | 17,4 → 17,4 |
| recovery | %58,6 / 99,9 / 38,2 / 34,8 / **38,3** | %65,2 → %61,7 | 56,0 → 56,2 |
| random | %59,8 / 99,8 / 95,0 / 82,8 / **90,3** | %16,3 → %9,0 | 29,2 → 30,7 |
| investment (ayrı) | – / – / – / 7,5 / **7,7** | %92,5 → %92,3 | 85,5 → 84,7 |

- Deste tükenmesi %0.
- 210/225/240 sütunlarındaki %0 dışı deste değerleri 255 SUMMARY'de.
- **Olumsuz sonuç:** random'daki kötüleşme (500 sınırı −7 puan) bu paketin bedeli. Random bedelli seçenekleri rastgele seçiyor ve yeni kartların hiçbirinde bedelsiz seçenek yok.

## 7. Testler (yerel, Windows)

- **Node:** `build-content --check` geçti; doğrulayıcı 0/0; `node --test tools/*.test.mjs` **104/104**. Yeni `tools/empire-strain-content.test.mjs` 5 test içeriyor ve CI listesinde.
- **Swift 6.4.2:** **156/156** (144 + 12). Yeni `EmpireStrainTests` 8 test içeriyor. Eski sayım testleri 270'e güncellendi.
- **Görsel denetimi:** 43 aday, 227 eksik. Geri bildirim kontrolü geçti.
- **Aynı-seed:** altı politika × 10.000 seed, `node tools/compare-reference.mjs docs/analysis/milestone255-windows docs/analysis/milestone270-windows 255 270` → altısı "identical except contentCardCount 255 → 270" (`docs/analysis/milestone270-windows/`).
- **Native CI:** [HANDOFF_270.md](HANDOFF_270.md).

## 8. Sonraki paket için öneriler

1. **Otorite tabanı** (ölçülen en büyük açık). Bir Era 4 "meşruiyet açığı" kuralı: otoritenin karşılayamadığı bedel istikrardan ödenir. Alternatif olarak kurum tavanı otoriteye bağlanabilir. Önce 500 seed ile ölçülmeli, heuristik istikrar hedefleriyle birlikte.
2. **Dönüm noktası ilerleme görünümü:** `milestoneConditions` arayüzde gösterilmeli. Galibiyet ekranı ayrı tasarlanmalı.
3. **Ayarı bozulmuş sikke:** neredeyse bütün koşularda kalıcı kalıyor. Sikkeyi yeniden basma yolu daha sık açılmalı ya da daha görünür olmalı.
4. **Random kırılganlığı:** bedelsiz ama kalıcı tavizli seçenekler eklenmeli. Yeni krizlerde zararsız bir "bekle" seçeneği bilerek konmadı.
