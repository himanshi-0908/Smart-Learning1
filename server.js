// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {text: "hii\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hello! 👋  I'm here to help you create a system for generating questions automatically.  To make this work effectively, I need a bit more information. Tell me about:\n\n**1. The Scope of Your Web Application:**\n\n* **Target Audience:**  Who are the primary users (e.g., elementary school students, high school students, college students, adults)? This will help me tailor the difficulty and content of the questions.\n* **Subject Areas:**  What specific subjects will this tool cover (e.g., math, science, history, literature)?  \n* **Desired Question Types:**  You mentioned MCQs and subjective. Are there any other specific question types you want to include (e.g., true/false, fill-in-the-blank, matching)?\n\n**2.  The Level of Automation:**\n\n* **Input Needed:**  What information do you want the teacher and student to provide?  Do they need to provide any content besides the topic name, number of questions, and question type?\n* **Question Generation Process:**  Do you want me to suggest questions based on a given topic, or should I generate completely original questions?  \n\nOnce I have this information, I can start crafting a solution that uses my knowledge to create your question generation system.  Let's get started! \n"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "I need 10 mcqs questions based on mathematics trignometry"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Okay, here are 10 multiple-choice questions based on trigonometry, designed to test a range of concepts:\n\n**1. What is the value of sin(90°)?**\n\na) 0\nb) 1\nc) -1\nd) √2/2\n\n**2. Which of the following trigonometric identities is TRUE?**\n\na) cos²θ + sin²θ = 1\nb) tanθ = cosθ/sinθ\nc) cotθ = sinθ/cosθ\nd) secθ = 1/sinθ\n\n**3. In a right triangle, the side opposite the right angle is called the:**\n\na) Hypotenuse\nb) Opposite\nc) Adjacent\nd) Sine\n\n**4. What is the value of cos(60°)?**\n\na) 1/2\nb) √3/2\nc) √2/2\nd) 0\n\n**5. If sinθ = 3/5, then what is the value of cosθ?**\n\na) 4/5\nb) 3/4\nc) 5/3\nd) 5/4\n\n**6. What is the period of the function y = sin(x)?**\n\na) π\nb) 2π\nc) 4π\nd) 1\n\n**7. Which of the following is the graph of y = cos(x)?**\n\n* Include images of sine and cosine graphs.\n\n**8. If tanθ = 1, then what is the value of θ in degrees?**\n\na) 30°\nb) 45°\nc) 60°\nd) 90°\n\n**9. What is the value of cot(45°)?**\n\na) 0\nb) 1\nc) √2\nd) √3\n\n**10. In a right triangle, if the length of the opposite side is 5 and the length of the adjacent side is 12, what is the length of the hypotenuse?**\n\na) 7\nb) 13\nc) 17\nd) 19\n\n**Answer Key:**\n\n1. b) 1\n2. a) cos²θ + sin²θ = 1\n3. a) Hypotenuse\n4. a) 1/2\n5. a) 4/5\n6. b) 2π\n7. (Show the cosine graph)\n8. b) 45°\n9. b) 1\n10. b) 13 \n\nLet me know if you have any other requests for questions or need help with anything else! \n"},
        ],
      },
    ],
  });


  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/ques.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(5000, () => {
  console.log(`Server listening on port 5000`);
});