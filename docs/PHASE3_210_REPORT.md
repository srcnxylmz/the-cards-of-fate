# Phase 3 — 195 → 210 paketi (Era 4 hâlâ kapalı)

Tarih: 2026-11-20 · Yazar: Claude · Dal: `phase3-era4-210` (taban `phase3-era4-groundwork`, PR #1 üzerine) · Kaynak SHA: devir notuna bakın.

## 1. Özet

15 yeni Antik İmparatorluklar olayı eklendi; hepsi Era 4'te. Era 4 kapısı `enabled:false` kaldı. Envanter 30/40 kart, 17/24 tekrarlanabilir, 6/8 sonuç, 6/8 köprü; sekiz zorunlu kriz alanı temsil ediliyor. İlk üç çağın 180 tanımı ve 195 paketinin ilk 15 Era 4 tanımı birebir aynı (sıra dahil). Yeni kalıcı state yok; kayıt şeması v1.

Toplam: 210 kart, 541 karar (+55), 50 bağlam-bölümlü karar, 183 statik çağlar arası bağlantı (+16). Doğrulayıcı 0 hata / 0 uyarı.

## 2. Yeni kartlar (`tools/content/empire-province-events.mjs`)

| Kart | Rol | Alan / zincir | Özü |
|---|---|---|---|
| `garrison_rotation` | tekrarlanabilir | logistics | Nöbet değişimi; asker ücreti borcu tek kademe (`garrison_pay_arrears`), ödeyince kapanır; ikmal sözleşmesi olan taksite bağlayabilir |
| `caravan_bandits` | tekrarlanabilir | roads | Kervan sigortası sandığı ↔ ücretli muhafız (karşılıklı dışlayıcı); bakımlı yolda gözcü kulesi |
| `grain_ceiling` | tekrarlanabilir | economy | Kıtlık deposu ↔ fiyat tavanı (karşılıklı dışlayıcı); ortak ölçü kabı ile tartı denetimi |
| `river_customs` | tekrarlanabilir | taxation | Kamu gümrükçüsü ↔ mültezim; rıhtım hesabı kurulumu ucuzlatır (net 0) |
| `irrigation_court` | tekrarlanabilir | water | Su saatleri mahkemesi; ortak su vergisi kaydı ve eski su günleri anlaşması emsal |
| `quarry_collapse` | tekrarlanabilir | production | Ocak göçüğü; destek kirişi/tazminat, zorla devam, uzak ocak, mahalle bakım hesabı |
| `coin_assay` | tekrarlanabilir | law | Sikke ayarı; ayar düşürme tek kademe (`debased_coinage`), yalnız ücretli yeniden basımla kapanır |
| `governor_petition` | tekrarlanabilir | province | `recorded_provincial_dissent` ister ve asla silmez; müfettiş, ad verme, ortak duruşma, emsal |
| `customs_house_ledger` | köprü | river_memory | `quay_levy` → gümrük evi; rıhtım hesabı deftere taşınır |
| `harbor_ward_roll` | köprü | hospitality | `harbor_residency` → liman mahallesi vatandaşlığı; `guest_gate` vatandaşlığı emsal |
| `watch_guild_charter` | köprü | public_voice | `night_patrol` → muhafız loncası; kamu ↔ özel nöbet |
| `pasture_gate_levy` | sonuç | pasture | `grazing_appeal` + `irrigation_court`; mera geçiş vergisi mevsime bölünür |
| `guest_assembly_bench` | sonuç | hospitality | `guest_gate` + `residency_hearing`; kapı mahallesine meclis sırası |
| `assembly_seal_appeal` | sonuç | public_voice | `seal_appeal` + `governor_petition`; mühür itirazı eyalet meclisine |
| `civil_code_draft` | reform (yeni rol) | law | `civil_law`'ı koşullu ve bedelli verir |

**Reform rolü:** `eraRole:"reform"` yalnız toplam karta sayılır; tekrarlanabilir/sonuç/köprü sayısına girmez (bu yüzden hedefler 17/6/6). Doğrulayıcı reformun bir teknoloji vermesini, o teknoloji alınınca desteden çıkmasını ve tarihsel bir koşula bağlı olmasını ister. Swift envanteri bilinmeyen rolleri zaten yalnız toplama sayar.

**`civil_code_draft`:** `writing` + `lawful_review_precedent` + bilgi ≥ 70 ister. `codify` (−12, rezerv 12) ve `privileged` (−9, rezerv 9, istikrar −5) `civil_law` verir; `defer` vermez ve kart desteden düşmez (yalnız `civil_law` alınınca düşer). `civil_law` Era 4'ün çıkış teknolojisidir; Era 5'te kart yok ve kapısı kapalı, bu yüzden tek başına çağ açamaz (Swift testiyle doğrulandı).

**Kurallar (değişmedi):** ödeyen her seçim o tutarda rezerv ister; eski bir hak duruşma, emsal veya indirim verir, net kaynak üretmez (yeni test bunu köprü ve sonuçlara da uygular); ödenmiş borç yeniden açılmaz; erken kayıtlar ve `recorded_provincial_dissent` silinmez. Yeni karşılıklı dışlayıcı çiftler `PROVINCE_LEDGER_EXCLUSIVE` içinde.

## 3. Araçlar

- `tools/validate-content.mjs`: `reform` rolü ve üç reform kuralı.
- `Sources/FateCore/EraReadiness.swift`: `diagnosticallyOpened(era:)` — kapısı zorla açılmış bir **kopya** döndürür; uygulama ve kayıtlar kullanmaz.
- `FateSimulation --diagnostic-open-era 4`: yalnız teşhis. Rapor `diagnosticOpenEra` ve uyarı alanı taşır; bu alanlar yalnız bu modda eklenir, böylece temel raporların şekli değişmez.
- `tools/compare-reference.mjs <ref> <cur> <n> <m>`: genel aynı-seed karşılaştırması; teşhis raporlarını reddeder.
- CI Node listesine `tools/empire-province-content.test.mjs` eklendi.

## 4. Testlerin gerçek sonuçları (Windows 11, Node v25.2.1, Swift 6.4.2)

| Komut | Sonuç |
|---|---|
| `node tools/build-content.mjs --check` | geçti (210 kart) |
| `node tools/validate-content.mjs` | 0 hata, 0 uyarı; Era 4 envanteri 30/17/6/6, `open:false` |
| `node --test tools/*.test.mjs` | **77/77** (70 + 7 yeni `empire-province-content.test.mjs`) |
| `node tools/art-audit.mjs`, `generate-feedback.mjs --check` | geçti |
| `swift test` | **127/127** (FateCoreTests 115 + FateDiagnosticsTests 12; 2 yeni: teşhis kopyası, civil_law reformu). `EmpireGroundworkTests` 30 Era 4 kartının her seçimini ve bağlam sonucunu gerçek seçiciyle çekip replay ediyor |
| Release `FateSimulation`, altı politika × 10.000 seed | `node tools/compare-reference.mjs docs/analysis/milestone195-windows docs/analysis/milestone210-windows 195 210`: altısı "identical except contentCardCount 195 → 210" |
| Native iPhone CI | devir notunda (tek tam koşu, PR açıldıktan sonra) |

## 5. Era 4 dengesi — teşhis ölçümü (kapı zorla açık, oyuncuya kapalı)

Komut: `FateSimulation 2000 --policy <p> --diagnostic-open-era 4`. Raporlar: `docs/analysis/milestone210-era4-diagnostic/`.

| Politika | Era 4'e ulaşan | Era 4 kararı | Era 4 tekrar oranı | `civil_law` | Ort. kaynak / istikrar (Era 4) |
|---|---|---|---|---|---|
| progression | 1940/2000 (%97) | 81.776 | %58,9 | 1271 | 17,6 / 15,7 |
| knowledge | 1387/2000 (%69) | 100.038 | %73,8 | 660 | 25,8 / 11,2 |
| recovery | 1943/2000 (%97) | 62.486 | %54,7 | 269 | 17,1 / 52,4 |
| survival | 0 | 0 | – | 0 | – |

Sonuçlar (yalnız teşhis; normal oyunda Era 4 erişilemez):

1. **Era 4 bir açlık tuzağı.** progression'da 2000 koşunun 1202'si açlıkla bitti; 1083'ü tur sonu ("world") aşamasındaki nüfus kaybıyla. Aynı seed'lerde kapı kapalıyken progression koşularının %96'sı Era 3'te 500 tur sınırına ulaşıyor. Era 4'te yiyecek/üretim döngüsü yok; kartlar bilerek net harcatıyor, ama karşılığında gelir üreten bir yapı yok.
2. **Deste tükeniyor.** progression'da 775, recovery'de 805 koşu "uygun olay kalmadı" ile bitti; tekrar oranı %55–74. 30 kart, cooldown ve ≥2 seçim kuralı için yetersiz.
3. **İstikrar çöküyor.** progression/knowledge Era 4 ortalaması 11–16. Gelir getiren seçimlerin çoğu istikrar bedeli taşıyor; istikrar kazandıran seçimler kaynak istiyor.
4. **Kartların hepsi seçilebiliyor.** progression ve knowledge 30 kartın hepsini seçti; recovery üç tek seferlik kartı hiç seçmedi (`guard_levy_charter`, `care_census_hearing`, `customs_house_ledger`).
5. `quarry_collapse.push` 56 koşuda nüfus sonunu tetikleyen son karar oldu; bilinçli bir bedel, ama 225 dengesinde izlenmeli.

Bu sayılar Era 4'ün neden kapalı kaldığını ölçümle gösteriyor: envanter eksik olmasının yanında ekonomi henüz sürdürülebilir değil.

## 6. Görsel ve ses

Görsel üretim aracı yok: **yeni illüstrasyon üretilmedi**. Manifest 210 satır: 43 gerçek aday, 167 eksik. Era 4 için öncelik: `governor_seat`, `river_customs`, `civil_code_draft`, `caravan_bandits`, `harbor_ward_roll`. Sanat yönü satırları her kartta benzersiz ve dönem kurallarına uygun (taş, mermer, balmumu tablet/papirüs, bronz-demir alet; üzengi, kâğıt kitap, barut yok). Ses değişmedi.
