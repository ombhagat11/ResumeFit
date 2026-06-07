import { useState } from 'react';
export default function UploadCard({ onAnalyze, loading }) {
  const [form, setForm] = useState({ targetRole: '', experienceLevel: 'mid', jobDescriptionText: '', resumeText: '' });
  const [resumePdf, setResumePdf] = useState(null);
  const [jobDescriptionPdf, setJobDescriptionPdf] = useState(null);
  const submit = (event) => { event.preventDefault(); onAnalyze({ ...form, resumePdf, jobDescriptionPdf }); };
  return <form className="upload-card glass" onSubmit={submit}>
    <div className="section-heading"><span className="eyebrow">AI Career Copilot</span><h2>Upload resume and job description</h2><p>PDF uploads are parsed by the API; text fallback keeps demos fast.</p></div>
    <div className="form-grid"><label>Target role<input value={form.targetRole} onChange={(e) => setForm({ ...form, targetRole: e.target.value })} placeholder="Senior MERN Engineer" /></label><label>Experience level<select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}><option value="entry">Entry</option><option value="mid">Mid</option><option value="senior">Senior</option><option value="lead">Lead</option></select></label></div>
    <div className="form-grid"><label>Resume PDF<input type="file" accept="application/pdf" onChange={(e) => setResumePdf(e.target.files?.[0])} /></label><label>JD PDF<input type="file" accept="application/pdf" onChange={(e) => setJobDescriptionPdf(e.target.files?.[0])} /></label></div>
    <label>Resume text<textarea value={form.resumeText} onChange={(e) => setForm({ ...form, resumeText: e.target.value })} placeholder="Paste resume text if no PDF is available" /></label>
    <label>Job description text<textarea required={!jobDescriptionPdf} value={form.jobDescriptionText} onChange={(e) => setForm({ ...form, jobDescriptionText: e.target.value })} placeholder="Paste the target job description" /></label>
    <button className="btn primary large" disabled={loading}>{loading ? 'Generating report…' : 'Generate hiring-readiness report'}</button>
  </form>;
}
