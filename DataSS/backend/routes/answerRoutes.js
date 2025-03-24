const express = require("express");
const { submitAnswer } = require("../controllers/answerController");

const router = express.Router();

router.post("/", submitAnswer);

module.exports = router;
