# Phase 3 — 180 → 195 Antik İmparatorluklar temel paketi

Durum: **yerel içerik/Node kabulü tamam; Swift ve native doğrulama yapılmadı.** Dördüncü çağ normal oynanışta kapalı.

Kaynak dalı: `phase3-era4-groundwork` (taban `c405ac2`). Kod/içerik commit'i `b2e904b`; belge commit'i bunun üstündedir. Bu paket Claude tarafından, Swift araç zinciri ve GitHub push izni olmayan bir ortamda hazırlandı.

## 1. Hazırlık kapısı (Era content gate)

| Öğe | Uygulama |
|---|---|
| Veri | `EraDefinition.contentGate: EraContentGate?` (isteğe bağlı; eski eras JSON'u ve v1 kayıtları etkilenmez). Era 4: `enabled:false`, 40 kart / 24 tekrarlanabilir / 8 sonuç / 8 köprü, sekiz zorunlu kriz alanı. Era 5–12: aynı sayılar, `enabled:false`, alan listesi boş. Era 1–3: kapı yok. |
| Sınıflandırma | `CardEvent.eraRole: String?` — `recurring` / `conclusion` / `bridge`. Gruplar ayrıktır; kendi `resolved_` bayrağıyla kapanan bir kart tekrarlanabilir sayılmaz; sonuç kartı hikâye zinciri, köprü kartı tarihsel koşul ister. |
| Motor | `GameEngine.advanceEra` artık `content.eraContentReady(era+1)` ister: kart var **ve** (kapı yoksa) ya da (kapı `enabled` **ve** envanter tam). writing, knowledge ≥78, stability ≥35, population ≥25 kontrolleri değişmedi ve önce uygulanır. |
| Doğrulayıcı | `validate-content.mjs` kapı alanlarını, rolleri ve envanteri denetler; envanter eksikken `enabled:true` yapılırsa **hata** verir. `docs/content-report.json` → `eraInventory`. |
| Uygulama | Ana menüdeki olay sayısı artık `playableCards` (180) gösterir; 195 değil. |

Bugünkü envanter: 15 toplam, 9 tekrarlanabilir, 3 sonuç, 3 köprü; sekiz alanın hepsi temsil ediliyor (province, taxation, logistics, roads, water, production, citizenship, law). Eksik: 25 kart (15 tekrarlanabilir, 5 sonuç, 5 köprü).

Açma prosedürü (gelecek): ≥40 kart ve dağılım → doğrulayıcı `eraInventory[4].satisfied=true` → ayrı bir commit'te `ERA4_GATE.enabled=true` → tam native CI ve aynı seed karşılaştırmaları. Yalnızca kart eklemek veya yalnızca anahtarı açmak yetmez (ikisi de testli).

## 2. Eyalet defteri — mevcut modelde temsil

İkinci bir ekonomi motoru eklenmedi. Altı istatistik ve mevcut `flags` / `removeFlags` / `delayedEffects` / bağlam sonuçları yeterli: kalıcı durum yalnızca bayraktır, `GameState` şeması ve anahtarları değişmedi (test edildi).

| Sistem | Bayrak durumu | Sınır |
|---|---|---|
| Özerklik | `province_local_steward` ⟷ `province_central_receiver` | Karşılıklı dışlayıcı; derin borç yerel kâhyayı engeller |
| Haraç | `tribute_arrears` → `tribute_arrears_deep`; `provincial_default_record` | En fazla iki kademe; ikinci kademede yeni takdir kartı çıkmaz; ödeme rezervden |
| Yollar | `imperial_road_maintained` ⟷ `imperial_road_worn` | Aşınmış yol ucuz garnizon konvoyunu kapatır; erteleme gecikmeli taşıma bedeli doğurur |
| Garnizon | `garrison_supply_contract` + tarihli taksit | Ücretli sözleşme ≥10 rezerv ister; aksi yol ya gecikme ya zorla el koyma (nüfus/istikrar bedeli) |
| Su | `provincial_water_levy_shared` ⟷ `provincial_water_quota_private`; `cistern_credit_used` | Çevre <20 iken su payı satılamaz; eski sarnıç kredisi bir kez kullanılır |
| Atölye | `guild_workshop_franchise` ⟷ `open_workshop_tender` | `smelting` gerekir; nüfus <30'da lonca yarım teslim eder; ödeme peşin |
| Vatandaşlık | `provincial_residency_hearing` ⟷ `restricted_provincial_residency` | Eski `guest_citizenship` asla silinmez; kısıtlama itiraz kaydı üretir |
| Meşruiyet | `recorded_provincial_dissent`, `lawful_review_precedent` | Kayıt; şu an kaynak üretmez |
| Eski borçlar | `provincial_bond_registry` | Ödenmiş senet kapalı kalır; açık senet ne affedilir ne büyür; devredilirse aynı borç haraç senedi olur |

Değişmezler (Node statik + yazılmış Swift testleri): ödeme yapan her seçim o tutarda rezerv ister; tekrarlanan krizlerde eski kayda bağlı seçimler net pozitif kaynak üretmez; hiçbir Era 4 etkisi `bread_bond_open` eklemez; Era 4 etkileri ilk üç çağın bayraklarını silmez (yalnızca ödenmiş açık senet kapanır); tüm gecikmeli etkiler `minimumEra: 4`.

## 3. Yeni 15 kart

| ID | Rol | Alan / zincir | Tarihsel bağ |
|---|---|---|---|
| governor_seat | tekrarlanabilir | province | `accountable_rule` ortak hesap kurulu |
| tribute_assessment | tekrarlanabilir | taxation | açık `bread_bond_open` önce ödenebilir |
| arrears_reckoning | tekrarlanabilir | taxation | — |
| garrison_supply | tekrarlanabilir | logistics | bakımlı yol |
| road_wear | tekrarlanabilir | roads | `quay_public_account` gümrük denetimi |
| aqueduct_quota | tekrarlanabilir | water | `cistern_public_closed` (bir kez) |
| workshop_tender | tekrarlanabilir | production | `mold_charter_closed` teklif hakkı |
| residency_hearing | tekrarlanabilir | citizenship | `guest_citizenship`, `pasture_public_settlement` |
| census_dispute | tekrarlanabilir | law | `public_care_settlement` |
| bond_ledger_transfer | köprü | debt | `bread_bond` açık/ödenmiş/temerrüt/hiç |
| mold_requisition | köprü | memory | `mold_audit` kamu/özel kapanışı |
| ridge_toll_audit | köprü | ridge_route | `ridge_account` kamu/özel kapanışı |
| cistern_precedent | sonuç | river_memory | `cistern_account` + `aqueduct_quota` |
| guard_levy_charter | sonuç | warning | `alarm_inquest` + `garrison_supply` |
| care_census_hearing | sonuç | care_work | `ward_charter` + `census_dispute` |

Altı tamamlanmış zincirin altısı da en az bir Era 4 devamı aldı (mera zinciri vatandaşlık duruşmasında tanık olarak). Toplam 486 karar (52 yeni), 49 bağlam-bölümlü karar, 167 statik çağlar arası bağlantı. Bunlar "tamamlanmış zincir" sayısına eklenmedi; Era 4 sonuçları oyuncu tarafından henüz erişilemez.

## 4. Testlerin gerçek sonuçları

| Komut | Sonuç |
|---|---|
| `node tools/build-content.mjs --check` | geçti (195 kart) |
| `node tools/validate-content.mjs` | 0 hata, 0 uyarı |
| `node --test tools/*.test.mjs` | **70/70 geçti** (63 eski + 7 yeni `empire-content.test.mjs`) |
| Eski 180 kart | `docs/analysis/milestone195-180-before/cards.json` ile derin eşit, sıra korunmuş |
| `swift test` | **çalıştırılmadı** — ortamda Swift yok. Swift dosyaları yalnızca tree-sitter sözdizimi taramasından geçti (tip denetimi değil). |
| 60.000 simülasyon / native iPhone UI | **çalıştırılmadı** |

Yazılan, çalıştırılmamış Swift testleri: `EraReadinessTests` (8), `EmpireGroundworkTests` (8, aynı seed'de 195 ve 180 desteleriyle 2 politika × 30 seed × 300 karar birebir eşitlik dahil). Dört eski testteki toplam kart sayısı iddiası "ilk üç çağ = 180" olarak daraltıldı.

İlk üç çağ değişmezliği yapısal olarak da korunur: `selectCard` çağ filtresini RNG'den önce uygular, Era 4 kartları Era ≤3 durumunda aday listesine hiç girmez; geçiş, önceden "kart yok" kuralıyla durduğu noktada şimdi kapı ile durur. Bu bir akıl yürütmedir; kanıt Swift testi ve `tools/compare-reference195.mjs` ile yapılacak native karşılaştırmadır.

## 5. Denge

Yeni bir simülasyon çalıştırılmadı; JavaScript kopya motoru da kullanılmadı (MASTER_PLAN kuralı). Era 4 kartlarının doğal maruziyeti ölçülemez çünkü çağ kapalı. Statik gözlemler: ücretli seçimlerin maliyeti 3–12, gelir seçimleri +2…+9 ve her biri istikrar/nüfus/çevre bedeli taşır; `governor_seat` dışındaki sekiz tekrarlanabilir krizde her zaman kaynak harcamayan bir yol vardır (gecikme, karne, erteleme, ret, temerrüt vb.). Boş rezervde ücretli seçimler kapanır; `governor_seat` ise iki seçim kalmazsa desteden düşer, oyunu kilitlemez.

## 6. Görsel ve ses

Bu ortamda görsel üretim aracı yoktu: **yeni illüstrasyon üretilmedi**. 43 mevcut aday ve PNG/katalog dokunulmadı; manifest 195 satır, 152 eksik. Era 4 için `art-pipeline.mjs` dönem istem satırı eklendi (taş, mermer, balmumu tablet/papirüs, bronz-demir alet, yün tunik; üzengi, kâğıt kitap, barut yok). Ses dosyaları, mute ve erişilebilirlik kodu değişmedi.
