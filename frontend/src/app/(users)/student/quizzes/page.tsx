'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import axiosInstance from "@/app/utils/axiosInstance";

// Arrow Icon Component with Animation
const ArrowIcon = ({ isOpen }: { isOpen: boolean }) => (
  <span
    className={`ml-2 text-xl transition-transform duration-300 ${isOpen ? "rotate-180 transform" : ""}`}
    style={{ transformOrigin: "center" }}
  >
    ▼
  </span>
);

// Interfaces for TypeScript
interface QuizData {
  _id: string;
}

interface CourseData {
  _id: string;
  title: string;
  modules: ModuleData[];
}

interface ModuleData {
  _id: string;
  title: string;
  quizzes: QuizData[];
}

const StudentCourses = () => {
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openCourses, setOpenCourses] = useState<{ [id: string]: boolean }>({});
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [quizStatuses, setQuizStatuses] = useState<{ [quizId: string]: string }>({});
  const [username, setUsername] = useState<string | null>(null);
  const [responseId, setResponseId] = useState<string>("");

  const router = useRouter(); // Initialize the router for navigation

  // Fetch course data from the API
  const fetchCourseData = async () => {
    try {
      const cookieDataResponse = await axiosInstance.get("http://localhost:3002/auth/get-cookie-data", {
        withCredentials: true,
      });
      const result = cookieDataResponse.data;
      if (!result?.userData?.payload?.username) {
        setError("No valid username found");
        setLoading(false);
        return;
      }

      const username = result.userData.payload.username;
      setUsername(username);
      const coursesResponse = await axiosInstance.get<CourseData[]>(
        `http://localhost:3002/courses/studcour2/${username}/courses`,
        { withCredentials: true }
      );
      if(coursesResponse && coursesResponse.data.length!==0){
      const courses = coursesResponse.data;

      const courseData: CourseData[] = await Promise.all(
        courses.map(async (course: any) => {
          const modulesResponse = await axiosInstance.get<ModuleData[]>(
            `http://localhost:3002/courses/${course.course_code}/modules2`,
            { withCredentials: true }
          );
          const modules = modulesResponse.data;

          const populatedModules = await Promise.all(
            modules.map(async (module: any) => {
              const quizzesResponse = await axiosInstance.get<QuizData[]>(
                `http://localhost:3002/modules/quiz/id/${module._id}`,
                { withCredentials: true }
              );
              const quizzes = quizzesResponse.data;
              return { ...module, quizzes };
            })
          );

          return { ...course, modules: populatedModules };
        })
      );

      setCourseData(courseData);
      setLoading(false);
      }

    } catch (error) {
     // console.error("Error fetching course data:", error);
     // setError("Failed to fetch course data");
      setLoading(false);
    }
  
  };

  // Fetch quiz statuses for the student
  const fetchQuizStatuses = async () => {
    try {
      const statuses: { [quizId: string]: string } = {};
      for (const course of courseData)
        for (const module of course.modules) {
          for (const quiz of module.quizzes) {
            const response = await axiosInstance.get(
              `http://localhost:3002/quizzes/check-status/${quiz._id}/${username}`
            );
            if(response.data.message==="Student has responded to the quiz"){
              const userResponse = await axiosInstance.get(`http://localhost:3002/quizzes/response/${quiz._id}/${username}`)
              console.log(userResponse.data.response)
              setResponseId(userResponse.data.response._id)
            }
            statuses[quiz._id] = response.data.message;
          }
        }
      setQuizStatuses(statuses);
    } catch (error) {
      console.error("Error fetching quiz statuses:", error);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (courseData.length > 0 && username) {
      fetchQuizStatuses();
    }
  }, [courseData, username]);

  const toggleCourse = (id: string) => {
    setOpenCourses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleModule = (id: string) => {
    setOpenModule(openModule === id ? null : id);
  };

  // Handle click for taking the quiz
  const handleClick = (quizId: string) => {
    alert(`Taking quiz: ${quizId}`);
    router.push(`/student/quizzes/${quizId}/${openModule}`);
  };

  if (loading) return <div className="text-center text-xl text-red-500">Loading...</div>;

  if (error) return <div className="text-center text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gradient-to-r from-teal-500 to-indigo-600 min-h-screen py-10">
      <div className="container mx-auto p-6 bg-white rounded-xl shadow-2xl max-w-4xl">
        <h1 className="text-4xl font-extrabold text-black mb-8 text-center">
          📚 My Quizzes
        </h1>

        {courseData.length === 0 ? (
          <p className="text-xl text-center text-gray-400">No courses found.</p>
        ) : (
          <>
            {courseData.map((course) => (
              <div
                key={course._id}
                className="mb-6 p-6 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300"
              >
                <h2
                  className="text-2xl font-semibold text-blue-800 flex items-center justify-between"
                  onClick={() => toggleCourse(course._id)}
                >
                  {course.title}
                  <ArrowIcon isOpen={openCourses[course._id]} />
                </h2>

                <div className={`mt-4 ${openCourses[course._id] ? "block" : "hidden"}`}>
                  {course.modules.length === 0 ? (
                    <p className="text-lg text-gray-600">No modules found for this course.</p>
                  ) : (
                    course.modules.map((module) => (
                      <div key={module._id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-300">
                        <h3
                          className="text-xl text-blue-600 font-medium flex items-center justify-between cursor-pointer"
                          onClick={() => toggleModule(module._id)}
                        >
                          {module.title}
                          <ArrowIcon isOpen={openModule === module._id} />
                        </h3>

                        <div className={`mt-2 ${openModule === module._id ? "block" : "hidden"}`}>
                          {module.quizzes.length === 0 ? (
                            <p className="text-lg text-gray-600">No quizzes found for this module.</p>
                          ) : (
                            module.quizzes.map((quiz) => (
                              <div key={quiz._id} className="mt-3">
                                {quizStatuses[quiz._id] === "Student has responded to the quiz" ? (
                                  <div className="flex space-x-4">
                                    <button
                                      onClick={() => router.push(`/student/quizzes/${quiz._id}/${openModule}/${responseId}`)}
                                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-all"
                                    >
                                      📄 See Response
                                    </button>
                                    <button
                                      onClick={() => handleClick(quiz._id)}
                                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-pink-800 transition-all"
                                    >
                                      🔁 Retake Quiz
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleClick(quiz._id)}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-pink-800 transition-all"
                                  >
                                    🚀 Take Quiz
                                  </button>
                                )}
                              </div>
                            ))
                            
                          )}
                        </div>
                        
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentCourses;
