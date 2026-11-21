# Devir notu — 240 → 255 paketi (Claude, 2026-11-21)

Bu not geçmiş sohbetleri görmeden okunabilir. Ayrıntılar: `docs/PHASE3_255_REPORT.md`. Ölçüm tabloları: `docs/analysis/milestone255-era4-diagnostic/SUMMARY.md`.

## Kaynak ve dallar

- PR yığını, birleşme sırası #1 → #2 → #3 → #4 → #5 (hiçbiri otomatik birleştirilmedi):
  - #1 `phase3-era4-groundwork` (180 → 195, CI 44734293652)
  - #2 `phase3-era4-210` (CI 44748860814)
  - #3 `phase3-era4-225` (CI 44813221092)
  - #4 `phase3-era4-240` (kaynak `e4c11f6`, CI 44881478766, HEAD `ad3ac27`)
  - #5 `phase3-era4-255` (bu paket; tabanı `ad3ac27`, kaynak `3bc8a65`, CI 44893045378): https://github.com/srcnxylmz/the-cards-of-fate/pull/5
- `main` hâlâ 180 kartlık Phase 2'de. Birleşmeler yapılmadıysa yeni işi `phase3-era4-255` HEAD'inden başlatın.
- Kod SHA'sı, belge SHA'sı, PR bağlantısı ve native CI: "Doğrulama" bölümü.

## Bu pakette yapılanlar

1. **Siyasi teşhis** (`FateSimulation --diagnostic-open-era 4`, yalnız teşhis):
   - Otorite, meclis savunması, rakip gücü ve ilişkileri.
   - Toplantı başına itiraz; ittifak ve müzakerenin açık olduğu kararlar.
   - Özet: `node tools/era4-diagnostic-summary.mjs <dir>…`.
2. **Meclis düzeltmesi (yalnız Era 4):** `politics.institutionDefense` kuralına `reconciliationPerFlag: 1`, `reconciliationCeiling: 15` eklendi.
   - Toplantılarda kurumlar düşman rakip ilişkilerini 15'e kadar yatıştırıyor; 15, tarafsızlık eşiği 20'nin altında.
   - Kod: `GameEngine.reconcileFactions` (`Politics.swift`).
   - Era 4 için `powerStats` bilerek eklenmedi: üç farklı eşleme meclis baskısını artırdı (rapor bölüm 2).
3. **Ekonomik kırılganlık (yalnız Era 4):** `balance.provincialFamineRelief`. Mühürlü kamu deposu açlıkta bir kez açılıyor, açığın en fazla 4 payını karşılıyor, sonra boşalıyor. Kod: `FoodBudget.relieved`, `GameEngine.simulate`.
4. **Yatırımları gören ayrı teşhis politikası:** `--policy investment` (`selectInvestment`, `Sources/FateSimulation/main.swift`).
   - Era 1–3'te progression gibi oynuyor; Era 4'te yalnız görünür bilgiyle kapasite, ambar, kurum, borç ve ilişkiyi değerlendiriyor.
   - Eski beş politika değişmedi. `compare-reference.mjs` yatırım politikasını içermiyor; raporlarda ayrı `policyNote` alanı var.
5. **15 yeni Era 4 kartı** (`tools/content/empire-assembly-events.mjs`):
   - 9 tekrarlanabilir: temsil, toprak vergisi, tahıl paktı, kamu güvenliği, sadakat yemini, toprak hakları, mevsimlik göç, ticaret antlaşması, teras bakımı.
   - 3 köprü: `levy_hearing`, `silt_charter`, `roof_beams`.
   - 3 sonuç: `archive_dispute` + toprak hakları, `water_court` + kanal, `charcoal_embargo` + antlaşma.
   - Era 4 = 75 kart (46 tekrarlanabilir, 14 sonuç, 14 köprü, 1 reform). 240 paketinin kartları birebir aynı; bu pakette eski kart değişmedi.
   - Yeni ledger bayrakları: `regional_grain_pact`, `regional_grain_loan` (tek açık, 6 tur sonra −4), `land_rights_registry`.
6. **Testler:** `tools/empire-assembly-content.test.mjs` (7, CI listesinde) ve `Tests/FateCoreTests/EmpireAssemblyTests.swift` (6). Eski sayım testleri 255'e güncellendi.

## Doğrulama

