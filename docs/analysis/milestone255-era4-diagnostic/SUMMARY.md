# Era 4 teşhis özeti — 210 → 225 → 240 → 255 (kapı zorla açık, oyuncuya kapalı)

Aynı 255 ikilisi, aynı seed'ler (0..<2000), aynı ölçüm kodu. Üretim: `node tools/era4-diagnostic-summary.mjs docs/analysis/milestone255-ref-210 docs/analysis/milestone255-ref-225 docs/analysis/milestone255-ref-240 docs/analysis/milestone255-era4-diagnostic`. Referanslar kendi `--cards/--balance/--politics` dosyalarıyla ölçüldü (`milestone225-210-before`, `milestone240-225-before`, `milestone255-240-before`).

"Açlık sonu" nüfusun sıfıra inmesidir; 500 sınırına ulaşmak kazanılmış oyun sayılmaz (sansürlü gözlem).

## Eski beş politika

### progression (2000 seed | 2000 seed | 2000 seed | 2000 seed)

| Ölçüm | milestone255-ref-210 | milestone255-ref-225 | milestone255-ref-240 | milestone255-era4-diagnostic |
|---|---|---|---|---|
| Era 4'e ulaşan | 97.0% | 97.0% | 97.0% | 97.0% |
| Açlık sonu | 60.0% | 99.8% | 83.5% | 58.1% |
| Deste tükenmesi | 39.9% | 0.0% | 0.0% | 0.0% |
| 500 sınırı | 0.0% | 0.0% | 16.1% | 41.8% |
| Toprak sonu | 0.1% | 0.2% | 0.4% | 0.1% |
| Era 4 karar/koşu | 42.2 | 115.8 | 176.2 | 263.0 |
| Giriş kaynak/nüfus/istikrar/çevre | 44.4 / 52.6 / 46.6 / 35.6 | 44.4 / 52.6 / 46.6 / 35.6 | 44.4 / 52.6 / 46.6 / 35.6 | 44.4 / 52.6 / 46.6 / 35.6 |
| Ortalama kaynak/nüfus/istikrar/çevre | 17.6 / 38.5 / 15.7 / 31.2 | 15.3 / 34.2 / 12.2 / 29.6 | 19.6 / 45.7 / 22.2 / 29.3 | 24.2 / 49.1 / 25.1 / 39.5 |
| Yiyecek üretim/tüketim (tur) | 2.54 / 4.00 | 3.60 / 4.00 | 3.71 / 4.00 | 3.78 / 4.00 |
| Açlık turu oranı | 14.5% | 5.9% | 5.3% | 2.7% |
| Açlık turunda nüfus kaybı | 4.4 | 3.9 | 3.9 | 3.8 |
| İstikrar <15 (koşu, tur) | 98.4% after 17.0 | 99.4% after 25.9 | 96.9% after 44.4 | 94.3% after 57.1 |
| Uygun kart | 9.5 | 20.3 | 30.2 | 40.1 |
| Aktif seçenek | 2.41 | 2.67 | 2.92 | 3.10 |
| Sıfır kaynak kararı · uygun kart | 15.9% · 2.1 cards | 9.7% · 12.1 cards | 8.4% · 20.4 cards | 4.3% · 29.3 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 7.8 / 5.3 / 9.2 / 8.4 | 19.6 / 17.2 / 19.8 / 19.7 | 28.9 / 24.0 / 29.7 / 30.1 | 38.9 / 34.1 / 39.7 / 40.7 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 15.7% / 49.4% / 57.8% | 0.1% / 25.8% / 58.4% | 0.0% / 5.1% / 44.3% | 0.0% / 0.2% / 34.5% |
| Nüfus/100 karar: kart −kayıp/+kazanç | −44.1 / +4.0 | −28.9 / +7.3 | −14.9 / +5.7 | −11.7 / +4.5 |
| Nüfus/100 karar: gecikmeli | −2.4 / +0.3 | −0.9 / +0.1 | −0.7 / +0.1 | −0.5 / +0.0 |
| Nüfus/100 karar: tur sonu (açlık −, büyüme +) | −63.6 / +0.0 | −23.0 / +0.0 | −20.6 / +5.4 | −10.5 / +6.7 |
| İstikrar/100 karar: kart net · gecikmeli · tur sonu · meclis | 178.9−205.2 / −41.0 / −22.8 / −16.9 | 159.7−128.4 / −22.0 / −8.5 / −40.7 | 197.6−150.7 / −19.0 / −9.9 / −39.6 | 187.5−151.5 / −15.5 / −5.1 / −27.4 |
| 20./40./80. Era 4 kararında kaynak/istikrar/nüfus | 11/13/41 · 7/5/27 · 8/4/25 | 23/21/45 · 12/11/38 · 11/6/31 | 26/27/47 · 16/20/44 · 15/18/43 | 28/29/48 · 20/21/45 · 19/21/46 |
| Nüfusu sıfırlayan adım (koşu) | world 1083, card 81, delayed 0 | world 1714, card 222, delayed 0 | world 1547, card 73, delayed 0 | world 1079, card 48, delayed 0 |
| Ambara birikim/100 karar (tur sonu kaynak artışı) | 0.0 | 0.0 | 23.3 | 13.3 |
| Otorite / meclis savunması / rakip gücü (avcı–rahip) / ilişki (avcı–rahip) | 37.0 / 39.4 / 33–36 / 17–-15 | 13.8 / 15.8 / 35–40 / 15–-22 | 8.3 / 42.1 / 40–42 / 47–3 | 5.7 / 40.5 / 41–42 / 45–20 |
| Meclis itirazı/toplantı · meclis istikrar kaybı/100 karar | 0.30 · −16.9 istikrar | 0.50 · −40.7 istikrar | 0.37 · −39.6 istikrar | 0.26 · −27.4 istikrar |
| 100. karardan sonra çeşitlilik | 40 runs · 9.7 cards · 12.2 choices | 1044 runs · 19.8 cards · 26.9 choices | 1032 runs · 30.9 cards · 50.3 choices | 1249 runs · 41.9 cards · 72.7 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 24.3%, estate_fields_worked 63.3%, granary_register_kept 22.3%, harbor_fishery_licensed 52.1% | canal_fields_open 23.4%, estate_fields_worked 72.2%, granary_register_kept 31.7%, harbor_fishery_licensed 61.0% | canal_fields_open 43.0%, estate_fields_worked 68.5%, granary_register_kept 25.2%, harbor_fishery_licensed 76.5% |

