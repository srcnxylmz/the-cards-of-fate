# Era 4 teşhis özeti — 210 → 225 → 240 (kapı zorla açık, oyuncuya kapalı)

Aynı ikili, aynı seed'ler (0..<2000), aynı ölçüm kodu. Üretim: `node tools/era4-diagnostic-summary.mjs docs/analysis/milestone240-210-era4-reference docs/analysis/milestone240-225-era4-reference docs/analysis/milestone240-era4-diagnostic`.

- 210 sütunu: `--cards docs/analysis/milestone225-210-before/cards.json --balance docs/analysis/milestone225-210-before/balance.json --politics docs/analysis/milestone240-225-before/politics.json`
- 225 sütunu: `--cards/--balance/--politics docs/analysis/milestone240-225-before/*.json`
- 240 sütunu: paketlenmiş içerik.

"Açlık sonu" nüfusun sıfıra inmesidir; nedenini "Nüfusu sıfırlayan adım" ve 100 karar başına akış satırları ayırır. "Tur sonu" satırındaki + değer Era 4 nüfus artışıdır.

#### progression (2000 seed | 2000 seed | 2000 seed)

| Ölçüm | milestone240-210-era4-reference | milestone240-225-era4-reference | milestone240-era4-diagnostic |
|---|---|---|---|
| Era 4'e ulaşan | 97.0% | 97.0% | 97.0% |
| Açlık sonu | 60.0% | 99.8% | 83.5% |
| Deste tükenmesi | 39.9% | 0.0% | 0.0% |
| 500 sınırı | 0.0% | 0.0% | 16.1% |
| Toprak sonu | 0.1% | 0.2% | 0.4% |
| Era 4 karar/koşu | 42.2 | 115.8 | 176.2 |
| Giriş kaynak/nüfus/istikrar/çevre | 44.4 / 52.6 / 46.6 / 35.6 | 44.4 / 52.6 / 46.6 / 35.6 | 44.4 / 52.6 / 46.6 / 35.6 |
| Ortalama kaynak/nüfus/istikrar/çevre | 17.6 / 38.5 / 15.7 / 31.2 | 15.3 / 34.2 / 12.2 / 29.6 | 19.6 / 45.7 / 22.2 / 29.3 |
| Yiyecek üretim/tüketim (tur) | 2.54 / 4.00 | 3.60 / 4.00 | 3.71 / 4.00 |
| Açlık turu oranı | 14.5% | 5.9% | 5.3% |
| Açlık turunda nüfus kaybı | 4.4 | 3.9 | 3.9 |
| İstikrar <15 (koşu, tur) | 98.4% after 17.0 | 99.4% after 25.9 | 96.9% after 44.4 |
| Uygun kart | 9.5 | 20.3 | 30.2 |
| Aktif seçenek | 2.41 | 2.67 | 2.92 |
| Sıfır kaynak kararı · uygun kart | 15.9% · 2.1 cards | 9.7% · 12.1 cards | 8.4% · 20.4 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 7.8 / 5.3 / 9.2 / 8.4 | 19.6 / 17.2 / 19.8 / 19.7 | 28.9 / 24.0 / 29.7 / 30.1 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 15.7% / 49.4% / 57.8% | 0.1% / 25.8% / 58.4% | 0.0% / 5.1% / 44.3% |
| Nüfus/100 karar: kart −kayıp/+kazanç | −44.1 / +4.0 | −28.9 / +7.3 | −14.9 / +5.7 |
| Nüfus/100 karar: gecikmeli | −2.4 / +0.3 | −0.9 / +0.1 | −0.7 / +0.1 |
| Nüfus/100 karar: tur sonu (açlık −, büyüme +) | −63.6 / +0.0 | −23.0 / +0.0 | −20.6 / +5.4 |
| İstikrar/100 karar: kart net · gecikmeli · tur sonu · meclis | 178.9−205.2 / −41.0 / −22.8 / −16.9 | 159.7−128.4 / −22.0 / −8.5 / −40.7 | 197.6−150.7 / −19.0 / −9.9 / −39.6 |
| 20./40./80. Era 4 kararında kaynak/istikrar/nüfus | 11/13/41 · 7/5/27 · 8/4/25 | 23/21/45 · 12/11/38 · 11/6/31 | 26/27/47 · 16/20/44 · 15/18/43 |
| Nüfusu sıfırlayan adım (koşu) | world 1083, card 81, delayed 0 | world 1714, card 222, delayed 0 | world 1547, card 73, delayed 0 |
| Ambara birikim/100 karar (tur sonu kaynak artışı) | 0.0 | 0.0 | 23.3 |
| 100. karardan sonra çeşitlilik | 40 runs · 9.7 cards · 12.2 choices | 1044 runs · 19.8 cards · 26.9 choices | 1032 runs · 30.9 cards · 50.3 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 24.3%, estate_fields_worked 63.3%, granary_register_kept 22.3%, harbor_fishery_licensed 52.1% | canal_fields_open 23.4%, estate_fields_worked 72.2%, granary_register_kept 31.7%, harbor_fishery_licensed 61.0% |

