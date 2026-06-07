const { generateCareerAnalysis } = require('./geminiService');

async function generateResumeReport(resume, selfDescription, jobDescription) {
  return generateCareerAnalysis({ resumeText: `${resume}\n${selfDescription || ''}`, jobDescriptionText: jobDescription });
}

module.exports = { generateResumeReport };
