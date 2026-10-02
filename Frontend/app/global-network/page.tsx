import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { getGlobalNetworkPage } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Global Network',
  description: 'Explore the international logistics network, relationships and coordination behind Supreme Supply Management.',
};

export default async function GlobalNetworkPage() {
  const content = await getGlobalNetworkPage();

  return (
    <>
      <PageHero eyebrow="Global Network" title={content.heroTitle} intro={content.heroIntro} />

      <section className="section network-story-section">
        <div className="shell network-story-list">
          {content.sections.map((section) => {
            const hasExplicitClosing = Boolean(section.closing);
            const paragraphs = hasExplicitClosing
              ? section.paragraphs
              : section.paragraphs.slice(0, -1);
            const closing = section.closing || section.paragraphs[section.paragraphs.length - 1] || '';

            return (
              <article className="network-story" key={`${section.number}-${section.title}`}>
                <div className="network-story-heading">
                  <span className="network-story-number">{section.number}</span>
                  <h2>{section.title}</h2>
                </div>
                <div className="network-story-copy body-copy">
                  {paragraphs.map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                  ))}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="network-capabilities">
                      {section.bullets.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                  {closing && <p className="network-closing">{closing}</p>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="network-cta">
        <div className="shell network-cta-inner">
          <div>
            <span className="eyebrow light">One point of contact</span>
            <h2>Global reach, without losing the personal touch.</h2>
          </div>
          <Link className="button button-white" href="/contact">Request a quote <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
