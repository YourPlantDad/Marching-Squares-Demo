## Marching Squares Demo

**What it is**  Marching Squares converts a 2‑D scalar grid into crisp contour lines. Each cell looks at its four corners, encodes them into a 4‑bit state (0‑15), and draws one or two line segments accordingly.

**Core loop — 3 steps**

1. **Sample noise** `noise3D(x, y, zoff)` fills every grid corner with a value ‑1…1. Increment `zoff` each frame → flowing animation.
2. **Build bitmask** For each cell, test every corner against iso‑level 0; pack the four booleans into a 4‑bit integer with `getState()`.
3. **Draw segment(s)** Use a 16‑entry lookup table to pick the right edge segments and render them via `drawLine()`.

**Sketch flow**

```text
setup()   -> build grid, seed with OpenSimplex noise

draw()    -> 1. sample noise grid
             2. zoff += zIncrement
             3. for each cell: state = getState()
             4. switch(state) -> drawLine()
```

`drawLine()` renders the line, accepting a, b, c and d .

Tweak a handful of variables and the look, resolution, and motion update instantly — the underlying algorithm stays the same.
