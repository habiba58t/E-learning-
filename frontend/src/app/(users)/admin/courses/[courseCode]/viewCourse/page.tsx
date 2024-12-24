'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";
import { Types } from 'mongoose';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';

export interface Course {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  level: 'easy' | 'medium' | 'hard';
  created_by: string;
  created_at: Date;
  Unavailable?: boolean;
  modules: string[];
  totalRating?: number;
  totalStudents?: number;
  averageRating?: number;
  isOutdated: boolean;
  threads: string[];
}

export interface Module {
  _id: string;
  title: string;
  level: 'easy' | 'medium' | 'hard';
  content?: Types.ObjectId[];  // Content ID array
  created_at: Date;
  isOutdated: boolean;
}

export interface Content {
  _id: string
  title: string;
  isOutdated: boolean;
  resources: { filePath: string; fileType: string; originalName: string }[];
}
interface ContentWithDownload {
  title: string;
  resources: {
    filePath: string;
    fileType: string;
    originalName: string;
  }[];
  download?: () => void; // Make download optional
}
type UserData = {
  payload: {
    username: string;
    role: 'student' | 'instructor' | 'admin';
  };
};
const backend_url = "http://localhost:3002";

const CourseDetailsAdmin = () => {
  const params = useParams();
  const courseCode = params.courseCode;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [updateMode, setUpdateMode] = useState<boolean>(false); // Toggle update form
  const [updatedCourse, setUpdatedCourse] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
  });
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleLevel, setModuleLevel] = useState<"easy" | "medium" | "hard">("easy");
  const [showForm, setShowForm] = useState(false);
  const [totalStudents, setTotalStudents] =  useState<number | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [students, setStudents] = useState<string[] | null>(null);
  const [totalRating, setTotalRating] =  useState<number | 0>();
  const [userData, setUserData] = useState<UserData | null>(null);

  const router = useRouter();

  async function fetchCourseAndModules() {
    try {
      // Fetch user data from cookies
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();
      setUserData(userData);
      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
  
      const username = userData.payload.username;
       
      // Fetch course data (handle potential 404)
      let courseData: Course | null = null;
      try {
        const courseResponse = await axiosInstance.get<Course>(`${backend_url}/courses/${courseCode}`);
        setCourse(courseResponse.data);
        courseData = courseResponse.data;
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            console.error("Course not found:", err);
            setError("Course not found. Please check the course code and try again.");
          } else {
            console.error("Error fetching course:", err);
            setError("Failed to load the course. Please try again.");
          }
        } else if (err instanceof Error) {
          console.error("Unknown error:", err);
          setError("An unknown error occurred.");
        }
        setCourse(null);
      }
  
      // Fetch modules data
      const modulesResponse = await axiosInstance.get<Module[]>(`${backend_url}/courses/${courseCode}/modulesAdmin`);
      setModules(modulesResponse.data);
  
      // Fetch total students
      const totalStudentsResponse = await axiosInstance.get<number>(`${backend_url}/progress/enrolled/${courseCode}`);
      const totalStudents = totalStudentsResponse.data || 0; // Ensure it defaults to 0 if no data is returned
      setTotalStudents(totalStudents);
      // Fetch average rating
      if (courseData && courseData._id) {
        try {
            const ratingResponse = await axiosInstance.get<number>(`${backend_url}/courses/getavg/${courseData._id}`);
            const averageRating = ratingResponse.data;
            setTotalRating(averageRating);
            console.log('Average Rating:', averageRating);
        } catch (ratingError) {
            console.error('Failed to fetch course rating:', ratingError);
            setError('Error fetching course rating.');
        
    }
      } else {
        console.error("Course ID is missing, cannot fetch rating.");
        setError("Course ID is missing, cannot fetch rating.");
      }
    } catch (err) {
      console.error("Error fetching modules:", err);
      setError("Failed to load the modules. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  

  useEffect(() => {
    fetchCourseAndModules();
  }, []);


  const handleDelete = async () => {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();
  
      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
      const username = userData.payload.username;
      await axiosInstance.put(`${backend_url}/courses/${username}/${courseCode}/delete`);
      router.push(`/admin/courses`);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to get cookie. Please try again.");
    }
  };

  const handleUpdateCourse = async () => {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();
  
      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
  
      const username = userData.payload.username;
  
      try {
        const response = await axiosInstance.get<Course>(`${backend_url}/courses/${courseCode}`);
        const currentCourse = response.data;
  
        // Prepare updated data, using current values for any missing fields
        const updatedData = {
          title: updatedCourse.title || currentCourse.title,
          description: updatedCourse.description || currentCourse.description,
          category: updatedCourse.category || currentCourse.category,
          level: updatedCourse.level || currentCourse.level,
        };
  ``
        await axiosInstance.put(`${backend_url}/courses/updateCourse/${username}/${courseCode}`, updatedData);
        setUpdateMode(false); // Hide the form
        fetchCourseAndModules(); // Refresh data
  
        // Reset updatedCourse state
        setUpdatedCourse({
          title: '',
          description: '',
          category: '',
          level: '',
        });
      } catch (err) {
        console.error("Error updating course:", err);
        setError("Failed to update the course.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to get cookie. Please try again.");
    }
  };

  const handleCreateModule =async  () => {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
      const username = userData.payload.username;
       const moduleDto ={
        title: moduleTitle,
        level: moduleLevel,
       }
       const response = await axiosInstance.put(`${backend_url}/courses/${username}/${courseCode}/modules`,moduleDto);
       const moduleCreated= response.data;
      await setModules((prev) => [...prev, moduleCreated]);

    console.log("Creating module:", { moduleTitle, moduleLevel });
    fetchCourseAndModules();
    // Reset the form and hide it
    setModuleTitle("");
    setModuleLevel("easy");
    setShowForm(false);
  } catch (err) {
    console.error("Error creating course:", err);
    setError("Failed to create course. Please try again.");
  }
  };

  const handleViewModule = (title: string) => {
    router.push(`/admin/courses/${courseCode}/viewCourse/${title}/module`);
  };

  const toggleModal = async () => {
    setModalOpen(!modalOpen);

    if (!modalOpen && students === null) {
      // Fetch students when the modal is opened
      try {
        setLoading(true);
        setError(null);
        const response =await axiosInstance.get(`${backend_url}/progress/enrolledStudents/${courseCode}`);
        const students: string[] = response.data; // API returns usernames directly
        setStudents(students);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load students.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navbar */}
      <div className="fixed w-full z-30 flex bg-white p-2 items-center justify-between h-16 px-10 shadow-md top-0 left-0">
        <div className="flex items-center space-x-6">
        <a href="/admin/users" className="text-sm md:text-md font-medium text-gray-700 hover:text-gray-900">
            Users
          </a>
          <a href="/admin/homeA" className="text-sm md:text-md font-medium text-gray-700 hover:text-gray-900">
            Dashboard
          </a>
          <a href="/admin/courses" className="text-sm md:text-md font-medium text-gray-700 hover:text-gray-900">
            Courses
          </a>
        </div>

        <div className="flex-none h-full text-center flex items-center justify-center">
          <div className="flex space-x-3 items-center px-3">
            <div className="flex-none flex justify-center">
              <div className="w-8 h-8 flex">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShta_GXR2xdnsxSzj_GTcJHcNykjVKrCBrZ9qouUl0usuJWG2Rpr_PbTDu3sA9auNUH64&usqp=CAU"
                  alt="profile"
                  className="shadow rounded-full object-cover"
                />
              </div>
            </div>
            <div className="hidden md:block text-sm md:text-md text-black">
              {userData?.payload.username}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-20">
            {updateMode ? (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Update Course</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={updatedCourse.title}
                onChange={(e) => setUpdatedCourse({ ...updatedCourse, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                value={updatedCourse.description}
                onChange={(e) => setUpdatedCourse({ ...updatedCourse, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                value={updatedCourse.category}
                onChange={(e) => setUpdatedCourse({ ...updatedCourse, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
           
            <div className="mb-4">
  <label className="block text-gray-700">Difficulty Level</label>
  <select
    value={updatedCourse.level || ""}
    onChange={(e) => setUpdatedCourse({ ...updatedCourse, level: e.target.value })}
    className="w-full px-4 py-2 border rounded-lg"
  >
    <option value="" disabled>
      Select Difficulty Level
    </option>
    <option value="easy">Easy</option>
    <option value="medium">Medium</option>
    <option value="hard">Hard</option>
  </select>
</div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  if (!updatedCourse.title && !updatedCourse.description && !updatedCourse.category && !updatedCourse.level) {
                    alert("must fill at least one field");
                    return; // Exit if any field is missing
                  }
                  handleUpdateCourse(); // Call the function to create the course
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Confirm Update
              </button>
              <button
                type="button"
                onClick={() => setUpdateMode(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : course ? (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-semibold text-blue-600 mb-4">{course.title}</h1>
          <div className="text-gray-700 mb-6">
            <p><strong>Code:</strong> {course.course_code}</p>
            <p><strong>Description:</strong> {course.description}</p>
            <p><strong>Category:</strong> {course.category}</p>
            <p><strong>Level:</strong> {course.level}</p>
           <p ><strong>
                        Course Rating:</strong>
                        {totalRating !== null ? totalRating : 'Loading...'}
                    </p>
            <p><strong>Number of Students Enrolled:</strong>{totalStudents}</p>
            <p><strong>Instructor:</strong> 
  {course.created_by ? (
    <Link href={`/profile/${course.created_by}`}>
      {course.created_by}
    </Link>
  ) : 'N/A'}
</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => setUpdateMode(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:opacity-90">
              Update Course
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white rounded-lg shadow-md hover:opacity-90 transition-all">
              Delete Course
            </button>
            <button
        onClick={() => setShowForm((prev) => !prev)}
        className="px-4 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all"
      >
        Create Module
      </button>
     
    {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Module</h3>

            <div className="mb-4">
              <label htmlFor="moduleTitle" className="block text-gray-700 font-medium mb-1">
                Module Title:
              </label>
              <input
                type="text"
                id="moduleTitle"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter module title"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="moduleLevel" className="block text-gray-700 font-medium mb-1">
                Level:
              </label>
              <select
                id="moduleLevel"
                value={moduleLevel}
                onChange={(e) => setModuleLevel(e.target.value as "easy" | "medium" | "hard")}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleCreateModule}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
              >
                Confirm Create
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all"
              >
                Cancel
              </button>
              </div>
          </div>
        </div>
            )}
            <button
        onClick={toggleModal}
        className="px-4 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all"
      >
        Enrolled Students
      </button>
       {/* Modal */}
       {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close Button */}
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enrolled Students</h2>

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && students && (
              <ul className="space-y-2">
                {students.length > 0 ? (
                  students.map((username) => (
                    <li key={username}>
                      <button
                        onClick={() => handleUserClick(username)}
                        className="text-blue-600 hover:underline w-full text-left"
                      >
                        {username}
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No students enrolled.</p>
                )}
              </ul>
            )}
          </div>
        </div>
      )}      
            </div>
          </div>
      ) : (
        <div>No course found with the specified code.</div>
      )}
       </div>

      {/* Modules Section */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modules</h2>
      {modules.length > 0 ? (
               modules.map((module) => (
                <div key={module._id} className="border-b border-gray-300 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl text-blue-600">{module.title}</h3>
                      <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-md">{module.level}</span>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <button
                        onClick={() => handleViewModule(module.title)}
                        className="px-3 py-1 bg-teal-500 text-white rounded-lg shadow-md hover:opacity-80"
                      >
                        View Module
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No modules available.</p>
            )}
          </div>
        );
};

export default CourseDetailsAdmin;