### knowledge (2000 seed | 2000 seed | 2000 seed | 2000 seed)

| Ölçüm | milestone255-ref-210 | milestone255-ref-225 | milestone255-ref-240 | milestone255-era4-diagnostic |
|---|---|---|---|---|
| Era 4'e ulaşan | 69.3% | 69.3% | 69.3% | 69.3% |
| Açlık sonu | 73.2% | 86.6% | 54.4% | 43.3% |
| Deste tükenmesi | 22.5% | 0.0% | 0.0% | 0.0% |
| 500 sınırı | 4.3% | 13.4% | 45.5% | 56.7% |
| Toprak sonu | 0.0% | 0.0% | 0.1% | 0.0% |
| Era 4 karar/koşu | 72.1 | 139.8 | 209.5 | 234.7 |
| Giriş kaynak/nüfus/istikrar/çevre | 62.3 / 50.1 / 53.8 / 26.7 | 62.3 / 50.1 / 53.8 / 26.7 | 62.3 / 50.1 / 53.8 / 26.7 | 62.3 / 50.1 / 53.8 / 26.7 |
| Ortalama kaynak/nüfus/istikrar/çevre | 25.8 / 34.2 / 11.2 / 24.6 | 26.2 / 32.0 / 9.2 / 25.6 | 28.1 / 40.0 / 13.9 / 26.2 | 32.0 / 41.3 / 17.4 / 34.1 |
| Yiyecek üretim/tüketim (tur) | 2.89 / 4.00 | 3.64 / 4.00 | 3.77 / 4.00 | 3.78 / 4.00 |
| Açlık turu oranı | 3.7% | 1.8% | 2.1% | 1.7% |
| Açlık turunda nüfus kaybı | 4.1 | 3.8 | 3.8 | 3.7 |
| İstikrar <15 (koşu, tur) | 98.9% after 13.8 | 98.4% after 18.5 | 97.8% after 25.0 | 97.1% after 29.8 |
| Uygun kart | 11.6 | 23.1 | 32.3 | 41.3 |
| Aktif seçenek | 2.60 | 2.87 | 3.03 | 3.15 |
| Sıfır kaynak kararı · uygun kart | 4.5% · 2.1 cards | 2.4% · 11.9 cards | 2.6% · 20.0 cards | 2.2% · 28.9 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 11.2 / 9.1 / 11.5 / 11.4 | 22.9 / 21.4 / 23.1 / 23.0 | 32.1 / 29.6 / 32.3 / 32.6 | 41.0 / 38.1 / 41.6 / 42.8 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 8.2% / 51.4% / 68.9% | 0.0% / 21.5% / 58.2% | 0.0% / 2.1% / 43.2% | 0.0% / 0.1% / 31.3% |
| Nüfus/100 karar: kart −kayıp/+kazanç | −51.1 / +3.4 | −30.9 / +5.1 | −14.7 / +6.6 | −11.8 / +5.3 |
| Nüfus/100 karar: gecikmeli | −1.4 / +0.3 | −0.7 / +0.2 | −0.8 / +0.1 | −0.8 / +0.1 |
| Nüfus/100 karar: tur sonu (açlık −, büyüme +) | −15.0 / +0.0 | −7.0 / +0.0 | −7.8 / +1.1 | −6.3 / +1.9 |
| İstikrar/100 karar: kart net · gecikmeli · tur sonu · meclis | 130.9−162.0 / −23.6 / −5.3 / −13.7 | 127.0−110.5 / −18.1 / −2.0 / −34.4 | 182.0−128.8 / −19.1 / −3.1 / −54.1 | 174.8−142.8 / −16.6 / −2.8 / −31.0 |
| 20./40./80. Era 4 kararında kaynak/istikrar/nüfus | 31/13/42 · 14/5/32 · 14/3/25 | 45/19/43 · 27/10/38 · 18/3/31 | 47/25/46 · 33/14/43 · 22/11/41 | 49/29/46 · 39/16/44 · 26/12/42 |
| Nüfusu sıfırlayan adım (koşu) | world 439, card 576, delayed 0 | world 834, card 367, delayed 0 | world 700, card 53, delayed 2 | world 568, card 31, delayed 1 |
| Ambara birikim/100 karar (tur sonu kaynak artışı) | 0.0 | 0.0 | 45.6 | 36.4 |
| Otorite / meclis savunması / rakip gücü (avcı–rahip) / ilişki (avcı–rahip) | 47.6 / 53.2 / 36–47 / 42–-58 | 21.2 / 26.3 / 35–46 / 40–-58 | 13.3 / 46.2 / 37–46 / 66–-37 | 11.4 / 43.4 / 38–42 / 57–-1 |
| Meclis itirazı/toplantı · meclis istikrar kaybı/100 karar | 0.19 · −13.7 istikrar | 0.39 · −34.4 istikrar | 0.48 · −54.1 istikrar | 0.30 · −31.0 istikrar |
| 100. karardan sonra çeşitlilik | 227 runs · 12.7 cards · 16.9 choices | 940 runs · 21.9 cards · 31.5 choices | 967 runs · 32.3 cards · 55.6 choices | 1014 runs · 40.5 cards · 69.1 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 13.7%, estate_fields_worked 46.5%, granary_register_kept 62.7%, harbor_fishery_licensed 30.3% | canal_fields_open 15.1%, estate_fields_worked 65.0%, granary_register_kept 73.8%, harbor_fishery_licensed 44.6% | canal_fields_open 34.1%, estate_fields_worked 54.4%, granary_register_kept 71.5%, harbor_fishery_licensed 49.8% |

