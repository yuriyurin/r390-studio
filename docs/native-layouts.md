# Native layout evidence

The catalogue dump provided by the owner was inspected read-only. The independent container analyzer parsed 98 containers, with matching CRCs and byte-for-byte rebuilds. Work files remain outside this repository.

- Time uses the existing type-3 sources 2/3 (hour digits) and 10/11 (minute digits). Stacked time changes their coordinates, not their data sources. Hour/minute colors use separate raster sets.
- `SM-R390_00013` contains a type-3 source 17 with seven rasters. Decoding the first raster shows MON, confirming Monday-first weekday order.
- `SM-R390_00003/style0.bin` contains a type-13 date composite with source 21 followed by source 18. Its shipped preview shows 12/28, corroborating month/day ordering. Its second field prefixes the slash from string group 5, while group 6 supplies numeric glyphs.
- The editor's existing date template uses sources 17/21/18, weekday strings starting at group 0, month strings at group 7, and numeric glyphs at group 21. New layouts retain these sources and add per-layer, fixed-language string groups to every existing locale table. Format fields and unused composite slots retain the stock record structure.
- Existing metric sources 29/41/48 remain unchanged. PNG layout changes add static icon rasters around a native numeric widget; disabling an icon does not freeze the metric.

Tests compare estimated sizes with actual container construction for time, dates, metrics, batteries, hands and animations. A browser-built test BIN passed the independent analyzer's CRC/rebuild checks. These checks verify encoding, not rendering on physical hardware. New date formats still need an on-watch smoke test across midnight and month boundaries.

Project ZIP is an editor interchange format, not arbitrary BIN decompilation. It contains a versioned JSON manifest, embedded assets and an optional preview. Import rejects unexpected paths, missing resources, remote image references and archives over the compressed/expanded limits.
