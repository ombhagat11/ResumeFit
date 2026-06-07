const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  overallMatch: { type: Number, min: 0, max: 100, default: 0 },
  ats: { type: Number, min: 0, max: 100, default: 0 },
  skillMatch: { type: Number, min: 0, max: 100, default: 0 },
  experienceMatch: { type: Number, min: 0, max: 100, default: 0 },
  educationMatch: { type: Number, min: 0, max: 100, default: 0 },
  recruiterInterest: { type: Number, min: 0, max: 100, default: 0 },
  keywordCoverage: { type: Number, min: 0, max: 100, default: 0 },
  shortlistingProbability: { type: Number, min: 0, max: 100, default: 0 }
}, { _id: false });

const keywordSchema = new mongoose.Schema({
  keyword: String,
  found: Boolean,
  category: { type: String, default: 'general' }
}, { _id: false });

const improvementSchema = new mongoose.Schema({
  professionalSummary: String,
  skillsSection: [String],
  experienceSection: [String],
  projectDescriptions: [String],
  achievementStatements: [{ before: String, after: String }]
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  resume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  jobDescription: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDescription', required: true },
  targetRole: { type: String, default: 'Target Role' },
  scores: { type: scoreSchema, default: () => ({}) },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  improvementAreas: [{ type: String }],
  currentSkills: [{ type: String }],
  requiredSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  missingTechnologies: [{ type: String }],
  missingCertifications: [{ type: String }],
  missingTools: [{ type: String }],
  foundKeywords: [keywordSchema],
  missingKeywords: [keywordSchema],
  keywordRecommendations: [{ type: String }],
  resumeImprovements: improvementSchema,
  optimizedResume: {
    professionalSummary: String,
    skills: [String],
    experience: [String],
    projects: [String],
    education: [String],
    achievements: [String],
    certifications: [String],
    copyVersion: String
  },
  recruiterSimulation: {
    rejectionReasons: [String],
    shortlistReasons: [String],
    criticalImprovements: [String]
  },
  projectRecommendations: {
    beginner: [String],
    intermediate: [String],
    advanced: [String]
  },
  certificationRecommendations: [{ name: String, reason: String, priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' } }],
  aiModel: { type: String, default: 'gemini-2.0-flash' },
  status: { type: String, enum: ['completed', 'failed'], default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
