import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppShell from '../layouts/AppShell.jsx';
import AnalyticsCards from '../components/AnalyticsCards.jsx';
import ATSScoreMeter from '../components/ATSScoreMeter.jsx';
import ExportButtons from '../components/ExportButtons.jsx';
import KeywordTable from '../components/KeywordTable.jsx';
import SkillGapChart from '../components/SkillGapChart.jsx';
import ResumeSuggestionCards from '../components/ResumeSuggestionCards.jsx';
import { getAnalysis } from '../features/analysis/services/analysis.api.js';

function ListBlock({ title, items = [], marker = '•' }) {
  return (
    <article className="glass">
      <h3>{title}</h3>
      {items.length ? items.map((item) => <p key={item}>{marker} {item}</p>) : <p className="muted">No items generated.</p>}
    </article>
  );
}

export default function AnalysisResultPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAnalysis(id).then(setData).catch(() => setError('Analysis not found'));
  }, [id]);

  if (error) return <AppShell><div className="error-state glass">{error}</div></AppShell>;
  if (!data) return <AppShell><div className="skeleton-grid"><span /><span /><span /></div></AppShell>;

  const { analysis } = data;

  return (
    <AppShell>
      <div className="result-hero glass">
        <div>
          <span className="eyebrow">Complete Hiring-Readiness Report</span>
          <h1>{analysis.targetRole}</h1>
          <p>{analysis.strengths?.[0]}</p>
        </div>
        <ExportButtons analysis={analysis} />
      </div>

      <AnalyticsCards scores={analysis.scores} />
      <ATSScoreMeter score={analysis.scores?.ats} coverage={analysis.scores?.keywordCoverage} />
      <SkillGapChart current={analysis.currentSkills} required={analysis.requiredSkills} missing={analysis.missingSkills} />
      <KeywordTable found={analysis.foundKeywords} missing={analysis.missingKeywords} />

      <section className="cards-three">
        <ListBlock title="Strengths" items={analysis.strengths} marker="✓" />
        <ListBlock title="Weaknesses" items={analysis.weaknesses} />
        <ListBlock title="Improvement Areas" items={analysis.improvementAreas} marker="→" />
      </section>

      <section className="cards-three">
        <ListBlock title="Missing Technologies" items={analysis.missingTechnologies} />
        <ListBlock title="Missing Tools" items={analysis.missingTools} />
        <ListBlock title="Missing Certifications" items={analysis.missingCertifications} />
      </section>

      <ResumeSuggestionCards improvements={analysis.resumeImprovements} />

      <section className="glass">
        <h2>Recruiter Simulation</h2>
        <p><b>Shortlisting Probability:</b> {analysis.scores?.shortlistingProbability}%</p>
        <div className="cards-three inner-grid">
          <div><h3>Reject Risk</h3>{analysis.recruiterSimulation?.rejectionReasons?.map((item) => <p key={item}>{item}</p>)}</div>
          <div><h3>Shortlist Reasons</h3>{analysis.recruiterSimulation?.shortlistReasons?.map((item) => <p key={item}>{item}</p>)}</div>
          <div><h3>Critical Fixes</h3>{analysis.recruiterSimulation?.criticalImprovements?.map((item) => <p key={item}>{item}</p>)}</div>
        </div>
      </section>

      <section className="cards-two">
        <article className="glass">
          <h2>Project Recommendation Engine</h2>
          <h3>Beginner</h3>{analysis.projectRecommendations?.beginner?.map((item) => <p key={item}>• {item}</p>)}
          <h3>Intermediate</h3>{analysis.projectRecommendations?.intermediate?.map((item) => <p key={item}>• {item}</p>)}
          <h3>Advanced</h3>{analysis.projectRecommendations?.advanced?.map((item) => <p key={item}>• {item}</p>)}
        </article>
        <article className="glass">
          <h2>Certification Recommendation Engine</h2>
          {analysis.certificationRecommendations?.map((certification) => (
            <div className="cert-row" key={certification.name}>
              <span className={`pill ${certification.priority === 'high' ? 'danger' : certification.priority === 'medium' ? 'warning' : 'success'}`}>{certification.priority}</span>
              <h3>{certification.name}</h3>
              <p>{certification.reason}</p>
            </div>
          ))}
        </article>
      </section>

      <div className="hero-actions">
        <Link className="btn primary" to="/resume-improvement">Resume Engine</Link>
        <Link className="btn ghost" to="/interview-prep">Interview Prep</Link>
        <Link className="btn ghost" to="/roadmap">Learning Roadmap</Link>
      </div>
    </AppShell>
  );
}
