import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { getProjects } from '@/lib/cms';

export const metadata: Metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="Selected experience"
        title="Projects shaped around the movement."
        intro="A concise selection of logistics and supply-chain work presented by Supreme Supply Management."
      />

      <section className="section project-list-section">
        <div className="shell accordion-list project-accordion-list">
          {projects.map((project, index) => (
            <details className="info-accordion project-accordion" id={project.slug || `project-${index + 1}`} key={project.id || project.slug || project.client}>
              <summary>
                <span className="accordion-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="accordion-heading">
                  <small>{project.type}</small>
                  <h2>{project.client}</h2>
                </div>
                <span className="accordion-preview">{project.summary}</span>
                <span className="accordion-toggle" aria-hidden="true"><ChevronDown size={19} /></span>
              </summary>
              <div className="accordion-content project-accordion-content">
                <div className="accordion-copy" dangerouslySetInnerHTML={{ __html: project.detailHtml }} />
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
