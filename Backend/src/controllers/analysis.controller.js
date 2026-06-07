const Analysis = require('../models/analysis.model');
const Resume = require('../models/resume.model');
const JobDescription = require('../models/jobDescription.model');
const InterviewPreparation = require('../models/interviewPreparation.model');
const Roadmap = require('../models/roadmap.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const { extractPdfText } = require('../utils/pdfParser');
const { generateCareerAnalysis, MODEL } = require('../services/geminiService');

const getUserId = (req) => req.user?.id || req.user?._id;

function normalizeAnalysisPayload(aiPayload) {
  const optimizedResume = aiPayload.optimizedResume || {};
  if (!optimizedResume.copyVersion) {
    optimizedResume.copyVersion = [
      optimizedResume.professionalSummary,
      `Skills: ${(optimizedResume.skills || []).join(', ')}`,
      ...(optimizedResume.experience || []),
      ...(optimizedResume.projects || []),
      ...(optimizedResume.education || []),
      ...(optimizedResume.achievements || []),
      ...(optimizedResume.certifications || [])
    ].filter(Boolean).join('\n\n');
  }
  return { ...aiPayload, optimizedResume };
}


const uploadResumeOnly = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const resumeFile = req.file || req.files?.resumePdf?.[0];
  const resumeText = (req.body.resumeText || await extractPdfText(resumeFile)).trim();
  if (!resumeText) throw new ApiError(400, 'Resume text or resumePdf is required');

  const resume = await Resume.create({
    user: userId,
    fileName: resumeFile?.originalname,
    mimeType: resumeFile?.mimetype,
    size: resumeFile?.size || resumeText.length,
    rawText: resumeText
  });

  res.status(201).json({ message: 'Resume uploaded successfully', resume });
});

const uploadJobDescriptionOnly = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const jdFile = req.file || req.files?.jobDescriptionPdf?.[0];
  const jobDescriptionText = (req.body.jobDescriptionText || await extractPdfText(jdFile)).trim();
  if (!jobDescriptionText) throw new ApiError(400, 'Job description text or jobDescriptionPdf is required');

  const jobDescription = await JobDescription.create({
    user: userId,
    title: req.body.targetRole || 'Target Role',
    company: req.body.company || '',
    source: jdFile ? 'pdf' : 'text',
    fileName: jdFile?.originalname,
    rawText: jobDescriptionText
  });

  res.status(201).json({ message: 'Job description uploaded successfully', jobDescription });
});

const createAnalysis = asyncHandler(async (req, res) => {
  const userId = getUserId(req);
  const resumeFile = req.files?.resumePdf?.[0];
  const jdFile = req.files?.jobDescriptionPdf?.[0];
  const resumeText = (req.body.resumeText || await extractPdfText(resumeFile)).trim();
  const jobDescriptionText = (req.body.jobDescriptionText || await extractPdfText(jdFile)).trim();

  if (!resumeText || !jobDescriptionText) throw new ApiError(400, 'Resume text/PDF and job description text/PDF are required');

  const resume = await Resume.create({ user: userId, fileName: resumeFile?.originalname, mimeType: resumeFile?.mimetype, size: resumeFile?.size || resumeText.length, rawText: resumeText });
  const jobDescription = await JobDescription.create({ user: userId, title: req.body.targetRole || 'Target Role', company: req.body.company || '', source: jdFile ? 'pdf' : 'text', fileName: jdFile?.originalname, rawText: jobDescriptionText });

  const aiPayload = normalizeAnalysisPayload(await generateCareerAnalysis({ resumeText, jobDescriptionText, targetRole: req.body.targetRole, experienceLevel: req.body.experienceLevel }));
  const analysis = await Analysis.create({
    user: userId,
    resume: resume._id,
    jobDescription: jobDescription._id,
    targetRole: aiPayload.targetRole || req.body.targetRole || jobDescription.title,
    ...aiPayload,
    aiModel: MODEL
  });

  resume.extractedSkills = analysis.currentSkills || [];
  jobDescription.requiredSkills = analysis.requiredSkills || [];
  await Promise.all([resume.save(), jobDescription.save()]);

  const interview = await InterviewPreparation.create({ user: userId, analysis: analysis._id, questions: aiPayload.interviewQuestions || [] });
  const roadmap = await Roadmap.create({ user: userId, analysis: analysis._id, missingSkills: aiPayload.missingSkills || [], weeks: aiPayload.roadmapWeeks || [] });

  res.status(201).json({ message: 'Analysis generated successfully', analysis, resume, jobDescription, interview, roadmap });
});

const listAnalyses = asyncHandler(async (req, res) => {
  const analyses = await Analysis.find({ user: getUserId(req) }).sort({ createdAt: -1 }).limit(Number(req.query.limit || 20)).populate('resume jobDescription');
  res.json({ analyses });
});

const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({ _id: req.params.id, user: getUserId(req) }).populate('resume jobDescription');
  if (!analysis) throw new ApiError(404, 'Analysis not found');
  const [interview, roadmap] = await Promise.all([
    InterviewPreparation.findOne({ analysis: analysis._id, user: getUserId(req) }),
    Roadmap.findOne({ analysis: analysis._id, user: getUserId(req) })
  ]);
  res.json({ analysis, interview, roadmap });
});

const getAtsScore = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({ _id: req.params.id, user: getUserId(req) }).select('scores foundKeywords missingKeywords keywordRecommendations');
  if (!analysis) throw new ApiError(404, 'Analysis not found');
  res.json({ atsScore: analysis.scores.ats, keywordCoverage: analysis.scores.keywordCoverage, foundKeywords: analysis.foundKeywords, missingKeywords: analysis.missingKeywords, recommendations: analysis.keywordRecommendations });
});

const getResumeOptimization = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({ _id: req.params.id, user: getUserId(req) }).select('resumeImprovements optimizedResume');
  if (!analysis) throw new ApiError(404, 'Analysis not found');
  res.json({ resumeImprovements: analysis.resumeImprovements, optimizedResume: analysis.optimizedResume });
});

const getInterviewPreparation = asyncHandler(async (req, res) => {
  const interview = await InterviewPreparation.findOne({ analysis: req.params.id, user: getUserId(req) });
  if (!interview) throw new ApiError(404, 'Interview preparation not found');
  res.json({ interview });
});

const getRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ analysis: req.params.id, user: getUserId(req) });
  if (!roadmap) throw new ApiError(404, 'Roadmap not found');
  res.json({ roadmap });
});

module.exports = { uploadResumeOnly, uploadJobDescriptionOnly, createAnalysis, listAnalyses, getAnalysis, getAtsScore, getResumeOptimization, getInterviewPreparation, getRoadmap };
