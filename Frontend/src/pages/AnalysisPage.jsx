import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../layouts/AppShell.jsx';
import UploadCard from '../components/UploadCard.jsx';
import { createAnalysis } from '../features/analysis/services/analysis.api.js';
export default function AnalysisPage() { const navigate = useNavigate(); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const onAnalyze = async (payload) => { setLoading(true); setError(''); try { const data = await createAnalysis(payload); navigate(`/analysis/${data.analysis._id}`); } catch (err) { setError(err.response?.data?.message || 'Unable to generate analysis.'); } finally { setLoading(false); } }; return <AppShell><UploadCard onAnalyze={onAnalyze} loading={loading} />{error && <div className="error-state glass">{error}</div>}</AppShell>; }
