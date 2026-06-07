function colorFor(value) { return value >= 75 ? 'success' : value >= 50 ? 'warning' : 'danger'; }
export default function AnalyticsCards({ scores = {} }) {
  const cards = [
    ['Match Score', scores.overallMatch], ['ATS Score', scores.ats], ['Skill Match', scores.skillMatch], ['Keyword Coverage', scores.keywordCoverage], ['Shortlisting', scores.shortlistingProbability]
  ];
  return <section className="analytics-grid">{cards.map(([label, value = 0]) => <article className="metric-card glass" key={label}><div><p>{label}</p><strong>{value}%</strong></div><div className="progress"><span className={colorFor(value)} style={{ width: `${value}%` }} /></div></article>)}</section>;
}
