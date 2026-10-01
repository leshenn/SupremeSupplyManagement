type Props = {
  eyebrow: string;
  title: string;
  intro: string;
};

export function PageHero({ eyebrow, title, intro }: Props) {
  return (
    <section className="page-hero">
      <div className="shell page-hero-grid">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
        <p>{intro}</p>
      </div>
    </section>
  );
}
