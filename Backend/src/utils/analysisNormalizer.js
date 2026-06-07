const { z } = require('zod');

const scoreSchema = z.object({
  overallMatch: z.coerce.number().min(0).max(100).default(0),
  ats: z.coerce.number().min(0).max(100).default(0),
  skillMatch: z.coerce.number().min(0).max(100).default(0),
  experienceMatch: z.coerce.number().min(0).max(100).default(0),
  educationMatch: z.coerce.number().min(0).max(100).default(0),
  recruiterInterest: z.coerce.number().min(0).max(100).default(0),
  keywordCoverage: z.coerce.number().min(0).max(100).default(0),
  shortlistingProbability: z.coerce.number().min(0).max(100).default(0)
});

const keywordSchema = z.object({
  keyword: z.coerce.string().default(''),
  found: z.coerce.boolean().default(false),
  category: z.coerce.string().default('general')
});

const questionSchema = z.object({
  category: z.enum(['technical', 'behavioral', 'scenario', 'hr']).default('technical'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  question: z.coerce.string().default(''),
  answerStrategy: z.coerce.string().default(''),
  technologies: z.array(z.coerce.string()).default([])
});

const roadmapWeekSchema = z.object({
  week: z.coerce.number().min(1).max(12).default(1),
  title: z.coerce.string().default('Preparation focus'),
  topics: z.array(z.coerce.string()).default([]),
  resources: z.array(z.coerce.string()).default([]),
  practiceTasks: z.array(z.coerce.string()).default([]),
  projects: z.array(z.coerce.string()).default([])
});

const careerAnalysisSchema = z.object({
  targetRole: z.coerce.string().default('Target Role'),
  scores: scoreSchema.default({}),
  strengths: z.array(z.coerce.string()).default([]),
  weaknesses: z.array(z.coerce.string()).default([]),
  improvementAreas: z.array(z.coerce.string()).default([]),
  currentSkills: z.array(z.coerce.string()).default([]),
  requiredSkills: z.array(z.coerce.string()).default([]),
  missingSkills: z.array(z.coerce.string()).default([]),
  missingTechnologies: z.array(z.coerce.string()).default([]),
  missingCertifications: z.array(z.coerce.string()).default([]),
  missingTools: z.array(z.coerce.string()).default([]),
  foundKeywords: z.array(keywordSchema).default([]),
  missingKeywords: z.array(keywordSchema).default([]),
  keywordRecommendations: z.array(z.coerce.string()).default([]),
  resumeImprovements: z.object({
    professionalSummary: z.coerce.string().default(''),
    skillsSection: z.array(z.coerce.string()).default([]),
    experienceSection: z.array(z.coerce.string()).default([]),
    projectDescriptions: z.array(z.coerce.string()).default([]),
    achievementStatements: z.array(z.object({
      before: z.coerce.string().default(''),
      after: z.coerce.string().default('')
    })).default([])
  }).default({}),
  optimizedResume: z.object({
    professionalSummary: z.coerce.string().default(''),
    skills: z.array(z.coerce.string()).default([]),
    experience: z.array(z.coerce.string()).default([]),
    projects: z.array(z.coerce.string()).default([]),
    education: z.array(z.coerce.string()).default([]),
    achievements: z.array(z.coerce.string()).default([]),
    certifications: z.array(z.coerce.string()).default([]),
    copyVersion: z.coerce.string().default('')
  }).default({}),
  recruiterSimulation: z.object({
    rejectionReasons: z.array(z.coerce.string()).default([]),
    shortlistReasons: z.array(z.coerce.string()).default([]),
    criticalImprovements: z.array(z.coerce.string()).default([])
  }).default({}),
  projectRecommendations: z.object({
    beginner: z.array(z.coerce.string()).default([]),
    intermediate: z.array(z.coerce.string()).default([]),
    advanced: z.array(z.coerce.string()).default([])
  }).default({}),
  certificationRecommendations: z.array(z.object({
    name: z.coerce.string().default(''),
    reason: z.coerce.string().default(''),
    priority: z.enum(['high', 'medium', 'low']).default('medium')
  })).default([]),
  interviewQuestions: z.array(questionSchema).default([]),
  roadmapWeeks: z.array(roadmapWeekSchema).default([]),
  aiError: z.coerce.string().optional()
});

function uniqueStrings(values) {
  return [...new Set((values || []).map((value) => String(value || '').trim()).filter(Boolean))];
}

function buildCopyVersion(optimizedResume) {
  const sections = [
    ['PROFESSIONAL SUMMARY', [optimizedResume.professionalSummary]],
    ['SKILLS', optimizedResume.skills],
    ['EXPERIENCE', optimizedResume.experience],
    ['PROJECTS', optimizedResume.projects],
    ['EDUCATION', optimizedResume.education],
    ['ACHIEVEMENTS', optimizedResume.achievements],
    ['CERTIFICATIONS', optimizedResume.certifications]
  ];

  return sections
    .filter(([, lines]) => lines && lines.some(Boolean))
    .map(([heading, lines]) => `${heading}\n${lines.filter(Boolean).map((line) => `• ${line}`).join('\n')}`)
    .join('\n\n');
}

function normalizeCareerAnalysis(payload, defaults = {}) {
  const parsed = careerAnalysisSchema.parse({ ...payload, targetRole: payload?.targetRole || defaults.targetRole || 'Target Role' });
  parsed.scores = scoreSchema.parse(parsed.scores || {});
  parsed.resumeImprovements = { professionalSummary: '', skillsSection: [], experienceSection: [], projectDescriptions: [], achievementStatements: [], ...(parsed.resumeImprovements || {}) };
  parsed.optimizedResume = { professionalSummary: '', skills: [], experience: [], projects: [], education: [], achievements: [], certifications: [], copyVersion: '', ...(parsed.optimizedResume || {}) };
  parsed.recruiterSimulation = { rejectionReasons: [], shortlistReasons: [], criticalImprovements: [], ...(parsed.recruiterSimulation || {}) };
  parsed.projectRecommendations = { beginner: [], intermediate: [], advanced: [], ...(parsed.projectRecommendations || {}) };
  parsed.currentSkills = uniqueStrings(parsed.currentSkills);
  parsed.requiredSkills = uniqueStrings(parsed.requiredSkills);
  parsed.missingSkills = uniqueStrings(parsed.missingSkills.length ? parsed.missingSkills : parsed.requiredSkills.filter((skill) => !parsed.currentSkills.includes(skill)));
  parsed.missingTechnologies = uniqueStrings(parsed.missingTechnologies);
  parsed.missingCertifications = uniqueStrings(parsed.missingCertifications);
  parsed.missingTools = uniqueStrings(parsed.missingTools);
  parsed.optimizedResume.skills = uniqueStrings(parsed.optimizedResume.skills.length ? parsed.optimizedResume.skills : [...parsed.currentSkills, ...parsed.requiredSkills]);

  if (!parsed.optimizedResume.copyVersion) {
    parsed.optimizedResume.copyVersion = buildCopyVersion(parsed.optimizedResume);
  }

  if (!parsed.interviewQuestions.length) {
    parsed.interviewQuestions = [
      { category: 'technical', difficulty: 'medium', question: `Explain the most relevant ${parsed.targetRole} project on your resume.`, answerStrategy: 'Describe architecture, tradeoffs, technologies, impact, and metrics.', technologies: parsed.requiredSkills.slice(0, 4) },
      { category: 'behavioral', difficulty: 'medium', question: 'Tell me about a time you improved a weak process.', answerStrategy: 'Use STAR: situation, task, action, measurable result.', technologies: [] },
      { category: 'scenario', difficulty: 'hard', question: 'How would you close the top skill gaps before joining?', answerStrategy: 'Prioritize missing requirements, build proof-of-work, and communicate ramp-up plan.', technologies: parsed.missingSkills.slice(0, 4) },
      { category: 'hr', difficulty: 'easy', question: 'Why are you interested in this role?', answerStrategy: 'Connect company needs, role scope, and your strongest matching achievements.', technologies: [] }
    ];
  }

  if (!parsed.roadmapWeeks.length) {
    parsed.roadmapWeeks = [1, 2, 3, 4].map((week) => ({
      week,
      title: `Week ${week}: ${parsed.missingSkills[week - 1] || 'Hiring readiness'}`,
      topics: [parsed.missingSkills[week - 1] || 'ATS keyword optimization'],
      resources: ['Official documentation', 'Role-specific interview practice'],
      practiceTasks: ['Complete targeted exercises', 'Rewrite resume bullets with metrics'],
      projects: ['Create one portfolio proof-of-work artifact']
    }));
  }

  return parsed;
}

module.exports = { careerAnalysisSchema, normalizeCareerAnalysis };
