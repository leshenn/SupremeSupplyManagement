import { projects as fallbackProjects, services as fallbackServices, testimonials as fallbackTestimonials } from './site';
import { getMockPost, mockPosts } from './blog';
import { decodeHtml, decodeHtmlList } from './html';

const wordpressUrl = (process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || '').replace(/\/$/, '');
const revalidateSeconds = Number(process.env.CMS_REVALIDATE_SECONDS || 60);

async function cmsFetch<T>(path: string): Promise<T | null> {
  if (!wordpressUrl) return null;
  try {
    const response = await fetch(`${wordpressUrl}${path}`, {
      next: { revalidate: Number.isFinite(revalidateSeconds) ? revalidateSeconds : 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

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

export async function getServices(): Promise<CmsService[]> {
  const remote = await cmsFetch<CmsService[]>('/wp-json/ssm/v1/services');
  if (remote && remote.length) {
    return remote.map((service) => ({
      ...service,
      title: decodeHtml(service.title),
      kicker: decodeHtml(service.kicker),
      summary: decodeHtml(service.summary),
      capabilities: decodeHtmlList(service.capabilities),
    }));
  }

  return fallbackServices.map((service) => ({
    slug: service.slug,
    title: decodeHtml(service.title),
    kicker: decodeHtml(service.kicker),
    summary: decodeHtml(service.summary),
    detailHtml: service.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join(''),
    capabilities: decodeHtmlList(service.capabilities),
  }));
}

export async function getProjects(): Promise<CmsProject[]> {
  const remote = await cmsFetch<CmsProject[]>('/wp-json/ssm/v1/projects');
  if (remote && remote.length) {
    return remote.map((project) => ({
      ...project,
      client: decodeHtml(project.client),
      type: decodeHtml(project.type),
      summary: decodeHtml(project.summary),
    }));
  }

  return fallbackProjects.map((project, index) => ({
    slug: `project-${index + 1}`,
    client: decodeHtml(project.client),
    type: decodeHtml(project.type),
    summary: decodeHtml(project.summary),
    detailHtml: `<p>${project.detail}</p>`,
  }));
}

export async function getTestimonials(): Promise<CmsTestimonial[]> {
  const remote = await cmsFetch<CmsTestimonial[]>('/wp-json/ssm/v1/testimonials');
  if (remote && remote.length) {
    return remote.map((item) => ({
      ...item,
      quote: decodeHtml(item.quote),
      person: decodeHtml(item.person),
      role: decodeHtml(item.role),
      company: decodeHtml(item.company),
    }));
  }

  return fallbackTestimonials.map((item) => {
    const [role, ...companyParts] = item.role.split(',').map((value) => value.trim());
    return {
      quote: decodeHtml(item.quote),
      person: decodeHtml(item.person),
      role: decodeHtml(role || item.role),
      company: decodeHtml(companyParts.join(', ')),
    };
  });
}

export async function getTestimonial(): Promise<CmsTestimonial> {
  const items = await getTestimonials();
  return items[0];
}

function normalizePost(post: CmsPost): CmsPost {
  return {
    ...post,
    title: decodeHtml(post.title),
    excerpt: decodeHtml(post.excerpt),
    imageAlt: decodeHtml(post.imageAlt),
  };
}

function fallbackPost(slug: string): CmsPost | null {
  const post = getMockPost(slug);
  if (!post) return null;
  return normalizePost({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    contentHtml: post.content.map((paragraph) => `<p>${paragraph}</p>`).join(''),
    image: post.image,
    imageAlt: post.imageAlt,
  });
}

export async function getBlogPosts(limit = 12): Promise<CmsPost[]> {
  const remote = await cmsFetch<CmsPost[]>(`/wp-json/ssm/v1/posts?limit=${limit}`);
  if (remote && remote.length) return remote.map(normalizePost);

  return mockPosts.slice(0, limit).map((post) => normalizePost({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    contentHtml: post.content.map((paragraph) => `<p>${paragraph}</p>`).join(''),
    image: post.image,
    imageAlt: post.imageAlt,
  }));
}

export async function getBlogPost(slug: string): Promise<CmsPost | null> {
  const remote = await cmsFetch<CmsPost>(`/wp-json/ssm/v1/posts/${encodeURIComponent(slug)}`);
  return remote ? normalizePost(remote) : fallbackPost(slug);
}

export async function getContactSettings(): Promise<ContactSettings> {
  const remote = await cmsFetch<Partial<ContactSettings>>('/wp-json/ssm/v1/contact');

  // WordPress is the single source of truth for public contact information.
  // Keep CMS-derived fallbacks only (for example quoteEmail -> email), rather
  // than duplicating phone/email/address values in the frontend.
  return {
    phone: decodeHtml(remote?.phone || ''),
    email: decodeHtml(remote?.email || ''),
    quoteEmail: decodeHtml(remote?.quoteEmail || remote?.email || ''),
    address: decodeHtml(remote?.address || ''),
    linkedin: remote?.linkedin || '',
    mapQuery: decodeHtml(remote?.mapQuery || remote?.address || ''),
  };
}

export async function getChatbotConfig(): Promise<ChatbotConfig | null> {
  const remote = await cmsFetch<ChatbotConfig>('/wp-json/ssm/v1/chatbot');
  if (!remote || !Array.isArray(remote.items) || remote.items.length === 0) return null;

  return {
    greeting: decodeHtml(remote.greeting || 'Hi! How can we help?'),
    intro: decodeHtml(remote.intro || ''),
    items: remote.items.map((item) => ({
      ...item,
      key: String(item.key || ''),
      parentKey: String(item.parentKey || ''),
      label: decodeHtml(item.label || ''),
      actionLabel: decodeHtml(item.actionLabel || ''),
      actionUrl: String(item.actionUrl || ''),
      responseHtml: item.responseHtml || '',
    })).filter((item) => item.key && item.label),
  };
}

