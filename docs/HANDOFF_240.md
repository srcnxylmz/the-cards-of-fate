# Devir notu — 225 → 240 paketi (Claude, 2026-11-21)

Bu not geçmiş sohbetleri görmeden okunabilir. Ayrıntılar ve tablolar: `docs/PHASE3_240_REPORT.md`. Ölçüm tabloları: `docs/analysis/milestone240-era4-diagnostic/SUMMARY.md`.

## Kaynak ve dallar

- PR yığını, birleşme sırası #1 → #2 → #3 → #4 (hiçbiri otomatik birleştirilmedi):
  - PR #1 `phase3-era4-groundwork` (180 → 195, native CI 44734293652 başarılı)
  - PR #2 `phase3-era4-210` (195 → 210, native CI 44748860814 başarılı)
  - PR #3 `phase3-era4-225` (210 → 225, kaynak `89173de`, native CI 44813221092 başarılı, dal HEAD `8bc4648`)
  - PR #4 `phase3-era4-240` (bu paket; tabanı `8bc4648`)
- `main` hâlâ 180 kartlık Phase 2'de. Birleşmeler yapılmadıysa yeni işi `phase3-era4-240` HEAD'inden başlatın.
- Kod commit'i, belge commit'i, PR bağlantısı ve native CI: aşağıdaki "Doğrulama" bölümü.

## Bu pakette yapılanlar

1. **Ölüm ve istikrar ayrıştırması** (`FateSimulation --diagnostic-open-era 4`, yalnız teşhis):
   - Aşama başına nüfus, istikrar ve kaynak akışı; kart ve seçim başına nüfus kaybı.
   - 20./40./80. Era 4 kararındaki seviyeler; nüfusu sıfırlayan aşama.
   - Özet: `node tools/era4-diagnostic-summary.mjs <dir>…`.
   - Eski paketleri aynı ikiliyle ölçmek için `--balance` ve `--politics` seçenekleri (`--cards` ile birlikte).
2. **Kontrollü yeniden dengeleme:** `EMPIRE_REBALANCE` (`tools/content/empire-governance-events.mjs`). Yedi eski Era 4 sonucu değişti:
   - Nüfus kaybı yarıya indi; bedelin bir kısmı üretim, çevre ya da gecikmeli gelir kaybına taşındı.
   - Kimlikler, gereksinimler, bayraklar ve borçlar değişmedi.
   - Testler eski paketleri "beyan edilen düzeltme dışında birebir aynı" diye denetliyor.
3. **Era 4 motor kuralları** (isteğe bağlı veri, yeni kalıcı state yok, v1 kayıt aynı):
   - `balance.provincialStorage`: fazla kapasitenin turda 1 payı ambara girer. Kayıt (`granary_register_kept` ya da `grain_famine_store`) gerekir; açlık ve ödenmemiş gider olmamalı; rezerv 40'ın altında olmalı.
   - `balance.provincialGrowth`: kendi üretimiyle doyan, istikrarı ≥ 25 olan eyalete her 4. turda bir hane eklenir; nüfus < 60.
   - `politics.institutionDefense`: yetki paylaşan her kurum meclis savunmasına +10 ekler, en fazla +30.
4. **15 yeni Era 4 kartı:** 9 tekrarlanabilir yönetim ve toparlanma olayı, 3 köprü (`council_seal`, `furnace_wood`, `debt_tablet`), 3 sonuç (`seal_copy`+öşür, `succession_tablet`+vali değişimi, `caravan_charter`+tahıl sözleşmesi). Era 4 = 60: 37 tekrarlanabilir, 11 sonuç, 11 köprü, 1 reform.
5. **Testler:** `tools/empire-governance-content.test.mjs` (8, CI listesinde) ve `Tests/FateCoreTests/EmpireGovernanceTests.swift` (7). Eski sayım testleri 240'a güncellendi.

## Doğrulama (gerçek sonuçlar)

- **Node:** `build-content --check` geçti; doğrulayıcı 0/0; `node --test tools/*.test.mjs` **92/92**.
- **Swift 6.4.2 (Windows):** **142/142** (130 + 12).
- **Teşhis** (2.000 seed, 210 → 225 → 240, aynı ikili ve tanımlar):
  - Kart kaynaklı nüfus kaybı 100 kararda 29–44'ten 15–23'e indi.
  - 500 sınırına canlı ulaşan koşular: recovery %62, knowledge %46, progression %16.
  - Ortalama istikrar: progression 22, knowledge 14 (hedef ≈ 30, **tutmadı**); recovery 55, random 32.
  - Deste tükenmesi %0. random hâlâ %95 nüfus sıfırlanması.
