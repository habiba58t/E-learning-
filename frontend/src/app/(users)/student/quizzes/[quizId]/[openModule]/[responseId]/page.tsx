"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useParams, useRouter } from "next/navigation"; // Import useRouter for navigation
import axiosInstance from "@/app/utils/axiosInstance";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  studentAnswer: string;
}

interface ResponseData {
  answers: {
    questionId: string;
    answer: string;
  }[];
  username: string;
  score: number;
  message: string;
}

const QuizResponses = () => {
  const { quizId, responseId } = useParams();
  const router = useRouter(); // Initialize the router for navigation

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchQuizResponses = async () => {
      try {
        if (!responseId) return;
        const response = await axiosInstance.get<ResponseData>(
          `http://localhost:3002/responses/findR/${responseId}`
        );

        const { answers, message } = response.data;
        setMessage(message);

        const questionsData = await Promise.all(
          answers.map(async (answer) => {
            const questionResponse = await axiosInstance.get(
              `http://localhost:3002/questions/get-question/${answer.questionId}`
            );
            const { question_text, options, correct_answer } =
              questionResponse.data;

            return {
              id: answer.questionId,
              questionText: question_text,
              options: options,
              correctAnswer: correct_answer,
              studentAnswer: answer.answer,
            };
          })
        );

        setQuestions(questionsData);
      } catch (err: any) {
        console.error("Error fetching responses:", err);
        setError(err.response?.data?.message || "Failed to load quiz responses");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResponses();
  }, [responseId]);

  if (loading) {
    return <div className="text-center text-xl font-bold">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-xl font-bold">
        {error}
      </div>
    );
  }

  const totalQuestions = questions.length;
  const correctAnswers = questions.filter(
    (q) => q.correctAnswer === q.studentAnswer
  ).length;
  const scorePercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-green-500 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Quiz Review
        </h1>

        <p className="text-lg font-semibold text-gray-800 text-center mb-4">
          {message}
        </p>

        <div className="bg-blue-100 p-4 rounded-md mb-6 text-center">
          <h2 className="text-2xl font-semibold text-blue-700">
            Summary Statistics
          </h2>
          <p className="text-lg mt-2 text-gray-800">Total Questions: {totalQuestions}</p>
          <p className="text-lg text-gray-800">Correct Answers: {correctAnswers}</p>
          <p
            className={`text-lg font-bold mt-2 ${
              parseFloat(scorePercentage) >= 80
                ? "text-green-600"
                : parseFloat(scorePercentage) >= 50
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            Score: {scorePercentage}%
          </p>
          <p className="mt-2 text-lg text-gray-800">
            {parseFloat(scorePercentage) >= 80
              ? "Excellent job! 🎉"
              : parseFloat(scorePercentage) >= 50
              ? "Good effort, keep improving!"
              : "You did not pass the quiz, please revise this module and retake the quiz when you are ready!"}
          </p>
        </div>

        <div className="w-full bg-gray-300 h-3 rounded-full mb-6">
          <div
            style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
            className="bg-green-500 h-3 rounded-full"
          ></div>
        </div>

        {questions.map((q, index) => (
          <div
            key={q.id}
            className="border border-gray-200 p-6 mb-4 rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {index + 1}. {q.questionText}
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
              {q.studentAnswer !== q.correctAnswer && (
                <p className="mt-2 text-sm font-semibold text-green-600">
                  Correct Answer: {q.correctAnswer}
                </p>
              )}
            </ul>
          </div>
        ))}

        {/* Back to Quizzes Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/student/quizzes")}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResponses;
