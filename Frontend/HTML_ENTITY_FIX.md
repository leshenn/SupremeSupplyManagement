# WordPress HTML Entity Fix

This version decodes WordPress HTML entities in plain-text CMS fields before they reach React.

Examples:

- `Women&#8217;s Day` -> `Women’s Day`
- `A &amp; B` -> `A & B`
- `&quot;Quoted text&quot;` -> `"Quoted text"`

## Changed files

- `lib/html.ts` — new reusable HTML entity decoder
- `lib/cms.ts` — applies decoding to WordPress text fields

The decoder is applied centrally to:

- Service titles, kickers, summaries and capabilities
- Project/client names, types and summaries
- Testimonial quotes, names, roles and companies
- Blog titles, excerpts and image alt text
- Plain contact details

Full WordPress HTML (`contentHtml` / `detailHtml`) is intentionally left untouched because it is rendered as HTML and the browser resolves its entities naturally.

No new npm dependency is required.
