# Devir notu — Claude → Codex (180 → 195 paketi)

Bu notu geçmiş sohbet olmadan okunabilecek şekilde yazdım. Ayrıntı: `docs/PHASE3_195_REPORT.md`.

## Kaynak

- Taban: `main` = `c405ac2d9a31cb37cc0c21a94a0bf290108f5f02` (Codex, 180 native kabul).
- Çalışma dalı: `phase3-era4-groundwork`. Kod/içerik commit'i `b2e904b`; üzerindeki belge/CI commit'i bu dalın HEAD'i (SHA'yı `git log -1` ile okuyun; bu belge kendi SHA'sını içeremez).
- **Push edildi (2026-11-20).** Dal GitHub'da: `origin/phase3-era4-groundwork`, test düzeltmesi `8a2924b` + bu belge güncellemesi. PR: https://github.com/srcnxylmz/the-cards-of-fate/pull/1. Bundle/patch yalnızca tarihsel kayıt.

## Eklenenler

1. `Sources/FateCore/EraReadiness.swift`: `EraContentGate`, `EraInventory`, `ContentDatabase.inventory(era:)`, `eraContentReady(_:)`, `playableCards`.
2. `Models.swift`: `CardEvent.eraRole: String? = nil`, `EraDefinition.contentGate: EraContentGate? = nil` (ikisi de isteğe bağlı; v1 kayıt ve eski JSON çözülür).
3. `GameEngine.advanceEra`: "sonraki çağda kart var" kontrolü → `content.eraContentReady(state.era + 1)`. Eşikler aynı.
4. `tools/content/empire-events.mjs`: 15 Era 4 kartı + `ERA4_GATE` (`enabled:false`, 40/24/8/8, sekiz alan) + `FUTURE_ERA_GATE` + `LEDGER_EXCLUSIVE`.
5. `build-content.mjs`: `eraRole` alanı, Era 4–12 kapıları; `art-pipeline.mjs`: Era 4 istem satırı; `validate-content.mjs`: kapı/rol/envanter denetimi, `inventory()` dışa aktarımı.
6. Testler: `tools/empire-content.test.mjs` (7, geçti); `Tests/FateCoreTests/EraReadinessTests.swift` (8) ve `EmpireGroundworkTests.swift` (8) yazıldı ve Windows Swift 6.4.2 ile çalıştırıldı (geçti). Eski Node testleri ilk üç çağ destesine (`era<=3`) daraltıldı; dört Swift testindeki `cards.count == 180` → `filter { $0.era <= 3 }.count == 180`.
7. `tools/compare-reference195.mjs`: 195 kaynaktan üretilen altı 10.000 seed raporunu `docs/analysis/milestone180-verified` ile karşılaştırır; yalnızca `contentCardCount` 180→195 farkına izin verir.
8. `.github/workflows/ios.yml`: Node listesine `empire-content.test.mjs` eklendi. Başka iş akışı değişikliği yok.
9. Ana menü artık `playableCards.count` gösterir (180).

## Gerçek test sonuçları