#### knowledge (2000 seed | 2000 seed | 2000 seed)

| Ölçüm | milestone240-210-era4-reference | milestone240-225-era4-reference | milestone240-era4-diagnostic |
|---|---|---|---|
| Era 4'e ulaşan | 69.3% | 69.3% | 69.3% |
| Açlık sonu | 73.2% | 86.6% | 54.4% |
| Deste tükenmesi | 22.5% | 0.0% | 0.0% |
| 500 sınırı | 4.3% | 13.4% | 45.5% |
| Toprak sonu | 0.0% | 0.0% | 0.1% |
| Era 4 karar/koşu | 72.1 | 139.8 | 209.5 |
| Giriş kaynak/nüfus/istikrar/çevre | 62.3 / 50.1 / 53.8 / 26.7 | 62.3 / 50.1 / 53.8 / 26.7 | 62.3 / 50.1 / 53.8 / 26.7 |
| Ortalama kaynak/nüfus/istikrar/çevre | 25.8 / 34.2 / 11.2 / 24.6 | 26.2 / 32.0 / 9.2 / 25.6 | 28.1 / 40.0 / 13.9 / 26.2 |
| Yiyecek üretim/tüketim (tur) | 2.89 / 4.00 | 3.64 / 4.00 | 3.77 / 4.00 |
| Açlık turu oranı | 3.7% | 1.8% | 2.1% |
| Açlık turunda nüfus kaybı | 4.1 | 3.8 | 3.8 |
| İstikrar <15 (koşu, tur) | 98.9% after 13.8 | 98.4% after 18.5 | 97.8% after 25.0 |
| Uygun kart | 11.6 | 23.1 | 32.3 |
| Aktif seçenek | 2.60 | 2.87 | 3.03 |
| Sıfır kaynak kararı · uygun kart | 4.5% · 2.1 cards | 2.4% · 11.9 cards | 2.6% · 20.0 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 11.2 / 9.1 / 11.5 / 11.4 | 22.9 / 21.4 / 23.1 / 23.0 | 32.1 / 29.6 / 32.3 / 32.6 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 8.2% / 51.4% / 68.9% | 0.0% / 21.5% / 58.2% | 0.0% / 2.1% / 43.2% |
| Nüfus/100 karar: kart −kayıp/+kazanç | −51.1 / +3.4 | −30.9 / +5.1 | −14.7 / +6.6 |
| Nüfus/100 karar: gecikmeli | −1.4 / +0.3 | −0.7 / +0.2 | −0.8 / +0.1 |
| Nüfus/100 karar: tur sonu (açlık −, büyüme +) | −15.0 / +0.0 | −7.0 / +0.0 | −7.8 / +1.1 |
| İstikrar/100 karar: kart net · gecikmeli · tur sonu · meclis | 130.9−162.0 / −23.6 / −5.3 / −13.7 | 127.0−110.5 / −18.1 / −2.0 / −34.4 | 182.0−128.8 / −19.1 / −3.1 / −54.1 |
| 20./40./80. Era 4 kararında kaynak/istikrar/nüfus | 31/13/42 · 14/5/32 · 14/3/25 | 45/19/43 · 27/10/38 · 18/3/31 | 47/25/46 · 33/14/43 · 22/11/41 |
| Nüfusu sıfırlayan adım (koşu) | world 439, card 576, delayed 0 | world 834, card 367, delayed 0 | world 700, card 53, delayed 2 |
| Ambara birikim/100 karar (tur sonu kaynak artışı) | 0.0 | 0.0 | 45.6 |
| 100. karardan sonra çeşitlilik | 227 runs · 12.7 cards · 16.9 choices | 940 runs · 21.9 cards · 31.5 choices | 967 runs · 32.3 cards · 55.6 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 13.7%, estate_fields_worked 46.5%, granary_register_kept 62.7%, harbor_fishery_licensed 30.3% | canal_fields_open 15.1%, estate_fields_worked 65.0%, granary_register_kept 73.8%, harbor_fishery_licensed 44.6% |

