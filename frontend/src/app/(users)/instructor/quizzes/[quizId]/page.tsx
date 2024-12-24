"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axiosInstance from '@/app/utils/axiosInstance';

import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LineElement, LinearScale, Title, Tooltip, Legend, PointElement } from 'chart.js';

// Register the necessary components
ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);


interface QuizData{
    no_of_questions: number;
    types_of_questions: 'mcq'|'t/f'|'both';
}
const QuizResponsesPage = () => {
  const { quizId } = useParams();
  const [responses, setResponses] = useState<any[]>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [totalResponses, setTotalResponses] = useState<number>(0);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quizDetails, setQuizDetails] = useState<any | null>(null); // State to store quiz details

  async function fetchCookieData() {
    setLoading(true);
    setError(null);
    try {
      const cookieResponse = await fetch(`http://localhost:3002/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const username = userData.payload.username;
      setUsername(username);
    } catch (err) {
      setError("Failed to fetch user data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchQuizDetails() {
    try {
      const response = await axiosInstance.get(`http://localhost:3002/quizzes/get-quiz/${quizId}`);
      setQuizDetails(response.data.quiz); // Store quiz details (e.g., no_of_questions, types_of_questions)
        console.log(quizDetails)
    } catch (error) {
      setError("Failed to fetch quiz details.");
      console.error("Error fetching quiz details:", error);
    }
  }

  useEffect(() => {
    fetchCookieData();
    fetchQuizDetails();
  }, []);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3002/quizzes/responses/${quizId}`);
        const data = response.data.responses;

        if (data && data.length > 0) {
          setResponses(data);
          const validScores = data.filter((response: any) => response.score !== undefined && response.score !== null);
          const totalScore = validScores.reduce((acc: number, curr: any) => acc + curr.score, 0);

          setTotalResponses(data.length);
          setAverageScore(validScores.length > 0 ? totalScore / validScores.length : 0);
        }
      } catch (error) {
        setError("Failed to fetch quiz responses.");
        console.error("Error fetching responses:", error);
      }
    };

    fetchResponses();
  }, [quizId]);

  // Categorizing scores into ranges for the bar chart
  const scoreRanges = [
    { label: '0.00-0.20', min: 0, max: 0.20 },
    { label: '0.21-0.40', min: 0.21, max: 0.40 },
    { label: '0.41-0.60', min: 0.41, max: 0.60 },
    { label: '0.61-0.80', min: 0.61, max: 0.80 },
    { label: '0.81-1.00', min: 0.81, max: 1.00 },
  ];


  const scoreCounts = scoreRanges.map((range) => {
    return responses.filter((response) => response.score >= range.min && response.score <= range.max).length;
  });

  const barData = {
    labels: scoreRanges.map((range) => range.label),
    datasets: [
      {
        label: 'Number of Responses',
        data: scoreCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: scoreRanges.map((range) => range.label),
    datasets: [
      {
        data: scoreCounts,
        backgroundColor: ['#f44336', '#ff9800', '#ffeb3b', '#4caf50', '#2196f3'],
        hoverOffset: 4,
      },
    ],
  };

  const lineData = {
    labels: responses.map((response) => response.submittedAt),
    datasets: [
      {
        label: 'Scores Over Time',
        data: responses.map((response) => response.score),
        fill: false,
        borderColor: '#FF5733',
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-300 shadow-2xl rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Quiz Responses</h1>

      {username && (
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Instructor: {username}</h2>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-700">Quiz Summary</h2>
        {quizDetails && (
          <>
            <p className="text-gray-600 text-lg">Total Questions: <span className="font-medium">{quizDetails.no_of_questions}</span></p>
            <p className="text-gray-600 text-lg">Question Types: <span className="font-medium">{quizDetails.types_of_questions}</span></p>
          </>
        )}
        <p className="text-gray-600 text-lg">Total Responses: <span className="font-medium">{totalResponses}</span></p>
        <p className="text-gray-600 text-lg">Average Score: <span className="font-medium">{averageScore !== null ? averageScore.toFixed(2) : 'Loading...'}</span></p>
      </div>

      <div className="mb-12 grid gap-8 md:grid-cols-3 sm:grid-cols-1">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Score Distribution</h3>
          <Pie data={pieData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Scores per Range</h3>
          <Bar data={barData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Scores Over Time</h3>
          <Line data={lineData} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-700">Individual Responses</h2>
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-indigo-500 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Score</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {responses.map((response) => (
                <tr key={response._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{response.username}</td>
                  <td className="px-4 py-2">{response.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuizResponsesPage;