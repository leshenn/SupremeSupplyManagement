import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { SmoothAccordion } from '@/components/SmoothAccordion';
import { getProjects } from '@/lib/cms';

export const metadata: Metadata = { title: 'Projects' };

export default async function ProjectsPage() {
  const projects = await getProjects();

  const items = projects.map((project, index) => ({
    id: project.slug || `project-${index + 1}`,
    number: String(index + 1).padStart(2, '0'),
    eyebrow: project.type,
    title: project.client,
    preview: project.summary,
    html: project.detailHtml,
  }));

  return (
    <>
      <PageHero
        eyebrow="Selected experience"
        title="Projects shaped around the movement."
        intro="A concise selection of logistics and supply-chain work presented by Supreme Supply Management."
      />

      <section className="section project-list-section">
        <div className="shell">
          <SmoothAccordion items={items} variant="projects" />
        </div>
      </section>
    </>
  );
}
