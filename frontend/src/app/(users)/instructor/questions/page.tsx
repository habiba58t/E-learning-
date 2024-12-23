"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axiosInstance from '@/app/utils/axiosInstance';
import InstructorSidebar from '@/app/components/instructor/instructor-sidebar/page';
import Navbar from '@/app/components/NavBar/page';

interface QuestionData {
  _id: number;
  keywordTitle: string;
  question_text: string;
  correct_answer: string;
  difficulty_level: string;
  type: string;
  options: string[];
}

interface coursedata {
  id: number;
  course_code: string;
  title: string;
  description: string;
  category: string;
  level: string;
  modules: moduledata[];
  Unavailable: boolean;
  created_at: Date;
  created_by: string;
}

interface moduledata {
  _id: number;
  title: string;
  level: string;
}

const QuestionPage = () => {
  const [courses, setCourses] = useState<coursedata[]>([]);
  const [modules, setModules] = useState<moduledata[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<QuestionData>({
    _id: 0,
    keywordTitle: "",
    question_text: "",
    correct_answer: "",
    difficulty_level: "",
    type: "",
    options: [],
  });
  const [isClient, setIsClient] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState<QuestionData>({
    _id: 0,
    keywordTitle: "",
    question_text: "",
    correct_answer: "",
    difficulty_level: "",
    type: "",
    options: []
  });

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchCookieData = async () => {
    try {
      const response = await fetch("http://localhost:3002/auth/get-cookie-data", {
        credentials: "include",
      });
      const { userData } = await response.json();

      if (!userData?.payload?.username) {
        console.error("No cookie data found");
        setError("No cookie data found");
        setLoading(false);
        return;
      }

      const user = userData.payload.username;
      setUsername(user);
      console.log("User logged in:", user);

      await fetchCoursesAndModules();
      await fetchQuestionsByCreator(user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cookie data:", error);
      setError("Error fetching cookie data");
      setLoading(false);
    }
  };

  const fetchCoursesAndModules = async () => {
    try {
      const coursesResponse = await axiosInstance.get<coursedata[]>(`http://localhost:3002/courses/coursesInstructor/${username}`);
      if (!coursesResponse.data || coursesResponse.data.length === 0) {
       // setError('No courses found');
        setCourses([]);
      }
      setCourses(coursesResponse.data);
      setError(null); // Clear error if courses are fetched successfully
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Error fetching courses');
    }
  };

  const fetchModulesForCourse = async (courseCode: string) => {
    try {
      const modulesResponse = await axiosInstance.get<moduledata[]>(`http://localhost:3002/courses/${courseCode}/modulesinstructor`);
      console.log(modulesResponse)
      if (!modulesResponse.data || modulesResponse.data.length === 0) {
        setModules([]); // If no modules found, clear modules
        return;
      }
      setModules(modulesResponse.data);
    } catch (error) {
      //console.log(modulesResponse)

      console.error('Error fetching modules:', error);
      setError('Error fetching modules');
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      // Fetch modules when a course is selected
      fetchModulesForCourse(selectedCourse);
    }
  }, [selectedCourse]);

  // Assuming instructor is passed as a prop or derived from context
  useEffect(() => {
    fetchCoursesAndModules();
  }, []);

  const handleCourseSelect = (courseCode: string) => {
    setSelectedCourse(courseCode);
    setSelectedModule(null); // Reset module when course is changed
  };

  const handleModuleSelect = (moduleCode: string) => {
    setSelectedModule(moduleCode);
  };
  const fetchQuestionsByCreator = async (creator: string) => {
    try {
      const response = await axiosInstance.get<QuestionData[]>(`http://localhost:3002/questions/${creator}`);
      const questionsData = response.data;
      if (questionsData && questionsData.length > 0) {
        setQuestions(questionsData);
      } else {
        setQuestions([])
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Error fetching questions");
    }
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDifficulty = e.target.value;
    setEditData((prevState) => ({
      ...prevState,
      difficulty_level: selectedDifficulty,
    }));
    };

  
  const handleCreate = () => {
    setShowCreateForm(true);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addOption = () => {
    setNewQuestion({ ...newQuestion, options: [...newQuestion.options, ''] });
  };

  const removeOption = (index: number) => {
    const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewQuestion({
      ...newQuestion,
      [field]: e.target.value
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { _id, ...questionDataWithoutId } = newQuestion; 
      console.log(questionDataWithoutId)
      const response = await axiosInstance.post(     
        `http://localhost:3002/questions/${username}/${selectedModule}`, // Correct string interpolation
        questionDataWithoutId
      );
      
      setQuestions((prevQuestions) => [...prevQuestions, response.data]);
      setShowCreateForm(false);
      setNewQuestion({
        _id: 0,
        keywordTitle: '',
        question_text: '',
        correct_answer: '',
        difficulty_level: '',
        type: '',
        options: [],

      });
    } catch (error) {
      console.error("Error creating question:", error);
      setError("Error creating question");
    }
  };
  
  const handleAnswerChange = (id: number, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === id ? { ...q, correct_answer: value } : q
      )
    );
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditData({ ...questions[index] });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex === null) return;

    try {
      const updatedQuestion = editData;
      const response = await axiosInstance.patch(
        `http://localhost:3002/questions/${updatedQuestion._id}`,
        updatedQuestion
      );

      const updatedQuestions = [...questions];
      updatedQuestions[editIndex] = response.data;
      setQuestions(updatedQuestions);
      setEditIndex(null);
    } catch (error) {
      console.error("Error updating question:", error);
      setError("Error updating question");
    }
  };


  const handleDelete = async (index: number, questionId: string) => {
    try {
      // Send DELETE request to backend
      const response = await axiosInstance.delete(`http://localhost:3002/questions/${questionId}`);
      
      // If the delete was successful, remove the question from the state
      if (response.status === 200) {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
      } else {
        // Handle any errors returned by the API (not status 200)
        console.error('Failed to delete question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };
  

 
  

  useEffect(() => {
    if (isClient) {
      fetchCookieData();
    }
  }, [isClient]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-teal-500 font-bold text-gray-800 mb-4">
            No Courses Available
          </h1>
          <p className="text-gray-600 text-xl">
            It seems like you haven’t created or been assigned any courses yet. Please check back later or contact support for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-6">Instructor Question Management</h1>

        <button
          className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 mb-4"
          onClick={handleCreate}
        >
          Create New Question
        </button>

        {/* Render edit form or create form based on context */}
        {showCreateForm || editIndex !== null ? (
          <form onSubmit={editIndex === null ? handleCreateSubmit : handleSave} className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-black mb-4">{editIndex === null ? 'Create New Question' : 'Edit Question'}</h2>

            {/* Keyword Title */}
            <input
              type="text"
              className="w-full p-3 border text-black border-teal-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Keyword Title"
              value={editIndex === null ? newQuestion.keywordTitle : editData.keywordTitle}
              onChange={(e) =>
                editIndex === null
                  ? handleInputChange(e, 'keywordTitle')
                  : setEditData((prevState) => ({ ...prevState, keywordTitle: e.target.value }))
              }
              required
            />

            {/* Only show Course and Module dropdown in create form */}
            {editIndex === null && (
              <>
                {/* Course Dropdown */}
                <div className="mb-6">
                  <label className="block text-black mb-2" htmlFor="course">Course</label>
                  <select
                    id="course"
                    className="w-full p-3 border text-black border-teal-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={selectedCourse || ''}
                    onChange={(e) => handleCourseSelect(e.target.value)}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course.course_code}>{course.title}</option>
                    ))}
                  </select>
                </div>

                {/* Module Dropdown */}
                <div className="mb-6">
                  <label className="block text-black mb-2" htmlFor="module">Module</label>
                  <select
                    id="module"
                    className="w-full p-3 border text-black border-teal-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={selectedModule || ''}
                    onChange={(e) => handleModuleSelect(e.target.value)}
                    disabled={!selectedCourse} // Disable module selection if no course is selected
                    required
                  >
                    <option value="">Select Module</option>
                    {modules.map((module, index) => (
                      <option key={index} value={module._id}>{module.title}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Question Text */}
            <textarea
              className="w-full p-3 border text-black border-teal-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Question Text"
              value={editIndex === null ? newQuestion.question_text : editData.question_text}
              onChange={(e) =>
                editIndex === null
                  ? handleInputChange(e, 'question_text')
                  : setEditData((prevState) => ({ ...prevState, question_text: e.target.value }))
              }
              required
            />

            {/* Difficulty Level */}
            <div className="mb-6">
              <label className="block text-black mb-2" htmlFor="difficulty_level">Difficulty Level</label>
              <select
                id="difficulty_level"
                className="w-full p-3 border border-teal-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={editIndex === null ? newQuestion.difficulty_level : editData.difficulty_level}
                onChange={(e) =>
                  editIndex === null
                    ? handleInputChange(e, 'difficulty_level')
                    : setEditData((prevState) => ({ ...prevState, difficulty_level: e.target.value }))
                }
                required
              >
                <option value="">Select difficulty level</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>

            {/* Question Type */}
            <div className="mb-6">
              <label className="block text-black mb-2" htmlFor="type">Type</label>
              <select
                id="type"
                className="w-full p-3 border border-teal-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={editIndex === null ? newQuestion.type : editData.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  const updatedData = { ...(editIndex === null ? newQuestion : editData), type: newType };

                  // Set options based on selected type
                  if (newType === 't/f') {
                    updatedData.options = ['True', 'False'];
                  } else if (newType === 'mcq') {
                    updatedData.options = [];
                  }

                  if (editIndex === null) {
                    setNewQuestion(updatedData);
                  } else {
                    setEditData(updatedData);
                  }
                }}
                required
              >
                <option value="">Select Type</option>
                <option value="t/f">True/False</option>
                <option value="mcq">Multiple Choice</option>
              </select>
            </div>

            {/* Options (only for mcq type) */}
            {(editIndex === null ? newQuestion.type : editData.type) === 'mcq' && (
              <div className="mb-6">
                <label className="block text-black mb-2">Options</label>
                {(editIndex === null ? newQuestion.options : editData.options).map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      className="text-gray-600 w-full p-3 border border-teal-300 rounded-md mr-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        if (editIndex === null) {
                          const updatedOptions = [...newQuestion.options];
                          updatedOptions[index] = e.target.value;
                          setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
                        } else {
                          const updatedOptions = [...editData.options];
                          updatedOptions[index] = e.target.value;
                          setEditData((prev) => ({ ...prev, options: updatedOptions }));
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                      onClick={() => {
                        if (editIndex === null) {
                          const updatedOptions = newQuestion.options.filter((_, i) => i !== index);
                          setNewQuestion((prev) => ({ ...prev, options: updatedOptions }));
                        } else {
                          const updatedOptions = editData.options.filter((_, i) => i !== index);
                          setEditData((prev) => ({ ...prev, options: updatedOptions }));
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                  onClick={() => {
                    if (editIndex === null) {
                      setNewQuestion((prev) => ({ ...prev, options: [...prev.options, ''] }));
                    } else {
                      setEditData((prev) => ({ ...prev, options: [...prev.options, ''] }));
                    }
                  }}
                >
                  Add Option
                </button>
              </div>
            )}

            {/* Correct Answer */}
            <div className="mb-4">
              <label className="block text-black mb-2" htmlFor="correct_answer">Correct Answer</label>
              <input
                type="text"
                id="correct_answer"
                className="text-gray-500 w-full p-3 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Correct Answer"
                value={editIndex === null ? newQuestion.correct_answer : editData.correct_answer}
                onChange={(e) =>
                  editIndex === null
                    ? handleInputChange(e, 'correct_answer')
                    : setEditData((prevState) => ({ ...prevState, correct_answer: e.target.value }))
                }
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {editIndex === null ? 'Create Question' : 'Save Changes'}
            </button>
          </form>
        ) : null}

        {/* Table */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Questions</h2>
          <table className="min-w-full border-collapse bg-white shadow-lg">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b text-left text-black">Keyword Title</th>
                <th className="py-3 px-4 border-b text-left text-black">Question Text</th>
                <th className="py-3 px-4 border-b text-left text-black">Correct Answer</th>
                <th className="py-3 px-4 border-b text-left text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={question._id}>
                  <td className="py-2 px-4 border-b text-gray-700">{question.keywordTitle}</td>
                  <td className="py-2 px-4 border-b text-gray-700">{question.question_text}</td>
                  <td className="py-2 px-4 border-b text-gray-700">{question.correct_answer}</td>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <button
                      className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700"
                      onClick={() => handleDelete(index, String(question._id))} // Convert _id to string
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;

