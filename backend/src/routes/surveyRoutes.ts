import express, { Router } from 'express';
import { submitSurvey, getAllSurveys, getSurveyById } from '../controllers/surveyController';

const router: Router = express.Router();

// POST /api/survey/submit
router.post('/submit', submitSurvey);

// GET /api/survey (get all surveys - for admin/testing)
router.get('/', getAllSurveys);

// GET /api/survey/:id (get specific survey)
router.get('/:id', getSurveyById);

export default router;
