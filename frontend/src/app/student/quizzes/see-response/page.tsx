import React, { useState } from "react";
import confetti from "canvas-confetti"; // Add confetti effect (install with `npm install canvas-confetti`)

const QuizResponses = () => {
  const questions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
      studentAnswer: "Paris",
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: "Mars",
      studentAnswer: "Earth",
    },
    {
      id: 3,
      question: "Who wrote 'To Kill a Mockingbird'?",
      options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
      correctAnswer: "Harper Lee",
      studentAnswer: "Harper Lee",
    },
  ];

  // Calculate summary statistics
  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(
    (q) => q.correctAnswer === q.studentAnswer
  ).length;
  const scorePercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  // Trigger confetti for high scores
  if (parseFloat(scorePercentage) >= 80) confetti();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-green-500 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Quiz Review
        </h1>

        {/* Summary Section */}
        <div className="bg-blue-100 p-4 rounded-md mb-6 text-center">
          <h2 className="text-2xl font-semibold text-blue-700">
            Summary Statistics
          </h2>
          <p className="text-lg mt-2 text-gray-800">
            Total Questions: {totalQuestions}
          </p>
          <p className="text-lg text-gray-800">
            Correct Answers: {correctAnswers}
          </p>
          <p
            className={`text-lg font-bold mt-2 ${
                (parseFloat(scorePercentage) >= 80) ? "text-green-600"
                : (parseFloat(scorePercentage) >= 50)? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            Score: {scorePercentage}%
          </p>
          <p className="mt-2 text-lg text-gray-800">
            {(parseFloat(scorePercentage) >= 80)
              ? "Excellent job! 🎉"
              :(parseFloat(scorePercentage) >= 50)
              ? "Good effort, keep improving!"
              : "Don't give up, try again!"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="w-full bg-gray-300 h-3 rounded-full mb-6">
          <div
            style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
            className="bg-green-500 h-3 rounded-full"
          ></div>
        </div>

        {/* Questions List */}
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="border border-gray-200 p-6 mb-4 rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {index + 1}. {q.question}
            </h3>
            <ul className="space-y-2">
              {q.options.map((option, idx) => {
                const isCorrect = option === q.correctAnswer;
                const isStudentChoice = option === q.studentAnswer;
                return (
                  <li
                    key={idx}
                    className={`p-2 rounded-md border text-sm font-medium text-black transition-all duration-300 ${
                      isStudentChoice
                        ? isCorrect
                          ? "bg-green-200 border-green-400"
                          : "bg-red-200 border-red-400"
                        : isCorrect
                        ? "bg-green-100 border-green-300"
                        : "border-gray-300"
                    }`}
                  >
                    {option}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        
      </div>
    </div>
  );
};

export default QuizResponses;
