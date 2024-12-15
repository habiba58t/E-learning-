'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";
import { Types } from 'mongoose';
import axios, { AxiosError } from 'axios';

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

const backend_url = "http://localhost:3002";

const CourseDetails = () => {
  const params = useParams();
  const courseCode = params.courseCode;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleContents, setModuleContents] = useState<Record<string, { resources: { filePath: string; fileType: string; originalName: string }[] }>>({});
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
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [contentDetails, setContentDetails] = useState<Record<string, Content[]>>({});
  const [contentList, setContentList] = useState<{ title: string; resources: any[] }[] | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [contentTitle, setContentTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  const router = useRouter();

  async function fetchCourseAndModules() {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();
  
      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
  
      const username = userData.payload.username;
  
      // Fetch course data (handle potential 404)
      try {
        const courseResponse = await axiosInstance.get<Course>(`${backend_url}/courses/${courseCode}`);
        setCourse(courseResponse.data);
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
      const modulesResponse = await axiosInstance.get<Module[]>(`${backend_url}/courses/${username}/${courseCode}/modulesInstructor`);
      setModules(modulesResponse.data);

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

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

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
      router.push(`/components/instructor/courses`);
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


  const toggleModuleContent = (moduleId: string) => {
    setModuleContents(prev => ({
      ...prev,
      [moduleId]: prev[moduleId]  //if module already exist in previous list (shown)in make it not shown and vise verca
        ? { resources: [] }  
        : { resources: [{ filePath: '', fileType: '', originalName: '' }] }, // Set default content structure when showing
    }));
  };
  const fetchModuleContent = async (moduleId: string) => {
    try {
      const response = await axiosInstance.get(`${backend_url}/modules/${moduleId}/content`);
      setModuleContents(prev => ({
        ...prev,
        [moduleId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching module content:", error);
      setError("Failed to fetch module content.");
    }
  };


//  // Handle module expand/collapse
//  const toggleModule = (moduleId: string, contentIds: Types.ObjectId[]) => {
//   const isExpanded = expandedModule === moduleId;  //stor module id the one that are expanded
//   setExpandedModule(isExpanded ? null : moduleId);  //if it's already expanded set it b false and vise verca

//   if (!isExpanded && !contentDetails[moduleId]) {
//     fetchContentDetails(moduleId, contentIds);
//   }
// };


// Fetch content details for a specific module
async function fetchContentDetails(moduleId: string, contentIds: Types.ObjectId[]) {
  try {
    const responses = await Promise.all(
      contentIds.map((id) => axiosInstance.get<Content>(`${backend_url}/contents/${id}`))
    );
    setContentDetails((prev) => ({
      ...prev,
      [moduleId]: responses.map((res) => res.data),
    }));
  } catch (err) {
    console.error("Error fetching content details:", err);
  }
}  

const handleToggleOutdated = async (title: string) => {
  try {
      // Fetch user data from cookie
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const username = userData.payload.username;
      
  
      await axiosInstance.put<Module>(`${backend_url}/modules/toggle/${username}/${title}`);
      setModules((prevModules) =>
        prevModules.map((module) =>
          module.title === title
            ? { ...module, isOutdated: !module.isOutdated } // Toggle the 'isOutdated' status
            : module
        )
      );

} catch (err) {
  console.error("Error fetching data:", err);
  setError("Failed to load courses. Please try again.");
} finally {
  setLoading(false);
}
};


  const handleQuestion = (moduleId: string) => {
    router.push(`/components/instructor/courses/${courseCode}/Question/${moduleId}`);
  };

  const handleQuiz = (moduleId: string) => {
    router.push(`/components/instructor/courses/${courseCode}/Quiz/${moduleId}`);
  };

  const toggleContentDisplay = async (moduleId: string) => {
    console.log(moduleId);
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();
  
      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
      const username = userData.payload.username;
  
      if (isExpanded) {  //global variables bug
        // Collapse content
        setIsExpanded(false);
        setContentList(null);
      } else {
        // Expand content and fetch data
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `${backend_url}/modules/${username}/${moduleId}/content`,
            { withCredentials: true }
          );
  
          const contents = response.data;
  
          // Ensure each content item has the `download` function if resources exist
          const modifiedContent: ContentWithDownload[] = contents.map((item: any) => ({
            ...item, // Keep all the existing properties from the content
            download: item.resources && item.resources.length > 0
              ? () => downloadFile(item.resources[0].filePath, item.resources[0].originalName)
              : undefined, // Set to undefined if no resources
          }));
  
          // Now, set the modified content
          setContentList(modifiedContent);
          setIsExpanded(true);
        } catch (err) {
          console.error("Error fetching content:", err);
          setError("Failed to fetch content. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to get cookie. Please try again.");
    }
  };
  
  const downloadFile = (filePath: string, fileName: string) => {
    const anchor = document.createElement("a");
    anchor.href = `${backend_url}${filePath}`; // Combine backend URL and file path
    anchor.download = fileName; // Suggest filename for download
    anchor.click();
  };
  
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (moduleId: string) => {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();
  
      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
      const username = userData.payload.username;
  
      // Validate inputs
      if (!contentTitle || !file) {
        setError("Please provide a title and select a file.");
        return;
      }
  
      setError(null);
      setIsUploading(true);
  
      const formData = new FormData();
      formData.append("file", file);
      formData.append("contentTitle", contentTitle);
      
     console.log("module id from this:", moduleId);
     console.log("Yalhwy!")
      try {
        const response = await axios.post(
          `${backend_url}/modules/${username}/${moduleId}/upload`,
          formData,
          { withCredentials: true } // Ensure credentials are sent
        );
  
        alert(response.data.message); // Show success message
  
        // Fetch updated content list after successful upload
        try {
          const contentResponse = await axios.get(
            `${backend_url}/modules/${username}/${moduleId}/content`,
            { withCredentials: true }
          );
          setContentList(contentResponse.data); // Populate content list
          setIsExpanded(true);
        } catch (err) {
          console.error("Error fetching content:", err);
          setError("Failed to fetch content. Please try again.");
        } finally {
          setLoading(false);
        }
        setShowModal(false); // Close the modal
        setContentTitle("");
        setFile(null);
      } catch (err: unknown) {
        console.error("Error uploading content:", err);
        // Check if the error is an AxiosError
        if (err instanceof AxiosError) {
          // If the error is an AxiosError, check for a response and set the error message
          setError(err.response?.data.message || "Failed to upload content. Please try again.");
        } else {
          // For other types of errors, set a generic error message
          setError("Failed to upload content. Please try again.");
        }
      } finally {
        setIsUploading(false);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to get cookie. Please try again.");
    }
  };

  const handleViewModule = (title: string) => {
    router.push(`/components/instructor/courses/${courseCode}/viewCourse/${title}/module`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
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
            <p><strong>Average Rating:</strong> {course.averageRating ?? 'N/A'}</p>
            <p><strong>Number of Students Enrolled:</strong> {course.totalStudents ?? 'N/A'}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => setUpdateMode(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:opacity-90">
              Update Course
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white rounded-lg shadow-md hover:opacity-90 transition-all">
              Delete Course
            </button>
            <button onClick={() => router.push(`/courses/${courseCode}/create-module`)} className="px-4 py-2 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all">
              Create Module
            </button>
            <div className="relative">
              <button onClick={toggleDropdown} className="px-4 py-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:opacity-90 transition-all">
                Enrolled Students
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-md">
                  <button onClick={() => router.push(`/courses/${courseCode}/students`)} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">
                    View Enrolled Students
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>No course found with the specified code.</div>
      )}

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

export default CourseDetails;