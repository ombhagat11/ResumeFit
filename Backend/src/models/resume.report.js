const mongoose = require('mongoose');


/**
 * job description, company name, start date, end date, and user reference
 * resume text
 * self description
 * matchScore with job description
 * technical question :[{
 * question text: "",
 * intention: "",
 * answer: "",
 * }]
 * behavioral question [{
 * question text: "",
 * intention: "",
 * answer: "",
 * }]
 * skill gaps: [{
 * skill name: "",
 * severity: "",
 * type: String,
 * enum: ["low", "medium", "high"]}]
 * preparation tips plan: [{
 * tip: "",
 * day: number,
 * focus: String,
 * task: String,    
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question: {type: String, required: [true, "Question text is required"]},
    intention: {type: String,
        required: [true, "Intention is required"],
    },
    answer: {type: String,
        required: [true, "Answer is required"],
    }
}, {_id: false});

const behavioralQuestionSchema = new mongoose.Schema({ 
     question: {type: String, required: [true, "Question text is required"]},
    intention: {type: String,
        required: [true, "Intention is required"],
    },
    answer: {type: String,
        required: [true, "Answer is required"],
    }
}   , {_id: false});

const skillGapSchema = new mongoose.Schema({
    skillName: {type: String, required: [true, "Skill name is required"]},
    severity: {type: String, required: [true, "Severity is required"], enum: ["low", "medium", "high"]},
    type: {type: String, required: [true, "Type is required"], enum: ["technical", "behavioral"]}
}, {_id: false});

const preparationTipSchema = new mongoose.Schema({
   
    day: {type: Number, required: [true, "Day is required"]},
    focus: {type: String, required: [true, "Focus is required"]},
    task: {type: String, required: [true, "Task is required"]}
}, {_id: false}); 

const resumeReportSchema = new mongoose.Schema({
    jobDescription: {type: String, required: [true, "Job description is required"]},
    resume: {type: String, },
    selfDescription: {type: String, },
    matchScore: {type: Number, min: 0, max: 100},
    technicalQuestions: [technicalQuestionSchema], behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationTips: [preparationTipSchema]}, {timestamps: true});


    const ResumeReport = mongoose.model('ResumeReport', resumeReportSchema);

    module.exports = ResumeReport;