### recovery (2000 seed | 2000 seed | 2000 seed | 2000 seed)

| Ölçüm | milestone255-ref-210 | milestone255-ref-225 | milestone255-ref-240 | milestone255-era4-diagnostic |
|---|---|---|---|---|
| Era 4'e ulaşan | 97.2% | 97.2% | 97.2% | 97.2% |
| Açlık sonu | 58.6% | 99.9% | 38.2% | 34.8% |
| Deste tükenmesi | 41.4% | 0.0% | 0.0% | 0.0% |
| 500 sınırı | 0.0% | 0.1% | 61.8% | 65.2% |
| Toprak sonu | 0.0% | 0.0% | 0.0% | 0.0% |
| Era 4 karar/koşu | 32.2 | 130.1 | 326.7 | 334.6 |
| Giriş kaynak/nüfus/istikrar/çevre | 29.9 / 56.7 / 69.0 / 67.1 | 29.9 / 56.7 / 69.0 / 67.1 | 29.9 / 56.7 / 69.0 / 67.1 | 29.9 / 56.7 / 69.0 / 67.1 |
| Ortalama kaynak/nüfus/istikrar/çevre | 17.1 / 45.7 / 52.4 / 70.0 | 12.5 / 36.9 / 46.3 / 67.9 | 24.8 / 55.1 / 55.1 / 65.2 | 29.1 / 56.4 / 56.0 / 75.3 |
| Yiyecek üretim/tüketim (tur) | 2.96 / 4.00 | 3.81 / 4.00 | 3.90 / 4.00 | 3.87 / 4.00 |
| Açlık turu oranı | 20.7% | 5.1% | 2.1% | 1.8% |
| Açlık turunda nüfus kaybı | 4.3 | 3.9 | 3.8 | 3.6 |
| İstikrar <15 (koşu, tur) | 7.3% after 28.5 | 24.9% after 89.3 | 4.4% after 155.0 | 2.6% after 123.1 |
| Uygun kart | 8.9 | 18.8 | 31.0 | 40.1 |
| Aktif seçenek | 2.39 | 2.58 | 2.97 | 3.12 |
| Sıfır kaynak kararı · uygun kart | 23.3% · 1.7 cards | 12.2% · 12.3 cards | 4.4% · 21.0 cards | 3.0% · 29.3 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 4.1 / 3.4 / – / 6.9 | 17.4 / 16.3 / – / 17.8 | 25.1 / 24.0 / – / 30.8 | 34.3 / 32.0 / – / 39.9 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 23.5% / 47.3% / 54.0% | 0.7% / 29.0% / 60.3% | 0.0% / 6.4% / 48.3% | 0.0% / 0.4% / 37.1% |
| Nüfus/100 karar: kart −kayıp/+kazanç | −54.8 / +4.5 | −33.9 / +10.6 | −20.3 / +7.0 | −16.4 / +5.0 |
| Nüfus/100 karar: gecikmeli | −1.7 / +0.6 | −0.4 / +0.2 | −0.5 / +0.1 | −0.5 / +0.1 |
| Nüfus/100 karar: tur sonu (açlık −, büyüme +) | −88.1 / +0.0 | −19.9 / +0.0 | −8.0 / +15.5 | −6.5 / +12.9 |
| İstikrar/100 karar: kart net · gecikmeli · tur sonu · meclis | 199.6−215.4 / −44.7 / −46.2 / −9.1 | 153.1−135.4 / −20.9 / −10.4 / −17.3 | 173.1−149.9 / −12.7 / −4.1 / −13.4 | 165.6−144.5 / −11.7 / −3.4 / −12.4 |
| 20./40./80. Era 4 kararında kaynak/istikrar/nüfus | 11/48/42 · 10/46/39 · 7/48/35 | 19/53/48 · 12/48/44 · 9/43/36 | 21/57/51 · 18/54/52 · 21/53/52 | 22/57/51 · 20/54/50 · 23/54/53 |
| Nüfusu sıfırlayan adım (koşu) | world 1004, card 134, delayed 0 | world 1366, card 576, delayed 0 | world 688, card 54, delayed 0 | world 624, card 52, delayed 0 |
| Ambara birikim/100 karar (tur sonu kaynak artışı) | 0.0 | 0.0 | 14.0 | 11.1 |
| Otorite / meclis savunması / rakip gücü (avcı–rahip) / ilişki (avcı–rahip) | 33.9 / 41.3 / 40–39 / 5–11 | 9.4 / 15.8 / 51–50 / -4–4 | 4.3 / 52.7 / 56–55 / 36–34 | 4.2 / 50.5 / 56–56 / 35–32 |
| Meclis itirazı/toplantı · meclis istikrar kaybı/100 karar | 0.32 · −9.1 istikrar | 0.35 · −17.3 istikrar | 0.19 · −13.4 istikrar | 0.18 · −12.4 istikrar |
| 100. karardan sonra çeşitlilik | 16 runs · 5.8 cards · 6.6 choices | 1153 runs · 20.6 cards · 28.4 choices | 1459 runs · 35.3 cards · 70.3 choices | 1443 runs · 44.1 cards · 88.8 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 65.0%, estate_fields_worked 63.6%, granary_register_kept 21.3%, harbor_fishery_licensed 55.9% | canal_fields_open 66.2%, estate_fields_worked 81.7%, granary_register_kept 21.5%, harbor_fishery_licensed 63.3% | canal_fields_open 65.6%, estate_fields_worked 65.1%, granary_register_kept 23.7%, harbor_fishery_licensed 67.0% |

