// seedQuestions.
require('dotenv').config();
require('./Models/db');
const mongoose = require('mongoose');
const Question = require('./models/Questions');

// Connect to DB
// Sample questions to insert
const sampleQuestions = [
  {
    text: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswerIndex: 2,
    category: 'Geography',
    difficulty: 'Easy'
  },
  {
    text: 'Which language runs in a web browser?',
    options: ['Java', 'C', 'Python', 'JavaScript'],
    correctAnswerIndex: 3,
    category: 'Programming',
    difficulty: 'Easy'
  },
  {
    text: 'Who wrote "To Kill a Mockingbird"?',
    options: ['Harper Lee', 'J.K. Rowling', 'Mark Twain', 'Jane Austen'],
    correctAnswerIndex: 0,
    category: 'Literature',
    difficulty: 'Medium'
  },
  {
    text: 'Which data structure uses LIFO?',
    options: ['Queue', 'Array', 'Stack', 'LinkedList'],
    correctAnswerIndex: 2,
    category: 'Computer Science',
    difficulty: 'Medium'
  }
];

// Insert into database
async function seedDB() {
  try {
    await Question.deleteMany(); // optional: clears old questions
    await Question.insertMany(sampleQuestions);
    console.log('Questions seeded successfully!');
  } catch (err) {
    console.error('Error seeding questions:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB(); 