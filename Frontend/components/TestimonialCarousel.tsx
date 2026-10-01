import type { CmsTestimonial } from '@/lib/cms';

type Props = { testimonials: CmsTestimonial[] };

export function TestimonialCarousel({ testimonials }: Props) {
  if (!testimonials.length) return null;
  const repeated = [...testimonials, ...testimonials];

  return (
    <section className="section testimonial-marquee-section" aria-label="Client testimonials">
      <div className="testimonial-marquee-window">
        <div className="testimonial-marquee-track">
          {repeated.map((testimonial, index) => (
            <article
              className="testimonial-marquee-card"
              key={`${testimonial.id || testimonial.person}-${index}`}
              aria-hidden={index >= testimonials.length ? true : undefined}
            >
              <blockquote>“{testimonial.quote}”</blockquote>
              <div className="testimonial-marquee-signature">
                <span className="testimonial-initials" aria-hidden="true">
                  {testimonial.person.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <strong>{testimonial.person}</strong>
                  <span>{[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
