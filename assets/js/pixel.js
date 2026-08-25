/* ---------- The Pixel Story: shared Pixel character reference ----------
 * Every chapter page embeds Pixel's base SVG markup directly and statically
 * (see ai-story-design-guidelines.md §5) rather than injecting it at runtime,
 * because that inline-and-working approach is what's already validated in
 * every chapter — dynamically generating it here would risk breaking a
 * working page for no benefit on a static site with no build step. This file
 * simply keeps the canonical markup available as a reference/reuse point for
 * any future chapter or tool that wants to generate a page programmatically.
 */
window.PIXEL_BASE_SVG = '' +
  '<g id="pixelBase">' +
    '<ellipse cx="205" cy="196" rx="46" ry="7" fill="var(--ink)" opacity="0.07"/>' +
    '<rect x="163" y="34" width="7" height="24" rx="3.5" fill="var(--line-strong)"/>' +
    '<circle cx="166.5" cy="34" r="6.5" fill="var(--c)"/>' +
    '<rect x="150" y="58" width="112" height="94" rx="26" fill="var(--surface)" stroke="var(--line-strong)" stroke-width="2"/>' +
    '<circle cx="206" cy="102" r="32" fill="var(--surface-2)" stroke="var(--line-strong)" stroke-width="2"/>' +
    '<circle id="facePupil" cx="206" cy="102" r="14" fill="var(--ink)"/>' +
    '<circle cx="200" cy="96" r="3.6" fill="var(--surface)"/>' +
    '<rect x="180" y="140" width="52" height="8" rx="4" fill="var(--line-strong)"/>' +
  '</g>';
