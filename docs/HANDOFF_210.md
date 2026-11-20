# Devir notu — 195 → 210 paketi (Claude, 2026-11-20)

Geçmiş sohbet olmadan okunabilir. Ayrıntı ve tablolar: `docs/PHASE3_210_REPORT.md`.

## Kaynak

- Dal: `phase3-era4-210` (PR #2). Doğrulanan kaynak: `0521f6f`. Tabanı `phase3-era4-groundwork` (PR #1, 195 paketi; native CI 44734293652 ile kabul aldı, henüz `main`'e birleşmedi). 210 PR'ı bu dalın üzerine açıldı; önce PR #1 birleşmeli.
- 210 kod/içerik/belge commit'i bu dalın HEAD'idir (`git log -1`; bu belge kendi SHA'sını içeremez). Doğrulamaların çalıştığı kaynak, belge güncellemesinden önceki ağaçla aynıdır: belgeler dışında dosya değişmedi.

## Yapılanlar

1. 15 yeni Era 4 olayı (`tools/content/empire-province-events.mjs`): 8 tekrarlanabilir kriz, 3 Tunç köprüsü (`quay_levy`, `harbor_residency`/`guest_gate`, `night_patrol`), 3 koşullu sonuç (pasture, hospitality, public_voice; her biri bir Era 4 krizi tamamlanmış olmayı ister), 1 yasal reform (`civil_code_draft`, `civil_law`'ı koşullu ve bedelli verir).
2. Yeni `eraRole:"reform"`: yalnız toplama sayılır. Doğrulayıcı reformun teknoloji vermesini, teknoloji alınınca desteden çıkmasını, tarihsel koşul istemesini denetler.
3. Envanter 30/40 · 17/24 · 6/8 · 6/8; sekiz alan tam. `ERA4_GATE.enabled:false` değişmedi.
4. Teşhis: `ContentDatabase.diagnosticallyOpened(era:)` ve `FateSimulation --diagnostic-open-era N`. Kopya döndürür; normal raporların şekli değişmez.
5. `tools/compare-reference.mjs` (genel aynı-seed karşılaştırması), `tools/empire-province-content.test.mjs` (7 test, CI listesinde).
6. Swift: `EraReadinessTests` 10 test (2 yeni), `EmpireGroundworkTests` 30 kartı kapsıyor.

## Gerçek test sonuçları

- Node: `build-content --check` geçti; doğrulayıcı 0/0; `node --test tools/*.test.mjs` 77/77; art-audit ve feedback --check geçti.
- Swift 6.4.2 (Windows): `swift test` 127/127 (115 FateCore + 12 Diagnostics). İlk denemede bir test derlenmedi (`EraDefinition` `Equatable` değil); karşılaştırma `contentGate` üzerinden yapıldı. Başka hata yok.
- Aynı seed: altı politika × 10.000 seed, release. `node tools/compare-reference.mjs docs/analysis/milestone195-windows docs/analysis/milestone210-windows 195 210` → altısı "identical except contentCardCount 195 → 210".
- Teşhis (kapı zorla açık, 2000 seed): progression %97 Era 4'e ulaşıyor, 2000'in 1202'si açlıkla bitiyor, 775'i deste tükenmesiyle; tekrar oranı %59; Era 4 ortalama istikrar 16. Tablolar raporda.
- Native CI [run 44748860814](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44748860814) (`0521f6f`, workflow_dispatch) **başarılı**: Node 77/77, macOS Swift 127/127, iPhone SE 3 / iOS 18.5 derleme + 6/6 UI testi, 4 simülasyon işi (short, knowledge, progression, recovery). Era 4 kapalı olduğu için bu bir 210 içerik kabulüdür, Era 4 açılış kabulü değildir.

## Bilinen sorunlar

- **Era 4 ekonomisi sürdürülemez** (teşhis): üretim/yiyecek döngüsü yok, tur sonu tüketimi nüfusu bitiriyor, istikrar çöküyor. Bu, envanter tamamlansa bile kapıyı açmamak için yeterli neden.
- Deste tükenmesi: 30 kartla Era 4 koşularının ~%39'u "uygun olay kalmadı" ile bitiyor.
- recovery politikası üç tek seferlik kartı hiç seçmedi (`guard_levy_charter`, `care_census_hearing`, `customs_house_ledger`).
- İllüstrasyon yok: 43 aday, 167 eksik (görsel üretim aracı yok).
- `tools/swift-windows.ps1`, Windows PowerShell 5.1'de swift stderr'e yazınca düşer; toolchain ortamıyla `swift.exe` doğrudan çalıştırıldı. `.build/release` sembolik bağı oluşmuyor; ikili `.build/out/Products/Release-windows-x86_64/FateSimulation.exe`.
- Kullanıcının çalışma ağacında bu pakete ait olmayan, commit'lenmemiş eski değişiklikler var (`README.md`, kök `technologies.json`, `docs/simulation-survival-council.json`, `docs/swift-*-windows.log`). Dokunulmadı, commit'lere girmedi.

## Era 4 neden kapalı

1. Envanter 30/40 (17/24, 6/8, 6/8); doğrulayıcı eksik envanterle `enabled:true`'yu hata sayar.
2. Teşhis ölçümü Era 4'ün şu haliyle oyuncuyu açlığa ve deste tükenmesine sürüklediğini gösteriyor.
3. Açma kararı ayrı bir onaydır: envanter + denge kanıtı + native CI + kullanıcı onayı.

## 210 → 225 önerilen kapsam (Era 4 kapalı kalır)

Hedef: envanteri 40/24/8/8'e tamamlamak **ve** teşhis ölçümünde açlık/tükenme sorununu çözmek.

- **Üretim/yiyecek döngüsü (öncelik):** 4–5 tekrarlanabilir kart: eyalet tahıl çiftlikleri ve kiracı payı, hasat öşrü, kıtlık deposundan dağıtım (`grain_famine_store` okuyarak), sulama ile genişleyen tarla, liman balıkçılığı. Gelir, önceden ödenmiş yatırımın gecikmeli getirisi olmalı; bedava üretim yok.
- **Kalan tekrarlanabilir krizler** (toplam ≥24): salgın ve karantina, yangın ve kiremit çatı, köprü ve feribot bakımı.
- **2 köprü** (8/8): örn. `ward_charter`/bakım → eyalet hastanesi; `clay_archive`/arşiv → eyalet kayıt dairesi.
- **2 sonuç** (8/8): `stored_power` ve `embers` zincirleri; her biri bir Era 4 krizi tamamlanmış olmayı ister.
- Yeni ledger bayraklarını okuyan kartlar: `garrison_pay_arrears`, `debased_coinage`, `caravan_insurance_pool`, `grain_price_ceiling`, `river_customs_farmed`.
- Teşhis kabul ölçütü önerisi: progression/knowledge/recovery'de Era 4 açlık sonu < %25, deste tükenmesi < %5, tekrar oranı < %40, ortalama istikrar ≥ 30.
- 3–5 gerçek Era 4 illüstrasyonu (araç varsa).
- Son adımda aynı-seed karşılaştırması (210 → 225) ve tek tam native CI.
