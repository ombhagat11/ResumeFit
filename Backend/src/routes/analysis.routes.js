const { Router } = require('express');
const analysisController = require('../controllers/analysis.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadResumeAndJd, uploadResume, uploadJobDescription } = require('../middlewares/upload.middleware');

const router = Router();
router.use(authMiddleware.authUser);
router.post('/resume-upload', uploadResume, analysisController.uploadResumeOnly);
router.post('/job-description-upload', uploadJobDescription, analysisController.uploadJobDescriptionOnly);
router.post('/', uploadResumeAndJd, analysisController.createAnalysis);
router.get('/', analysisController.listAnalyses);
router.get('/:id', analysisController.getAnalysis);
router.get('/:id/ats-score', analysisController.getAtsScore);
router.get('/:id/resume-optimization', analysisController.getResumeOptimization);
router.get('/:id/interview-preparation', analysisController.getInterviewPreparation);
router.get('/:id/learning-roadmap', analysisController.getRoadmap);

module.exports = router;
