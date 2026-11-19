# Era 4 boundary and future dependencies — 180-card group

## Durum — 195 paketi (Claude, dal `phase3-era4-groundwork`)

Aşağıdaki "proposed, not implemented" bölümlerinin bir kısmı artık uygulandı; Era 4 **hâlâ kapalı**.

- **Uygulandı:** açık içerik hazırlık kapısı (`EraDefinition.contentGate`, `enabled:false`), ayrık envanter sayımı (`CardEvent.eraRole`), `advanceEra` artık `eraContentReady` ister. Yalnızca kart eklemek de, yalnızca anahtarı açmak da çağı açmaz; doğrulayıcı envanter eksikken `enabled:true`'yu hata sayar. Mevcut writing / knowledge78 / stability35 / population25 eşikleri değişmedi.
- **Uygulandı:** 15 Era 4 olayı (9 tekrarlanabilir, 3 köprü, 3 sonuç) ve bayrak tabanlı eyalet defteri (özerklik, iki kademeli haraç borcu, yol, garnizon, su, atölye, ikamet, meşruiyet, eyalet senet sicili). Yeni kalıcı state yok; v1 şema anahtarları aynı.
- **Uygulandı (dönüşüm tablosundan):** ekmek senedi (açık/ödenmiş/temerrüt/hiç), kalıp beratı (kamu/özel), sırt yolu (kamu/özel), sarnıç (kamu/özel, kredi bir kez), alarm (kamu/özel), bakım (kamu/özel), konuk vatandaşlığı ve mera kaydı (tanıklık). Gece nöbeti, liman ikameti ve iskele vergisi dönüşümleri henüz yok.
- **Envanter:** 15/40 · 9/24 · 3/8 · 3/8; sekiz kriz alanı temsil ediliyor.
- **Doğrulama:** Node 70/70. Swift testleri yazıldı ama bu ortamda çalıştırılamadı; native/simülasyon kanıtı yok. Ayrıntı: [PHASE3_195_REPORT.md](PHASE3_195_REPORT.md), devir: [HANDOFF_195_CODEX.md](HANDOFF_195_CODEX.md).


This milestone adds no Era 4 cards and does not open the fourth era. MASTER_SPEC section 3 defines Ancient Empires as governing large kingdoms/empires; section 4 requires knowledge, discoveries, stability and key historical events rather than an elapsed-turn gate. The first-three-era Phase 2 target remains 180 original events. Existing 12-era metadata is not playable content.

The current Bronze → Ancient boundary requires writing, knowledge ≥78, stability ≥35, population ≥25, a living civilization, and authored next-era content. `advanceEra` refuses an unauthored era. The native-verified Phase 2 release has 60 cards per era in eras 1–3 and zero in eras 4–12. Era 4 metadata lists Stone Capital / Empire, civil_law and knowledge 82 for the eventual next transition. [Native Phase 2 evidence](NATIVE_180_EVIDENCE.md)

Before a future phase enables that boundary:

- Author the planned substantial Era 4 inventory and tested recurring pool. Do not let one experimental card silently activate an otherwise empty era; add an explicit content-readiness gate when opening it.
- Define provinces, taxation/tribute, road and siege logistics, local autonomy and citizenship conflicts with observable human costs. Keep the offline deterministic/save architecture; do not substitute empire names for mechanics.
- Carry the actual Bronze records forward: mold access versus private leases, water contributions and runoff obligations, open/defaulted/paid grain bonds, civic ferry terms and guest representation. Name the permitted conversions and closure conditions; old flags must not grant permanent cost-free privileges.
- Specify the relationship between the existing six rating stats and provincial quantities before introducing a second currency or literal population economy. This milestone constrains work through card outcomes; it does not claim that population already continuously scales world farm production.
- Define lawful reform/civil_law discovery and opposition legitimacy, plus settlement/leadership presentation and later transition requirements. The current generic famine/ecology endings are not the required thirty fate endings.
- Test both maintained and collapsed infrastructure, low population, empty reserves, unpaid bonds, succession and faction opposition at the transition. Load schema-v1 saves and replay the same RNG; preserve already displayed cards and queued consequences.
- Provide period-specific art, music/ambience, accessibility/device evidence and a versioned weekly-rules plan. Signing/Game Center configuration requires the user's Apple account and remains separate from simulator acceptance.

Commercial targets remain 12 eras, at least 800 original cards, 100 editorially complete chains and 30 distinct fate endings. These dependencies are a boundary plan, not a completion claim or authorization to publish an incomplete fourth era.

## Proposed conversion ledger — design only, not active rules

| Bronze history | Future imperial conflict / required limits |
|---|---|
| public/private mold settlement | Provincial workshop franchise versus transferable access; new labor/material costs and appeal; no permanent free production |
| cistern public/private accounts, runoff rule | Municipal versus provincial water obligations; drought audit, maintenance and local consent; no automatic ecology bonus |
| public/private pasture settlement | Citizenship/access claims at provincial gates; credit old well/crossing work separately from new roads and watches; closure/revision hearing |
| shared ferry terms and quay_public_account | Road/river toll audit and tax collection; declared upkeep budget, no universal tax exemption |
| bread open/repaid/default and surety_child_release | Separate grain claim, credit history and work protection; never resurrect paid debt or erase open debt on an era transition |
| coppice_memory and maintained fuel quota | Surveyed rotation concessions with paid guards and soil/water constraints; historical boundary is knowledge, not infinite timber |
| guest representation and route_school_memory | Residency/citizenship and guide service disputes; adult consent, inheritance scope and new work compensation |