### random (2000 seed | 2000 seed | 2000 seed | 2000 seed)

| Ölçüm | milestone255-ref-210 | milestone255-ref-225 | milestone255-ref-240 | milestone255-era4-diagnostic |
|---|---|---|---|---|
| Era 4'e ulaşan | 43.0% | 43.0% | 43.0% | 43.0% |
| Açlık sonu | 59.8% | 99.8% | 95.0% | 82.8% |
| Deste tükenmesi | 40.2% | 0.0% | 0.0% | 0.0% |
| 500 sınırı | 0.0% | 0.0% | 4.1% | 16.3% |
| Toprak sonu | 0.0% | 0.2% | 0.9% | 0.9% |
| Era 4 karar/koşu | 30.2 | 57.8 | 122.1 | 162.3 |
| Giriş kaynak/nüfus/istikrar/çevre | 34.9 / 52.5 / 72.8 / 60.0 | 34.9 / 52.5 / 72.8 / 60.0 | 34.9 / 52.5 / 72.8 / 60.0 | 34.9 / 52.5 / 72.8 / 60.0 |
| Ortalama kaynak/nüfus/istikrar/çevre | 14.7 / 40.5 / 49.3 / 58.5 | 11.0 / 35.8 / 36.3 / 63.2 | 11.6 / 39.3 / 31.9 / 66.1 | 12.1 / 41.1 / 29.2 / 71.7 |
| Yiyecek üretim/tüketim (tur) | 3.13 / 4.00 | 3.73 / 4.00 | 3.85 / 4.00 | 3.88 / 4.00 |
| Açlık turu oranı | 19.1% | 11.6% | 7.9% | 5.8% |
| Açlık turunda nüfus kaybı | 4.1 | 4.4 | 4.2 | 4.1 |
| İstikrar <15 (koşu, tur) | 45.8% after 27.0 | 75.6% after 38.0 | 74.8% after 69.2 | 74.8% after 80.3 |
| Uygun kart | 8.1 | 17.3 | 27.6 | 36.7 |
| Aktif seçenek | 2.36 | 2.49 | 2.78 | 2.90 |
| Sıfır kaynak kararı · uygun kart | 24.1% · 2.0 cards | 23.4% · 11.9 cards | 11.7% · 20.3 cards | 10.0% · 29.0 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 5.9 / 4.9 / 8.2 / 7.3 | 15.3 / 14.7 / 17.7 / 16.8 | 27.0 / 25.4 / 27.3 / 27.7 | 36.3 / 34.4 / 36.3 / 36.9 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 24.3% / 46.1% / 53.3% | 1.9% / 26.9% / 50.0% | 0.0% / 8.1% / 41.4% | 0.0% / 1.1% / 31.4% |
| Nüfus/100 karar: kart −kayıp/+kazanç | −61.5 / +7.2 | −44.2 / +5.9 | −22.6 / +9.3 | −18.0 / +8.0 |
| Nüfus/100 karar: gecikmeli | −2.1 / +0.6 | −1.1 / +0.3 | −2.3 / +0.6 | −1.8 / +0.5 |
| Nüfus/100 karar: tur sonu (açlık −, büyüme +) | −79.0 / +0.0 | −51.6 / +0.0 | −33.1 / +6.4 | −23.7 / +5.8 |
| İstikrar/100 karar: kart net · gecikmeli · tur sonu · meclis | 172.1−249.4 / −36.1 / −37.9 / −7.5 | 112.8−174.2 / −21.7 / −20.7 / −9.6 | 145.8−149.9 / −19.1 / −14.5 / −14.1 | 138.9−140.5 / −16.2 / −10.6 / −10.1 |
| 20./40./80. Era 4 kararında kaynak/istikrar/nüfus | 11/49/40 · 5/30/33 · 5/6/24 | 13/51/41 · 6/29/34 · 4/6/24 | 14/58/46 · 9/46/44 · 8/29/42 | 15/59/46 · 11/47/46 · 9/30/44 |
| Nüfusu sıfırlayan adım (koşu) | world 380, card 134, delayed 0 | world 627, card 231, delayed 0 | world 657, card 149, delayed 12 | world 593, card 108, delayed 12 |
| Ambara birikim/100 karar (tur sonu kaynak artışı) | 0.0 | 0.0 | 63.3 | 66.8 |
| Otorite / meclis savunması / rakip gücü (avcı–rahip) / ilişki (avcı–rahip) | 57.9 / 67.7 / 44–47 / 9–8 | 38.7 / 46.8 / 43–44 / 8–12 | 20.2 / 46.5 / 46–46 / 2–4 | 16.3 / 41.8 / 43–43 / 17–19 |
| Meclis itirazı/toplantı · meclis istikrar kaybı/100 karar | 0.17 · −7.5 istikrar | 0.27 · −9.6 istikrar | 0.32 · −14.1 istikrar | 0.27 · −10.1 istikrar |
| 100. karardan sonra çeşitlilik | 9 runs · 7.1 cards · 9.4 choices | 112 runs · 13.0 cards · 18.2 choices | 378 runs · 29.2 cards · 63.7 choices | 423 runs · 38.1 cards · 91.3 choices |
| Üreten kapasite (karar payı) | – | canal_fields_open 56.3%, estate_fields_worked 33.7%, granary_register_kept 48.7%, harbor_fishery_licensed 44.5% | canal_fields_open 62.9%, estate_fields_worked 48.1%, granary_register_kept 66.8%, harbor_fishery_licensed 60.5% | canal_fields_open 64.0%, estate_fields_worked 40.4%, granary_register_kept 71.4%, harbor_fishery_licensed 65.8% |

