# Supreme Supply Management — Next.js frontend

This is the current Supreme Supply Management frontend. WordPress is used as the CMS and Next.js renders the public website.

## Run locally

Create `.env.local` next to `package.json`:

```env
WORDPRESS_URL=http://localhost/supreme-supply
CMS_REVALIDATE_SECONDS=60
```

Then run:

```bash
npm install
npm run dev
```

## Main routes

```text
/                 Home
/company          Company / About Us
/services         Services
/global-network   Global Network
/projects         Projects
/blog             Blog
/contact          Contact / quote request
```

`/about` now redirects to `/company`.

## WordPress REST endpoints

```text
/wp-json/ssm/v1/services
/wp-json/ssm/v1/projects
/wp-json/ssm/v1/testimonials
/wp-json/ssm/v1/posts
/wp-json/ssm/v1/posts/{slug}
/wp-json/ssm/v1/contact
/wp-json/ssm/v1/chatbot
/wp-json/ssm/v1/company
/wp-json/ssm/v1/global-network
```

## Current home page

The Home page contains:

- hero;
- concise Supreme introduction;
- Personal Attention / Global Connections / Reliable Execution / Tailored Solutions block;
- “Your Shipment, Made Simple.” four-step logistics journey;
- final Request a quote CTA.

Projects, testimonials and blog previews have intentionally been removed from Home. Projects and Blog remain available on their own pages.

## Company and Global Network CMS

Install the supplied **SSM Company Page** and **SSM Global Network** WordPress plugins. Both ship with the approved copy preloaded and can be edited from WordPress without changing the frontend code.

If the new endpoints are temporarily unavailable, the frontend contains matching fallback copy so the pages still render during development.
