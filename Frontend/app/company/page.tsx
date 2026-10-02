import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { getCompanyPage } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Company',
  description: 'Learn about Supreme Supply Management, our mission, vision and the values behind every shipment and relationship.',
};

export default async function CompanyPage() {
  const content = await getCompanyPage();

  return (
    <>
      <PageHero eyebrow="Company" title={content.heroTitle} intro={content.heroIntro} />

      <section className="section company-about-section">
        <div className="shell company-about-wrap">
          <div className="company-about-heading">
            <span className="eyebrow">Who we are</span>
            <h2>{content.aboutTitle}</h2>
          </div>

          <div className="company-about-body">
            {content.aboutParagraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section company-direction-section">
        <div className="shell company-direction-grid">
          <article>
            <span className="company-card-number">01</span>
            <span className="eyebrow">Our Mission</span>
            <h2>{content.mission}</h2>
          </article>
          <article>
            <span className="company-card-number">02</span>
            <span className="eyebrow">Our Vision</span>
            <h2>{content.vision}</h2>
          </article>
        </div>
      </section>

      <section className="section company-values-section">
        <div className="shell">
          <div className="company-values-heading">
            <span className="eyebrow">{content.valuesTitle}</span>
            <h2>{content.valuesIntro}</h2>
          </div>

          <div className="company-values-list">
            {content.values.map((value) => (
              <article className="company-value-row" key={`${value.number}-${value.title}`}>
                <span className="company-value-number">{value.number}</span>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="simple-cta company-page-cta">
        <div className="shell simple-cta-inner">
          <h2>Logistics that stays personal, wherever your business needs to move.</h2>
          <Link className="button" href="/contact">Request a quote <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
