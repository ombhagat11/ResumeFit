import { useEffect, useState } from 'react';
import AppShell from '../layouts/AppShell.jsx';
import RoadmapTimeline from '../components/RoadmapTimeline.jsx';
import { getAnalysis, listAnalyses } from '../features/analysis/services/analysis.api.js';
export default function LearningRoadmapPage() { const [roadmap, setRoadmap] = useState(null); useEffect(() => { listAnalyses().then(async ([latest]) => { if (latest?._id) { const data = await getAnalysis(latest._id); setRoadmap(data.roadmap); } }); }, []); return <AppShell><div className="section-heading"><span className="eyebrow">Learning Roadmap Generator</span><h1>4-week preparation plan</h1><p>Prioritized by missing skills, technologies, tools, and certification gaps.</p></div>{roadmap ? <RoadmapTimeline weeks={roadmap.weeks} /> : <div className="empty glass">Generate an analysis to unlock your roadmap.</div>}</AppShell>; }
