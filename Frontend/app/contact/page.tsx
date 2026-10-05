import type { Metadata } from 'next';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { QuoteForm } from '@/components/QuoteForm';
import { getContactSettings, getServices } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Contact',
};

export default async function ContactPage() {
  const [contact, services] = await Promise.all([
    getContactSettings(),
    getServices(),
  ]);

  const mapLocation = contact.mapQuery || contact.address;

  const mapSrc = mapLocation
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        mapLocation
      )}&z=15&output=embed`
    : '';

  // 069 825 7912 -> 27698257912
  const whatsappNumber = '27698257912';

  const whatsappMessage = encodeURIComponent(
    "Hi Supreme Supply Management, I'd like to make an enquiry."
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s move something forward."
        intro="Speak to our team about your next shipment, logistics requirement or supply-chain project."
      />

      <section className="section contact-section">
        <div className="shell contact-grid">

          {/* LEFT SIDE */}
          <div className="contact-details">
            {contact.phone && (
              <div>
                <span>Phone</span>

                <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                  {contact.phone}
                </a>
              </div>
            )}

            {contact.email && (
              <div>
                <span>Email</span>

                <a href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </div>
            )}

            {(contact.address || mapSrc) && (
              <div className="office-block">
                <span>Office</span>

                {contact.address && (
                  <p>{contact.address}</p>
                )}

                {mapSrc && (
                  <div
                    className="office-map"
                    aria-label="Map showing the Supreme Supply Management office"
                  >
                    <iframe
                      title="Supreme Supply Management office map"
                      src={mapSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}

            {contact.linkedin && (
              <div>
                <span>LinkedIn</span>

                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  Supreme Supply Management
                </a>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="contact-form-column">

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-link"
              aria-label="Talk to Supreme Supply Management on WhatsApp"
            >
              <MessageCircle size={20} />

              <span>Talk to someone on WhatsApp</span>

              <ArrowUpRight
                size={18}
                className="whatsapp-link-arrow"
              />
            </a>

            <QuoteForm
              services={services.map((service) => service.title)}
              quoteEmail={contact.quoteEmail}
            />
          </div>

        </div>
      </section>
    </>
  );
}