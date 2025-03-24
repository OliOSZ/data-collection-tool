const pool = require("../config/db");

exports.createSurvey = async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const newSurvey = await pool.query(
            "INSERT INTO surveys (title, description) VALUES ($1, $2) RETURNING *",
            [title, description || ""]
        );

        const surveyId = newSurvey.rows[0].id;

        for (const question of questions) {
            const { question_text, question_type, choices } = question;

            const newQuestion = await pool.query(
                "INSERT INTO questions (survey_id, question_text, question_type) VALUES ($1, $2, $3) RETURNING *",
                [surveyId, question_text, question_type]
            );

            if (question_type === "multiple_choice" && choices) {
                for (const choice of choices) {
                    await pool.query(
                        "INSERT INTO choices (question_id, choice_text) VALUES ($1, $2)",
                        [newQuestion.rows[0].id, choice]
                    );
                }
            }
        }

        res.status(201).json({ message: "Survey created successfully", survey: newSurvey.rows[0] });
    } catch (error) {
        console.error("Error in createSurvey:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getSurveys = async (req, res) => {
    try {
        const surveys = await pool.query("SELECT * FROM surveys");

        if (surveys.rows.length === 0) {
            return res.status(404).json({ message: "No surveys found" });
        }

        res.json(surveys.rows);
    } catch (error) {
        console.error("Error in getSurveys:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getSurveyQuestions = async (req, res) => {
    try {
        const { survey_id } = req.params;

        const questions = await pool.query(
            "SELECT id, question_text, question_type FROM questions WHERE survey_id = $1",
            [survey_id]
        );

        if (questions.rows.length === 0) {
            return res.status(404).json({ message: "No questions found for this survey." });
        }

        res.json(questions.rows);
    } catch (error) {
        console.error("Error in getSurveyQuestions:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getSurveyResults = async (req, res) => {
    try {
        const { survey_id } = req.params;

        const questions = await pool.query(
            "SELECT id, question_text, question_type FROM questions WHERE survey_id = $1",
            [survey_id]
        );

        if (questions.rows.length === 0) {
            return res.status(404).json({ message: "No questions found for this survey." });
        }

        const surveyResults = [];

        for (let question of questions.rows) {
            const questionResult = {
                question_id: question.id,
                question_text: question.question_text,
                question_type: question.question_type,
                answers: []
            };

            if (question.question_type === "multiple_choice") {
                const choicesQuery = `
                    SELECT c.id AS choice_id, c.choice_text, COUNT(a.choice_id) AS choice_count
                    FROM choices c
                    LEFT JOIN answers a ON a.choice_id = c.id AND a.question_id = $1
                    GROUP BY c.id
                `;
                const choices = await pool.query(choicesQuery, [question.id]);

                questionResult.answers = choices.rows.map(choice => ({
                    choice_text: choice.choice_text,
                    choice_count: parseInt(choice.choice_count, 10)
                }));
            } else if (question.question_type === "text") {
                const textAnswersQuery = `
                    SELECT answer_text
                    FROM answers
                    WHERE question_id = $1
                `;
                const textAnswers = await pool.query(textAnswersQuery, [question.id]);

                questionResult.answers = textAnswers.rows.map(answer => ({
                    answer_text: answer.answer_text
                }));
            }

            surveyResults.push(questionResult);
        }

        res.status(200).json(surveyResults);
    } catch (error) {
        console.error("Error in getSurveyResults:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};