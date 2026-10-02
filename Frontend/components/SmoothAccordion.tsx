'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type AccordionItem = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  preview: string;
  html: string;
  capabilities?: string[];
};

type SmoothAccordionProps = {
  items: AccordionItem[];
  variant?: 'services' | 'projects';
};

export function SmoothAccordion({ items, variant = 'services' }: SmoothAccordionProps) {
  const validIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && validIds.has(hash)) {
      setOpenItems((current) => {
        const next = new Set(current);
        next.add(hash);
        return next;
      });

      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [validIds]);

  const toggleItem = (id: string) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={`accordion-list ${variant === 'projects' ? 'project-accordion-list' : ''}`}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);

        return (
          <article
            className={`info-accordion ${variant === 'projects' ? 'project-accordion' : ''} ${isOpen ? 'is-open' : ''}`}
            id={item.id}
            key={item.id}
          >
            <button
              className="accordion-summary"
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${item.id}-panel`}
              onClick={() => toggleItem(item.id)}
            >
              <span className="accordion-number">{item.number}</span>
              <div className="accordion-heading">
                <small>{item.eyebrow}</small>
                <h2>{item.title}</h2>
              </div>
              <span className={variant === 'projects' ? 'accordion-preview' : 'accordion-summary-copy'}>
                {item.preview}
              </span>
              <span className="accordion-toggle" aria-hidden="true">
                <ChevronDown size={19} />
              </span>
            </button>

            <div
              className="accordion-panel"
              id={`${item.id}-panel`}
              aria-hidden={!isOpen}
            >
              <div className="accordion-panel-inner">
                <div className={`accordion-content ${variant === 'projects' ? 'project-accordion-content' : ''}`}>
                  <div className="accordion-copy" dangerouslySetInnerHTML={{ __html: item.html }} />

                  {variant === 'services' && item.capabilities && item.capabilities.length > 0 ? (
                    <div>
                      <span className="accordion-label">Capabilities</span>
                      <ul className="capability-chips">
                        {item.capabilities.map((capability) => (
                          <li key={capability}>{capability}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
