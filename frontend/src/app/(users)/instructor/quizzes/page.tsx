"use client";
import { useEffect, useState } from "react";
import * as mongoose from "mongoose";
import axiosInstance from "@/app/utils/axiosInstance";

const backend_url = "http://localhost:3002";

export interface Course {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  level: "easy" | "medium" | "hard";
  created_by: string;
  created_at: Date;
  Unavailable?: boolean;
  modules: mongoose.Types.ObjectId[];
  totalRating?: number;
  totalStudents?: number;
  averageRating?: number;
  isOutdated: boolean;
  threads: mongoose.Types.ObjectId[];
}

export interface Module {
  _id: string;
  title: string;
  level: "easy" | "medium" | "hard";
  status: number;
  content: mongoose.Types.ObjectId[];
  quizzes: mongoose.Types.ObjectId[];
  questions: mongoose.Types.ObjectId[];
  notes: mongoose.Types.ObjectId[];
  created_at: Date;
  totalRating: number;
  totalStudents: number;
  averageRating: number;
  isOutdated: boolean;
}

export interface Quiz {
  _id: string;
  created_at: Date;
  no_of_questions: number;
  types_of_questions: string;
}

export default function Quiz() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [moduleList, setModuleList] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [quizDetails, setQuizDetails] = useState({
    no_of_questions: 0,
    types_of_questions: "" as "mcq" | "t/f" | "both",
  });
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  async function fetchCookieData() {
    setLoading(true);
    setError(null);
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const username = userData.payload.username;
      setUsername(username);
      console.log("Fetched username:", username);

      const response = await axiosInstance.get<Course[]>(`${backend_url}/courses/coursesInstructor/${username}`);
      setCourseList(response.data);
    } catch (err) {
      setCourseList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCookieData();
  }, []);

  const handleCourseChange = async (course_code: string) => {
    setSelectedCourse(course_code);
    try {
      const response = await axiosInstance.get<Module[]>(`${backend_url}/courses/${course_code}/modulesInstructor`);
      setModuleList(response.data);
      console.log(moduleList);
    } catch (err) {}
  };

  const fetchQuizzes = async (moduleId: string) => {
    try {
      const response = await axiosInstance.get<Quiz[]>(`${backend_url}/modules/quiz/id/${moduleId}`);
      setQuizzes(response.data);
      console.log(response.data);
    } catch (err) {
      setQuizzes([]);
    }
  };

  const handleModuleChange = (moduleId: string) => {
    setSelectedModule(moduleId);
    fetchQuizzes(moduleId);
  };

  const handleQuizDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuizDetails((prev) => ({
      ...prev,
      [name]: name === "no_of_questions" ? parseInt(value) : value,
    }));
  };

  const handleGenerateQuiz = async () => {
    if (!selectedModule) {
      alert("Please select a module first");
      return;
    }

    const payload = {
      no_of_questions: quizDetails.no_of_questions,
      types_of_questions: quizDetails.types_of_questions,
    };

    try {
      const response = await axiosInstance.post(`${backend_url}/quizzes/generate/${selectedModule}`, payload);
      alert("Quiz generated successfully");
      await fetchQuizzes(selectedModule);
    } catch (err) {
      alert("Failed to generate quiz. Please try again.");
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const response = await axiosInstance.delete(`${backend_url}/quizzes/${quizId}`);
      alert(response.data.message || "Quiz deleted successfully");
      if (selectedModule) await fetchQuizzes(selectedModule);
    } catch (err) {
      alert("Failed to delete quiz. Please try again.");
    }
  };

  const handleUpdateQuiz = async (quizId: string) => {
    const no_of_questions = prompt("Enter the new number of questions:");
    const types_of_questions = prompt("Enter the new question type (mcq/t/f/both):");

    if (!no_of_questions || !types_of_questions) {
      alert("Both fields are required for updating the quiz.");
      return;
    }

    const payload = {
      no_of_questions: parseInt(no_of_questions),
      types_of_questions: types_of_questions,
    };

    try {
      const response = await axiosInstance.put(`${backend_url}/quizzes/update`, payload);
      alert("Quiz updated successfully");
      if (selectedModule) await fetchQuizzes(selectedModule);
    } catch (err) {
      alert("Failed to update quiz. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-black mb-4">Create a Quiz</h1>

        <div className="mb-6">
          <label htmlFor="course" className="block text-black font-medium mb-2">
            Choose Course
          </label>
          <select
            id="course"
            value={selectedCourse || ""}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="text-[#1e40af] w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option className="text-gray-600" value="" disabled>
              Select a course
            </option>
            {courseList.map((course) => (
              <option className="text-gray-700" key={course.course_code} value={course.course_code}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="module" className="block text-black font-medium mb-2">
            Choose Module
          </label>
          <select
            id="module"
            value={selectedModule || ""}
            onChange={(e) => handleModuleChange(e.target.value)}
            className={`w-full border-2 text-[#1e40af] ${selectedModule ? "border-indigo-600" : "border-gray-300"} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option className="text-gray-600" value="" disabled>
              Select a module
            </option>
            {moduleList.map((module) => (
              <option className="text-gray-700" key={module._id} value={module._id}>
                {module.title}
              </option>
            ))}
          </select>
        </div>

        {quizzes.length === 0 ? (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Quiz Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateQuiz();
              }}
            >
              <div className="mb-4">
                <label htmlFor="no_of_questions" className="block text-gray-700 font-medium mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  id="no_of_questions"
                  name="no_of_questions"
                  value={quizDetails.no_of_questions}
                  onChange={handleQuizDetailsChange}
                  placeholder="Enter number of questions"
                  className="text-gray-500 w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="types_of_questions" className="block text-gray-700 font-medium mb-2">
                  Question Type
                </label>
                <select
                  id="types_of_questions"
                  name="types_of_questions"
                  value={quizDetails.types_of_questions}
                  onChange={handleQuizDetailsChange}
                  className="text-gray-500 w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select question type</option>
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="t/f">True/False</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-indigo-500"
              >
                Generate Quiz
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Manage Quizzes</h2>
            <div className="text-[#0369a1] bg-gray-50 p-4 rounded-lg shadow">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <div key={quiz._id} className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800">Creation Date: {new Date(quiz.created_at).toLocaleDateString()}</h3>
                      <p className="text-sm text-gray-600">
                        Number of Questions: {quiz.no_of_questions} | Type of Questions: {quiz.types_of_questions}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleUpdateQuiz(quiz._id)} className="text-blue-600 hover:underline">
                        Update
                      </button>
                      <button onClick={() => handleDeleteQuiz(quiz._id)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No quiz found for this module.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
