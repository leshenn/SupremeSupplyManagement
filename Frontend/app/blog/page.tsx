import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { getBlogPosts } from '@/lib/cms';

export const metadata: Metadata = { title: 'Blog' };

function BlogCard({ post, featured = false }: { post: Awaited<ReturnType<typeof getBlogPosts>>[number]; featured?: boolean }) {
  return (
    <Link
      className={featured ? 'blog-feature-card clickable-block' : 'blog-grid-card clickable-block'}
      href={`/blog/${post.slug}`}
      aria-label={`Read ${post.title}`}
    >
      <div className="blog-card-media">
        {post.image ? <img src={post.image} alt={post.imageAlt || ''} /> : <div className="blog-card-placeholder" />}
      </div>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span>{new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <ArrowRight size={14} aria-hidden="true" />
        </div>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts(30);
  const [featured, ...remaining] = posts;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="From the blog."
        intro="Ideas and practical perspectives on freight, supply chains and the movement of goods."
      />

      <section className="section blog-index-section blog-index-redesign">
        <div className="shell">
          {featured && <BlogCard post={featured} featured />}
          <div className="blog-card-grid">
            {remaining.map((post) => <BlogCard post={post} key={post.id || post.slug} />)}
          </div>
        </div>
      </section>
    </>
  );
}
