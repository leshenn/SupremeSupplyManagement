/**
 * Decode HTML entities returned by WordPress for plain-text fields.
 *
 * WordPress commonly returns entities such as &#8217; for curly apostrophes,
 * &amp; for ampersands, and &quot; for quotes. React escapes plain strings,
 * so without decoding them first those entity codes can appear literally.
 *
 * Do NOT use this on full HTML content that is rendered with
 * dangerouslySetInnerHTML. Browsers already resolve entities inside HTML.
 */
const namedEntities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: '\u00A0',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  hellip: '…',
  copy: '©',
  reg: '®',
  trade: '™',
};

function decodeOnce(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
      const codePoint = Number.parseInt(hex, 16);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : _;
    })
    .replace(/&#(\d+);/g, (_, decimal: string) => {
      const codePoint = Number.parseInt(decimal, 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : _;
    })
    .replace(/&([a-z][a-z0-9]+);/gi, (entity, name: string) => {
      return namedEntities[name.toLowerCase()] ?? entity;
    });
}

export function decodeHtml(value?: string | null): string {
  if (!value) return '';

  // Two passes also handle the occasional double-encoded value such as
  // &amp;#8217; without repeatedly mutating normal text.
  return decodeOnce(decodeOnce(value));
}

export function decodeHtmlList(values?: string[] | null): string[] {
  return (values ?? []).map((value) => decodeHtml(value));
}
