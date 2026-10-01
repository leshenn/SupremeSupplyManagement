import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getBlogPost } from '@/lib/cms';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: 'Blog' };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="article-page mock-article-page">
      <div className="shell article-shell">
        <div className="article-topbar">
          <Link className="text-link article-back" href="/blog"><ArrowLeft size={16} /> Back to blog</Link>
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
        </div>
        <h1>{post.title}</h1>
        <p className="article-lead">{post.excerpt}</p>
        {post.image && <img className="mock-article-image" src={post.image} alt={post.imageAlt || ''} />}
        <div className="mock-post-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </div>
    </article>
  );
}
