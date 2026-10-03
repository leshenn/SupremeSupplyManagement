import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { getContactSettings } from '@/lib/cms';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Supreme Supply Management collects, uses and protects personal information submitted through this website.',
};

export default async function PrivacyPage() {
  const contact = await getContactSettings();

  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy Policy"
        intro="How we handle personal information when you use the Supreme Supply Management website or contact our team."
      />

      <section className="section privacy-section">
        <div className="shell privacy-layout">
          <aside className="privacy-aside">
            <span className="eyebrow">Last updated</span>
            <p>3 October 2026</p>
          </aside>

          <article className="privacy-content body-copy">
            <section>
              <h2>Our approach to privacy</h2>
              <p>
                Supreme Supply Management respects your privacy and is committed to handling personal information responsibly, transparently and securely. This policy explains what information we may collect through this website, why we use it and the choices available to you.
              </p>
              <p>
                We handle personal information in accordance with applicable South African privacy requirements, including the Protection of Personal Information Act 4 of 2013 (POPIA).
              </p>
            </section>

            <section>
              <h2>Information we may collect</h2>
              <p>We may collect information that you choose to provide when you contact us or request a quote, including:</p>
              <ul>
                <li>Your name and company name.</li>
                <li>Your email address and telephone number.</li>
                <li>The service you are interested in.</li>
                <li>Shipment, logistics or supply-chain information included in your message.</li>
                <li>Any other information you voluntarily provide in correspondence with us.</li>
              </ul>
              <p>
                Our hosting and security systems may also process limited technical information such as IP addresses, browser information, device information and server logs where necessary to operate and protect the website.
              </p>
            </section>

            <section>
              <h2>How we use your information</h2>
              <p>We may use personal information to:</p>
              <ul>
                <li>Respond to enquiries and quote requests.</li>
                <li>Understand your logistics requirements and communicate with you about possible solutions.</li>
                <li>Provide, coordinate and improve our services.</li>
                <li>Maintain the security, reliability and performance of our website and systems.</li>
                <li>Keep appropriate business and correspondence records.</li>
                <li>Meet legal, regulatory or contractual obligations where applicable.</li>
              </ul>
            </section>

            <section>
              <h2>When we share information</h2>
              <p>
                We do not sell personal information. Where reasonably necessary, information may be shared with trusted service providers, technology providers, logistics partners or professional advisers who support our operations or help us respond to your requirements. We may also disclose information where required by law or a lawful authority.
              </p>
              <p>
                Because logistics can involve international movements and partners, information related to a service request may need to be shared across borders where this is necessary to arrange or manage a service. Where applicable, we take reasonable steps to ensure that personal information remains appropriately protected.
              </p>
            </section>

            <section>
              <h2>Cookies and third-party services</h2>
              <p>
                The website may use essential technologies required for normal operation and security. Some pages may also include third-party services, such as an embedded Google Maps view on our Contact page. Those third-party services may process technical information or use their own cookies in accordance with their own privacy terms.
              </p>
            </section>

            <section>
              <h2>How long we keep information</h2>
              <p>
                We keep personal information only for as long as reasonably necessary for the purpose for which it was collected, to maintain appropriate business records, resolve enquiries or disputes, and meet legal or regulatory requirements.
              </p>
            </section>

            <section>
              <h2>Keeping information secure</h2>
              <p>
                We use reasonable administrative, technical and organisational safeguards designed to protect personal information against loss, misuse, unauthorised access, alteration or disclosure. No online system can guarantee absolute security, but we take reasonable steps to reduce risk and protect the information entrusted to us.
              </p>
            </section>

            <section>
              <h2>Your privacy rights</h2>
              <p>
                Subject to applicable law, you may ask us to confirm whether we hold personal information about you, request access to it, ask for inaccurate information to be corrected, request deletion where appropriate, or object to certain processing. Where processing is based on consent, you may withdraw that consent subject to applicable legal limitations.
              </p>
              <p>
                You may also raise a concern with the South African Information Regulator. More information is available from the Information Regulator at{' '}
                <a href="https://inforegulator.org.za/" target="_blank" rel="noreferrer">inforegulator.org.za</a>.
              </p>
            </section>

            <section>
              <h2>Contact us about privacy</h2>
              <p>If you have a question about this policy or how we handle personal information, please contact Supreme Supply Management.</p>
              <div className="privacy-contact">
                {contact.email && (
                  <div>
                    <span>Email</span>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                )}
                {contact.phone && (
                  <div>
                    <span>Phone</span>
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
                  </div>
                )}
                {contact.address && (
                  <div>
                    <span>Office</span>
                    <p>{contact.address}</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2>Changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes to our website, services, technology or legal obligations. The latest version will always be published on this page with the updated date shown above.
              </p>
            </section>
          </article>
        </div>
      </section>
    </>
  );
}
