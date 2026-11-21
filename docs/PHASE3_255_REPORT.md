# Phase 3 — 240 → 255 paketi: meclis dengesi, ekonomik kırılganlık ve yatırım politikası (Era 4 hâlâ kapalı)

Tarih: 2026-11-21 · Yazar: Claude · Dal: `phase3-era4-255` (taban `phase3-era4-240` / PR #4) · SHA'lar, CI ve PR: [HANDOFF_255.md](HANDOFF_255.md).

## 1. Özet

- **Kart ve karar:** 255 kart (60/60/60/75), 715 karar (+58), 230 statik çağlar arası bağlantı (+16). Doğrulayıcı 0 hata, 0 uyarı.
- **Era 4 envanteri:** 75 olay; 46 tekrarlanabilir, 14 sonuç, 14 köprü, 1 reform.
- **Kapılar:** `ERA4_GATE.enabled:false` ve `balanceEvidence:null` değişmedi; Era 5 kapalı.
- **Normal oyun:** değişmedi; altı politika × 10.000 seed, 240 ile birebir aynı.
- **Kanıt düzeni:** 240 paketinin 240 kartı birebir korundu. Bu pakette eski kart değişmedi.
- **Dengede kazanılanlar:**
  - Meclis baskısı knowledge'da 100 kararda −54'ten −31'e, progression'da −40'tan −27'ye indi.
  - 500 karar sınırına canlı ulaşan koşular: progression %16 → %42, knowledge %46 → %57, random %4 → %16.
- **Tutmayanlar:** ortalama istikrar progression'da 25, knowledge'da 17; hedef 30'un altında.
- **Yatırım politikası** (ayrı raporlanan yeni teşhis politikası): istikrar 86, koşuların %93'ü 500 karar sınırında. Era 4 iyi bir oyuncu için sürdürülebilir, hatta fazla rahat olabilir (bölüm 6).

## 2. Meclis ve istikrar: ölçüm ve düzeltme

### Ölçüm (240, teşhis modu, 2.000 seed)

| | progression | knowledge | recovery | random |
|---|---|---|---|---|
| Otorite / meclis savunması | 8,3 / 42,1 | 13,3 / 46,2 | 4,3 / 52,7 | 20,2 / 46,5 |
| Rakip gücü (avcı–rahip) | 40–42 | 37–46 | 56–55 | 46–46 |
| Rakip ilişkisi (avcı–rahip) | 47 / 3 | 66 / **−37** | 36 / 34 | 2 / 4 |
| Toplantı başına itiraz · meclis istikrar kaybı/100 karar | 0,37 · −40 | 0,48 · −54 | 0,19 · −13 | 0,32 · −14 |
| İttifak / müzakere açık (karar payı, 400 seed) | %0 / %73 | %0 / %90 | %40 / %69 | %3 / %47 |

Bulgular:
1. **Era 4'te `powerStats` girdisi yok;** iki rakip de gücünü istikrardan alıyor. Era 3 eşlemesini (avcı = kaynak, rahip = bilgi) ya da iki alternatifi Era 4'e taşımayı 400 seed ile denedim. Üçü de meclis baskısını **artırdı**: knowledge'da −54'ten −69..−76'ya; bilgi yüksek olduğu için rahipler 84 güce çıktı. Varsayılan model asıl sorun değildi; değiştirilmedi. Bunu bir Node testi kayda geçiriyor.
2. **Asıl neden düşmanlık.** knowledge'da rahiplerin ilişkisi −37. Düşmanca ilişki (≤ −20) rakibe +15 güç ve koalisyon bonusu veriyor. İtiraz için de ilişkinin 20'nin altında olması yetiyor.
3. **Otorite** Era 4'te 4–13 arasında; savunmanın çoğunu 240'ta eklenen kurumsal meşruiyet taşıyor.
4. **İttifak ve müzakere** çoğu zaman açık, ama eski politikalar meclis eylemi kullanmıyor (survival-council dışında). Bu bir politika sınırlaması.

### Düzeltme: kurumlar yoluyla yatıştırma (yalnız Era 4)

`politics.institutionDefense` kuralına `reconciliationPerFlag: 1` ve `reconciliationCeiling: 15` eklendi. Her meclis toplantısında, kurulu her kurum (yerel meclis sırası, sivil denetim, devredilmiş mühür, seçimli ya da azledilebilir valilik, yerel kâhya) 15'in altındaki rakip ilişkilerini 1 adım yükseltiyor.
- **Tarihsel gerekçe:** Kurumsal temsil, rakip gruplara yasal bir ses verir ve açık düşmanlığı azaltır.
- **Matematiksel sınır:** Tavan 15, tarafsızlık eşiği olan 20'nin altında. Kurumlar düşmanlık bonusunu ve koalisyonu kaldırıyor ama sadakat satın almıyor; güç savunmayı aşarsa itiraz yine oluyor (toplantı başına 0,18–0,30). Rakip güçleri değişmedi.
- **Uygulama:** Era 3 ve öncesinde kural çalışmıyor (Swift testi). Yeni kalıcı state yok.

**Sonuç (2.000 seed, 240 → 255):**
- Rahiplerle ilişki knowledge'da −37'den −1'e, progression'da 3'ten 20'ye çıktı.
- Toplantı başına itiraz: knowledge 0,48 → 0,30, progression 0,37 → 0,26.
- Ortalama istikrar: progression 22,2 → 25,1, knowledge 13,9 → 17,4. Hedef 30 **tutmadı**.
- Kalan istikrar kaybı, politikaların istikrarı kaynak ve bilgiyle takas eden seçimlerinden geliyor; politikaların puanlaması değiştirilmedi.

## 3. Random politikasında kırılganlık

- **Ölçüm (240):** random'da gerçek açlık kaybı 100 kararda 33. Kart kararları 100 kararda net −64 kaynak harcatıyor. random, paralı seçenekleri rastgele seçerek rezervi tüketiyor; kapasiteler yine de kararların %47–68'inde kurulu.
- **Düzenleme (`balance.provincialFamineRelief`, yalnız Era 4):** Mühürlü kamu deposu (`grain_famine_store`) varken açlık gelirse depo bir kez açılıyor ve açığın 4 payına kadarını karşılıyor. Sonra depo boşalıyor; yeniden doldurmak yine kaynak istiyor. Bu kuralın tek başına etkisi küçük: 400 seed'de random'da nüfus sıfırlanması %94'ten %91'e indi.
- **Yeni kartlardaki ücretli ya da siyasi bedelli yardım yolları:**
  - Bölgesel tahıl paktı: ödünç alınır, 6 tur sonra −4 ile kapanır ve beklerken otorite bedeli var.
  - Pakta emekle katılım.
  - Sıfır kaynakta 29 uygun kart.
- **Toplam etki (2.000 seed, 240 → 255):**
  - random'da gerçek açlık kaybı 100 kararda 33,1'den 23,7'ye indi.
  - Nüfus sıfırlanması %95,0'dan %82,8'e, 500 sınırı %4'ten %16'ya geçti.
  - random'ın her zaman hayatta kalması hedeflenmedi; ortalama istikrarı 31,9 → 29,2 hafif düştü (daha uzun koşular).

## 4. Yatırımları gören ayrı teşhis politikası (`--policy investment`)

`Sources/FateSimulation/main.swift` içindeki `selectInvestment`. Eski beş politika ve `SimulationPolicy.swift` değişmedi. Rapor alanları: `policy: "investment"` ve ayrı bir `policyNote`. `compare-reference.mjs` bu politikayı listelemiyor.
- **Era 1–3:** `progression` ile birebir aynı oynuyor; Era 4'e aynı durumlarla giriyor.
- **Era 4'te yalnız oyuncunun görebildiklerini kullanıyor:**
  - Mevcut istatistikler, bayraklar ve ilişkiler.
  - Seçeneklerin yazılı etkileri ve gecikmeli sonuçları; gecikmeli sonuçlar 0,6 katsayıyla.
  - Eski politikaların kullandığı aynı beklenen olasılıklar.
  - Gelecekteki rastgele çekimleri bilmiyor.
- **Değer verdikleri:**
  - Şartları tutan yeni üretim kapasitesine +12, kaybedilen kapasiteye −12.
  - Ambar kaydına +5; tavana kadar kuruma +5.
  - Borç açmaya −4, kapatmaya +3.
  - İlişki 20'nin altındayken ilişki kazancına 0,3 katsayı.
  - Kaynak, nüfus, istikrar ve çevreye ihtiyaca göre ağırlık.

| Yatırım politikası (2.000 seed) | 240 kuralları | 255 kuralları |
|---|---|---|
| Era 4'e ulaşan | %97 | %97 |
| Nüfus sıfırlanması / 500 sınırı | %7,1 / %92,9 | %7,4 / %92,6 |
| Ortalama kaynak / nüfus / istikrar / çevre | 33 / 65 / 73 / 61 | 42 / 62 / **86** / 73 |
| Gerçek açlık kaybı / 100 karar | 1,3 | 1,2 |
| Meclis itirazı/toplantı · istikrar kaybı/100 | 0,40 · −48 | 0,14 · −17 |
| Üreten kapasite (karar payı) | %94–96 | %94–95 |

## 5. Yeni 15 kart (`tools/content/empire-assembly-events.mjs`)

| Kart | Rol | Özü |
|---|---|---|
| `representation_reform` | tekrarlanabilir / citizenship | Hane sayısına göre sıra; mülk şartı; vatandaşlık duruşmasındaki aileleri sayma; ücretli sayım |
| `land_tax_reform` | tekrarlanabilir / taxation | Ölçülmüş toprak vergisi (−6 → 6 tur sonra +4); kişi başı vergi; çiftlik hasadından pay; eskiyi koruma |
| `grain_pact` | tekrarlanabilir / logistics | Depo ya da emekle pakta katılım; kasadan pay; ödünç tahıl (tek açık borç); dışarıda kalma |
| `public_safety_compact` | tekrarlanabilir / settlement | Mahalle nöbeti; asker; ücretli bekçi; kamu loncasının nöbeti |
| `legitimacy_oath` | tekrarlanabilir / province | Yasaya yemin; imparator kültü tapınağı; yerel tapınaklar; erteleme |
| `land_rights_survey` | tekrarlanabilir / production | Ortak meralar; çiftlik sınırları (itiraz kaydı); ücretli ölçüm; kil arşiv emsali |
| `seasonal_migration` | tekrarlanabilir / settlement | Mevsimlik işçi (gecikmeli hasat); kalıcı yerleşim; yolları kapatma; geçiş harcı |
| `trade_treaty` | tekrarlanabilir / trade | Gümrük indirimi; tek lonca ayrıcalığı; ücretli elçiler; ret |
| `terrace_upkeep` | tekrarlanabilir / production | Ücretli onarım; angarya (el azsa yarım); erteleme (5 tur sonra çiftlik kapasitesi kaybı); meclisle masraf paylaşımı |
| `provincial_levy_review` | köprü / debt | `levy_hearing` → eyalet angaryası |
| `barge_silt_league` | köprü / river_memory | `silt_charter` → mavna ve çamur birliği |
| `granary_roof_watch` | köprü / memory | `roof_beams` → ambar çatıları |
| `land_registry_record` | sonuç / memory | `archive_dispute` + `land_rights_survey` |
| `water_court_canal` | sonuç / river_memory | `water_court` + `canal_extension` |
| `fuel_trade_clause` | sonuç / embers | `charcoal_embargo` + `trade_treaty` |

Kurallar Node testleriyle denetleniyor:
- İstikrar ya da nüfus kazandıran her kaynaksız sonuç başka bir bedel taşıyor.
- Ödeme yapan seçimler rezerv istiyor.
- Gecikmeli getiri maliyetten az.
- Eski kayıtlar yalnız indirim veriyor.
- Köprü ve sonuçlar tek bir Tunç sonucuyla bile çekilebiliyor.
- Dokuz tekrarlanabilir kart sıfır kaynakta ve stres fikstürlerinde en az iki bedelli seçenek sunuyor.

Testler iki içerik hatası yakaladı ve ikisi düzeltildi:
- `grain_pact`, açık borç varken ve depo yokken tek seçeneğe düşüyordu; emekle katılım eklendi.
- `terrace_upkeep` düşük nüfusta kilitleniyordu; angaryaya "el azsa yarım" sonucu eklendi.

## 6. 210 → 225 → 240 → 255 ve açılış değerlendirmesi

Tam tablo: `docs/analysis/milestone255-era4-diagnostic/SUMMARY.md`.

| Politika | Ort. istikrar | Meclis kaybı/100 | Gerçek açlık kaybı/100 | Kart nüfus kaybı/100 | 500 sınırı | Era 4 karar/koşu |
|---|---|---|---|---|---|---|
| progression | 15,7 → 12,2 → 22,2 → **25,1** | −17 → −41 → −40 → **−27** | 63,6 → 23,0 → 20,6 → **10,5** | 44 → 29 → 15 → **11,7** | 0 → 0 → %16 → **%42** | 42 → 116 → 176 → **263** |
| knowledge | 11,2 → 9,2 → 13,9 → **17,4** | −14 → −34 → −54 → **−31** | 15,0 → 7,0 → 7,8 → **6,3** | 51 → 31 → 15 → **11,8** | %4 → %13 → %46 → **%57** | 72 → 140 → 210 → **235** |
| recovery | 52,4 → 46,3 → 55,1 → **56,0** | −9 → −17 → −13 → **−12** | 88,1 → 19,9 → 8,0 → **6,5** | 55 → 34 → 20 → **16,4** | 0 → 0 → %62 → **%65** | 32 → 130 → 327 → **335** |
| random | 49,3 → 36,3 → 31,9 → **29,2** | −8 → −10 → −14 → **−10** | 79,0 → 51,6 → 33,1 → **23,7** | 62 → 44 → 23 → **18,0** | 0 → 0 → %4 → **%16** | 30 → 58 → 122 → **162** |

Diğer ölçümler:
- **Deste tükenmesi:** %0.
- **Sıfır kaynakta uygun kart:** 20–21'den 29'a çıktı.
- **100. karardan sonra çeşitlilik:** 29–35'ten 38–44 karta, 50–70'ten 69–91 seçime çıktı.
- **20./40./80. kararda istikrar:** progression 29/21/21, knowledge 29/16/12.

**Olumsuz sonuçlar:**
1. progression (25) ve knowledge (17) istikrarı hedefin altında.
2. random'da ortalama istikrar 31,9'dan 29,2'ye düştü.
3. random'da nüfus sıfırlanması hâlâ %83.
4. knowledge'da 80. kararda istikrar 12.

**Era 4 açılış hazırlık değerlendirmesi** (açılış kararı değildir):

| Ölçüt | Durum |
|---|---|
| Envanter (40/24/8/8) | karşılanıyor (75/46/14/14) |
| Deste tükenmesi < %5 | karşılanıyor (%0) |
| İyi yatırım yapan oyuncuda sürdürülebilirlik | karşılanıyor (yatırım politikası: istikrar 86, %93 500 sınırı); **fazla rahat olabilir** |
| Eski heuristik politikalarda istikrar ≈ 30 | **karşılanmıyor** (progression 25, knowledge 17) |
| Rastgele oyuncuda kırılganlık | **yüksek** (%83 nüfus sıfırlanması) |
| Olumlu Era 4 sonu / Era 5 içeriği | **yok** (Era 5'te kart yok) |
| Native CI ve kaynak SHA | bu paket için [HANDOFF_255.md](HANDOFF_255.md) |
| Kullanıcı onayı | **yok** |

Sonuç: `balanceEvidence` doldurulmadı. Açmadan önce şunlar tartışılmalı:
- Yatırım politikasının fazla rahat ilerlemesi; zorluk eğrisi.
- Heuristik politikalarda istikrarın neden hedefe ulaşmadığı.
- Bağımsız bir olumlu son.

## 7. Testlerin gerçek sonuçları (Windows 11, Node v25.2.1, Swift 6.4.2)

| Komut | Sonuç |
|---|---|
| `node tools/build-content.mjs --check` | geçti (255 kart) |
| `node tools/validate-content.mjs` | 0 hata, 0 uyarı; Era 4 75/46/14/14, `satisfied:true`, `open:false` |
| `node --test tools/*.test.mjs` | **99/99** (92 + 7 yeni `empire-assembly-content.test.mjs`) |
| `swift test` | **148/148** (FateCoreTests 136 + FateDiagnosticsTests 12; 6 yeni `EmpireAssemblyTests`) |
| Release `FateSimulation`, altı politika × 10.000 seed | `compare-reference.mjs docs/analysis/milestone240-windows docs/analysis/milestone255-windows 240 255`: altısı "identical except contentCardCount 240 → 255" |
| Native iPhone CI | [HANDOFF_255.md](HANDOFF_255.md) |

## 8. Görsel ve üretim eksikleri

- **Görsel:** üretim aracı yok; yeni illüstrasyon üretilmedi. Manifest 255 satır: 43 gerçek aday (41 aday + 2 inceleme bekleyen), **212 eksik**.
- **Yapılmadı:** fiziksel cihaz, imzalama, Game Center, nihai ses ve marka çalışmaları. Ses değişmedi.
