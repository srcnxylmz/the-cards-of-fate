# Devir notu — 210 → 225 paketi (Claude → Codex, 2026-11-20)

Bu not geçmiş sohbetleri görmeden okunabilir. Ayrıntılar, tablolar ve kart listesi: `docs/PHASE3_225_REPORT.md`.

## Kaynak ve dallar

- PR yığını, birleşme sırası #1 → #2 → yeni PR (hiçbiri otomatik birleştirilmedi):
  - PR #1 `phase3-era4-groundwork` (180 → 195, native CI 44734293652 başarılı)
  - PR #2 `phase3-era4-210` (195 → 210, kod `0521f6f`, belge `f723b75`, native CI 44748860814 başarılı)
  - PR #3 `phase3-era4-225` (bu paket; tabanı `f723b75`; doğrulanan kaynak `89173de`)
- `main` hâlâ 180 kartlık Phase 2'de. Yeni işi `main`'den değil, birleşmeler yapılmadıysa bu dalın HEAD'inden başlatın.
- Kod/içerik commit'i bu dalın ilk 225 commit'idir. Native CI sonucu ve SHA: aşağıdaki "Native CI" satırı ve PROGRESS/QA_REPORT.

## Yapılanlar

1. **Teşhis ölçümü** (`Sources/FateSimulation/main.swift`, yalnız `--diagnostic-open-era`): `diagnosticEconomy` bölümü. İçinde:
   - Era 4 giriş rezervi, tur başına yiyecek üretimi/tüketimi, açlık turları ve nüfus kaybı.
   - İstikrarın çöküş süresi, uygun kart ve aktif seçenek sayıları.
   - Sıfır kaynak, düşük istikrar, nüfus, çevre ve düşmanca meclis durumlarında uygun kart sayısı.
   - İlk 20/40/80 Era 4 kararında tekrar oranı, 100. karardan sonra çeşitlilik, üreten kapasite payı.
   - Normal raporların biçimi değişmedi.
   - Özet aracı: `node tools/era4-diagnostic-summary.mjs <dir> [<dir>…]`.
2. **Motor (yalnız Era 4):**
   - `Balance.provincialProduction` (isteğe bağlı, `ProductionSource`) ve `FoodBudget`'ta bayrak, nüfus ve çevre şartlı +1 paylar.
   - Toplam üretim yine `resourceConsumption` ile sınırlı.
   - Yeni kalıcı state yok; kayıt şeması v1.
3. **15 yeni Era 4 kartı** (`tools/content/empire-harvest-events.mjs`):
   - 11 tekrarlanabilir: 8 yiyecek/üretim + salgın, yangın, feribot.
   - 2 köprü: `ward_charter` → darüşşifa, `clay_archive` → ambar kayıt dairesi.
   - 2 sonuç: `stored_power`, `embers`.
4. **Envanter ve kapı:** envanter 45 · 28 · 8 · 8 (+1 reform), asgari ölçüt karşılandı. `ERA4_GATE.enabled:false` kaldı. Yeni alan `balanceEvidence:null`: doğrulayıcı, bu alan dolmadan `enabled:true`'yu hata sayar (`gate enabled without recorded balance evidence`). Swift bu alanı yok sayar.
5. **Testler:**
   - `tools/empire-harvest-content.test.mjs` (7 test, CI listesinde) ve `Tests/FateCoreTests/EmpireHarvestTests.swift` (8 test).
   - Eski testler 225'e güncellendi: ilk 195 ve ilk 210 kart birebir korunuyor (`docs/analysis/milestone225-210-before/`).

## Gerçek test sonuçları (Windows, bu dal)

- **Node:** `build-content --check` geçti; doğrulayıcı 0/0; `node --test tools/*.test.mjs` **84/84**.
- **Swift 6.4.2:** `swift test` **135/135** (123 + 12).
  - İlk turda yeni kartlardaki 50/50 sonuçlar, eski "her sonuç tek seed'le çözülür" testine takıldı. Test her sonucun en az bir seed'de (195–258) gerçekten çıkmasını isteyecek şekilde genişletildi.
  - Kendi test kodumdaki bir sorun düzeltildi. Motor hatası bulunmadı.
- **Aynı seed:** altı politika × 10.000, `compare-reference.mjs … 210 225` → altısı "identical except contentCardCount 210 → 225". Normal oyuncu 180 kartlık oynanışı birebir yaşıyor.
- **Teşhis** (kapı zorla açık, 2.000 seed): `docs/analysis/milestone225-era4-diagnostic/SUMMARY.md`.
  - 210 → 225: deste tükenmesi %22–41 → %0. Era 4'te karar/koşu progression 42 → 116, knowledge 72 → 140, recovery 32 → 130. Üretim 2,5–3,1 → 3,6–3,8/tur. Açlık turu oranı ½–¼'e indi.
  - **Açlık sonu %87–100** (hedef < %25, tutmadı). Ortalama istikrar progression 12, knowledge 9 (hedef ≥ 30, tutmadı); recovery 46 ve random 36 tuttu.
