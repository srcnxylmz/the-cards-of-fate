# 180 kart macOS ve iPhone Simulator doğrulaması

İçerik kaynağı `8fcab04bd3415dbda50ad991a4fa0c3d97dfff5f`. İki Intel koşusu arasında yalnızca GitHub Actions iş akışı değişti. Devam koşusu aynı oyun, içerik, varlık, Swift/UI testleri ve simülasyon kaynaklarını doğrulayan Git karşılaştırmasını çalıştırır.

## Koşular ve tamamlanan kontroller

| Koşu | Kaynak | Sonuç |
|---|---|---|
| [İlk macOS arm64 koşusu](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44556885858) | `8fcab04` | İki denemede de hosted runner atanamadı. Test adımı çalışmadı. |
| [İlk Intel koşusu](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44563303267) | `fa99181fa17daef6a64a411601601ae5af9d6990` | 63 Node ve 109 macOS Swift testi geçti. Random, survival ve meclisli survival 10.000'er oyun tamamladı. 80 dakika sınırı ikinci simülasyon grubunu iptal etti. iOS adımları atlandı. |
| [Intel devam koşusu](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44578728588) | `c1fed81ec91de2696ce9c14d55bb05efe51c513a` | Knowledge, progression ve recovery 10.000'er oyun tamamladı. İlk Simulator işi GitHub bağlantısı ve artifact servisi zaman aşımı yüzünden durdu. Yalnızca o iş yeniden başlatıldı. |

Tüm 60.000 macOS oyunu aynı 0–9.999 seed aralığı ve 500 karar sınırıyla çalıştı. İndirilen altı rapor yerel 180 kart sonuçlarıyla bütün alanlarda eşleşti. İlk Intel ZIP'inde üç taze rapor koşu günlüğündeki `Saved 10000` kayıtlarıyla ilişkilendirildi. Aynı ZIP'teki üç sürüm kontrollü kopya hesaplamaya dahil edilmedi. Devam koşusundaki her yeni politika işinin artifact'ı temiz bir çıktı dizininden gelir.

| Artifact | Kimlik | Doğrulanan ZIP SHA-256 |
|---|---|---|
| quality-reports, ilk Intel | 14556288423 | `9ec0ba55a2cb72a731841457b331f6ceac77ff8dd7d7cb3948a34db1b1b38e1c` |
| native-simulations-knowledge | 14561443166 | `0fad3e9e18955b9402df727b6782711b75977cbf69498f1151aa20a4592935b6` |
| native-simulations-progression | 14562001724 | `3e5456820f4fde5492b3470ff2d45bc5465a556671102f9c522fad81fe0e3708` |
| native-simulations-recovery | 14561239325 | `31cd57064d84dc72168803375f1f04c577a56c469ed96132ee15157a523ea6b3` |

## İkinci Simulator denemesi

[Deneme 2](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44578728588/attempts/2), iş `135787862209`. Xcode 16.4 (16F6) ile iPhone SE (3. nesil) için derleme, kurulum ve açılış başarılı. TR/EN karar ve kayıt, meclis, 43 illüstrasyon ile büyük yazı/Reduce Motion ve ses API/mute testleri geçti. İstatistik testinde ilk üretim OCR ölçümü `legacy=false, visible=6, missing=[]` olarak kaydedildikten sonra XCTest runner XPC yanıtı işlerken `-[__NSCFString bytes]` hatasıyla durdu. Kalan OCR ölçümleri bu denemede tamamlanmadı.

Artifact `14565331919` kaynak SHA'sı `c1fed81ec91de2696ce9c14d55bb05efe51c513a`. Doğrulanan ZIP özeti `f25c9a2fb59c8c1973f1b67818eac66369a94732c3e2174bfb5af5ec3912bbb2`. 178 attachment, 43 kartın her birinde üç doğrulama görüntüsü, 104 ses olayı, üç geçerli başlangıç ve mute kanıtı var. Uygulama çökme raporu veya dışa aktarma hatası bulunmadı. XCTest runner hatası iş günlüğünde ayrıca görünür.

13 yeni illüstrasyonun Simulator standart ekranları açıldı. Portreler çerçevede tamamen görünür. Uzun metin ve seçenekler küçük ekranda kaydırma gerektiriyor. Ana menü, kent yol hesabının kaydırılmış aktif ve devre dışı seçenekleri ile tur 1 sonucu, ambarın büyük yazı/Reduce Motion görüntüsü ayrıca incelendi. Kent yolunun sözleşmeli kapanışında sonuç `Kaynak +6, Otorite +6, İstikrar −6`. Fixture geçmişi olmayan hesap seçeneği devre dışı. Bu inceleme tarihsel, anatomik, kontrast veya fiziksel cihaz onayı yerine geçmez.

