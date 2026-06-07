const app = require('./src/app');
require("dotenv").config();
const connectToDB = require('./src/config/database');
const { resume, selfDescription, jobDescription } = require('./src/services/temp');
const { generateResumeReport } = require('./src/services/ai.service');
connectToDB();


generateResumeReport(resume, selfDescription, jobDescription);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});