#### recovery (2000 seed | 2000 seed | 2000 seed)

| Ölçüm | milestone240-210-era4-reference | milestone240-225-era4-reference | milestone240-era4-diagnostic |
|---|---|---|---|
| Era 4'e ulaşan | 97.2% | 97.2% | 97.2% |
| Açlık sonu | 58.6% | 99.9% | 38.2% |
| Deste tükenmesi | 41.4% | 0.0% | 0.0% |
| 500 sınırı | 0.0% | 0.1% | 61.8% |
| Toprak sonu | 0.0% | 0.0% | 0.0% |
| Era 4 karar/koşu | 32.2 | 130.1 | 326.7 |
| Giriş kaynak/nüfus/istikrar/çevre | 29.9 / 56.7 / 69.0 / 67.1 | 29.9 / 56.7 / 69.0 / 67.1 | 29.9 / 56.7 / 69.0 / 67.1 |
| Ortalama kaynak/nüfus/istikrar/çevre | 17.1 / 45.7 / 52.4 / 70.0 | 12.5 / 36.9 / 46.3 / 67.9 | 24.8 / 55.1 / 55.1 / 65.2 |
| Yiyecek üretim/tüketim (tur) | 2.96 / 4.00 | 3.81 / 4.00 | 3.90 / 4.00 |
| Açlık turu oranı | 20.7% | 5.1% | 2.1% |
| Açlık turunda nüfus kaybı | 4.3 | 3.9 | 3.8 |
| İstikrar <15 (koşu, tur) | 7.3% after 28.5 | 24.9% after 89.3 | 4.4% after 155.0 |
| Uygun kart | 8.9 | 18.8 | 31.0 |
| Aktif seçenek | 2.39 | 2.58 | 2.97 |
| Sıfır kaynak kararı · uygun kart | 23.3% · 1.7 cards | 12.2% · 12.3 cards | 4.4% · 21.0 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 4.1 / 3.4 / – / 6.9 | 17.4 / 16.3 / – / 17.8 | 25.1 / 24.0 / – / 30.8 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 23.5% / 47.3% / 54.0% | 0.7% / 29.0% / 60.3% | 0.0% / 6.4% / 48.3% |
| Nüfus/100 karar: kart −kayıp/+kazanç | −54.8 / +4.5 | −33.9 / +10.6 | −20.3 / +7.0 |
| Nüfus/100 karar: gecikmeli | −1.7 / +0.6 | −0.4 / +0.2 | −0.5 / +0.1 |
| Nüfus/100 karar: tur sonu (açlık −, büyüme +) | −88.1 / +0.0 | −19.9 / +0.0 | −8.0 / +15.5 |
| İstikrar/100 karar: kart net · gecikmeli · tur sonu · meclis | 199.6−215.4 / −44.7 / −46.2 / −9.1 | 153.1−135.4 / −20.9 / −10.4 / −17.3 | 173.1−149.9 / −12.7 / −4.1 / −13.4 |
| 20./40./80. Era 4 kararında kaynak/istikrar/nüfus | 11/48/42 · 10/46/39 · 7/48/35 | 19/53/48 · 12/48/44 · 9/43/36 | 21/57/51 · 18/54/52 · 21/53/52 |
| Nüfusu sıfırlayan adım (koşu) | world 1004, card 134, delayed 0 | world 1366, card 576, delayed 0 | world 688, card 54, delayed 0 |
| Ambara birikim/100 karar (tur sonu kaynak artışı) | 0.0 | 0.0 | 14.0 |
| 100. karardan sonra çeşitlilik | 16 runs · 5.8 cards · 6.6 choices | 1153 runs · 20.6 cards · 28.4 choices | 1459 runs · 35.3 cards · 70.3 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 65.0%, estate_fields_worked 63.6%, granary_register_kept 21.3%, harbor_fishery_licensed 55.9% | canal_fields_open 66.2%, estate_fields_worked 81.7%, granary_register_kept 21.5%, harbor_fishery_licensed 63.3% |

