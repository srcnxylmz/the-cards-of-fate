# Phase 3 — 225 → 240 paketi: Antik İmparatorluklarda nüfus, istikrar ve sınırlı birikim (Era 4 hâlâ kapalı)

Tarih: 2026-11-21 · Yazar: Claude · Dal: `phase3-era4-240` (taban `phase3-era4-225` / PR #3) · Kaynak SHA, CI ve PR: [HANDOFF_240.md](HANDOFF_240.md).

## 1. Özet

- **Kart ve karar:** 240 kart (60/60/60/60), 657 karar (+57), 214 statik çağlar arası bağlantı (+15). Doğrulayıcı 0 hata, 0 uyarı.
- **Era 4 envanteri:** 60 olay; 37 tekrarlanabilir, 11 sonuç, 11 köprü, 1 hukuki reform.
- **Kapı:** `ERA4_GATE.enabled:false` ve `balanceEvidence:null` değişmedi. Era 5 de kapalı.
- **Normal oyun:** değişmedi. Altı politika × 10.000 seed karşılaştırması bölüm 6'da; ayrıca bir Swift testi (`testNormalPlayIsUnchangedByThe240Package`).
- **Dengede kazanılanlar:**
  - Kart kaynaklı nüfus kaybı yarıya indi; Era 4'te yaşam süresi 1,5–2,5 kat uzadı.
  - 500 karar sınırına canlı ulaşan koşular: recovery %62, knowledge %46, progression %16.
- **Tutmayanlar:** progression (22) ve knowledge (14) ortalama istikrarı hedef 30'un altında. random politikası hâlâ %95 oranında nüfusun sıfırlanmasıyla bitiyor.

## 2. Ölçülen sorunlar (225, 2.000 seed, 100 Era 4 kararı başına)

Teşhis raporuna yalnız teşhis modunda yeni alanlar eklendi:
- Her motor aşaması için (kart, gecikmeli, tur sonu, meclis, ardıllık) nüfus, istikrar ve kaynak akışı.
- Kart ve seçim başına nüfus kaybı.
- 20., 40. ve 80. Era 4 kararındaki seviyeler.
- Nüfusu sıfırlayan son aşama.

Sonuçlar:

| Ölçüm (225) | progression | knowledge | recovery | random |
|---|---|---|---|---|
| Kart kaynaklı nüfus kaybı / kazancı | −28,9 / +7,3 | −30,9 / +5,1 | −33,9 / +10,6 | −44,2 / +5,9 |
| Gecikmeli nüfus kaybı | −0,9 | −0,7 | −0,4 | −1,1 |
| Tur sonu (gerçek açlık) nüfus kaybı | −23,0 | −7,0 | −19,9 | −51,6 |
| İstikrar: meclis baskısı / gecikmeli | −40,7 / −22,0 | −34,4 / −18,1 | −17,3 / −20,9 | −9,6 / −21,7 |
| Nüfusu sıfırlayan aşama (koşu): tur sonu / kart | 1714 / 222 | 834 / 367 | 1366 / 576 | 627 / 231 |
| 500 karar sınırına ulaşan | %0 | %13 | %0,1 | %0 |

Sonuç: "açlık sonu"nun yaklaşık yarısı kart kararlarının biriken nüfus maliyetinden geliyordu. Yalnız açlık yüzdesine bakmak yanıltıcıydı. Ayrıca:
- Era 4'te nüfusu toparlayan hiçbir mekanik yoktu.
- Üretim tüketimi geçemediği için birikim de yoktu.
- Era 4'te otorite 4–13'e düşüyor, en güçlü rakibin gücü ise 40–57. Bu yüzden meclis baskısı istikrarın en büyük düzenli kaybıydı.

## 3. Eski Era 4 kartlarında kontrollü düzeltmeler (`EMPIRE_REBALANCE`)

Bu pakete özel dar istisna kullanıldı.
- **Değişmeyenler:** kart ve seçim kimlikleri, gereksinimler, bayraklar, borç kimlikleri ve zincirler. Yalnız yedi sonucun istatistikleri, metni ve (üçünde) yeni bir gecikmeli bedel değişti.
- **Testler:** `empire-content.test.mjs` 195/210/225 paketlerinin, "beyan edilen yeniden dengeleme dışında" birebir aynı olduğunu doğruluyor. `empire-governance-content.test.mjs` her düzeltmenin gerekçeli, dar kapsamlı olduğunu ve bedel taşımaya devam ettiğini doğruluyor.

| Sonuç | 225 → 240 etkisi | Gerekçe (225 ölçümü) | Seçim payı ve nüfus/100 karar (progression, 225 → 240) |
|---|---|---|---|
| `quarry_collapse.push` | nüfus −2 → −1; kaynak +4 → +3; çevre −1; 5 tur sonra −2 kaynak (çatlayan ocak yüzü) | knowledge'da 100 kararda 5,4 nüfus | %2,5 → %1,8 · 4,92 → 1,79 |
| `garrison_supply.delay` | nüfus −2 → −1; çevre −2 (aç askerler bahçeleri yağmalıyor); otorite −6 → −5 | recovery'de 6,7 nüfus | %2,1 → %1,2 · 4,24 → 1,19 |
| `garrison_supply.requisition` | nüfus −3 → −1; istikrar −9 → −7; 4 tur sonra −3 kaynak −1 istikrar (tohumluk alındı) | random'da 6,3 nüfus | %1,1 → %0,8 · 3,31 → 0,80 |
| `grain_ceiling.free` | nüfus −2 → −1; kaynak +5 → +4; 5 tur sonra −1 (ekilmeyen tarla) | random'da 4,7 nüfus | %1,1 → %1,2 · 2,28 → 1,25 |
| `aqueduct_quota.sell` | kaynak +9 → +7; çevre −6 → −5; istikrar −7 → −5 | en büyük tek istikrar kaybı | %3,1 → %1,9 · – |
| `aqueduct_quota.ration` | nüfus −2 → −1; otorite −1 → −2; istikrar +3 → +2 | recovery'de 5,1 nüfus | %0,4 → %0,3 · 0,87 → 0,34 |
| `irrigation_court.upstream` | nüfus −2 → −1; çevre −2; istikrar −6 → −5 | knowledge'da 2,8 nüfus | %0,6 → %0,7 · 1,19 → 0,68 |

Hiçbir nüfus kaybı kazanca dönmedi; her düzeltilmiş sonuç hâlâ en az iki gerçek bedel taşıyor.

## 4. Ekonomi ve siyaset (yalnız Era 4; veriyle)

- **Sınırlı birikim (`balance.provincialStorage`):** Kapasite olağan tüketimi aşarsa fazlanın 1 payı ambara girer. Şartları:
  - Tartı kaydı (`granary_register_kept`) ya da mühürlü kıtlık deposu (`grain_famine_store`) olmalı.
  - Açlık ya da ödenmemiş gider olmamalı.
  - Rezerv 40'ın altında olmalı.

  Ölçülen birikim 100 kararda 14–63 kaynak. Sınırsız büyüme yok: rezerv 40'ta duruyor ve fazla üretim kapasitesi olmadan birikim olmuyor.
- **Yavaş demografik toparlanma (`balance.provincialGrowth`):** Her 4. turda bir hane eklenir. Şartları:
  - Eyalet kendi üretimiyle doymalı, açlık ve ödenmemiş gider olmamalı.
  - İstikrar ≥ 25, nüfus < 60 olmalı.

  Ölçülen artış: progression 100 kararda +5,4, recovery +15,5. Gerçek açlık kayıpları bunun 1,5–4 katı.
- **Kurumsal meşruiyet (`politics.institutionDefense`):** Yetki paylaşan her kurum meclis savunmasına +10 ekler, toplamda en fazla +30. Kurumlar: yerel meclis sırası, garnizonun sivil denetimi, devredilmiş eyalet mührü, seçimli ya da azledilebilir valilik, yerel kâhya. Bu kurumların her biri otorite ya da kaynakla satın alınıyor (Node testi). progression'da meclis baskısı 100 kararda −56'dan −40'a indi.
- **Uyumluluk:** Üç alan da isteğe bağlı. Eski içerik ve v1 kayıtlar değişmeden açılıyor. Yeni kalıcı state yok.

## 5. Yeni 15 kart (`tools/content/empire-governance-events.mjs`)

| Kart | Rol | Özü |
|---|---|---|
| `assembly_power_share` | tekrarlanabilir / province | Yerel meclise vergi takviminde oy (otorite −4, kurum); `guest_citizenship` ile kapı vatandaşlarına sıra; ücretli sadık adaylar; ret |
| `tax_deferral` | tekrarlanabilir / taxation | Vergi ertelemesi (tek açık, 6 tur sonra −5 ile kapanır); tapınak muafiyeti; tam tahsil; `river_customs_farmed` mültezimi |
| `governor_recall` | tekrarlanabilir / province | Ücretli müfettiş; yerel kâhya (`province_local_steward`, merkez tahsildarını kaldırır); valiyi tutmak; `recorded_provincial_dissent` duruşması |
| `garrison_oversight` | tekrarlanabilir / logistics | Sivil yargıç denetimi (kurum); `garrison_pay_arrears` yalnız ödemeyle kapanır; sıkıyönetim; ücretli sınır görevi |
| `duty_rota` | tekrarlanabilir / settlement | Yükümlülük çizelgesi (4 tur sonra hasat kaybı); `public_care_settlement` muafiyeti; ücretli işçi; düzeni koruma (−1 nüfus) |
| `refugee_settlement` | tekrarlanabilir / settlement | Çiftliklere yerleşim (−5, +3 nüfus, gecikmeli hasat); kamp (çevre ve istikrar bedeli); garnizona yazma (ücret borcu açar); geri çevirme |
| `surplus_harvest` | tekrarlanabilir / economy | Çiftlik varsa: kamu ambarına mühür (tavanı kaldırır); satış; tohum (5 tur sonra +3); şenlik |
| `grain_contract` | tekrarlanabilir / trade | Peşin sözleşme (−6 → 4 tur sonra +5); balıkçılık gelirini rehin; koru ürünleriyle takas (`debased_coinage` varsa ağır şartlar); ret |
| `well_sanitation` | tekrarlanabilir / health | Kuyu temizliği (−5, 6 tur sonra +1 nüfus); lağım nöbeti; arınma töreni; yok sayma (4 tur sonra −2 nüfus) |
| `provincial_seal_charter` | köprü / public_voice | `council_seal` → eyalet mührü (devredilmiş ya da tek mühür, meclise bırakma) |
| `charcoal_forest_reserve` | köprü / embers | `furnace_wood` → kömür ormanı (yakıt kotası, sanayi kesimi, koruma, açık artırma) |
| `estate_bondage_record` | köprü / debt | `debt_tablet` → çiftlikte borç kulluğu (af, miras kulluk, tanıklı inceleme, karışmama) |
| `tithe_measure_recall` | sonuç / debt | `seal_copy` + `harvest_tithe`: öşürde sahte ölçü |
| `governor_succession_rule` | sonuç / public_voice | `succession_tablet` + `governor_recall`: valiliğin ardıllığı |
| `merchant_grain_rights` | sonuç / hospitality | `caravan_charter` + `grain_contract`: yabancı tüccarın tahıl hakkı |

Kurallar:
- Kaynak harcamadan istikrar artıran her sonuç otorite, nüfus, çevre, bilgi ya da gecikmeli bir bedel taşıyor (Node testi).
- Eski kayıtlar yalnız indirim ve emsal veriyor; net kaynak üretmiyor.
- Dokuz yeni tekrarlanabilir kart sıfır kaynakta ve stres fikstürlerinde en az iki seçenek sunuyor.
- Testler iki gerçek içerik hatası yakaladı ve ikisi düzeltildi: `governor_succession_rule` tek Tunç kaydıyla çekilemezdi; `refugee_settlement.turn_away` bedelsizdi.

## 6. 210 → 225 → 240 teşhis karşılaştırması (2.000 seed, aynı tanımlar)

Tam tablo: `docs/analysis/milestone240-era4-diagnostic/SUMMARY.md`.

| Politika | Nüfus sıfırlanması | 500 sınırı | Era 4 karar/koşu | Ort. istikrar | Kart nüfus kaybı/100 | Gerçek açlık kaybı/100 | Deste tükenmesi |
|---|---|---|---|---|---|---|---|
| progression | %60 → %99,8 → **%83,5** | 0 → 0 → **%16,1** | 42 → 116 → **176** | 15,7 → 12,2 → **22,2** | 44,1 → 28,9 → **14,9** | 63,6 → 23,0 → 20,6 | %40 → 0 → 0 |
| knowledge | %73 → %87 → **%54** | %4 → %13 → **%46** | 72 → 140 → **210** | 11,2 → 9,2 → **13,9** | 51,1 → 30,9 → **14,7** | 15,0 → 7,0 → 7,8 | %22 → 0 → 0 |
| recovery | %59 → %99,9 → **%38** | 0 → 0,1 → **%62** | 32 → 130 → **327** | 52,4 → 46,3 → **55,1** | 54,8 → 33,9 → **20,3** | 88,1 → 19,9 → 8,0 | %41 → 0 → 0 |
| random | %60 → %99,8 → **%95** | 0 → 0 → **%4** | 30 → 58 → **122** | 49,3 → 36,3 → **31,9** | 61,5 → 44,2 → **22,6** | 79,0 → 51,6 → 33,1 | %40 → 0 → 0 |

Diğer ölçümler:
- **20./40./80. Era 4 kararında istikrar:** progression 21/11/6'dan 27/20/18'e, knowledge 19/10/3'ten 25/14/11'e çıktı.
- **Sıfır kaynakta uygun kart:** 12'den 20–21'e çıktı.
- **100. karardan sonra aktif çeşitlilik:** 20–22 karttan 29–35 karta, 26–32 seçimden 50–70 seçime çıktı.
- **Tekrar:** ilk 40 kararda %25–29'dan %5'e indi.

Olumsuz sonuçlar, açıkça:
1. **İstikrar hedefi tutmadı.** progression 22, knowledge 14 (hedef ≈ 30). knowledge politikası bilgi uğruna istikrarı satıyor ve meclis baskısı uzun koşularda birikiyor (100 kararda −54). Politikaların puanlaması değiştirilmedi.
2. **random politikası** %95 oranında nüfusun sıfırlanmasıyla bitiyor; gerçek açlık kaybı yüksek (100 kararda 33). Rastgele seçimde kapasite tutarlı kurulmuyor.
3. **random'da ortalama istikrar** 36'dan 32'ye düştü: daha uzun koşular daha fazla meclis ve kart baskısı biriktiriyor.
4. **progression'da gerçek açlık kaybı** hâlâ 100 kararda 20,6. Ölümü getiren son aşama çoğunlukla tur sonu açlığı.

## 7. Testlerin gerçek sonuçları (Windows 11, Node v25.2.1, Swift 6.4.2)

| Komut | Sonuç |
|---|---|
| `node tools/build-content.mjs --check` | geçti (240 kart) |
| `node tools/validate-content.mjs` | 0 hata, 0 uyarı; Era 4 60/37/11/11, `satisfied:true`, `open:false` |
| `node --test tools/*.test.mjs` | **92/92** (84 + 8 yeni `empire-governance-content.test.mjs`) |
| `swift test` | **142/142** (FateCoreTests 130 + FateDiagnosticsTests 12; 7 yeni `EmpireGovernanceTests`) |
| Release `FateSimulation`, altı politika × 10.000 seed | `compare-reference.mjs … 225 240`: altısı "identical except contentCardCount 225 → 240" |
| Native iPhone CI | [run 44881478766](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44881478766), kaynak `e4c11f6`: **başarılı**. Node 92/92, macOS Swift 142/142, iPhone SE (3. nesil) / iOS 18.5 6/6 UI; altı × 10.000 native simülasyon Windows raporlarıyla 63/63 alanda aynı |

## 8. Görsel ve ses

Görsel üretim aracı yok: **yeni illüstrasyon üretilmedi**. 43 gerçek aday korunuyor; manifestte 197 eksik satır var (15 yeni kart dahil). Ses değişmedi.

## 9. Açık riskler ve sonraki paket

[HANDOFF_240.md](HANDOFF_240.md).
