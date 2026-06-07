import axios from 'axios';
import { downloadPdf } from '../../../utils/pdfExport.js';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

export async function createAnalysis(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') formData.append(key, value);
  });
  const { data } = await api.post('/api/analyses', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}

export async function listAnalyses() {
  const { data } = await api.get('/api/analyses');
  return data.analyses || [];
}

export async function getAnalysis(id) {
  const { data } = await api.get(`/api/analyses/${id}`);
  return data;
}

export function downloadOptimizedResume(analysis) {
  const resume = analysis?.optimizedResume?.copyVersion || 'No optimized resume available.';
  const filename = `${analysis?.targetRole || 'optimized-resume'}.pdf`.replace(/\s+/g, '-').toLowerCase();
  downloadPdf(resume, filename);
}
