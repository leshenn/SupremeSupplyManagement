# Smooth Services / Projects Accordions

The Services and Projects pages now use a client-side accordion that keeps the expanded content mounted so opening and closing can animate smoothly.

Changes:
- Smooth height expansion/collapse
- Gentle fade + vertical settle animation
- Chevron rotation animation
- Multiple items can remain open at once
- Project links using `/projects#slug` automatically open and scroll to the matching project
- Reduced-motion accessibility support

The animation timing is controlled near the bottom of `app/globals.css` under:

`/* 2026-10 smooth Services / Projects accordion animation */`

To make it faster/slower, adjust the `.46s`, `.52s`, `.32s`, and `.42s` transition durations in that block.
