import { createBrowserRouter } from 'react-router-dom';
import Register from './features/auth/pages/register.jsx';
import Login from './features/auth/pages/login.jsx';
import Protected from './features/auth/components/protected.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AnalysisPage from './pages/AnalysisPage.jsx';
import AnalysisResultPage from './pages/AnalysisResultPage.jsx';
import ResumeImprovementPage from './pages/ResumeImprovementPage.jsx';
import InterviewPrepPage from './pages/InterviewPrepPage.jsx';
import LearningRoadmapPage from './pages/LearningRoadmapPage.jsx';

const secure = (component) => <Protected>{component}</Protected>;

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/dashboard', element: secure(<Dashboard />) },
  { path: '/analysis', element: secure(<AnalysisPage />) },
  { path: '/analysis/:id', element: secure(<AnalysisResultPage />) },
  { path: '/resume-improvement', element: secure(<ResumeImprovementPage />) },
  { path: '/interview-prep', element: secure(<InterviewPrepPage />) },
  { path: '/roadmap', element: secure(<LearningRoadmapPage />) },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/auth/register', element: <Register /> },
  { path: '/auth/login', element: <Login /> },
]);
