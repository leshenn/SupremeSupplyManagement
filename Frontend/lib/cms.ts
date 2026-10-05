import { decodeHtml, decodeHtmlList } from './html';
import type { CompanyPageContent } from './company';
import type { GlobalNetworkPageContent } from './globalNetwork';

const wordpressUrl = (
  process.env.WORDPRESS_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  'https://cms.supremesupply.co.za'
).replace(/\/+$/, '');

const revalidateSeconds = Number(
  process.env.CMS_REVALIDATE_SECONDS || 300
);

async function cmsFetch<T>(path: string): Promise<T | null> {
  if (!wordpressUrl) {
    return null;
  }

  try {
    const response = await fetch(`${wordpressUrl}${path}`, {
      next: {
        revalidate: Number.isFinite(revalidateSeconds)
          ? revalidateSeconds
          : 60,
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type CmsService = {
  id?: number;
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  detailHtml: string;
  capabilities: string[];
};

export type CmsProject = {
  id?: number;
  slug: string;
  client: string;
  type: string;
  summary: string;
  detailHtml: string;
};

export type CmsTestimonial = {
  id?: number;
  quote: string;
  person: string;
  role: string;
  company?: string;
};

export type CmsPost = {
  id?: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  contentHtml: string;
  image?: string;
  imageAlt?: string;
};

export type ChatbotItem = {
  id?: number;
  key: string;
  parentKey: string;
  label: string;
  responseHtml: string;
  actionLabel: string;
  actionUrl: string;
};

export type ChatbotConfig = {
  greeting: string;
  intro: string;
  items: ChatbotItem[];
};

export type ContactSettings = {
  phone: string;
  email: string;
  quoteEmail: string;
  address: string;
  linkedin: string;
  mapQuery: string;
};

/* -------------------------------------------------------------------------- */
/*                                  SERVICES                                  */
/* -------------------------------------------------------------------------- */

export async function getServices(): Promise<CmsService[]> {
  const remote = await cmsFetch<CmsService[]>(
    '/wp-json/ssm/v1/services'
  );

  if (!remote || !Array.isArray(remote)) {
    return [];
  }

  return remote.map((service) => ({
    ...service,
    title: decodeHtml(service.title || ''),
    kicker: decodeHtml(service.kicker || ''),
    summary: decodeHtml(service.summary || ''),
    capabilities: decodeHtmlList(service.capabilities || []),
  }));
}

/* -------------------------------------------------------------------------- */
/*                                  PROJECTS                                  */
/* -------------------------------------------------------------------------- */

export async function getProjects(): Promise<CmsProject[]> {
  const remote = await cmsFetch<CmsProject[]>(
    '/wp-json/ssm/v1/projects'
  );

  if (!remote || !Array.isArray(remote)) {
    return [];
  }

  return remote.map((project) => ({
    ...project,
    client: decodeHtml(project.client || ''),
    type: decodeHtml(project.type || ''),
    summary: decodeHtml(project.summary || ''),
  }));
}

/* -------------------------------------------------------------------------- */
/*                               TESTIMONIALS                                 */
/* -------------------------------------------------------------------------- */

export async function getTestimonials(): Promise<CmsTestimonial[]> {
  const remote = await cmsFetch<CmsTestimonial[]>(
    '/wp-json/ssm/v1/testimonials'
  );

  if (!remote || !Array.isArray(remote)) {
    return [];
  }

  return remote.map((item) => ({
    ...item,
    quote: decodeHtml(item.quote || ''),
    person: decodeHtml(item.person || ''),
    role: decodeHtml(item.role || ''),
    company: decodeHtml(item.company || ''),
  }));
}

export async function getTestimonial(): Promise<CmsTestimonial | null> {
  const items = await getTestimonials();

  return items[0] ?? null;
}

/* -------------------------------------------------------------------------- */
/*                                    BLOG                                    */
/* -------------------------------------------------------------------------- */

function normalizePost(post: CmsPost): CmsPost {
  return {
    ...post,
    title: decodeHtml(post.title || ''),
    excerpt: decodeHtml(post.excerpt || ''),
    imageAlt: decodeHtml(post.imageAlt || ''),
  };
}

export async function getBlogPosts(
  limit = 12
): Promise<CmsPost[]> {
  const remote = await cmsFetch<CmsPost[]>(
    `/wp-json/ssm/v1/posts?limit=${limit}`
  );

  if (!remote || !Array.isArray(remote)) {
    return [];
  }

  return remote.map(normalizePost);
}

export async function getBlogPost(
  slug: string
): Promise<CmsPost | null> {
  const remote = await cmsFetch<CmsPost>(
    `/wp-json/ssm/v1/posts/${encodeURIComponent(slug)}`
  );

  if (!remote) {
    return null;
  }

  return normalizePost(remote);
}

/* -------------------------------------------------------------------------- */
/*                              CONTACT SETTINGS                              */
/* -------------------------------------------------------------------------- */

export async function getContactSettings(): Promise<ContactSettings> {
  const remote = await cmsFetch<Partial<ContactSettings>>(
    '/wp-json/ssm/v1/contact'
  );

  return {
    phone: decodeHtml(remote?.phone || ''),
    email: decodeHtml(remote?.email || ''),
    quoteEmail: decodeHtml(
      remote?.quoteEmail || remote?.email || ''
    ),
    address: decodeHtml(remote?.address || ''),
    linkedin: remote?.linkedin || '',
    mapQuery: decodeHtml(
      remote?.mapQuery || remote?.address || ''
    ),
  };
}

/* -------------------------------------------------------------------------- */
/*                                  CHATBOT                                   */
/* -------------------------------------------------------------------------- */

export async function getChatbotConfig(): Promise<ChatbotConfig | null> {
  const remote = await cmsFetch<ChatbotConfig>(
    '/wp-json/ssm/v1/chatbot'
  );

  if (
    !remote ||
    !Array.isArray(remote.items) ||
    remote.items.length === 0
  ) {
    return null;
  }

  const items = remote.items
    .map((item) => ({
      ...item,
      key: String(item.key || ''),
      parentKey: String(item.parentKey || ''),
      label: decodeHtml(item.label || ''),
      actionLabel: decodeHtml(item.actionLabel || ''),
      actionUrl: String(item.actionUrl || ''),
      responseHtml: item.responseHtml || '',
    }))
    .filter((item) => item.key && item.label);

  if (items.length === 0) {
    return null;
  }

  return {
    greeting: decodeHtml(remote.greeting || ''),
    intro: decodeHtml(remote.intro || ''),
    items,
  };
}

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function splitParagraphs(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => decodeHtml(String(item || '').trim()))
      .filter(Boolean);
  }

  const text = String(value || '').trim();

  if (!text) {
    return [];
  }

  return text
    .split(/\n\s*\n/)
    .map((item) => decodeHtml(item.trim()))
    .filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/*                                COMPANY PAGE                                */
/* -------------------------------------------------------------------------- */

export async function getCompanyPage(): Promise<CompanyPageContent> {
  const remote = await cmsFetch<Partial<CompanyPageContent>>(
    '/wp-json/ssm/v1/company'
  );

  if (!remote) {
    return {
      heroTitle: '',
      heroIntro: '',
      aboutTitle: '',
      aboutParagraphs: [],
      mission: '',
      vision: '',
      valuesTitle: '',
      valuesIntro: '',
      values: [],
    };
  }

  const values =
    Array.isArray(remote.values) && remote.values.length
      ? remote.values
          .map((value, index) => ({
            number: decodeHtml(
              String(
                value?.number ||
                  String(index + 1).padStart(2, '0')
              )
            ),
            title: decodeHtml(
              String(value?.title || '')
            ),
            body: decodeHtml(
              String(value?.body || '')
            ),
          }))
          .filter((value) => value.title)
      : [];

  return {
    heroTitle: decodeHtml(remote.heroTitle || ''),
    heroIntro: decodeHtml(remote.heroIntro || ''),
    aboutTitle: decodeHtml(remote.aboutTitle || ''),
    aboutParagraphs: splitParagraphs(
      remote.aboutParagraphs
    ),
    mission: decodeHtml(remote.mission || ''),
    vision: decodeHtml(remote.vision || ''),
    valuesTitle: decodeHtml(remote.valuesTitle || ''),
    valuesIntro: decodeHtml(remote.valuesIntro || ''),
    values,
  };
}

/* -------------------------------------------------------------------------- */
/*                           GLOBAL NETWORK PAGE                              */
/* -------------------------------------------------------------------------- */

export async function getGlobalNetworkPage(): Promise<GlobalNetworkPageContent> {
  const remote =
    await cmsFetch<Partial<GlobalNetworkPageContent>>(
      '/wp-json/ssm/v1/global-network'
    );

  if (!remote) {
    return {
      heroTitle: '',
      heroIntro: '',
      sections: [],
    };
  }

  const sections =
    Array.isArray(remote.sections) &&
    remote.sections.length
      ? remote.sections
          .map((section, index) => ({
            number: decodeHtml(
              String(
                section?.number ||
                  String(index + 1).padStart(2, '0')
              )
            ),
            title: decodeHtml(
              String(section?.title || '')
            ),
            paragraphs: splitParagraphs(
              section?.paragraphs
            ),
            bullets: Array.isArray(section?.bullets)
              ? section.bullets
                  .map((item) =>
                    decodeHtml(String(item || ''))
                  )
                  .filter(Boolean)
              : [],
            closing: decodeHtml(
              String(section?.closing || '')
            ),
          }))
          .filter((section) => section.title)
      : [];

  return {
    heroTitle: decodeHtml(remote.heroTitle || ''),
    heroIntro: decodeHtml(remote.heroIntro || ''),
    sections,
  };
}