- **Node:** `build-content --check` geçti; doğrulayıcı 0/0; `node --test tools/*.test.mjs` **99/99**.
- **Swift 6.4.2 (Windows):** **148/148** (136 + 12).
- **Aynı-seed:** altı × 10.000; `compare-reference.mjs docs/analysis/milestone240-windows docs/analysis/milestone255-windows 240 255` → altısı "identical except contentCardCount 240 → 255".
- **Teşhis** (2.000 seed, 210 → 225 → 240 → 255, aynı ikili ve tanımlar):
  - Meclis kaybı knowledge'da 100 kararda −54'ten −31'e indi.
  - Gerçek açlık kaybı progression'da 20,6'dan 10,5'e, random'da 33,1'den 23,7'ye indi.
  - 500 sınırına canlı ulaşan koşular: progression %42, knowledge %57, recovery %65, random %16.
  - İstikrar: progression 25, knowledge 17 (hedef 30, **tutmadı**); random 29.
- **Yatırım politikası** (ayrı): istikrar 86, %93'ü 500 sınırında, gerçek açlık kaybı 100 kararda 1,2.
- **Kod SHA:** `3bc8a65`. **PR:** https://github.com/srcnxylmz/the-cards-of-fate/pull/5 (taban `phase3-era4-240`).
- **Native CI:** native CI [44893045378](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44893045378) (#37, `3bc8a65`) **başarılı**. Node 99/99, Swift 148/148, iPhone UI 6/6 (`** TEST SUCCEEDED **`); dört simülasyon işi başarılı. Altı native rapor (`native-simulations-*` artifact) `docs/analysis/milestone255-windows` ile kanonik JSON alan özetlerinde karşılaştırıldı: altısında 63/63 alan aynı. Belge kaydı bu commit'te (`[skip ci]`).

## Era 4 neden kapalı

Açılış hazırlık değerlendirmesi: rapor bölüm 6.
- Heuristik politikalarda istikrar hedefin altında.
- random'da koşuların %83'ü nüfusun sıfırlanmasıyla bitiyor.
- İyi yatırımcı için Era 4 fazla rahat olabilir; zorluk eğrisi değerlendirilmedi.
- Bağımsız bir olumlu son ve Era 5 içeriği yok.
- `balanceEvidence` boş. Açmak için hepsi gerekir: ekonomik kabul ölçümleri, kaynak SHA, native CI ve kullanıcı onayı.

## Açık riskler

- **Yatıştırma:** uzun koşularda rahip ve avcı ilişkileri 15–20 bandına yerleşiyor. Kart kararları ilişkiyi yine düşürebildiği için rekabet sürüyor (itiraz/toplantı 0,14–0,30). Oyuncu testinde rekabet fazla sönükse `reconciliationCeiling` düşürülmeli.
- **Yatırım politikası** 255 kurallarıyla istikrarı 86'ya taşıyor. Era 4 iyi oyuncu için fazla kolay olabilir. Açılış öncesi, kurumsal savunma (+30) ile büyüme ve birikim tavanları birlikte gözden geçirilmeli.
- **Ambar yardımının** tek başına etkisi küçük; random'daki iyileşme çoğunlukla yeni sıfır-kaynak seçenekleri ve yatıştırmadan geliyor.
- **İllüstrasyon:** görsel üretim aracı yok. 43 aday, **212 eksik**. Fiziksel cihaz, imzalama, Game Center, nihai ses ve marka yapılmadı.
- **Windows araçları:** `tools/swift-windows.ps1` PS 5.1'de düşüyor; `swift.exe` toolchain ortamıyla doğrudan çalıştırıldı. Release ikilisi `.build/out/Products/Release-windows-x86_64/FateSimulation.exe`.
- **Kullanıcının çalışma ağacı:** commit'lenmemiş eski değişiklikler var (`README.md`, kök `technologies.json`, `docs/simulation-survival-council.json`, `docs/swift-*-windows.log`). Dokunulmadı.

## Sonraki paket için öneri (kullanıcı ayrıca belirleyecek)

1. **Zorluk eğrisi:** yatırım politikası ile heuristik politikalar arasındaki farkı daraltmak. Seçenekler: kurumsal savunma ve büyüme tavanlarının kalibrasyonu; Era 4'ün geç dönemine baskı olayları (sınır savaşı, salgın dalgası).
2. **İstikrar:** knowledge politikasının bilgi uğruna istikrarı satması. Bilgi-istikrar takasını dengeleyen Era 4 kararları, politikayı değiştirmeden ölçülmeli.
3. **Olumlu bir Era 4 sonu ya da Era 5 köprüsü:** `civil_law` sonrası, 500 sınırını "kazanç" sanmamak için.
4. **Açılış paketi:** `balanceEvidence` (rapor yolu, kaynak SHA, native CI çalıştırması) + kullanıcı onayı.
5. **Görseller (araç varsa):** `representation_reform`, `grain_pact`, `land_rights_survey`, `trade_treaty`, `terrace_upkeep`.
