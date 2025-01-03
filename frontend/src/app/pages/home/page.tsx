'use client';

import { useState, useEffect } from 'react';
import CourseCard from '@/app/components/courses/CourseCard';
import EnrollButton from '@/app/components/courses/EnrollButton';
import CreateCourseButton from '@/app/components/courses/CreateCourseButton';

import axiosInstance from '../../utils/axiosInstance'; // Importing axios instance

interface Course {
  _id: string; // MongoDB ObjectId
  course_code: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  created_by: string;
  modules: string[];
  threads: string[];
}

const HomePage = () => {
  const [courses, setCourses] = useState<Course[]>([]); // Explicitly typing the courses state
  const [userRole, setUserRole] = useState<'student' | 'admin'>('student'); // Set the default role, it can be dynamically fetched

  useEffect(() => {
    // Fetch courses from the API using axios
    axiosInstance
      .get('/courses') // Assuming /courses is the endpoint for fetching all courses
      .then((response) => setCourses(response.data)) // Storing the response in the courses state
      .catch((error) => {
        console.error('Error fetching courses:', error);
      });
  }, []);

  const handleEnroll = (courseId: string) => {
    // Logic for enrolling a student in a course using axios
    axiosInstance
      .post(`/enroll/${courseId}`) // Assuming the endpoint for enrolling a student
      .then(() => {
        alert('Successfully enrolled in the course!');
      })
      .catch((error) => {
        console.error('Error enrolling in the course:', error);
      });
  };

  const handleCreateCourse = () => {
    // Logic for creating a course (for admin only)
    axiosInstance
      .post('/create-course', { name: 'New Course', description: 'Description of the new course' })
      .then(() => {
        alert('Course created successfully!');
        // After creating the course, refresh the courses list
        axiosInstance
          .get('/courses')
          .then((response) => setCourses(response.data))
          .catch((error) => console.error('Error fetching courses after creation:', error));
      })
      .catch((error) => {
        console.error('Error creating the course:', error);
      });
  };

  return (
    <div>
      <h1>Welcome to the Course Platform</h1>
      <div>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id}>
              {/* Pass the required props to CourseCard */}
              <CourseCard 
                course={{
                  id: course._id,  // Map _id to id for CourseCard
                  name: course.title, // Map title to name for CourseCard
                  description: course.description // Map description directly
                }} 
              />
              {userRole === 'student' ? (
                <EnrollButton onEnroll={() => handleEnroll(course._id)} />
              ) : userRole === 'admin' ? (
                <CreateCourseButton onCreate={handleCreateCourse} />
              ) : null}
            </div>
          ))
        ) : (
          <p>No courses available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
