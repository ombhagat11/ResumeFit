const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, trim: true, default: 'Target Role' },
  company: { type: String, trim: true, default: '' },
  source: { type: String, enum: ['pdf', 'text'], default: 'text' },
  fileName: { type: String, trim: true },
  rawText: { type: String, required: true },
  requiredSkills: [{ type: String }],
  experienceLevel: { type: String, enum: ['entry', 'mid', 'senior', 'lead', 'executive', 'unknown'], default: 'unknown' }
}, { timestamps: true });

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
