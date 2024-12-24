"use client";  // This should be at the top of the file

import { useEffect, useState } from "react";
import * as mongoose from "mongoose";
import axiosInstance from "@/app/utils/axiosInstance";
import { useRouter } from "next/navigation";

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
  const [isEditingQuiz, setIsEditingQuiz] = useState<string | null>(null);

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

  const handleQuizDetailsChange = (e) => {
    const { name, value } = e.target;
    setQuizDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
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
      alert("Failed to generate quiz. Please try again after creating enough questions.");
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const response = await axiosInstance.delete(`${backend_url}/quizzes/${quizId}`);
      alert(response.data.message || "Quiz deleted successfully");
      if (selectedModule) await fetchQuizzes(selectedModule);
    } catch (err) {
      alert(`You can't delete this quiz, it has responses!`);
    }
  };

  const router = useRouter();
  const handleSeeResponses = (quizId: string) => {
    router.push(`/instructor/quizzes/${quizId}`);
  };

  const handleUpdateQuiz = (quiz: Quiz) => {
    setIsEditingQuiz(quiz._id);
    setQuizDetails({
      no_of_questions: quiz.no_of_questions,
      types_of_questions: quiz.types_of_questions as "mcq" | "t/f" | "both",
    });
  };

  const handleSubmitUpdateQuiz = async () => {
    if (!isEditingQuiz) return;

    const payload = {
      no_of_questions: quizDetails.no_of_questions,
      types_of_questions: quizDetails.types_of_questions,
    };

    try {
      const response = await axiosInstance.put(`${backend_url}/quizzes/updateQuiz2/${isEditingQuiz}`, payload);
      alert("Quiz updated successfully");
      setIsEditingQuiz(null);
      if (selectedModule) await fetchQuizzes(selectedModule);
    } catch (err) {
      alert(`You can't update this quiz, it has responses!`);
    }
  };

  const handleCancelUpdate = () => {
    setIsEditingQuiz(null);
    setQuizDetails({
      no_of_questions: 0,
      types_of_questions: "" as "mcq" | "t/f" | "both",
    });
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

        {isEditingQuiz ? (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Edit Quiz</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitUpdateQuiz();
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
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold focus:outline-none hover:bg-indigo-700"
              >
                Update Quiz
              </button>

              <button
                type="button"
                onClick={handleCancelUpdate}
                className="w-full mt-4 py-2 bg-gray-600 text-white rounded-lg font-semibold focus:outline-none hover:bg-gray-700"
              >
                Cancel Update
              </button>
            </form>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">No Quizzes Available</h2>
          <p>No quizzes have been created yet for this module.</p>
          {/* Show Generate Quiz Form */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Generate a New Quiz</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleGenerateQuiz();
            }}>
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
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold focus:outline-none hover:bg-indigo-700"
              >
                Generate Quiz
              </button>
            </form>
          </div>
        </div>
      ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Quizzes</h2>
            <ul className="space-y-4">
              {quizzes.map((quiz) => (
                <li key={quiz._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg text-black">{quiz._id}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSeeResponses(quiz._id)}
                        className="bg-indigo-600 text-white rounded-lg py-1 px-3"
                      >
                        See Responses
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="bg-red-600 text-white rounded-lg py-1 px-3"
                      >
                        Delete Quiz
                      </button>
                      <button
                        onClick={() => handleUpdateQuiz(quiz)}
                        className="bg-yellow-500 text-white rounded-lg py-1 px-3"
                      >
                        Edit Quiz
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>No. of Questions:</strong> {quiz.no_of_questions}</p>
                    <p><strong>Question Types:</strong> {quiz.types_of_questions}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
