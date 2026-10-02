import type { Metadata } from 'next';
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
        intro="Five connected logistics capabilities. Select a service to see the details without leaving the page."
      />

      <section className="section service-directory-section">
        <div className="shell">
          <SmoothAccordion items={items} variant="services" />
        </div>
      </section>
    </>
  );
}