#### random (2000 seed | 2000 seed | 2000 seed)

| Ölçüm | milestone240-210-era4-reference | milestone240-225-era4-reference | milestone240-era4-diagnostic |
|---|---|---|---|
| Era 4'e ulaşan | 43.0% | 43.0% | 43.0% |
| Açlık sonu | 59.8% | 99.8% | 95.0% |
| Deste tükenmesi | 40.2% | 0.0% | 0.0% |
| 500 sınırı | 0.0% | 0.0% | 4.1% |
| Toprak sonu | 0.0% | 0.2% | 0.9% |
| Era 4 karar/koşu | 30.2 | 57.8 | 122.1 |
| Giriş kaynak/nüfus/istikrar/çevre | 34.9 / 52.5 / 72.8 / 60.0 | 34.9 / 52.5 / 72.8 / 60.0 | 34.9 / 52.5 / 72.8 / 60.0 |
| Ortalama kaynak/nüfus/istikrar/çevre | 14.7 / 40.5 / 49.3 / 58.5 | 11.0 / 35.8 / 36.3 / 63.2 | 11.6 / 39.3 / 31.9 / 66.1 |
| Yiyecek üretim/tüketim (tur) | 3.13 / 4.00 | 3.73 / 4.00 | 3.85 / 4.00 |
| Açlık turu oranı | 19.1% | 11.6% | 7.9% |
| Açlık turunda nüfus kaybı | 4.1 | 4.4 | 4.2 |
| İstikrar <15 (koşu, tur) | 45.8% after 27.0 | 75.6% after 38.0 | 74.8% after 69.2 |
| Uygun kart | 8.1 | 17.3 | 27.6 |
| Aktif seçenek | 2.36 | 2.49 | 2.78 |
| Sıfır kaynak kararı · uygun kart | 24.1% · 2.0 cards | 23.4% · 11.9 cards | 11.7% · 20.3 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 5.9 / 4.9 / 8.2 / 7.3 | 15.3 / 14.7 / 17.7 / 16.8 | 27.0 / 25.4 / 27.3 / 27.7 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 24.3% / 46.1% / 53.3% | 1.9% / 26.9% / 50.0% | 0.0% / 8.1% / 41.4% |
| Nüfus/100 karar: kart −kayıp/+kazanç | −61.5 / +7.2 | −44.2 / +5.9 | −22.6 / +9.3 |
| Nüfus/100 karar: gecikmeli | −2.1 / +0.6 | −1.1 / +0.3 | −2.3 / +0.6 |
| Nüfus/100 karar: tur sonu (açlık −, büyüme +) | −79.0 / +0.0 | −51.6 / +0.0 | −33.1 / +6.4 |
| İstikrar/100 karar: kart net · gecikmeli · tur sonu · meclis | 172.1−249.4 / −36.1 / −37.9 / −7.5 | 112.8−174.2 / −21.7 / −20.7 / −9.6 | 145.8−149.9 / −19.1 / −14.5 / −14.1 |
| 20./40./80. Era 4 kararında kaynak/istikrar/nüfus | 11/49/40 · 5/30/33 · 5/6/24 | 13/51/41 · 6/29/34 · 4/6/24 | 14/58/46 · 9/46/44 · 8/29/42 |
| Nüfusu sıfırlayan adım (koşu) | world 380, card 134, delayed 0 | world 627, card 231, delayed 0 | world 657, card 149, delayed 12 |
| Ambara birikim/100 karar (tur sonu kaynak artışı) | 0.0 | 0.0 | 63.3 |
| 100. karardan sonra çeşitlilik | 9 runs · 7.1 cards · 9.4 choices | 112 runs · 13.0 cards · 18.2 choices | 378 runs · 29.2 cards · 63.7 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 56.3%, estate_fields_worked 33.7%, granary_register_kept 48.7%, harbor_fishery_licensed 44.5% | canal_fields_open 62.9%, estate_fields_worked 48.1%, granary_register_kept 66.8%, harbor_fishery_licensed 60.5% |