## Yatırım politikası (ayrı teşhis politikası; eski politikalarla karıştırılmamalı)

240 ve 255 kuralları, aynı seed'ler. Era 1–3'te progression gibi oynar.

### investment (2000 seed | 2000 seed)

| Ölçüm | 240 | 255 |
|---|---|---|
| Era 4'e ulaşan | 97.0% | 97.0% |
| Açlık sonu | 7.1% | 7.4% |
| Deste tükenmesi | 0.0% | 0.0% |
| 500 sınırı | 92.9% | 92.6% |
| Toprak sonu | 0.0% | 0.0% |
| Era 4 karar/koşu | 435.1 | 433.1 |
| Giriş kaynak/nüfus/istikrar/çevre | 44.4 / 52.6 / 46.6 / 35.6 | 44.4 / 52.6 / 46.6 / 35.6 |
| Ortalama kaynak/nüfus/istikrar/çevre | 33.3 / 64.7 / 72.8 / 60.7 | 41.6 / 62.3 / 85.5 / 72.9 |
| Yiyecek üretim/tüketim (tur) | 3.96 / 4.00 | 3.95 / 4.00 |
| Açlık turu oranı | 0.3% | 0.3% |
| Açlık turunda nüfus kaybı | 3.9 | 3.8 |
| İstikrar <15 (koşu, tur) | 7.6% after 67.1 | 4.8% after 37.3 |
| Uygun kart | 33.1 | 41.8 |
| Aktif seçenek | 3.05 | 3.19 |
| Sıfır kaynak kararı · uygun kart | 0.5% · 20.9 cards | 0.5% · 29.7 cards |
| Uygun kart: düşük istikrar/nüfus/çevre/düşman | 29.2 / 25.4 / 30.9 / 32.9 | 36.6 / 33.8 / 40.2 / 41.5 |
| Tekrar: ilk 20/40/80 Era 4 kararı | 0.0% / 3.3% / 49.4% | 0.0% / 0.1% / 37.9% |
| Nüfus/100 karar: kart −kayıp/+kazanç | −15.1 / +14.9 | −11.7 / +10.2 |
| Nüfus/100 karar: gecikmeli | −0.2 / +0.0 | −0.2 / +0.0 |
| Nüfus/100 karar: tur sonu (açlık −, büyüme +) | −1.3 / +4.9 | −1.2 / +5.0 |
| İstikrar/100 karar: kart net · gecikmeli · tur sonu · meclis | 186.8−125.2 / −9.7 / −0.6 / −47.9 | 152.8−120.4 / −8.2 / −0.6 / −16.6 |
| 20./40./80. Era 4 kararında kaynak/istikrar/nüfus | 21/51/50 · 21/56/53 · 29/64/58 | 22/52/50 · 25/57/53 · 35/74/58 |
| Nüfusu sıfırlayan adım (koşu) | world 130, card 8, delayed 0 | world 138, card 6, delayed 0 |
| Ambara birikim/100 karar (tur sonu kaynak artışı) | 63.8 | 38.8 |
| Otorite / meclis savunması / rakip gücü (avcı–rahip) / ilişki (avcı–rahip) | 5.5 / 57.4 / 65–66 / 69–19 | 5.2 / 61.5 / 71–71 / 70–34 |
| Meclis itirazı/toplantı · meclis istikrar kaybı/100 karar | 0.40 · −47.9 istikrar | 0.14 · −16.6 istikrar |
| 100. karardan sonra çeşitlilik | 1808 runs · 37.5 cards · 62.4 choices | 1798 runs · 46.1 cards · 73.4 choices |
| Üreten kapasite (karar payı) | canal_fields_open 94.0%, estate_fields_worked 95.7%, granary_register_kept 95.9%, harbor_fishery_licensed 94.5% | canal_fields_open 93.5%, estate_fields_worked 94.8%, granary_register_kept 95.0%, harbor_fishery_licensed 93.7% |
