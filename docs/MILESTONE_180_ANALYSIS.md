# 180 kart denge karşılaştırması

Her hücre 165 → 180 kartı gösterir. Her politika aynı 10.000 seed ve 500 karar sınırını kullanır. Yaşayan sınır, gözlemin kesildiği noktadır.

| Politika | Ortalama karar | Neolitik / Tunç | Tunç açlık kaybı / 100 karar | Tunç çevre ortalaması | Tüm oyun tekrar % | Yaşayan sınır |
|---|---:|---:|---:|---:|---:|---:|
| random | 137.66 → 159.78 | 6327 / 5503 → 6172 / 5353 | 28.05 → 18.82 | 33.70 → 47.94 | 66.87 → 69.89 | 985 → 1803 |
| survival | 198.93 → 197.59 | 0 / 0 → 0 / 0 | — → — | — → — | 75.99 → 73.50 | 1199 → 1332 |
| knowledge | 402.88 → 419.56 | 8861 / 8116 → 8721 / 8181 | 0.24 → 0.19 | 18.30 → 19.58 | 85.38 → 84.25 | 7376 → 7992 |
| progression | 478.14 → 484.55 | 9907 / 9702 → 9911 / 9727 | 0.39 → 0.27 | 20.59 → 24.63 | 89.06 → 88.13 | 9389 → 9560 |
| recovery | 484.14 → 482.46 | 9918 / 9768 → 9909 / 9765 | 0.81 → 0.71 | 94.03 → 95.47 | 90.30 → 89.28 | 9654 → 9608 |
| survival-council | 74.25 → 70.30 | 0 / 0 → 0 / 0 | — → — | — → — | 40.04 → 31.81 | 71 → 51 |

## Tunç Çağı karar pencereleri

| Politika / pencere | Gözlem tamamlayan oyun | Tekrar % | Farklı kart | Farklı kart / karar |
|---|---:|---:|---:|---:|
| random / 20 | 5072 → 4926 | 0.32 → 0.15 | 19.94 → 19.97 | 19.97 → 19.99 |
| random / 40 | 4507 → 4260 | 24.97 → 16.68 | 30.01 → 33.33 | 34.88 → 36.91 |
| random / 80 | 3617 → 3397 | 61.21 → 56.81 | 31.03 → 34.55 | 46.14 → 51.71 |
| random / 100 sonrası | 3248 → 3181 | 99.74 → 99.73 | 17.41 → 21.85 | 34.32 → 47.72 |
| survival / 20 | 0 → 0 | — → — | — → — | — → — |
| survival / 40 | 0 → 0 | — → — | — → — | — → — |
| survival / 80 | 0 → 0 | — → — | — → — | — → — |
| survival / 100 sonrası | 0 → 0 | — → — | — → — | — → — |
| knowledge / 20 | 8072 → 8165 | 0.01 → 0.00 | 20.00 → 20.00 | 20.00 → 20.00 |
| knowledge / 40 | 7945 → 8125 | 25.14 → 16.80 | 29.95 → 33.28 | 33.36 → 35.71 |
| knowledge / 80 | 7828 → 8064 | 61.73 → 57.09 | 30.61 → 34.33 | 40.65 → 45.09 |
| knowledge / 100 sonrası | 7745 → 8030 | 99.82 → 99.77 | 18.39 → 22.00 | 32.06 → 39.94 |
| progression / 20 | 9681 → 9706 | 0.01 → 0.00 | 20.00 → 20.00 | 20.00 → 20.00 |
| progression / 40 | 9664 → 9697 | 29.72 → 20.58 | 28.11 → 31.77 | 32.52 → 34.56 |
| progression / 80 | 9584 → 9676 | 64.17 → 59.62 | 28.66 → 32.31 | 39.81 → 42.91 |
| progression / 100 sonrası | 9560 → 9673 | 99.84 → 99.87 | 17.99 → 21.57 | 32.27 → 40.09 |
| recovery / 20 | 9710 → 9718 | 0.02 → 0.01 | 20.00 → 20.00 | 20.00 → 20.00 |
| recovery / 40 | 9696 → 9703 | 29.35 → 20.73 | 28.26 → 31.71 | 32.14 → 34.38 |
| recovery / 80 | 9672 → 9649 | 64.47 → 59.98 | 28.42 → 32.02 | 38.16 → 41.06 |
| recovery / 100 sonrası | 9664 → 9632 | 99.99 → 99.98 | 16.35 → 20.13 | 29.87 → 34.15 |
| survival-council / 20 | 0 → 0 | — → — | — → — | — → — |
| survival-council / 40 | 0 → 0 | — → — | — → — | — → — |
| survival-council / 80 | 0 → 0 | — → — | — → — | — → — |
| survival-council / 100 sonrası | 0 → 0 | — → — | — → — | — → — |

Tam ilk pencereler o kadar Tunç turu tamamlayan oyunlardan oluşur. Aşağıdaki fiili kayıplar o pencereye giren tüm kararları içerir. Çevre giderinde kırpılan kısım sayılmaz.

| Random Tunç penceresi | Fiili çevre kaybı / 100 karar | Gecikmiş çevre kaybı / 100 karar | Çevre kazanımı / 100 karar |
|---|---:|---:|---:|
| 20 | 131.56 → 109.12 | 12.97 → 11.36 | 103.41 → 101.06 |
| 40 | 169.66 → 133.93 | 16.89 → 14.30 | 130.30 → 119.07 |
| 80 | 194.16 → 157.85 | 18.25 → 16.24 | 158.80 → 144.11 |

## Doğal zincir kapanışı ve karar kapsamı

| Politika | Yeni kararlar | Yol zinciri ortak / özel | 100 sonrası farklı sonuç anahtarı (toplam) |
|---|---:|---:|---:|
| random | 36 / 36 | 28 / 14 | 84 → 107 |
| survival | 10 / 36 | 0 / 0 | 0 → 0 |
| knowledge | 36 / 36 | 13 / 386 | 77 → 102 |
| progression | 36 / 36 | 13 / 237 | 68 → 92 |
| recovery | 36 / 36 | 3 / 99 | 64 → 84 |
| survival-council | 10 / 36 | 0 / 0 | 0 → 0 |

Sonuç anahtarları kart, seçim ve gerçekleşen sonuç kimliğini içerir. Bu sütun tüm kohortun birleşimidir. Oyun başına çeşitlilik üst tablodadır. Tam karar dağılımları, kaynak ve çevre giderleri, gerçek ölüm aşamaları ve eski zincirler ham JSON raporlarında yer alır.
