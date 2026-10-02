# Contact information: WordPress source of truth

Public contact information now comes only from the WordPress endpoint:

`/wp-json/ssm/v1/contact`

The same CMS data is used by:

- the Contact page
- the footer
- the quote form recipient email
- the Google Maps query/location

The frontend no longer keeps a duplicate phone number, public email, office address, or LinkedIn URL in `lib/site.ts`.

Update these values in WordPress under **Settings → SSM Contact**. With `CMS_REVALIDATE_SECONDS=10`, production/server-rendered CMS data may take up to roughly 10 seconds to refresh depending on Next.js caching.

If WordPress is unavailable, contact fields are intentionally not replaced with hardcoded frontend values. This keeps WordPress as the single source of truth.
