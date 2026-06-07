import { downloadOptimizedResume } from '../features/analysis/services/analysis.api.js';

export default function ExportButtons({ analysis }) {
  const copyResume = async () => {
    await navigator.clipboard.writeText(analysis?.optimizedResume?.copyVersion || '');
  };

  return (
    <div className="hero-actions">
      <button className="btn primary" onClick={copyResume}>Copy Version</button>
      <button className="btn ghost" onClick={() => downloadOptimizedResume(analysis)}>Download PDF</button>
    </div>
  );
}
