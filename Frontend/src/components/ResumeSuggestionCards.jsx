export default function ResumeSuggestionCards({ improvements = {} }) {
  const sections = [
    ['Professional Summary', improvements.professionalSummary ? [improvements.professionalSummary] : []],
    ['Skills Section', improvements.skillsSection || []],
    ['Experience Section', improvements.experienceSection || []],
    ['Project Descriptions', improvements.projectDescriptions || []]
  ];

  return (
    <section className="cards-two">
      {sections.map(([title, items]) => (
        <article className="glass" key={title}>
          <h3>{title}</h3>
          {items.length ? items.map((item) => <p key={item}>• {item}</p>) : <p className="muted">No suggestions generated yet.</p>}
        </article>
      ))}
    </section>
  );
}
