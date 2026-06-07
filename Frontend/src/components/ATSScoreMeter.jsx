export default function ATSScoreMeter({ score = 0, coverage = 0 }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const safeCoverage = Math.max(0, Math.min(100, Number(coverage) || 0));

  return (
    <article className="ats-meter glass">
      <div>
        <span className="eyebrow">ATS Score Meter</span>
        <h2>{safeScore}%</h2>
        <p>Keyword coverage: {safeCoverage}%</p>
      </div>
      <div className="meter-ring" style={{ '--score': `${safeScore * 3.6}deg` }}>
        <span>{safeScore}</span>
      </div>
    </article>
  );
}
