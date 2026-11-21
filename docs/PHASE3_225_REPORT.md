# Phase 3 — 210 → 225 paketi: Antik İmparatorluklarda yiyecek ve üretim (Era 4 hâlâ kapalı)

Tarih: 2026-11-20 · Yazar: Claude · Dal: `phase3-era4-225` (taban `phase3-era4-210` / PR #2, o da PR #1 üzerine) · Kaynak SHA ve CI: [HANDOFF_225.md](HANDOFF_225.md).

## 1. Özet

- **Kart ve karar:** 225 kart (+15), 600 karar (+59), 199 statik çağlar arası bağlantı (+16). Doğrulayıcı 0 hata, 0 uyarı.
- **Era 4 envanteri:** 45 olay; 28 tekrarlanabilir, 8 sonuç, 8 köprü, 1 hukuki reform. 40/24/8/8 asgari ölçütü ve sekiz zorunlu alan karşılanıyor.
- **Era 4 kapısı:** `enabled:false` kaldı. Envanter artık yeterli olduğu için kapıya ayrı bir şart eklendi: `balanceEvidence:null`. Doğrulayıcı, denge kanıtı kaydedilmeden açılan kapıyı hata sayıyor.
- **Normal oyun:** değişmedi. Altı politika × 10.000 seed, 210 raporlarıyla birebir aynı; tek fark `contentCardCount` (210 → 225).
- **Hedefler:** Teşhis ölçümünde deste tükenmesi hedefi tuttu. Açlık sonu ve iki politikada istikrar hedefleri tutmadı (bölüm 5). Kapı bu yüzden de kapalı.

## 2. Önce ölçüm: 210'da açlığın nedeni (gerçek Swift motoru)

`FateSimulation --diagnostic-open-era 4` raporlarına yalnız teşhis modunda `diagnosticEconomy` bölümü eklendi; normal raporların biçimi değişmedi. 210 kaynağında, progression politikasında 2.000 seed ile ölçülen değerler:

| Ölçüm | Değer | Anlamı |
|---|---|---|
| Era 4 giriş rezervi (kaynak/nüfus/istikrar/çevre) | 44 / 53 / 47 / 36 | Girişte rezerv var. Sorun girişte değil, sonraki gidişte. |
| Tur başına yiyecek üretimi / tüketimi | 2,54 / 4 | Yapısal açık ≈ 1,5/tur. 300 seed'lik ön ölçümde Era 4 kararlarının yalnız %34–37'sinde (recovery'de %14) ambar var; çevre ~30 olduğu için sulamanın katkısı küçük. |
| Kart başına net kaynak (statik, 30 Era 4 kartı) | ortalama −2,9 (Era 3: −0,5); en iyi seçenek ortalaması +1,9 (Era 3: +4,3) | Era 4 kartları bilinçli olarak harcatıyor, ama gelir yapısı yok. |
| Ücretli yatırım / gecikmeli getiri | 210'da Era 4'e özgü üretim kapasitesi yok; gecikmeli kaynak net −0,4/karar | Gecikmeli kalemler çoğunlukla borç ve ihmalin bedeli. |
| Sıfır kaynakta uygun kart | 2,1 | 30 kartın yalnız 11'inde rezerv istemeyen iki seçenek var; deste kilitleniyor (koşuların %40'ı "uygun olay kalmadı"). |
| Açlık | karar başına %14,5 açlık turu; açlık turunda −4,4 nüfus | |
| İstikrarın çöküşü | koşuların %98'inde girişten ~17 tur sonra < 15 | |
| Kart kaynaklı nüfus | Era 4 karar başına −0,29 (Era 3: +0,09) | "Açlık sonu" aslında nüfusun sıfıra inmesi. Bunun bir kısmı kartların kendisinden geliyor. |

Motorun kuralı: `FoodBudget` üretimi tüketimle (4) sınırlar. Üretim açlığı bitirebilir, ama kendi başına rezerv biriktiremez. Bu kural korundu.

## 3. Uygulanan üretim/yiyecek döngüsü

**Motor (yalnız Era 4, veriyle):** `Balance.provincialProduction` isteğe bağlı bir alan. Eski içerik bu alan olmadan da açılır. `FoodBudget`, bayrağı duran her kaynak için +1 pay ekler. Toplam yine `resourceConsumption` ile sınırlı.

| Kapasite bayrağı | Şart | Nasıl kurulur (bedel) | Nasıl kaybolur |
|---|---|---|---|
| `estate_fields_worked` | Era ≥ 4, nüfus ≥ 20 | `provincial_estates.clear`: −10 kaynak, −2 nüfus, rezerv 10, nüfus ≥ 30; 5 tur sonra +3. Ya da `lease`: +3 peşinat, −3 otorite, −4 istikrar | Üçte iki pay dayatılırsa %50 olasılıkla kiracılar terk eder; nüfus 20'nin altına inerse üretmez |
| `canal_fields_open` | Era ≥ 4, çevre ≥ 30 | `dig`: −9 (eski `canal_expansion` hattıyla −6), rezerv 9; 6 tur sonra +2. Ya da angarya (nüfus/istikrar). Ya da komşularla ortak hendek (−4 otorite) | Temizlik ertelenirse 5 tur sonra çamurla tıkanır; kuraklıkta su kente çevrilirse 3 tur kuru kalır |
| `harbor_fishery_licensed` | Era ≥ 4, nüfus ≥ 15, çevre ≥ 20 | `license`: −7 (eski balık geçidi kuralıyla −5), +2 nüfus; 5 tur sonra +2. Ya da açık av (−5 çevre) | Aşırı avla çevre düşerse üretmez |
| `granary_register_kept` | Era ≥ 4, nüfus ≥ 10 | Öşürde tartı kâtibi (−3) ya da ambar kayıt dairesi köprüsü | İdari kayıt; fiziksel kaybı yok (açık sorun, bölüm 7) |

İlkeler:
1. Her yatırımın başlangıç maliyeti var: rezerv, nüfus ya da siyasi bedel.
2. Üretim, nüfus veya çevre girdisine bağlı.
3. Getiri gecikmeli ve maliyetten az. Test: `later < cost`, en az 3 tur.
4. Düşük nüfus ve bozulan çevre üretimi keser.
5. Bakım yapılmazsa kapasite gerileyebilir.
6. Eski kayıtlar yalnız indirim verir. Bunlara bağlı her sonuç net ≤ 0 kaynak üretir.

## 4. Yeni 15 kart (`tools/content/empire-harvest-events.mjs`)

| Kart | Rol / alan | Özü |
|---|---|---|
| `provincial_estates` | tekrarlanabilir / production | Boşalan köylere eyalet çiftliği: ücretli kuruluş, uzun kira, ölçüm/ekim nöbeti, başakçılık |
| `crop_share_dispute` | tekrarlanabilir / economy | Kiracı ↔ toprak sahibi payı; nüfus < 30 ise hasat ince; hakem, kil arşivi emsali (`public_archive`) |
| `harvest_tithe` | tekrarlanabilir / taxation | Öşür; `debased_coinage` varsa sikkeyle ödenen öşür değer kaybeder; ambar tartı kaydı |
| `famine_store_release` | tekrarlanabilir / economy | `grain_famine_store` maliyetine satılır; yoksa tüccar ambarlarına el konur; `grain_price_ceiling` altında karne; faizsiz tapınak borcu (tek açık, 6 tur sonra −4 ile kapanır) |
| `canal_extension` | tekrarlanabilir / water | Kazı, angarya, ücretli temizlik; "bu yıl harcama" kararı kanalı ertelemeyle tıkar ya da komşularla ortak hendek kurar |
| `harbor_fishery` | tekrarlanabilir / trade | İzin (`fish_passage_rule` indirimi), açık av, tuzlu balık ticareti, yumurtlama yasağı |
| `grain_convoy` | tekrarlanabilir / logistics | Ücretli muhafız (`caravan_insurance_pool` payı böler); garnizon ve `garrison_pay_arrears` yalnız ödemeyle kapanır; korumasız gönderim ya da `river_customs_farmed` mültezimi; bekletince çürüme |
| `drought_year` | tekrarlanabilir / ecology | Sarnıç, `water_compact` emsali, suyun önce kente verilmesi (kanal bir mevsim kurur), sürülerin dağa gönderilmesi |
| `plague_quarantine` | tekrarlanabilir / health | Ücretli karantina (`public_care_settlement` ile hemşireler), kapıları kapatma, tapınak, yok sayma (50/50) |
| `insula_fire` | tekrarlanabilir / settlement | Kiremit çatı zorunluluğu; kamu ya da özel muhafız loncası ya da kova zinciri; yeniden yapımı ev sahiplerine bırakma |
| `ferry_upkeep` | tekrarlanabilir / roads | Onarım (`civic_ferry_rule` nöbetiyle ucuz), `household_ferry_lease`, geçiş ücreti, ertele (5 tur sonra batma) |
| `infirmary_ward` | köprü / care_work | `ward_charter` → eyalet darüşşifası (kamu, ücretli, tapınak, tecrit evi) |
| `granary_tally_office` | köprü / memory | `clay_archive` → ambar kayıt dairesi (`public_archive`, `witness_law`, tüccar kâtipleri, çetele) |
| `quarry_stone_granary` | sonuç / stored_power | `quarry_arbitration` + `quarry_collapse`: Tunç ocak hakemliği ambar inşaatına |
| `furnace_fire_law` | sonuç / embers | `furnace_coop` + `insula_fire`: ocakların yangın yasası |

Yeni tekrarlanabilir kartların 11'i de, sıfır kaynak / düşük istikrar / düşük nüfus / bozuk çevre / açık borç / düşmanca meclis fikstürlerinde en az iki gerçek seçenek sunuyor. Bu seçeneklerin hiçbiri bedelsiz değil (Node testi ve Swift testi).

Zincir desteği (2.000 seed teşhis koşusunda kaydın seçildiği koşu oranı; progression / knowledge / recovery):
- `ward_charter`: %0,3 / %3,5 / %0,1 → `infirmary_ward` %0,3 / %3,4 / %0,1. Bu köprü nadir ama gerçek.
- `clay_archive`: %51 / %65 / %53 → `granary_tally_office` %50 / %52 / %52.
- `quarry_arbitration`: %4 / %16 / %4 → `quarry_stone_granary` %4 / %11 / %4.
- `furnace_coop`: %35 / %61 / %34 → `furnace_fire_law` %34 / %48 / %32.

Ödenmiş borçlar yeniden açılmıyor; borç kimlikleri ayrı (`temple_grain_loan`, `garrison_pay_arrears`, `tribute_arrears`). `recorded_provincial_dissent` silinmiyor. Kıtlık deposu ile fiyat tavanı karşılıklı dışlayıcı kalıyor.

## 5. Era 4 dengesi — teşhis ölçümü (kapı zorla açık, oyuncuya kapalı)

Aynı ikili ve aynı seed'ler kullanıldı; 210 sütunu `--cards docs/analysis/milestone225-210-before/cards.json` ile ölçüldü. Tam tablolar: `docs/analysis/milestone225-era4-diagnostic/SUMMARY.md`.

| Politika (2.000 seed) | Açlık sonu 210 → 225 | Deste tükenmesi | Era 4 karar/koşu | Ort. istikrar | Üretim/tur | Açlık turu |
|---|---|---|---|---|---|---|
| progression | %60,0 → %99,8 | %39,9 → **%0** | 42 → **116** | 15,7 → 12,2 | 2,54 → 3,60 | %14,5 → %5,9 |
| knowledge | %73,2 → %86,6 (500 sınırı %4 → %13) | %22,5 → **%0** | 72 → **140** | 11,2 → 9,2 | 2,89 → 3,64 | %3,7 → %1,8 |
| recovery | %58,6 → %99,9 | %41,4 → **%0** | 32 → **130** | 52,4 → 46,3 | 2,96 → 3,81 | %20,7 → %5,1 |
| random | %59,8 → %99,8 | %40,2 → **%0** | 30 → **58** | 49,3 → 36,3 | 3,13 → 3,73 | %19,1 → %11,6 |
| survival | Era 4'e ulaşmıyor | – | – | – | – | – |

Hedeflere göre:
- **Deste tükenmesi < %5:** tuttu, her politikada %0. Sıfır kaynakta uygun kart 2 → 12.
- **Açlık sonu < %25:** **tutmadı.** Koşular artık deste tükenmesiyle değil, daha geç ama yine nüfusun sıfırlanmasıyla bitiyor. Bu yüzden oran yükseldi, ama Era 4'te yaşam süresi 2–4 kat uzadı ve açlık turu oranı yarıya ya da dörtte bire indi. Bir koşu yalnız 500 karar sınırına ulaşırsa açlıkla bitmemiş sayılıyor. Bunu başaran tek politika knowledge (%13).
- **Ortalama istikrar ≥ 30:** recovery (46) ve random (36) tuttu; progression (12) ve knowledge (9) **tutmadı**. Bu iki politika kaynak 25'in altına inince istikrarı kaynakla takas ediyor (`SimulationPolicy` ağırlıkları değiştirilmedi).
- **Tekrar:** ilk 20 Era 4 kararında %16–24'ten %0–2'ye indi; ilk 40'ta %46–51'den %22–29'a. İlk 80'de değişmedi (%50–60); uzun koşularda tekrar kaçınılmaz. 100. karardan sonra aktif çeşitlilik 6–13 karttan 13–22 karta çıktı.

Kalan açığın kaynakları (ölçülmüş):
1. 210'un 30 Era 4 kartı. Karar başına nüfus etkisi hâlâ −0,2 civarında. En büyük kalemler `quarry_collapse.push`, `garrison_supply.delay/requisition`, `grain_ceiling.free`. Bu kartlar paket kuralı gereği değiştirilmedi.
2. Üretim tavanı. Üretim tüketimi (4) geçemiyor; kalan açık kart harcamasından geliyor.
3. Miyop politikalar. Yalnız anlık stat değişimini puanlıyorlar; bayrakla gelen kapasiteyi görmüyorlar (bilinen sınırlama; politikalar değiştirilmedi).

## 6. Testlerin gerçek sonuçları (Windows 11, Node v25.2.1, Swift 6.4.2)

| Komut | Sonuç |
|---|---|
| `node tools/build-content.mjs --check` | geçti (225 kart) |
| `node tools/validate-content.mjs` | 0 hata, 0 uyarı; Era 4 45/28/8/8, `satisfied:true`, `open:false` |
| `node --test tools/*.test.mjs` | **84/84** (77 + 7 yeni `empire-harvest-content.test.mjs`) |
| `generate-feedback.mjs --check`, `art-audit.mjs` | geçti |
| `swift test` | **135/135** (FateCoreTests 123 + FateDiagnosticsTests 12; 8 yeni `EmpireHarvestTests`) |
| Release `FateSimulation`, altı politika × 10.000 seed | `node tools/compare-reference.mjs docs/analysis/milestone210-windows docs/analysis/milestone225-windows 210 225`: altısı "identical except contentCardCount 210 → 225" |
| Teşhis, beş politika × 2.000 seed (210 referansı ve 225) | `docs/analysis/milestone225-era4-diagnostic/`, `docs/analysis/milestone225-210-era4-reference/` |
| Native iPhone CI | [run 44813221092](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44813221092), kaynak `89173de`: **başarılı**. 5/5 iş; verify'da Node, Swift, iPhone derleme/kurulum/açılış ve TR/EN UI adımları geçti. Sayılar logdan okunmadı (log oturum istiyor) |

Yeni Swift testleri:
- Kapasitenin yalnız Era 4'te, nüfus ve çevre şartıyla ve tüketim tavanı altında üretmesi.
- Ücretli çiftlik yatırımı ve gecikmeli, maliyetten küçük getiri.
- Sıfır kaynakta 11 kartın her seçeneğinin seçilebilmesi ve kayıttan sonra aynı sonucu vermesi.
- Tapınak borcunun birikmemesi ve kendini kapatması.
- İhmal edilen kanalın tıkanması; kuraklıkta kanalın tek mevsim kuruması.
- Ücret borcunun yalnız ödemeyle kapanması; depo ile tavanın birbirini dışlaması.
- Yeni sonuçların iki kaydı birden istemesi.
- 210 destesi ve kapasitesiz balance ile normal oyunun 12 seed × 160 kararda birebir aynı kalması.

Önceki paketin `testEveryEraFourChoiceAndContextOutcomeIsSelectableAndReplayable` testi genişletildi. Yeni kartlarda gerçek 50/50 sonuçlar olduğu için her sonucun en az bir seed'de gerçekten çıkması isteniyor (195–258). Hiçbir sonuç denetimden çıkarılmadı.

## 7. Açık sorunlar

- Era 4 açlık sonu ve iki politikada istikrar hedefleri tutmadı (bölüm 5).
- `granary_register_kept` idari bir kayıt; fiziksel bir kayıp yolu yok, yalnız nüfus ≥ 10 şartı var.
- `ward_charter` köprüsü nadir tamamlanıyor; `quarry_stone_granary` için de Tunç kaydı seyrek.
- `garrison_supply.delay` ve `quarry_collapse.push` gibi eski kartların nüfus maliyeti ilk 210 içinde; dokunulmadı.

## 8. Görsel ve ses

Görsel üretim aracı yok: **yeni illüstrasyon üretilmedi**. 43 gerçek aday korunuyor; manifestte 182 eksik satır var (15 yeni kart dahil). Sanat yönü satırları her kart için ayrı ve dönem kurallarına uygun. Öncelikli sahneler: eyalet çiftliği (`provincial_estates`), imparatorluk ambarı (`granary_tally_office`, `quarry_stone_granary`), su anlaşmazlığı (`canal_extension`, `drought_year`), şehir mahkemesi (`crop_share_dispute`), liman (`harbor_fishery`). Ses değişmedi.
