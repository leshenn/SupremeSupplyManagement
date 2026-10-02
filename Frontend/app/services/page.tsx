import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { SmoothAccordion } from '@/components/SmoothAccordion';
import { getServices } from '@/lib/cms';

export const metadata: Metadata = { title: 'Services' };

export default async function ServicesPage() {
  const services = await getServices();

  const items = services.map((service, index) => ({
    id: service.slug || `service-${index + 1}`,
    number: String(index + 1).padStart(2, '0'),
    eyebrow: service.kicker,
    title: service.title,
    preview: service.summary,
    html: service.detailHtml,
    capabilities: service.capabilities,
  }));

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we offer."
        intro="Six connected logistics capabilities. Select a service to see the details without leaving the page."
      />

      <section className="section service-directory-section">
        <div className="shell">
          <SmoothAccordion items={items} variant="services" />
        </div>
      </section>

      <section className="services-request-cta">
        <div className="shell services-request-cta-inner">
          <div>
            <span className="eyebrow light">Ready to get moving?</span>
            <h2>Tell us what you need and we’ll help build the right logistics solution.</h2>
          </div>
          <Link className="button button-white" href="/contact">Request a service <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
