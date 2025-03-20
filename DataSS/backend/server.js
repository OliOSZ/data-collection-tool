require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());  


// Test data
const surveyResults = [
  { id: 1, question: "Hva er din favorittfarge?", answer: "Blå" },
  { id: 2, question: "Liker du kaffe?", answer: "Ja" }
];

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get("/api/results", (req, res) => {
  res.json(surveyResults);
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
