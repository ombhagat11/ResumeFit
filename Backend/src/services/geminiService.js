const { GoogleGenAI } = require('@google/genai');
const { normalizeCareerAnalysis } = require('../utils/analysisNormalizer');

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

function buildFallbackAnalysis({ resumeText, jobDescriptionText, targetRole = 'Target Role' }) {
  const normalize = (text) => [...new Set((text || '').toLowerCase().match(/[a-z][a-z+#.\-]{2,}/g) || [])];
  const resumeWords = normalize(resumeText);
  const jdWords = normalize(jobDescriptionText);
  const skillsCatalog = ['javascript', 'react', 'node', 'express', 'mongodb', 'aws', 'docker', 'kubernetes', 'typescript', 'python', 'sql', 'api', 'testing', 'git', 'ci/cd', 'leadership', 'agile'];
  const currentSkills = skillsCatalog.filter((skill) => resumeWords.includes(skill));
  const requiredSkills = skillsCatalog.filter((skill) => jdWords.includes(skill));
  const missingSkills = requiredSkills.filter((skill) => !currentSkills.includes(skill));
  const keywordRows = jdWords.slice(0, 40).map((keyword) => ({ keyword, found: resumeWords.includes(keyword), category: 'jd' }));
  const foundKeywords = keywordRows.filter((keyword) => keyword.found);
  const missingKeywords = keywordRows.filter((keyword) => !keyword.found).slice(0, 20);
  const skillMatch = requiredSkills.length ? Math.round(((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100) : 65;
  const keywordCoverage = keywordRows.length ? Math.round((foundKeywords.length / keywordRows.length) * 100) : 60;
  const overall = Math.min(100, Math.round((skillMatch * 0.45) + (keywordCoverage * 0.35) + 14));

  return normalizeCareerAnalysis({
    targetRole,
    scores: {
      overallMatch: overall,
      ats: Math.min(100, keywordCoverage + 10),
      skillMatch,
      experienceMatch: Math.max(45, overall - 5),
      educationMatch: 70,
      recruiterInterest: Math.max(40, overall - 8),
      keywordCoverage,
      shortlistingProbability: Math.max(35, overall - 10)
    },
    strengths: ['Clear resume content available for analysis', 'Candidate shows relevant transferable experience', 'Profile can be aligned strongly with targeted keywords'],
    weaknesses: missingSkills.length ? [`Missing visible coverage for ${missingSkills.slice(0, 3).join(', ')}`] : ['Resume could use stronger quantified business outcomes'],
    improvementAreas: ['Add exact JD terminology where truthful', 'Quantify impact in bullets', 'Move most relevant skills into the top third of the resume'],
    currentSkills,
    requiredSkills,
    missingSkills,
    missingTechnologies: missingSkills.filter((skill) => !['leadership', 'agile'].includes(skill)),
    missingCertifications: [],
    missingTools: [],
    foundKeywords,
    missingKeywords,
    keywordRecommendations: missingKeywords.slice(0, 6).map((keyword) => `Add truthful evidence for "${keyword.keyword}" in summary, skills, or experience.`),
    resumeImprovements: {
      professionalSummary: `Results-driven ${targetRole} candidate with experience aligning technical delivery to measurable business outcomes.`,
      skillsSection: [...new Set([...currentSkills, ...requiredSkills])],
      experienceSection: ['Rewrite each bullet with action verb + scope + technology + measurable outcome.'],
      projectDescriptions: ['Position projects around the target role, architecture decisions, and user/business impact.'],
      achievementStatements: [{ before: 'Worked on React project.', after: 'Developed and deployed a React-based web application improving feature delivery speed and user experience with measurable performance gains.' }]
    },
    optimizedResume: {
      professionalSummary: `ATS-optimized ${targetRole} candidate focused on ${requiredSkills.slice(0, 5).join(', ') || 'modern software delivery'}.`,
      skills: [...new Set([...currentSkills, ...requiredSkills])],
      experience: ['Add role-specific quantified accomplishments here.'],
      projects: ['Add 2-3 JD-aligned projects with technologies and outcomes.'],
      education: [],
      achievements: ['Delivered measurable improvements by connecting technical work to business results.'],
      certifications: []
    },
    recruiterSimulation: {
      rejectionReasons: ['Insufficient keyword alignment may reduce ATS ranking'],
      shortlistReasons: ['Relevant skills and adaptable experience are present'],
      criticalImprovements: ['Close top missing skill gaps and quantify achievements']
    },
    projectRecommendations: {
      beginner: ['Build a JD keyword dashboard'],
      intermediate: ['Deploy a full-stack role-specific portfolio app'],
      advanced: ['Create a production-grade system using missing technologies from the JD']
    },
    certificationRecommendations: missingSkills.slice(0, 3).map((skill) => ({ name: `${skill} professional certification`, reason: `Validates missing ${skill} capability requested in the JD`, priority: 'medium' })),
    interviewQuestions: [
      { category: 'technical', difficulty: 'medium', question: 'Explain your most relevant project architecture.', answerStrategy: 'Cover requirements, architecture, tradeoffs, testing, deployment, and impact.', technologies: requiredSkills.slice(0, 4) },
      { category: 'behavioral', difficulty: 'medium', question: 'Tell me about a time you handled ambiguity.', answerStrategy: 'Use STAR and quantify the final result.', technologies: [] },
      { category: 'scenario', difficulty: 'hard', question: 'How would you solve a production incident?', answerStrategy: 'Explain triage, rollback, observability, communication, and prevention.', technologies: requiredSkills.slice(0, 3) },
      { category: 'hr', difficulty: 'easy', question: 'Why should we shortlist you for this role?', answerStrategy: 'Connect top matching skills and quantified outcomes to the JD.', technologies: [] }
    ],
    roadmapWeeks: [1, 2, 3, 4].map((week) => ({
      week,
      title: `Week ${week}: ${missingSkills[week - 1] || 'ATS readiness'}`,
      topics: [missingSkills[week - 1] || 'Resume optimization'],
      resources: ['Official documentation', 'Role-specific practice problems'],
      practiceTasks: ['Complete 5 targeted exercises', 'Rewrite resume bullets'],
      projects: ['Build one portfolio artifact']
    }))
  }, { targetRole });
}

function buildAnalysisPrompt({ resumeText, jobDescriptionText, targetRole, experienceLevel }) {
  return `You are an ATS expert, recruiter, staff engineer, product designer, and AI career coach. Return ONLY valid JSON. Analyze the resume against the job description for ${targetRole || 'the target role'} at ${experienceLevel || 'unknown'} level. Include numeric scores 0-100; skill gaps; keyword found/missing arrays; resume improvements; a fully rewritten ATS-friendly resume; recruiter simulation; project/certification recommendations; interview questions grouped by category and difficulty; and a 4-week learning roadmap.

JSON shape keys: targetRole, scores {overallMatch, ats, skillMatch, experienceMatch, educationMatch, recruiterInterest, keywordCoverage, shortlistingProbability}, strengths[], weaknesses[], improvementAreas[], currentSkills[], requiredSkills[], missingSkills[], missingTechnologies[], missingCertifications[], missingTools[], foundKeywords[{keyword,found,category}], missingKeywords[{keyword,found,category}], keywordRecommendations[], resumeImprovements {professionalSummary, skillsSection[], experienceSection[], projectDescriptions[], achievementStatements[{before,after}]}, optimizedResume {professionalSummary, skills[], experience[], projects[], education[], achievements[], certifications[], copyVersion}, recruiterSimulation {rejectionReasons[], shortlistReasons[], criticalImprovements[]}, projectRecommendations {beginner[], intermediate[], advanced[]}, certificationRecommendations[{name,reason,priority}], interviewQuestions[{category,difficulty,question,answerStrategy,technologies}], roadmapWeeks[{week,title,topics[],resources[],practiceTasks[],projects[]}].

RESUME:
${resumeText}

JOB_DESCRIPTION:
${jobDescriptionText}`;
}

function parseGeminiJson(text) {
  const cleaned = String(text || '').trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(cleaned);
}

async function generateCareerAnalysis(input) {
  if (!process.env.GOOGLE_GENAI_API_KEY) return buildFallbackAnalysis(input);
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
  const prompt = buildAnalysisPrompt(input);
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json', temperature: 0.2 }
      });
      return normalizeCareerAnalysis(parseGeminiJson(response.text), { targetRole: input.targetRole });
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 600));
    }
  }

  const fallback = buildFallbackAnalysis(input);
  fallback.aiError = lastError?.message;
  return fallback;
}

module.exports = { generateCareerAnalysis, buildAnalysisPrompt, buildFallbackAnalysis, MODEL };
