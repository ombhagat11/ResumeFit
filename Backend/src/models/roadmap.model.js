const mongoose = require('mongoose');

const weekSchema = new mongoose.Schema({
  week: { type: Number, min: 1, max: 12, required: true },
  title: { type: String, required: true },
  topics: [{ type: String }],
  resources: [{ type: String }],
  practiceTasks: [{ type: String }],
  projects: [{ type: String }]
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  analysis: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis', index: true },
  missingSkills: [{ type: String }],
  weeks: [weekSchema]
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