- **Aynı-seed:** altı politika × 10.000 seed, `node tools/compare-reference.mjs docs/analysis/milestone225-windows docs/analysis/milestone240-windows 225 240` → altısı "identical except contentCardCount 225 → 240" (`docs/analysis/milestone240-windows/`). Normal oyuncu 180 kartlık oynanışı birebir yaşıyor.
- **Native CI:** PR açıldıktan sonra tek tam koşu; sonuç bu bölüme ve PROGRESS/QA_REPORT'a işlenir.

## Era 4 neden kapalı

1. progression ve knowledge istikrarı hedefin altında.
2. random politikasında koşuların %95'i nüfusun sıfırlanmasıyla bitiyor; progression'da gerçek açlık kaybı hâlâ 100 kararda 20,6.
3. `balanceEvidence` boş. Açmak için şunların hepsi gerekir: ekonomik kabul ölçümleri, kaynak SHA, native doğrulama ve kullanıcı onayı. Era 5'te kart yok, kapısı kapalı.

## Açık riskler

- **Kurumsal meşruiyet büyük bir kaldıraç** (+30'a kadar). Bunu yalnız otorite bedeliyle dengeledik. Oyuncu testinde "bütün kurumları kur" tek baskın strateji çıkarsa `defensePerFlag` ya da `maximumDefense` düşürülmeli.
- **Büyüme kuralı** (her 4 turda +1) recovery'de 100 kararda +15,5 hane veriyor. Bu, recovery'deki gerçek açlık kaybından (−8) fazla. Uzun koşularda nüfus 50–60 bandında kalıyor; sınır 60 bunu tutuyor.
- **Birikim:** random'da 100 kararda 63 kaynak. Rezerv tavanı (40) sayesinde sınırsız değil, ama tavan altında hızlı.
- **Politikalar miyop.** Kapasite ve kurum değerini görmüyorlar. Ayrı bir "kapasite bilen" teşhis politikası yazılmadı; önerilir, ama eski beş politikayla karıştırılmamalı.
- **İllüstrasyon yok:** görsel üretim aracı yok. 43 aday, 197 eksik.
- **Windows araçları:** `tools/swift-windows.ps1` PS 5.1'de düşüyor; `swift.exe` toolchain ortamıyla doğrudan çalıştırıldı. Release ikilisi `.build/out/Products/Release-windows-x86_64/FateSimulation.exe`.
- **Kullanıcının çalışma ağacı:** commit'lenmemiş eski değişiklikler var (`README.md`, kök `technologies.json`, `docs/simulation-survival-council.json`, `docs/swift-*-windows.log`). Dokunulmadı.

## Sonraki paket için öneri (kullanıcı ayrıca belirleyecek)

1. **İstikrar:** knowledge politikasında meclis baskısını ölçerek azaltmak. Seçenekler:
   - Era 4 `powerStats` girdisi; şu an Era 4 rakipleri istikrardan güç alıyor, yani istikrar arttıkça baskı da artıyor.
   - Meclis eylemlerinin Era 4 maliyeti.
2. **random politikası:** rastgele oyuncunun da sürdürebileceği, kapasite istemeyen asgari bir yiyecek güvencesi; bedelli ve sınırlı olmalı.
3. **Kapasite bilen ayrı teşhis politikası:** insan oyuncuya daha yakın bir ölçüm için.
4. **Kapıyı açmak için:** `balanceEvidence` alanı (rapor yolu, kaynak SHA, native CI çalıştırması) + kullanıcı onayı.
5. **Görseller:** 3–5 Era 4 illüstrasyonu (araç varsa): `assembly_power_share`, `refugee_settlement`, `surplus_harvest`, `grain_contract`, `well_sanitation`.
6. **MASTER_SPEC hedefleri:** 800 kart, 100 tamamlanmış zincir, 30 son. Henüz bağımsız bir olumlu son yok; bitiş yüzdeleri bu yüzden tek başına başarı ölçütü değil.
