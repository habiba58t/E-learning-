"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";

const TakeQuizPage = () => {
  const { quizId } = useParams(); // Access quizId from the dynamic URL

  const [quizData, setQuizData] = useState<any | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // Fetch cookie data to get the username
  const fetchCookieData = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:3002/auth/get-cookie-data",
        { withCredentials: true }
      );
      const result = response.data;

      if (result?.userData?.payload?.username) {
        setUsername(result.userData.payload.username);
      } else {
        throw new Error("No valid username found in cookie.");
      }
    } catch (err: any) {
      console.error("Error fetching cookie data:", err);
      setError(err.response?.data?.message || "Failed to fetch cookie data");
      setLoading(false);
    }
  };

  // Fetch quiz data from the API
  const fetchQuizData = async (user: string) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:3002/quizzes/prepare/${quizId}/${user}`,
        { withCredentials: true }
      );
      setQuizData(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching quiz data:", err);
      setError(err.response?.data?.message || "Failed to load quiz data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      (async () => {
        await fetchCookieData();
      })();
    }
  }, [quizId]);

  useEffect(() => {
    if (username && quizId) {
      fetchQuizData(username);
    }
  }, [username]);

  const handleOptionChange = (questionId: string, selectedOption: string) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      const existingIndex = updatedAnswers.findIndex((ans) => ans.questionId === questionId);
      if (existingIndex !== -1) {
        updatedAnswers[existingIndex].answer = selectedOption;
      } else {
        updatedAnswers.push({ questionId, answer: selectedOption });
      }
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    try {
      console.log(answers)
      await axiosInstance.post(
        `http://localhost:3002/quizzes/${quizId}/${username}/submit`,
        {  answers },
        { withCredentials: true }
      );
      alert("Your responses have been submitted successfully!");
    } catch (err: any) {
      console.error("Error submitting responses:", err);
      alert(err.response?.data?.message || "Failed to submit your responses");
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-blue-500">Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  if (!quizData) {
    return <div className="text-center text-xl text-gray-500">No quiz data found.</div>;
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(to bottom, #ffffff, #a8d0f0)",
      }}
    >
      <div className="max-w-4xl mx-auto bg-blue-50 rounded-lg shadow-lg border border-blue-200 p-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">Quiz</h1>
        <h2 className="text-2xl font-sans text-left mb-2 text-gray-600">Solve the following questions:</h2>

        <form>
          {quizData.map((question: any, index: number) => (
            <div
              key={question._id}
              className="mb-8 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200"
            >
              <h3 className="text-1xl font-semibold text-gray-800 mb-3">
                Question {index + 1}: {question.question_text || question.text}
              </h3>

              <div className="space-y-4">
                {question.options.map((option: string, optionIndex: number) => (
                  <label
                    key={optionIndex}
                    htmlFor={`${question._id}-option-${optionIndex}`}
                    className="flex items-center space-x-3 p-4 rounded-md border border-gray-300 hover:bg-blue-100 transition cursor-pointer"
                  >
                    <input
                      type="radio"
                      id={`${question._id}-option-${optionIndex}`}
                      name={question._id}
                      value={option}
                      onChange={() => handleOptionChange(question._id, option)}
                      checked={
                        answers.find((ans) => ans.questionId === question._id)?.answer === option
                      }
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-lg text-gray-700 font-medium">
                      {String.fromCharCode(65 + optionIndex)}. {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Submit Answers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeQuizPage;