- Node: 70/70 geçti; `build-content --check` güncel; doğrulayıcı 0 hata/0 uyarı.
- Swift 6.4.2 (Windows, `8a2924b`): `swift test` 125/125 (FateCoreTests 113 + FateDiagnosticsTests 12). Derleme hatası yoktu. Bir test iddiası yanlıştı: liderlik tur öncesiyle karşılaştırılıyordu, oysa otorite ≥ 60 her çağda `ruler` yapar. Artık aynı turun kapalı kapı sonucuyla karşılaştırılıyor.
- Release simülasyon, altı politika × 10.000 seed: `compare-reference195.mjs` altısı "identical except contentCardCount 180 → 195" (`docs/analysis/milestone195-windows/`).
- Native CI: [run 44734293652](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44734293652) (#33, workflow_dispatch, kaynak `8a2924bd541962b49fe768586dca37fabea237d9`) **başarılı**, beş işin beşi de geçti. `verify` (macos-15 arm64, Xcode 16.4): Node 70/70, içerik kontrolleri ve doğrulayıcı 0 hata/0 uyarı, Swift 125/125, iPhone SE (3. nesil)/iOS 18.5 simülatöründe derleme, kurulum, başlatma ve 6/6 UI testi (`** TEST SUCCEEDED **`: TR/EN karar ve kaldığı yerden devam, meclis müzakeresi, görünür istatistikler, illüstrasyonlu kartlar + büyük metin/Reduce Motion, ses cue/mute). Dört simülasyon işi (short, knowledge, progression, recovery; macos-15-intel) 10.000 seed ile başarıyla bitti. Artefaktlar: `iphone-ui-evidence`, `quality-reports`, `native-simulations-{short,knowledge,progression,recovery}`. macOS simülasyon raporları `compare-reference195.mjs` ile ayrıca karşılaştırılmadı (artefaktlar indirilmedi); aynı-seed kanıtı yukarıdaki Windows karşılaştırmasıdır. Ekran görüntüleri incelenmedi. Fiziksel cihaz ve ekran görüntüsü incelemesi açık.
- Windows notu: `tools/swift-windows.ps1`, Windows PowerShell 5.1'de swift stderr'e yazınca `NativeCommandError` ile düşer; aynı ortamla `swift.exe` doğrudan çalıştırıldı. `.build/release` sembolik bağı oluşturulamadı; ikili `.build/out/Products/Release-windows-x86_64/FateSimulation.exe`.

## Sıradaki ilk adımlar (195 kabulü) — 1, 2 ve 3 tamamlandı (2026-11-20, CI run 44734293652 başarılı)

1. `swift test` (Windows `tools/swift-windows.ps1` veya macOS). Beklenen: 109 eski + 16 yeni = 125. Hata varsa önce düzeltin.
2. `swift build -c release --product FateSimulation` → altı politika × 10.000 → `node tools/compare-reference195.mjs <dizin>`. Beklenen: altısı da "identical except contentCardCount". Fark çıkarsa bu bir regresyondur; Era 4 kartlarının ilk üç çağ seçimine sızdığını araştırın.
3. Tam native CI (arm64 Simulator yapılandırması, run 44601815107 referans). Ağır işi tekrar tetiklememek için önce 1–2'yi yerelde geçirin. CI hatasında runner/ağ/kapasite/hesap ile kod hatasını ayırın.
4. Ancak bunlardan sonra `docs/QA_REPORT.md` ve `PROGRESS.md`'ye "195 native kabul" yazın.

## Bilinen sorunlar ve açıklar

- `EmpireGroundworkTests.testFirstThreeErasPlayIdentically…` en az bir koşunun Bronz'a ulaşmasını ister; ulaşmazsa seed/tur sayısını artırın, iddiayı kaldırmayın.
- Yeni illüstrasyon üretilmedi (araç yoktu): 43 gerçek aday, 152 eksik. Era 4 için öncelik: `governor_seat`, `aqueduct_quota`, `garrison_supply`, `bond_ledger_transfer`, `mold_requisition`.
- Era 4 doğal maruziyeti ve dengesi ölçülemiyor (çağ kapalı). Era 4'ü açmadan önce kontrollü bir "gate açık" simülasyon bayrağı (yalnız teşhis) eklenmesi önerilir.
- `recorded_provincial_dissent` ve `lawful_review_precedent` şimdilik yalnızca kayıt; sonraki kartlarda okunmalı.
- `civil_law` teknolojisi hiçbir kartta verilmiyor (Era 4 → 5 geçişi için gerekecek). Yasal reform keşfi henüz yazılmadı.
- Hikâye zincirlerinin Era 4 devamları bağımsız editoryal/tarihçi incelemesinden geçmedi.

## Dördüncü çağ neden hâlâ kapalı

`ERA4_GATE.enabled=false` ve envanter 15/40 (9/24 tekrarlanabilir, 3/8 sonuç, 3/8 köprü). Doğrulayıcı, envanter tamamlanmadan anahtarın açılmasını hata sayar. Native ve aynı seed kanıtı da yok.

## 195 → 210 önerilen kapsam (hepsi Era 4, kapı kapalı kalır)

- 8 tekrarlanabilir kriz (toplam 17/24): eyalet sınırı ve garnizon rotasyonu (asker ücreti borcu), yol haydutları ve kervan sigortası, tahıl fiyat tavanı ve kıtlık deposu, liman/nehir gümrüğü, kuraklıkta sulama hakkı mahkemesi, maden ocağı işçi güvenliği, sikke ayarı ve sahte para, valiye karşı şikâyet dilekçesi (`recorded_provincial_dissent` okuyarak).
- 3 köprü (toplam 6/8): `quay_levy`/gümrük → nehir gümrüğü; `harbor_residency`/`guest_gate` → liman mahallesi vatandaşlığı; `night_patrol` → kent muhafız lonca sözleşmesi.
- 3 sonuç (toplam 6/8): `pasture` zinciri (mera → eyalet kapısı vergisi), `hospitality` (konuk → vatandaşlık meclis temsili), `public_voice` (mühür → eyalet meclisi) — her biri bir Era 4 krizi tamamlanmış olmayı ister.
- 1 yasal reform kartı `civil_law` teknolojisini koşullu verir (yalnız kayıt/emsal + bilgi eşiği; bedava değil).
- En az 3–5 gerçek Era 4 illüstrasyonu.
- Kontrollü "gate açık" teşhis simülasyonu (oyuncuya açmadan) ile Era 4 kaynak döngüsü ölçümü.
