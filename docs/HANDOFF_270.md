# Devir notu — main birleştirmesi ve 255 → 270 paketi (Claude, 2026-11-21)

Bu not geçmiş sohbetleri görmeden okunabilir. Ayrıntılar: [PHASE3_270_REPORT.md](PHASE3_270_REPORT.md), açılış değerlendirmesi: [ERA4_LAUNCH_CANDIDATE.md](ERA4_LAUNCH_CANDIDATE.md), ölçümler: [SUMMARY.md](analysis/milestone270-era4-diagnostic/SUMMARY.md).

## Kaynak ve dallar

- **PR #1–#5** merge commit ile `main`'e birleştirildi. Son birleşme sonrası `main` = `065e39a`. Ağacı doğrulanan 255 HEAD'i `c5ab913` ile birebir aynı. Ayrıntı: [PHASE3_MAIN_INTEGRATION.md](PHASE3_MAIN_INTEGRATION.md).
- **Yığılmış PR yapısı bitti.** 270 dalı `phase3-era4-270`, güncel `main`'den açıldı ve PR'ı doğrudan `main`'e hedefleniyor.
- **Eski dallar** (`phase3-era4-groundwork` … `phase3-era4-255`) silinmedi; birleştikleri için silinebilirler.
- **SHA'lar, PR ve native CI:** "Doğrulama" bölümü.

## Bu pakette yapılanlar

1. **Zorluk eğrisi ölçümü** (yalnız teşhis):
   - 40/80/160/240. Era 4 kararlarında güç dengesi.
   - 160. karardaki yatırım bileşimi ve hayatta kalma.
   - Az yatırımla istikrarlı koşular.
   - Dönüm noktası engelleri.
   - Kod: `Sources/FateSimulation/main.swift`; `diagnosticEconomy` anahtarları `power*`, `combo160.*`, `lowInvest160.*`, `milestone.*`.
2. **Dokuz geç oyun krizi, üç köprü, üç sonuç** (`tools/content/empire-strain-events.mjs`):
   - Krizlerin görünür nedenleri var ve önceki hazırlıklarla daha ucuz cevaplar açılıyor.
   - Bekleme süresi 12 tur.
   - Yeni haklar: `provincial_charter_rights`, `joint_imperial_council`, `veteran_land_rights`.
   - Yeni vadeli borçlar: `tax_farm_contract`, `veteran_debts`, `plague_relief_credit`.
3. **Tarihsel dönüm noktası "Kalıcı imparatorluk":**
   - Tanım: `balance.eraMilestones`.
   - Kod: `Sources/FateCore/EraMilestone.swift`; çağrı `GameEngine.simulate` → `recordEraMilestones`.
   - Kayıt: v1 bayrağı `enduring_empire_recorded` ve bir geçmiş kaydı. Oyunu bitirmez.
   - Yedi koşul: residence, economy, legitimacy, accord, rights, obligations, history.
4. **Düzeltme:** kamu ambarı geçmiş metnindeki bozuk interpolasyon `(food.relieved)` giderildi. Yalnız Era 4 metnini etkiliyor.
5. **Testler:**
   - Yeni: `tools/empire-strain-content.test.mjs` (5 test; CI listesinde) ve `Tests/FateCoreTests/EmpireStrainTests.swift` (8 test).
   - Eski sayım testleri 270'e güncellendi.
   - 255 referansı: `docs/analysis/milestone270-255-before/`.

## Doğrulama

- **Node:** `build-content --check` geçti; doğrulayıcı 0/0; testler **104/104**.
- **Swift 6.4.2 (Windows):** **156/156** (144 + 12).
- **Aynı-seed (normal oyun):** altı politika × 10.000 seed, `node tools/compare-reference.mjs docs/analysis/milestone255-windows docs/analysis/milestone270-windows 255 270` → altısı "identical except contentCardCount 255 → 270" (`docs/analysis/milestone270-windows/`).
- **Teşhis** (2.000 seed, 210 → 225 → 240 → 255 → 270; 255 sütunu aynı ikiliyle yeniden üretildi ve 255 paketinin değerleriyle aynı çıktı):
  - Açlık sonu: progression %61, knowledge %45, recovery %38, random %90.
  - 500 sınırı: progression %39, knowledge %55, recovery %62, random %9.
  - Investment (ayrı politika): istikrar 85, %92 500 sınırında, dönüm noktası %32.
- **Native CI:** PR açıldıktan sonra tek tam koşu yapılacak; sonuç bu bölüme ve PROGRESS/QA_REPORT'a işlenecek.

## Era 4 neden kapalı

Ayrıntı: [ERA4_LAUNCH_CANDIDATE.md](ERA4_LAUNCH_CANDIDATE.md).
- Otorite tabanı yüzünden yetki paylaşımı fiilen bedelsiz; bu düzeltilmedi.
- İstikrar hedefin altında: progression 25, knowledge 17.
- Random'da koşuların %90'ı nüfusun sıfırlanmasıyla bitiyor.
- Dönüm noktası için arayüz yok.
- Era 4 kartlarında görsel yok.
- `balanceEvidence` boş.

## Açık riskler

- **Krizler** heuristik politikaları hafif kötüleştirdi (500 sınırı −2…−7 puan); investment'ı neredeyse etkilemedi. Fark daralmadı.
- **Ayarı bozulmuş sikke** neredeyse bütün koşularda açık kalıyor ve dönüm noktasını en çok engelleyen koşul bu.
- **Yatırım politikası** 270'te değiştirilmedi (karşılaştırılabilirlik için). Yeni borçları ve dönüm noktasını bilmiyor.
- **Görsel ve ürün:** 43 aday var, 227 kart görselsiz. Fiziksel cihaz, imzalama, Game Center, nihai ses ve marka yapılmadı.
- **Windows araçları:** `tools/swift-windows.ps1` PS 5.1'de çalışmıyor; `swift.exe` doğrudan çalıştırıldı. Release ikilisi: `.build/out/Products/Release-windows-x86_64/FateSimulation.exe`.
- **Kullanıcının çalışma ağacı:** commit'lenmemiş eski değişiklikler var (`README.md`, kök `technologies.json`, `docs/simulation-survival-council.json`, `docs/swift-*-windows.log`). Bunlara dokunulmadı.

## Sonraki paket için öneri (kullanıcı ayrıca belirleyecek)

1. Era 4 meşruiyet açığı (otorite tabanı) — ölçülerek.
2. Dönüm noktası ilerleme arayüzü ve Era 4 UI testleri.
3. Sikkeyi yeniden basma yolu ve random kırılganlığı.
4. Açılış paketi: `balanceEvidence` ve kullanıcı onayı.