- **Native CI [run 44813221092](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44813221092) (#35, `89173de`, workflow_dispatch) **başarılı**: 5/5 iş yeşil (verify; short, knowledge, progression ve recovery simülasyonları). verify işindeki her adım başarılı: Node testleri, art-audit, feedback, `build-content --check`, doğrulayıcı, macOS Swift testleri, Xcode projesi, iPhone simülatöründe derleme, kurulum ve açılış, TR/EN UI ve kalıcılık, ekran görüntüsü dışa aktarımı. Kaynak: GitHub API'deki iş ve adım durumları. Ayrıntılı log oturum istediği için test sayıları logdan okunmadı.** Era 4 kapalı olduğu için bu, 225 içeriğinin kabulüdür; Era 4 açılış kabulü değildir.

## Era 4 neden kapalı

1. Teşhis ölçümünde koşuların neredeyse tamamı hâlâ nüfusun sıfırlanmasıyla bitiyor. Bu, açlık sonu < %25 hedefinden çok uzak.
2. progression ve knowledge politikalarında Era 4 ortalama istikrarı 9–12.
3. `balanceEvidence` boş; açma kararı ayrıca kullanıcı onayı ister.

## Bilinen sorunlar ve kök nedenler

- **30 eski Era 4 kartının nüfus/kaynak maliyeti.** Örnekler: `quarry_collapse.push`, `garrison_supply.delay/requisition`, `grain_ceiling.free`, `aqueduct_quota.sell`. Kart seçimi Era 4'te hâlâ karar başına yaklaşık −0,2 nüfus götürüyor (Era 3: +0,09). Bu kartlar paket kuralı gereği değiştirilmedi.
- **Üretim tavanı:** üretim tüketimi geçemiyor. Kalan açık kart harcamasından geliyor.
- **Politikalar miyop.** Yalnız anlık stat değişimini puanlıyorlar; kapasite bayraklarını görmüyorlar. Değiştirilmedi.
- `granary_register_kept` için fiziksel kayıp yolu yok.
- `ward_charter` köprüsü koşuların yalnız %0,1–3,5'inde açılıyor.
- **İllüstrasyon yok:** görsel üretim aracı yok. 43 gerçek aday, 182 eksik.
- **Windows:** `tools/swift-windows.ps1`, PS 5.1'de stderr yüzünden düşüyor; `swift.exe` toolchain ortamıyla doğrudan çalıştırıldı. Release ikilisi: `.build/out/Products/Release-windows-x86_64/FateSimulation.exe`.
- **Kullanıcının çalışma ağacı:** commit'lenmemiş eski değişiklikler var (`README.md`, kök `technologies.json`, `docs/simulation-survival-council.json`, `docs/swift-*-windows.log`). Dokunulmadı.

## Sonraki adım için öneri (Codex)

Era 4 kapalı kalmalı. Hedef: teşhis ölçütlerini dürüstçe karşılamak.

1. **Kullanıcı kararı gerekiyor:** 210'un eski Era 4 kartlarındaki nüfus götüren seçenekler yeniden dengelenebilir mi? Bunu yapmak "ilk 210 birebir korunur" testini bilinçli olarak değiştirmek demek. Önce onay alın.
2. **Nüfusa bağlı tüketim ya da Era 4'e özgü nüfus artışı** (doyurulan hanelerin büyümesi). Yalnız Era ≥ 4'te ve veriyle yapılmalı; ilk üç çağın aynı-seed sonuçları değişmemeli (`EmpireHarvestTests.testNormalPlayIsUnchangedByTheClosedEraFourPackage`).
3. **İstikrar kaynakları:** kaynak istemeyen, siyasi bedelli uzlaşı kararları. Kaynak 25'in altındayken istikrarı kaynakla takas eden politikalar için ölçülmeli.
4. **Her adımda ölçüm:** `FateSimulation 500 --policy p --diagnostic-open-era 4`; sonra 2.000 seed ve `era4-diagnostic-summary.mjs`.
5. **Kapıyı açmak için:** `balanceEvidence` (rapor yolu, kaynak SHA, native CI) + kullanıcı onayı.
6. **Görseller:** 3–5 Era 4 illüstrasyonu (araç varsa): `provincial_estates`, `granary_tally_office`, `canal_extension`, `crop_share_dispute`, `harbor_fishery`.
