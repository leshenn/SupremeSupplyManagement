# Supreme Supply Management — Next.js + WordPress CMS

This project is the current Supreme Supply Management Next.js frontend, connected to a small set of custom WordPress plugins so non-developers can manage Services, Projects, Testimonials, Blog Posts and Contact details from WordPress.

## 1. Install the WordPress plugins

The installable plugin ZIPs are inside `wordpress-plugin-zips/`.

In WordPress go to **Plugins → Add New → Upload Plugin** and install/activate:

1. `ssm-services.zip`
2. `ssm-projects.zip`
3. `ssm-testimonials.zip`
4. `ssm-blog-api.zip`
5. `ssm-contact-settings.zip`

Services, Projects and Testimonials seed the current content the first time they are activated. Contact Settings starts with the current contact information. Blog uses normal WordPress **Posts**.

## 2. WordPress admin areas

After activation you will see:

- **Services** — service title, short summary, detailed description, kicker and capability list.
- **Projects** — project/client name, type, summary and expanded description.
- **Testimonials** — client name, role, company and testimonial text.
- **Posts** — normal WordPress blog posts. Featured images are optional and automatically feed the frontend hover/image treatment.
- **Settings → SSM Contact** — phone, public email, quote email, office address, LinkedIn and Google Maps location.

## 3. Connect Next.js to WordPress

Copy `.env.example` to `.env.local` in the frontend root.

For a local XAMPP WordPress install at `http://localhost/supreme-supply`:

```env
WORDPRESS_URL=http://localhost/supreme-supply
CMS_REVALIDATE_SECONDS=60
```

If WordPress is at another local folder, change the URL. For production, use the live WordPress URL.

## 4. Run the frontend

```bash
npm install
npm run dev
```

Then open the localhost address Next.js prints, usually `http://localhost:3000`.

## 5. REST endpoints used by the frontend

- `/wp-json/ssm/v1/services`
- `/wp-json/ssm/v1/projects`
- `/wp-json/ssm/v1/testimonials`
- `/wp-json/ssm/v1/posts`
- `/wp-json/ssm/v1/posts/{slug}`
- `/wp-json/ssm/v1/contact`

The frontend fetches these server-side, so local development does not require browser CORS configuration.

## 6. Fallback behaviour

If WordPress is offline or `WORDPRESS_URL` is not configured, the Next.js site falls back to the existing static/mock content. This makes local frontend development safe even when XAMPP is not running.

## Content flow

**WordPress admin → custom REST endpoints → Next.js pages**

- Service changes update `/services`.
- Project changes update `/projects` and the project previews on Home.
- The first testimonial controls the testimonial shown on Home.
- Published WordPress posts update the Blog and Home blog preview.
- Contact settings update the Contact page, quote email target and footer.

Next.js caches CMS responses for the number of seconds configured in `CMS_REVALIDATE_SECONDS`.

## Showcase update

This revision includes:

- a redesigned Blog index with one featured article plus a clean two-column article grid;
- featured images for all local fallback posts;
- a continuously moving horizontal testimonial carousel on the homepage;
- support for all testimonials returned by the WordPress `/wp-json/ssm/v1/testimonials` endpoint;
- fallback demo testimonials when WordPress is not connected.

The populated CSV files are supplied separately in the Showcase CMS bundle. Some rows are intentionally mock/demo content and are clearly documented as such in the CSV README.
