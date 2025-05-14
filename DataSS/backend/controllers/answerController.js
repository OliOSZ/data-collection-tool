import pool from "../config/db";

export const submitAnswer = async (req, res) => {
    try {
      const { user_id, survey_id, answers } = req.body; 
  
      if (!user_id || !survey_id || !answers || answers.length === 0) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      for (const answer of answers) {
        const { question_id, answer_text, choice_id } = answer;
  
        if (!question_id || (answer_text === undefined && choice_id === undefined)) {
          return res.status(400).json({ message: "Missing required fields for answer" });
        }

        if (answer_text !== undefined) {
          await pool.query(
            "INSERT INTO answers (user_id, survey_id, question_id, answer_text) VALUES ($1, $2, $3, $4)",
            [user_id, survey_id, question_id, answer_text]
          );
        }

        if (choice_id !== undefined) {
          await pool.query(
            "INSERT INTO answers (user_id, survey_id, question_id, choice_id) VALUES ($1, $2, $3, $4)",
            [user_id, survey_id, question_id, choice_id]
          );
        }
      }
  
      res.status(201).json({ message: "Answers submitted successfully" });
    } catch (error) {
      console.error("Error in submitAnswer:", error);
      res.status(500).json({ message: "Server error" });
    }
};