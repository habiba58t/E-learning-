"use client"


import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentCourses = () => {
  const [courseData, setCourseData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseData = async () => {
    try {
      // Fetch cookie data to get the username
      const cookieDataResponse = await axios.get("http://localhost:3002/auth/get-cookie-data", {
        withCredentials: true,
      });

      const result = cookieDataResponse.data;

      if (!result?.userData?.payload?.username) {
        setError("No valid username found");
        setLoading(false);
        return;
      }

      const username = result.userData.payload.username;

      // Fetch courses for the student
      const coursesResponse = await axios.get(
        `http://localhost:3002/courses/studcour/${username}/courses`,
        { withCredentials: true }
      );

      const courses = coursesResponse.data;

      // Fetch modules and quizzes for each course
      const courseData = await Promise.all(
        courses.map(async (course: any) => {
          try {
            // Fetch modules for the course
            const modulesResponse = await axios.get(
              `http://localhost:3002/courses/${course.courseCode}/modules`,
              { withCredentials: true }
            );
            const modules = modulesResponse.data;

            // Fetch quizzes for each module
            const populatedModules = await Promise.all(
              modules.map(async (module: any) => {
                try {
                  const quizzesResponse = await axios.get(
                    `http://localhost:3002/modules/id/${module._id}`,
                    { withCredentials: true }
                  );
                  const quizzes = quizzesResponse.data;
                  return { ...module, quizzes };
                } catch (error) {
                  console.error(`Failed to fetch quizzes for module ${module._id}`, error);
                  return { ...module, quizzes: [] }; // Default to empty quizzes
                }
              })
            );

            return { ...course, modules: populatedModules };
          } catch (error) {
            console.error(`Failed to fetch modules for course ${course.courseCode}`, error);
            return { ...course, modules: [] }; // Default to empty modules
          }
        })
      );

      // Update state with the fetched data
      setCourseData(courseData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course data:", error);
      setError("Failed to fetch course data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Student Courses</h1>
      {courseData.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        courseData.map((course) => (
          <div key={course.courseCode} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
            <h2>Course: {course.title}</h2>
            {course.modules.length === 0 ? (
              <p>No modules found for this course.</p>
            ) : (
              course.modules.map((module: any) => (
                <div key={module._id} style={{ marginLeft: "20px", marginBottom: "10px" }}>
                  <h3>Module: {module.title}</h3>
                  {module.quizzes.length === 0 ? (
                    <p>No quizzes found for this module.</p>
                  ) : (
                    <ul>
                      {module.quizzes.map((quiz: any) => (
                        <li key={quiz.quizId}>
                          <strong>Quiz Title:</strong> {quiz.quizTitle}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentCourses;
