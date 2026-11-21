# Phase 3 — PR #1–#5'in `main`'e birleştirilmesi (2026-11-21)

Beş yığılmış Phase 3 PR'ı **merge commit** yöntemiyle, sırayla ve her adımda doğrulanarak `main`'e birleştirildi. Squash veya rebase kullanılmadı. Force push, hard reset, `git clean` yapılmadı; dallar silinmedi. Kullanıcının commit'lenmemiş dosyalarına dokunulmadı.

Bu belge `main`'e doğrudan yazılmadı; 270 dalının (`phase3-era4-270`) ilk commit'idir.

## Birleştirme öncesi kontroller

- `git fetch` sonrası zincir doğrusal: `main ⊂ groundwork ⊂ 210 ⊂ 225 ⊂ 240 ⊂ 255`. Silinen veya yeniden adlandırılan dosya yok.
- Her adımda kod dışı beklenmeyen dosya yok. Yalnız `Sources/`, `Tests/`, `tools/`, `docs/`, `cards.json`, `assets/art_manifest.json` ve `.github/workflows/ios.yml` değişti. #1'de ayrıca `App/TheCardsOfFateApp.swift` dosyasında tek satır değişti.
- Beş PR da açıktı. GitHub'daki head SHA'ları yerel dallarla aynıydı.
- Her dalın native CI kaynağından sonraki commit'leri yalnız `docs/` değiştiriyor:

| PR | Dal | Head | CI kaynağı | Native CI |
|---|---|---|---|---|
| #1 | `phase3-era4-groundwork` | `b1341ef` | `8a2924b` | [44734293652](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44734293652) (#33) başarılı |
| #2 | `phase3-era4-210` | `f723b75` | `0521f6f` | [44748860814](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44748860814) (#34) başarılı |
| #3 | `phase3-era4-225` | `8bc4648` | `89173de` | [44813221092](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44813221092) (#35) başarılı |
| #4 | `phase3-era4-240` | `ad3ac27` | `e4c11f6` | [44881478766](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44881478766) (#36) başarılı |
| #5 | `phase3-era4-255` | `c5ab913` | `3bc8a65` | [44893045378](https://github.com/srcnxylmz/the-cards-of-fate/actions/runs/44893045378) (#37) başarılı |

## Birleştirmeler

Her PR'ın tabanı bir öncekinin birleşmesinden sonra `main` yapıldı. GitHub her seferinde yalnız o paketin commit'lerini gösterdi ve "No conflicts with base branch" bildirdi.

| Sıra | PR | Taban değişikliği | Birleşmede commit / dosya | Merge commit | Ebeveynler |
|---|---|---|---|---|---|
| 1 | [#1](https://github.com/srcnxylmz/the-cards-of-fate/pull/1) | zaten `main` | 4 / 44 | `fab6874` | `c405ac2` + `b1341ef` |
| 2 | [#2](https://github.com/srcnxylmz/the-cards-of-fate/pull/2) | groundwork → `main` | 2 / 35 | `4860429` | `fab6874` + `f723b75` |
| 3 | [#3](https://github.com/srcnxylmz/the-cards-of-fate/pull/3) | 210 → `main` | 4 / 46 | `36eea6e` | `4860429` + `8bc4648` |
| 4 | [#4](https://github.com/srcnxylmz/the-cards-of-fate/pull/4) | 225 → `main` | 2 / 51 | `dd269ef` | `36eea6e` + `ad3ac27` |
| 5 | [#5](https://github.com/srcnxylmz/the-cards-of-fate/pull/5) | 240 → `main` | 2 / 59 | `065e39a` | `dd269ef` + `c5ab913` |

- Her birleşmeden sonra `git fetch` yapıldı. `main` ağacı birleşen dalın ağacıyla birebir aynı çıktı (`git diff` boş).
- **Arayüz hatası:** #5'in tabanı değiştirilirken dal listesinde yanlış öğeye tıklandı ve taban bir an `phase3-era4-225` oldu. Bu sırada birleştirme yapılmadı. Taban hemen `main` olarak düzeltildi ve 2 commit, çakışmasız durum doğrulandıktan sonra birleştirildi.
- GitHub API sonucu: beş PR da `closed`, `merged:true`, tabanı `main`.

## Birleştirme sonrası `main` doğrulaması

**Son `main` SHA'sı:** `065e39a03c98b8b9fb15e5862fe73ba2c29d2619`.

- **Soy ağacı:** `c5ab913` (255 belge HEAD'i) `main`'in atası.
- **Dosya ağacı:** `git diff c5ab913 065e39a` boş; `main` ağacı doğrulanan 255 HEAD'iyle birebir aynı.
- **Native CI'ın geçerliliği:** `git diff 3bc8a65 065e39a -- . ':!docs'` boş. #37'nin doğruladığı kaynak kod `main`'dekiyle aynı. Native CI ve 60.000 simülasyon bu yüzden tekrarlanmadı.
- **İçerik:**
  - 255 kart, 715 karar.
  - Çağ envanteri 60 / 60 / 60 / 75.
  - `ERA4_GATE.enabled:false`, `balanceEvidence:null`.
  - Era 5 ve sonrası `enabled:false`.
- **Testler (`main` üzerinde, Windows):**
  - `node tools/build-content.mjs --check` geçti.
  - `node tools/validate-content.mjs`: 0 hata, 0 uyarı.
  - `node --test tools/*.test.mjs`: **99/99**.
  - `swift test` (Swift 6.4.2): **148/148**. Bunun 136'sı FateCoreTests'te; v1 kayıt, deterministik tekrar ve ilk üç çağın değişmezliği testleri buradadır. Kalan 12'si FateDiagnosticsTests'te.
- **Düzeltme gerekmedi.**

Kaynak dallar silinmedi. İsterseniz birleşmiş oldukları için GitHub'dan silinebilirler.