## Başarılı arm64 Simulator doğrulaması

[Intel denemesi 3](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44578728588/attempts/3) aynı beş UI testini tamamladı ve aynı XCTest XPC hatası tekrarlandı. Ardından yalnızca CI yapılandırması değişti. Başarılı arm64 işinin kaynak SHA'sı `ae42a0e6d446110dff2dac31ab18e150ec9ecaf1`. Kaynak eşitliği kontrolü geçti. [GitHub Actions 44601815107, iş 135834933259](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44601815107)

Xcode 16.4 (16F6), iPhone SE (3. nesil), iOS 18.5. Derleme, kurulum ve açılış başarılı. Altı UI testi 1.058,184 saniyede geçti. TR/EN karar ve kayıt, meclis ve cooldown, 43 illüstrasyon ve Reduce Motion, normal/büyük metin OCR ve ses API/mute kapsamı doğrulandı. Dört üretim OCR kaydı `legacy=false, visible=6, missing=[]` verdi. Kaydırılmış piksel değerleri ve durum çubuğu sınırı denetimleri geçti.

Artifact `14571280341` doğrulanan kaynak SHA'yı taşıyor. İndirilen ZIP SHA-256 değeri `7a47d40d34d815995d65c10bd3902f7081a4b55d760f783e73136ab1816a616f` ve GitHub kaydıyla eşleşiyor. 249 attachment, her 43 kart için üç ekran ve 110 ses olayı mevcut. Üç sesin API başlangıcı ve sessize alma kayıtları geçerli. Uygulama veya XCTest runner çökme raporu ve export hatası bulunmadı. UI artifact 3 Aralık 2026'da sona erer. Yerel arşiv `artifacts/run-44601815107-attempt1` altında. [Simulator artifact’ı](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44601815107/artifacts/14571280341)

13 yeni görselin standart ekranları bu başarılı artifact'tan tekrar incelendi. Portreler görünür ve başlıklar okunur. Giriş karesinde bazı kartlar kısmi animasyon opaklığı gösteriyor. Uzun metinler, özellikle büyük punto, kaydırma gerektiriyor.

| Kart | İzlenen ekran dosyası |
|---|---|
| `debt_tablet` | `E4418F8C-6A25-4FD0-BD02-686DBDA62345.png` |
| `water_apportion` | `0ED88461-75A3-4232-9DF3-C890D85B7C39.png` |
| `salmon_weir` | `5C2E531E-90AF-4EE5-9E18-DBAA2F8AFB2B.png` |
| `reed_bank` | `F545164F-F335-412B-B6A7-545B15A23ABB.png` |
| `roof_cistern` | `FCE9941D-FC83-4EBD-986A-8E8764617A96.png` |
| `cistern_account` | `8D297771-EBF5-4575-BB99-26057FB7165A.png` |
| `guest_tongue` | `483D163D-C296-4C74-9D16-20CCA301664F.png` |
| `shade_duty` | `8E3F056C-227D-4D72-9624-BB109C80C8A2.png` |
| `sowing_relief` | `15EFA8B4-7FAB-405E-AFC5-0071423E2850.png` |
| `ward_charter` | `CE8A6576-EF9E-4785-85EA-B5D3A6A4ACB8.png` |
| `ridge_shelter` | `6FB86742-C132-40B9-986E-82D6CCE74988.png` |
| `terrace_path` | `026A5237-6546-4BF0-A1F3-A34A11D4FC44.png` |
| `ridge_account` | `6A4ADDA4-FA0B-4C8B-8107-4586C5CCFF69.png` |

Ayrıca `installed-launch.png`, kent yolunun seçenekleri `D939B909-4765-4687-BF4D-2E5FAD08664B.png` ve sonucu `C9F7A7B0-77FF-475F-8BCB-1A40585AFFCB.png`, büyük metin/Reduce Motion ambar seçenekleri `F38C7572-3902-4FFE-A8CD-DEFE129C2ED5.png`, standart ve büyük İngilizce kaydırma ekranları `9F07D9C2-8313-447E-9AD0-38A998CA9A87.png` ve `7947676A-C5C3-42C7-A1F7-D8F4BDCD3317.png` incelendi.

Phase 2'nin 180 kartlık native doğrulaması, birbirine kaynak eşitliğiyle bağlı Intel simülasyon ve arm64 Simulator kanıtıyla tamamlandı. Fiziksel cihaz erişilebilirliği, renk, pil, FPS, gerçek ses ve mağaza hesapları açık. 4. çağ kapalı. [Makine kaydı](analysis/milestone180-verified/native-run.json)