Opening Era 4 still requires completion of the first-three-era 180-card phase, a substantial verified Era 4 recurring/content inventory, an explicit readiness gate and migration/replay tests for each conversion. No conversion code, fourth-era event, threshold adjustment or transition unlock is added in the 150 group. New public/private alarm settlements, vented-bin practice and paid street-watch/guest representation must also be carried as bounded precedents, never free provincial rights.

## Concrete entry contract after180 — proposed, not implemented

Before authoring the first enabled fourth-era card, introduce an explicit content-readiness switch, default false. A single experimental event must not satisfy readiness. Proposed minimum:40 original Era4 events, including at least24 repeatable crises, eight independently reviewed one-shot chain conclusions and eight distinct entry/bridge events. These inventory groups are disjoint; do not count one event twice. At least six distinct recurring conflicts each cover provincial logistics/taxation, water/land obligations, work/production access and citizenship/legitimacy. No fixed-turn unlock and no lowering the existing knowledge78/stability35/population25/writing requirements.

| Existing record | Entry conversion | First imperial dispute and acceptance condition |
|---|---|---|
| Open/paid/defaulted bread bond | Keep each actual obligation and its identity; no blanket amnesty on entry | Provincial levy competes with grain repayment. Paid old claims remain closed; a different new loan survives settlement of an old claim. |
| Cistern/runoff/public water accounts | Carry contribution evidence, not ownership of all water | Province proposes a maintenance levy; drought quotas distinguish paid old construction from new labor. No free water or ecology grant. |
| Guest/roof household voice | Preserve the actual representation precedent | Residency hearing distinguishes lodging, contribution and political voice; provincial officials cannot silently revoke old rights. Both negotiated citizenship and restricted residency have explicit costs/closure. |
| Public/private mold ownership | Preserve equipment access and current production contract separately | Imperial requisition requires new paid labor/materials; no retroactive confiscation hidden in a flag rename. Low-workforce output and depleted reserves remain constrained. |
| Alarm/private watch settlement | Carry liability terms and who controlled messages | Provincial guard levy distinguishes error from fraud and public accountability from a private service contract. New watch wages remain payable. |
| Public/private care settlement | Carry credited care work or the separate household contract | Census/levy dispute counts care, tax and current service separately. Old recognition grants a documented hearing advantage, never tax-free production. |
| Earlier leadership/mandate and faction relations | Preserve actual ruler, opposition, exile and consent history | Appointment of a governor tests local mandate versus central authority. A ruler cannot acquire legitimacy merely by changing era. |

Acceptance requires v1 save/reload and deterministic replay across entry, current displayed cards and queued effects preserved, no reopened paid debt, and both opposed outcomes for each conversion. Full same-seed comparisons must report deaths, starvation, ecology, lost access and living caps. Measure complete20/40/80 Era4 residence windows and after100 active choices; no empty deck or forced death to improve repeats. Add period art/UI/OCR/audio evidence before enabling entry. Physical-device/signing/Game Center remains a separate account/device gate. The165→180 group should complete first-three-era60/60/60 and refine this contract; it must not automatically open Era4.


## Proposed playable systems after the Phase 2 gate

The future prototype uses a bounded ledger per province with grain due, paid service, arrears, road condition and local consent. Each value needs a defined domain, named source and maintenance cost. Persist each contract identity. Credit a prior contribution once to the matching obligation. An unrelated debt survives that credit. Implement a dry-run entry conversion before enabling the readiness switch.

| System | Decision and consequence | Acceptance example |
|---|---|---|
| Provincial autonomy | Elect a local steward or appoint a central receiver. The local route trades immediate revenue for consent. The central route collects current tribute and owes wages plus a hearing. | Weak authority and hostile representation make the appointment costly without erasing prior opposition or revoking resident status. |
| Citizenship and opposition | Recognize named work and residence as hearing evidence. Pay witnesses and decide eligibility for a specific local duty. A dissenting faction can pursue a later review with a preserved record. | The earlier public care and rooftop participation histories change available testimony. Private contracts keep their terms without granting citizenship automatically. |
| Taxes and old grain debt | Compute tribute from assessed current output. Let a town pay part now, negotiate a new dated invoice or decline and face an appeal. | A paid old debt stays closed. Unpaid debt survives entry. Repeated credit cannot produce positive free grain. |
| Roads, water and trade | Fund stonework and downstream protection separately. Apply shared/private ridge settlement to testimony and prior toll liability. New work still consumes capital. Track wear with a fixed upper bound. | Dry reservoirs block new allocations. A maintained route reduces haul cost only while the road remains usable. Old water and passage rights remain distinct. |
| Military logistics and civil oversight | Maintain capped garrison supply obligations. Route supplies by funded roads, delay a deployment or renegotiate with local councils. A choice can leave a town with less grain or less consent. | Depleted reserves cannot supply a garrison without a funded agreement. New guard wages do not discharge earlier watch or work obligations. |
| Workshop ownership | Commission from an established guild or an open workshop. Compare capital, maintenance and representation costs with each order. | A recorded mold license changes who can bid. No order draws output from an exhausted input or bypasses payment for new labor. |

Inventory proposal uses forty disjoint authored IDs. Twenty-four repeatable crises, eight story conclusions and eight transition bridges. The gate also requires actual natural exposure, an adequate legal recurring pool at low reserves and depleted ecology, v1 migration/replay regressions, all six seeded comparisons, and native UI and artifact checks. Era 4 remains closed in the 180-card package.
