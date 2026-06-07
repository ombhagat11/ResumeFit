const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: { type: String, enum: ['technical', 'behavioral', 'scenario', 'hr'], required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  question: { type: String, required: true },
  answerStrategy: { type: String, default: '' },
  technologies: [{ type: String }]
}, { _id: false });

const interviewPreparationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  analysis: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis', index: true },
  questions: [questionSchema]
}, { timestamps: true });

module.exports = mongoose.model('InterviewPreparation', interviewPreparationSchema);
