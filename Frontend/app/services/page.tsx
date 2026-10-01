import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { getServices } from '@/lib/cms';

export const metadata: Metadata = { title: 'Services' };

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What we offer."
        intro="Five connected logistics capabilities. Select a service to see the details without leaving the page."
      />

      <section className="section service-directory-section">
        <div className="shell accordion-list">
          {services.map((service, index) => (
            <details className="info-accordion" key={service.id || service.slug}>
              <summary>
                <span className="accordion-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="accordion-heading">
                  <small>{service.kicker}</small>
                  <h2>{service.title}</h2>
                </div>
                <p>{service.summary}</p>
                <span className="accordion-toggle" aria-hidden="true"><ChevronDown size={19} /></span>
              </summary>
              <div className="accordion-content">
                <div className="accordion-copy" dangerouslySetInnerHTML={{ __html: service.detailHtml }} />
                <div>
                  <span className="accordion-label">Capabilities</span>
                  <ul className="capability-chips">
                    {service.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
