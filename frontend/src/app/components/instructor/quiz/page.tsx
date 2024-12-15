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
  name: string;
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
  title: string;
  created_at: Date;
  numQuestions: number;
  questionType: string;
  module: mongoose.Types.ObjectId;
}

export default function Quiz() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [moduleList, setModuleList] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [quizDetails, setQuizDetails] = useState({
    numQuestions: 0,
    questionType: "" as "mcq" | "t/f" | "both",
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

      const response = await axiosInstance.get<Course[]>(
        `${backend_url}/courses/coursesInstructor/${username}`
      );
      setCourseList(response.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCookieData();
  }, []);

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId);
    setModuleList([]);
    setSelectedModule(null);

    try {
      const response = await axiosInstance.get<Module[]>(
        `${backend_url}/courses/${courseId}/modulesInstructor`
      );
      setModuleList(response.data);
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError("Failed to load modules. Please try again.");
    }
  };

  const fetchQuizzes = async (moduleId: string) => {
    try {
      const response = await axiosInstance.get<Quiz[]>(
        `${backend_url}/modules/getquizId/${moduleId}`
      );
      setQuizzes(response.data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setError("Failed to load quizzes. Please try again.");
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
      [name]: name === "numQuestions" ? parseInt(value) : value,
    }));
  };

  const handleGenerateQuiz = async () => {
    if (!selectedModule) {
      alert("Please select a module first");
      return;
    }

    const payload = {
      no_of_questions: quizDetails.numQuestions,
      types_of_questions: quizDetails.questionType,
    };

    console.log("Sending payload to backend:", payload);

    try {
      const response = await axiosInstance.post(
        `${backend_url}/quizzes/generate/${selectedModule}`,
        payload
      );

      console.log("Quiz creation response:", response.data);
      alert("Quiz generated successfully");

      // Refresh quizzes to include the new one
      await fetchQuizzes(selectedModule);
    } catch (err) {
      console.error("Error generating quiz:");
      alert("Failed to generate quiz. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-black mb-4">Create a Quiz</h1>

        <div className="mb-6">
          <label htmlFor="course" className="block text-black font-medium mb-2">Choose Course</label>
          <select
            id="course"
            value={selectedCourse || ''}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>Select a course</option>
            {courseList.map(course => (
              <option key={course.course_code} value={course.course_code}>{course.title}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label htmlFor="module" className="block text-black font-medium mb-2">Choose Module</label>
          <select
            id="module"
            value={selectedModule || ''}
            onChange={(e) => handleModuleChange(e.target.value)}
            className={`w-full border-2 ${selectedModule ? 'border-indigo-600' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option value="" disabled>Select a module</option>
            {moduleList.map(module => (
              <option
                key={module._id}
                value={module._id}
                className={selectedModule === module._id ? 'bg-indigo-100 text-black' : 'text-black'}
              >
                {module.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Quiz Details</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleGenerateQuiz(); }}>
            <div className="mb-4">
              <label htmlFor="numQuestions" className="block text-gray-700 font-medium mb-2">Number of Questions</label>
              <input
                type="number"
                id="numQuestions"
                name="numQuestions"
                value={quizDetails.numQuestions}
                onChange={handleQuizDetailsChange}
                placeholder="Enter number of questions"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="questionType" className="block text-gray-700 font-medium mb-2">Question Type</label>
              <select
                id="questionType"
                name="questionType"
                value={quizDetails.questionType}
                onChange={handleQuizDetailsChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Manage Quizzes</h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <div key={quiz._id} className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-800">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">
                      Questions: {quiz.numQuestions} | Type: {quiz.questionType}
                    </p>
                  </div>
                  <button className="text-red-600 hover:underline">Delete</button>
                </div>
              ))
            ) : (
              <p>No quizzes found for this module.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
