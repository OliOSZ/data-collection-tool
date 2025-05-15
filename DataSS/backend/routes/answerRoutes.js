import express from "express";
import { submitAnswer } from "../controllers/answerController.js";

const router = express.Router();

router.post("/", submitAnswer);

export default router;
