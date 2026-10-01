import { brand, projects as fallbackProjects, services as fallbackServices, testimonials as fallbackTestimonials } from './site';
import { getMockPost, mockPosts } from './blog';

const wordpressUrl = (process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || '').replace(/\/$/, '');
const revalidateSeconds = Number(process.env.CMS_REVALIDATE_SECONDS || 60);

async function cmsFetch<T>(path: string): Promise<T | null> {
  if (!wordpressUrl) return null;
  try {
    const response = await fetch(`${wordpressUrl}${path}`, {
      next: { revalidate: Number.isFinite(revalidateSeconds) ? revalidateSeconds : 60 },
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
  if (remote && remote.length) return remote;

  return fallbackServices.map((service) => ({
    slug: service.slug,
    title: service.title,
    kicker: service.kicker,
    summary: service.summary,
    detailHtml: service.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join(''),
    capabilities: service.capabilities,
  }));
}

export async function getProjects(): Promise<CmsProject[]> {
  const remote = await cmsFetch<CmsProject[]>('/wp-json/ssm/v1/projects');
  if (remote && remote.length) return remote;

  return fallbackProjects.map((project, index) => ({
    slug: `project-${index + 1}`,
    client: project.client,
    type: project.type,
    summary: project.summary,
    detailHtml: `<p>${project.detail}</p>`,
  }));
}

export async function getTestimonials(): Promise<CmsTestimonial[]> {
  const remote = await cmsFetch<CmsTestimonial[]>('/wp-json/ssm/v1/testimonials');
  if (remote && remote.length) return remote;

  return fallbackTestimonials.map((item) => {
    const [role, ...companyParts] = item.role.split(',').map((value) => value.trim());
    return {
      quote: item.quote,
      person: item.person,
      role: role || item.role,
      company: companyParts.join(', '),
    };
  });
}

export async function getTestimonial(): Promise<CmsTestimonial> {
  const items = await getTestimonials();
  return items[0];
}

function fallbackPost(slug: string): CmsPost | null {
  const post = getMockPost(slug);
  if (!post) return null;
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    contentHtml: post.content.map((paragraph) => `<p>${paragraph}</p>`).join(''),
    image: post.image,
    imageAlt: post.imageAlt,
  };
}

export async function getBlogPosts(limit = 12): Promise<CmsPost[]> {
  const remote = await cmsFetch<CmsPost[]>(`/wp-json/ssm/v1/posts?limit=${limit}`);
  if (remote && remote.length) return remote;

  return mockPosts.slice(0, limit).map((post) => ({
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
  return remote || fallbackPost(slug);
}

export async function getContactSettings(): Promise<ContactSettings> {
  const remote = await cmsFetch<Partial<ContactSettings>>('/wp-json/ssm/v1/contact');
  return {
    phone: remote?.phone || brand.phone,
    email: remote?.email || brand.email,
    quoteEmail: remote?.quoteEmail || remote?.email || brand.email,
    address: remote?.address || brand.address,
    linkedin: remote?.linkedin || brand.linkedin,
    mapQuery: remote?.mapQuery || remote?.address || brand.address,
  };
}
