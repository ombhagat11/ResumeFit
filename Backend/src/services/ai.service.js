const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const resumeReportSchema = z.object({
    matchScore: z.number().describe("the match score between the candidate and the job description"),

    technicalQuestions: z.array(
        z.object({
            question: z.string().describe("the technical question can be asked in the interview"),
            intention: z.string().describe("how the answer this question what points to cover what approach to take etc")
        })
    ).describe("the technical questions that can be asked in the interview and how to answer them"),

    behavioralQuestions: z.array(
        z.object({
            question: z.string().describe("the technical question can be asked in the interview"),
            intention: z.string().describe("how the answer this question what points to cover what approach to take etc")
        })
    ).describe("the behavioral questions that can be asked in the interview and how to answer them"),

    skillGaps: z.array(
        z.object({
            skill: z.string().describe("the skill that the candidate is lacking"),
            severity: z.enum(["low", "medium", "high"]).describe("the severity of the skill gap")
        }).describe("the skill gaps that the candidate has and their severity")
    ).describe("the skill gaps that the candidate has and their severity"),

    preparationPlan: z.array(
        z.object({
            day: z.number().describe("the day of the preparation plan"),
            focus: z.string().describe("the focus of the preparation for this day"),
            tasks: z.array(z.string()).describe("the tasks to be done on this day")
        })
    ).describe("the preparation plan for the candidate to follow in order to prepare for the interview")
});

async function generateResumeReport(
    resume,
    selfDescription,
    jobDescription
) {
    const prompt = `generate a report for the candidate based on his resume and self description and the job description the report should include the match score between the candidate and the job description the technical questions that can be asked in the interview and how to answer them the behavioral questions that can be asked in the interview and how to answer them the skill gaps that the candidate has and their severity and a preparation plan for the candidate to follow in order to prepare for the interview here is the resume : ${resume} here is the self description : ${selfDescription} here is the job description : ${jobDescription}`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }],
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumeReportSchema)
        }
    });

    console.log(JSON.parse(response.text));
}

module.exports = {
    generateResumeReport
};