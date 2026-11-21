# Era 4 (Antik İmparatorluklar) — açılış adayı kalite değerlendirmesi (270 paketi)

Tarih: 2026-11-21 · Yazar: Claude · Dal: `phase3-era4-270`. Ayrıntılar: [PHASE3_270_REPORT.md](PHASE3_270_REPORT.md), ölçümler: [SUMMARY.md](analysis/milestone270-era4-diagnostic/SUMMARY.md).

**Karar önerisi: Era 4 henüz açılmamalı.** `ERA4_GATE.enabled:false` ve `balanceEvidence:null` korunuyor; Era 5 kapalı. Kapı kullanıcı onayı olmadan açılmayacak.

## Değerlendirme

| Alan | Durum | Kanıt | Hüküm |
|---|---|---|---|
| İçerik envanteri | 90 kart; 55 tekrarlanabilir, 17 köprü, 17 sonuç, 1 reform. Sekiz zorunlu kategori karşılanıyor. | Doğrulayıcı 0/0, `eraInventory[4].satisfied:true` | Yeterli |
| Normal oyun | Era 1–3 değişmedi. Kapı kapalıyken Era 4'e normal oyunda ulaşılamıyor. | Altı politika × 10.000 seed karşılaştırması (HANDOFF); her paketin "normal play unchanged" Swift testi | Yeterli |
| Teşhis oyunu | Era 4'e girenlerin %39–62'si 500 karar sınırına ulaşıyor (heuristikler; random %9). Deste tükenmesi %0. | 2.000 seed teşhisi | Kısmi |
| Ekonomik sürdürülebilirlik | Üretim kapasiteleri, sınırlı birikim, tek seferlik kamu ambarı. Gerçek açlık kaybı 100 kararda 7–28. Random'da nüfus sıfırlanması %90. | SUMMARY tur sonu akışları | **Yetersiz** (random) |
| Siyasi istikrar | Ortalama istikrar progression 25, knowledge 17 (hedef 30). Meclis kaybı 100 kararda −24…−30. | SUMMARY | **Yetersiz** |
| Geç oyun zorluğu | Dokuz kriz, her biri görünür nedenli ve hazırlıklı cevaplı. Investment'ta koşu başına 55 kriz kararı, ama istikrar 85 ve %92 sınırda. Otorite 80. karardan sonra 1–3'e iniyor; yetki paylaşımının bedeli işlemiyor. | Bölüm 2 ve 3 | **Yetersiz**: iyi oyuncu için kolay; kök neden ölçüldü, düzeltilmedi |
| Save/replay | Şema v1 değişmedi. Yeni durum bayrak ve geçmiş kaydı olarak tutuluyor. Her yeni kart, kriz ve dönüm noktası için kaydet/yükle/tekrar testi var. | Swift 156/156 | Yeterli |
| Tarihsel başarı | "Kalıcı imparatorluk" dönüm noktası. Yedi bağımsız koşul var, iki meşruiyet yolu var, oyunu bitirmiyor. Investment %32, recovery %11. | `EmpireStrainTests`, teşhis | Motor hazır; **arayüzde ilerleme görünümü ve galibiyet ekranı yok** |
| Görsel ve ses | 43 gerçek illüstrasyon adayı; 227 kart görselsiz (Era 4'ün 90 kartının hiçbirinde görsel yok). Nihai ses ve marka yapılmadı. | `art-audit` | **Eksik** |
| iPhone Simulator | Derleme, kurulum, açılış ve 6 UI testi native CI'da. Era 4 içeriği simülatörde **oynanmadı**: kapı kapalı, UI testleri Era 1–3'ü kapsıyor. | Native CI (HANDOFF) | Kısmi |
| Gerçek cihaz | Fiziksel cihaz, imzalama, Game Center ve App Store testleri **yapılmadı**. | – | Eksik |

## Açılış için kullanıcıdan gereken kararlar

1. **Zorluk hedefi:** İyi bir oyuncunun Era 4'te ne kadar zorlanması isteniyor? Investment ile heuristikler arasındaki fark kabul edilebilir mi, yoksa otorite tabanı düzeltilsin mi?
2. **İstikrar hedefi:** progression ve knowledge için ≥ 30 hedefi korunacak mı? Bu politikalar bilgi ve ilerlemeyi istikrara tercih ediyor.
3. **Random hedefi:** Rastgele oynayan birinin Era 4'te ne sıklıkta hayatta kalması kabul edilebilir?
4. **Dönüm noktası sunumu:** Kayıt yalnız geçmişte mi görünsün, yoksa ayrı bir ekran ve ilerleme göstergesi mi olsun? Gerçek "oyun sonu galibiyeti" ne zaman tanımlanacak?
5. **Görseller:** Era 4 kartları görselsiz açılabilir mi?
6. **Onay:** Kapıyı açmak için `balanceEvidence` (rapor yolu, kaynak SHA, native CI) ve açık bir kullanıcı onayı gerekiyor.

## Açılmadan önce yapılması önerilenler

1. Otorite tabanı / meşruiyet açığı kuralı: ölçülerek uygulanmalı.
2. Dönüm noktası ilerleme arayüzü ve Era 4 için UI testleri.
3. Random ve knowledge kırılganlığı için hedeflenmiş seçenekler.
4. En az birkaç Era 4 illüstrasyonu (araç varsa).
5. Fiziksel cihaz testi.
