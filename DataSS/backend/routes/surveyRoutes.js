const express = require("express");
const { createSurvey, getSurveys, getSurveyQuestions, getSurveyResults } = require("../controllers/surveyController");

const router = express.Router();

router.post("/", createSurvey); 
router.get("/", getSurveys);  
router.get("/:survey_id/questions", getSurveyQuestions);
router.get("/:survey_id/results", getSurveyResults);


module.exports = router;
