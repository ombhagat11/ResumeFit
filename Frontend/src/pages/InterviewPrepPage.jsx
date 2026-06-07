import { useEffect, useState } from 'react';
import AppShell from '../layouts/AppShell.jsx';
import InterviewQuestionCards from '../components/InterviewQuestionCards.jsx';
import { getAnalysis, listAnalyses } from '../features/analysis/services/analysis.api.js';

export default function InterviewPrepPage() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    listAnalyses().then(async ([latest]) => {
      if (latest?._id) {
        const data = await getAnalysis(latest._id);
        setQuestions(data.interview?.questions || []);
      }
    });
  }, []);

  return (
    <AppShell>
      <div className="section-heading">
        <span className="eyebrow">Interview Preparation</span>
        <h1>Role-specific question bank</h1>
        <p>Technical, behavioral, scenario-based, and HR questions with easy, medium, and hard difficulty levels.</p>
      </div>
      <InterviewQuestionCards questions={questions} />
    </AppShell>
  );
}
