const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fileName: { type: String, trim: true },
  mimeType: { type: String, default: 'application/pdf' },
  size: { type: Number, default: 0 },
  rawText: { type: String, required: true },
  extractedSkills: [{ type: String }],
  experienceLevel: { type: String, enum: ['entry', 'mid', 'senior', 'lead', 'executive', 'unknown'], default: 'unknown' }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
