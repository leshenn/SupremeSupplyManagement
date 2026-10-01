import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { images } from '@/lib/site';
import { getBlogPosts, getProjects, getTestimonials } from '@/lib/cms';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';

export default async function HomePage() {
  const [projects, testimonials, posts] = await Promise.all([
    getProjects(),
    getTestimonials(),
    getBlogPosts(3),
  ]);

  return (
    <>
      <section className="home-hero home-hero-full">
        <div className="home-hero-stage home-hero-edge">
          <img src={images.hero} alt="Container terminal viewed from above" />
          <div className="home-hero-shade" aria-hidden="true" />
          <div className="shell home-hero-content-wrap">
            <div className="home-hero-content">
              <span className="eyebrow hero-eyebrow">Freight forwarding & supply chain management</span>
              <h1>Global logistics,<br /><em>made personal.</em></h1>
              <p>Personalised, end-to-end logistics solutions across South Africa and international markets.</p>
              <div className="hero-actions">
                <Link className="button button-white" href="/contact">Request a quote <ArrowRight size={16} /></Link>
                <a className="button button-ghost-light" href="#about">About Supreme Supply</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-about" id="about">
        <div className="shell editorial-two-col">
          <div>
            <span className="eyebrow">About Supreme Supply</span>
            <h2>One point of contact for a complex supply chain.</h2>
          </div>
          <div className="body-copy">
            <p>Supreme Supply is a high-end supply chain management company and a local and international freight forwarder. We provide personalised, high-quality and cost-effective end-to-end logistics solutions.</p>
            <p>Our approach is built around foresight, open communication and regular shipment updates. With more than 20 years of leadership experience, we continuously improve processes and systems to support efficient workflows, reliable delivery and clear tracking from origin to destination.</p>
          </div>
        </div>

        <div className="shell stats-row stats-row-soft">
          <div><strong>250+</strong><span>Offices in the collaboration network</span></div>
          <div><strong>120</strong><span>Countries</span></div>
          <div><strong>6</strong><span>Continents</span></div>
          <div><strong>20+</strong><span>Years of leadership experience</span></div>
        </div>
      </section>

      <section className="section section-tint home-projects-preview">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">Selected experience</span>
              <h2>Work shaped around the movement.</h2>
            </div>
            <Link className="text-link" href="/projects">Explore projects <ArrowRight size={15} /></Link>
          </div>

          <div className="home-project-list">
            {projects.slice(0, 3).map((project, index) => (
              <Link
                className="home-project-row clickable-block"
                href={`/projects#${project.slug || `project-${index + 1}`}`}
                key={project.id || project.slug || project.client}
                aria-label={`View ${project.client} project details`}
              >
                <div className="home-project-row-copy">
                  <span className="home-project-meta">0{index + 1} · {project.type}</span>
                  <h3>{project.client}</h3>
                  <p>{project.summary}</p>
                </div>
                <span className="home-project-arrow" aria-hidden="true"><ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TestimonialCarousel testimonials={testimonials} />

      <section className="section blog-preview-section blog-preview-soft">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <span className="eyebrow">Insights</span>
              <h2>From the blog.</h2>
            </div>
            <Link className="text-link" href="/blog">View all posts <ArrowRight size={15} /></Link>
          </div>

          <div className="blog-list-home">
            {posts.map((post) => (
              <Link
                className={post.image ? 'home-blog-row has-hover-image clickable-block' : 'home-blog-row clickable-block'}
                href={`/blog/${post.slug}`}
                key={post.id || post.slug}
                aria-label={`Read ${post.title}`}
              >
                {post.image && (
                  <div className="blog-hover-visual home-blog-hover-visual" aria-hidden="true">
                    <img src={post.image} alt="" />
                  </div>
                )}
                <div className="home-blog-copy">
                  <span>{new Date(post.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
                <span className="home-blog-arrow" aria-hidden="true"><ArrowRight size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
