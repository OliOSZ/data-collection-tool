import express from "express";
import { createSurvey, getSurveys, getSurveyQuestions, getSurveyResults } from "../controllers/surveyController";

const router = express.Router();

router.post("/", createSurvey); 
router.get("/", getSurveys);  
router.get("/:survey_id/questions", getSurveyQuestions);
router.get("/:survey_id/results", getSurveyResults);


export default router;
