# Era 4 teşhis özeti — 210 referansı ve 225 (kapı zorla açık, oyuncuya kapalı)

Üretim: `node tools/era4-diagnostic-summary.mjs docs/analysis/milestone225-210-era4-reference docs/analysis/milestone225-era4-diagnostic`. 210 sütunu aynı ikiliyle `--cards docs/analysis/milestone225-210-before/cards.json` kullanılarak ölçüldü (aynı seed'ler, aynı ölçüm kodu).

#### progression (2000 seed | 2000 seed)

| Ölçüm | milestone225-210-era4-reference | milestone225-era4-diagnostic |
|---|---|---|
| Era 4'e ulaşan | 97.0% | 97.0% |
| Açlık sonu | 60.0% | 99.8% |
| Deste tükenmesi | 39.9% | 0.0% |
| 500 sınırı | 0.0% | 0.0% |
| Toprak sonu | 0.1% | 0.2% |
| Era 4 karar/koşu | 42.2 | 115.8 |
| Giriş kaynak/nüfus/istikrar/çevre | 44.4 / 52.6 / 46.6 / 35.6 | 44.4 / 52.6 / 46.6 / 35.6 |
| Ortalama kaynak/nüfus/istikrar/çevre | 17.6 / 38.5 / 15.7 / 31.2 | 15.3 / 34.2 / 12.2 / 29.6 |
| Yiyecek üretim/tüketim (tur) | 2.54 / 4.00 | 3.60 / 4.00 |
| Açlık turu oranı | 14.5% | 5.9% |
| Açlık turunda nüfus kaybı | 4.4 | 3.9 |
| İstikrar <15 (koşu, tur) | 98.4% after 17.0 | 99.4% after 25.9 |
| Uygun kart | 9.5 | 20.3 |
| Aktif seçenek | 2.41 | 2.67 |
| Sıfır kaynak kararı · uygun kart | 15.9% · 2.1 cards | 9.7% · 12.1 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 7.8 / 5.3 / 9.2 / 8.4 | 19.6 / 17.2 / 19.8 / 19.7 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 15.7% / 49.4% / 57.8% | 0.1% / 25.8% / 58.4% |
| 100. karardan sonra çeşitlilik | 40 runs · 9.7 cards · 12.2 choices | 1044 runs · 19.8 cards · 26.9 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 24.3%, estate_fields_worked 63.3%, granary_register_kept 22.3%, harbor_fishery_licensed 52.1% |

#### knowledge (2000 seed | 2000 seed)

| Ölçüm | milestone225-210-era4-reference | milestone225-era4-diagnostic |
|---|---|---|
| Era 4'e ulaşan | 69.3% | 69.3% |
| Açlık sonu | 73.2% | 86.6% |
| Deste tükenmesi | 22.5% | 0.0% |
| 500 sınırı | 4.3% | 13.4% |
| Toprak sonu | 0.0% | 0.0% |
| Era 4 karar/koşu | 72.1 | 139.8 |
| Giriş kaynak/nüfus/istikrar/çevre | 62.3 / 50.1 / 53.8 / 26.7 | 62.3 / 50.1 / 53.8 / 26.7 |
| Ortalama kaynak/nüfus/istikrar/çevre | 25.8 / 34.2 / 11.2 / 24.6 | 26.2 / 32.0 / 9.2 / 25.6 |
| Yiyecek üretim/tüketim (tur) | 2.89 / 4.00 | 3.64 / 4.00 |
| Açlık turu oranı | 3.7% | 1.8% |
| Açlık turunda nüfus kaybı | 4.1 | 3.8 |
| İstikrar <15 (koşu, tur) | 98.9% after 13.8 | 98.4% after 18.5 |
| Uygun kart | 11.6 | 23.1 |
| Aktif seçenek | 2.60 | 2.87 |
| Sıfır kaynak kararı · uygun kart | 4.5% · 2.1 cards | 2.4% · 11.9 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 11.2 / 9.1 / 11.5 / 11.4 | 22.9 / 21.4 / 23.1 / 23.0 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 8.2% / 51.4% / 68.9% | 0.0% / 21.5% / 58.2% |
| 100. karardan sonra çeşitlilik | 227 runs · 12.7 cards · 16.9 choices | 940 runs · 21.9 cards · 31.5 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 13.7%, estate_fields_worked 46.5%, granary_register_kept 62.7%, harbor_fishery_licensed 30.3% |

#### recovery (2000 seed | 2000 seed)

| Ölçüm | milestone225-210-era4-reference | milestone225-era4-diagnostic |
|---|---|---|
| Era 4'e ulaşan | 97.2% | 97.2% |
| Açlık sonu | 58.6% | 99.9% |
| Deste tükenmesi | 41.4% | 0.0% |
| 500 sınırı | 0.0% | 0.1% |
| Toprak sonu | 0.0% | 0.0% |
| Era 4 karar/koşu | 32.2 | 130.1 |
| Giriş kaynak/nüfus/istikrar/çevre | 29.9 / 56.7 / 69.0 / 67.1 | 29.9 / 56.7 / 69.0 / 67.1 |
| Ortalama kaynak/nüfus/istikrar/çevre | 17.1 / 45.7 / 52.4 / 70.0 | 12.5 / 36.9 / 46.3 / 67.9 |
| Yiyecek üretim/tüketim (tur) | 2.96 / 4.00 | 3.81 / 4.00 |
| Açlık turu oranı | 20.7% | 5.1% |
| Açlık turunda nüfus kaybı | 4.3 | 3.9 |
| İstikrar <15 (koşu, tur) | 7.3% after 28.5 | 24.9% after 89.3 |
| Uygun kart | 8.9 | 18.8 |
| Aktif seçenek | 2.39 | 2.58 |
| Sıfır kaynak kararı · uygun kart | 23.3% · 1.7 cards | 12.2% · 12.3 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 4.1 / 3.4 / – / 6.9 | 17.4 / 16.3 / – / 17.8 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 23.5% / 47.3% / 54.0% | 0.7% / 29.0% / 60.3% |
| 100. karardan sonra çeşitlilik | 16 runs · 5.8 cards · 6.6 choices | 1153 runs · 20.6 cards · 28.4 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 65.0%, estate_fields_worked 63.6%, granary_register_kept 21.3%, harbor_fishery_licensed 55.9% |

#### random (2000 seed | 2000 seed)

| Ölçüm | milestone225-210-era4-reference | milestone225-era4-diagnostic |
|---|---|---|
| Era 4'e ulaşan | 43.0% | 43.0% |
| Açlık sonu | 59.8% | 99.8% |
| Deste tükenmesi | 40.2% | 0.0% |
| 500 sınırı | 0.0% | 0.0% |
| Toprak sonu | 0.0% | 0.2% |
| Era 4 karar/koşu | 30.2 | 57.8 |
| Giriş kaynak/nüfus/istikrar/çevre | 34.9 / 52.5 / 72.8 / 60.0 | 34.9 / 52.5 / 72.8 / 60.0 |
| Ortalama kaynak/nüfus/istikrar/çevre | 14.7 / 40.5 / 49.3 / 58.5 | 11.0 / 35.8 / 36.3 / 63.2 |
| Yiyecek üretim/tüketim (tur) | 3.13 / 4.00 | 3.73 / 4.00 |
| Açlık turu oranı | 19.1% | 11.6% |
| Açlık turunda nüfus kaybı | 4.1 | 4.4 |
| İstikrar <15 (koşu, tur) | 45.8% after 27.0 | 75.6% after 38.0 |
| Uygun kart | 8.1 | 17.3 |
| Aktif seçenek | 2.36 | 2.49 |
| Sıfır kaynak kararı · uygun kart | 24.1% · 2.0 cards | 23.4% · 11.9 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 5.9 / 4.9 / 8.2 / 7.3 | 15.3 / 14.7 / 17.7 / 16.8 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 24.3% / 46.1% / 53.3% | 1.9% / 26.9% / 50.0% |
| 100. karardan sonra çeşitlilik | 9 runs · 7.1 cards · 9.4 choices | 112 runs · 13.0 cards · 18.2 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 56.3%, estate_fields_worked 33.7%, granary_register_kept 48.7%, harbor_fishery_licensed 44.5% |

#### survival (2000 seed | 2000 seed)

| Ölçüm | milestone225-210-era4-reference | milestone225-era4-diagnostic |
|---|---|---|
| Era 4'e ulaşan | 0.0% | 0.0% |
| Açlık sonu | – | – |
| Deste tükenmesi | – | – |
| 500 sınırı | – | – |
| Toprak sonu | – | – |
| Era 4 karar/koşu | – | – |
| Giriş kaynak/nüfus/istikrar/çevre | – / – / – / – | – / – / – / – |
| Ortalama kaynak/nüfus/istikrar/çevre | – / – / – / – | – / – / – / – |
| Yiyecek üretim/tüketim (tur) | – / – | – / – |
| Açlık turu oranı | – | – |
| Açlık turunda nüfus kaybı | – | – |
| İstikrar <15 (koşu, tur) | – after – | – after – |
| Uygun kart | – | – |
| Aktif seçenek | – | – |
| Sıfır kaynak kararı · uygun kart | – · – cards | – · – cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | – / – / – / – | – / – / – / – |
| Tekrar: ilk 20/40/80 Era 4 kararı | – / – / – | – / – / – |
| 100. karardan sonra çeşitlilik | 0 runs · – cards · – choices | 0 runs · – cards · – choices |
| Üreten kapasite (karar payı) | – | – |
