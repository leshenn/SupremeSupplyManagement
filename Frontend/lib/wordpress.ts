export type WordPressPost = {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string; alt_text?: string }>;
  };
};

const baseUrl = (process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://supremesupply.co.za').replace(/\/$/, '');

export async function getPosts(limit = 12): Promise<WordPressPost[]> {
  try {
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?per_page=${limit}&_embed=1`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return [];
    return (await response.json()) as WordPressPost[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    const posts = (await response.json()) as WordPressPost[];
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

export function featuredImage(post: WordPressPost) {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
}

export function plainText(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, '’').replace(/\s+/g, ' ').trim();
}
