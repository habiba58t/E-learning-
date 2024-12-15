'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";
import axios, { AxiosError } from 'axios';

export interface Module {
  _id: string;
  title: string;
  level: 'easy' | 'medium' | 'hard';
  isOutdated: boolean;
  content: ContentWithDownload[];
}

export interface Content {
    _id: string
    title: string;
    isOutdated: boolean;
    resources: { filePath: string; fileType: string; originalName: string }[];
  }

  interface ContentWithDownload extends Content {
    download?: () => void; // Optional, as some contents may not have resources
  }

const backend_url = "http://localhost:3002";

const ModulePage = () => {
  const params = useParams();
  const courseCode = params.courseCode;
  const moduleTitle = params.title;

  const [module, setModule] = useState<Module | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [contentTitle, setContentTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [contentList, setContentList] = useState<{   _id: string,title: string; resources: any[] }[] | null>(null);

  const router = useRouter();

  async function fetchModule() {
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();
  
      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
      const username = userData.payload.username;
    console.log("moduleTitle:", moduleTitle);
    try {
      const response = await axiosInstance.get<Module>(`${backend_url}/modules/mtitle/${moduleTitle}`);
      console.log("module in response:",response.data); //till here ok
      setModule(response.data);
      console.log("module yarab:",module);
  
      // Log the fetched module data for debugging
      console.log("Fetched moduleData:", module);
      try {
        const response = await axios.get(
          `${backend_url}/modules/${username}/${moduleTitle}/content`,
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
  
      // Set the transformed module with modified contents
   //   setModule({ ...moduleData, content: modifiedContents });
    } catch (err) {
      console.error("Error fetching module:", err);
      setError("Failed to load the module. Please try again.");
    } finally {
      setLoading(false);
    }
  } catch (err) {
    console.error("Error fetching content:", err);
    setError("Failed to fetch content. Please try again.");
  } finally {
    setLoading(false);
  }
} catch (err) {
  console.error("Error fetching data:", err);
  setError("Failed to get cookie. Please try again.");
}
  }
  useEffect(() => {
    fetchModule();
  }, []);

  const downloadFile = (filePath: string, fileName: string) => {
    const anchor = document.createElement("a");
    anchor.href = `${backend_url}${filePath}`;
    anchor.download = fileName;
    anchor.click();
  };

  const handleToggleOutdated = async () => {
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
    if (!module) return;

    try {
      await axiosInstance.put(`${backend_url}/modules/toggle/${username}/${moduleTitle}`);
      setModule((prev) => prev ? { ...prev, isOutdated: !prev.isOutdated } : null);
    } catch (err) {
      console.error("Error toggling outdated status:", err);
      setError("Failed to update module status. Please try again.");
    }
} catch (err) {
    console.error("Error fetching data:", err);
    setError("Failed to load courses. Please try again.");
  } finally {
    setLoading(false);
  }
  };

  const handleDeleteModule = async () => {
  try {
    const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
      credentials: "include",
    });
    const { userData } = await cookieResponse.json();

    if (!userData || !userData.payload?.username) {
      throw new Error("No valid user data found in cookies.");
    }
    const username = userData.payload.username;
    await axiosInstance.put(`${backend_url}/courses/${username}/${courseCode}/modules/${moduleTitle}`);
    fetchModule();
  } catch (err) {
    console.error("Error fetching data:", err);
    setError("Failed to get cookie. Please try again.");
  }
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
    if (!module) return;
    if (!contentTitle || !file) {
      setError("Please provide a title and select a file.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("contentTitle", contentTitle);

      await axiosInstance.post(`${backend_url}/modules/${username}/${moduleId}/upload`, formData);
      setContentTitle("");
      setFile(null);
      setShowModal(false);
      fetchModule(); // Refresh module data after upload
    } catch (err) {
      console.error("Error uploading content:", err);
      setError("Failed to upload content. Please try again.");
    } finally {
      setIsUploading(false);
    }
} catch (err) {
    console.error("Error fetching data:", err);
    setError("Failed to get cookie. Please try again.");
  }
  };

  const handleQuestion = (moduleId: string) => {
    router.push(`/components/instructor/courses/${courseCode}/Question/${moduleId}`);
  };

  const handleQuiz = (moduleId: string) => {
    router.push(`/components/instructor/courses/${courseCode}/Quiz/${moduleId}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loading) {
    return <div>Loading module...</div>;
  }

  if (!module) {
    return <div>No module found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-blue-600 mb-4">{module.title}</h1>
        <p className="text-lg text-gray-700">Level: {module.level}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={handleToggleOutdated}
            className={`px-3 py-1 rounded-lg text-white ${module.isOutdated ? 'bg-red-500' : 'bg-green-500'} shadow-md hover:opacity-80`}
          >
            {module.isOutdated ? 'Outdated' : 'Up-to-date'}
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-lg shadow-md hover:opacity-80"
          >
            Update Module
          </button>
          <button
            onClick={handleDeleteModule}
            className="px-3 py-1 bg-red-500 text-white rounded-lg shadow-md hover:opacity-80"
          >
            Delete Module
          </button>
          <button
            onClick={() => handleQuiz(module._id)}
            className="px-3 py-1 bg-purple-500 text-white rounded-lg shadow-md hover:opacity-80"
          >
            Take Quiz
          </button>
          <button
            onClick={() => handleQuestion(module._id)}
            className="px-3 py-1 bg-indigo-500 text-white rounded-lg shadow-md hover:opacity-80"
          >
            Question Bank
          </button>
          <button
          className="px-3 py-1 rounded-lg bg-blue-500 text-white shadow-md hover:opacity-80"
          onClick={() => setShowModal(true)}
        >
          Add Content
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <h2 className="text-lg font-bold mb-4">Add Content to Module</h2>

              <label className="block mb-2 text-sm font-medium">Content Title:</label>
              <input
                type="text"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Enter content title"
              />

              <label className="block mb-2 text-sm font-medium">Select File:</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mb-4"
                accept=".jpg,.png,.pdf,.docx,.mp4,.zip"
              />

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                   onClick={() => handleUpload(module._id)}
                  className={`px-4 py-2 rounded-lg text-white ${isUploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        )}
          <button
            className="px-3 py-1 bg-orange-500 text-white rounded-lg shadow-md hover:opacity-80"
          >
            Delete Content
          </button>
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded-lg shadow-md hover:opacity-80"
          >
            Enable Notes
          </button>
        </div>
      </div>
 
      <div className="mt-8">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contents</h2>
  {contentList && contentList.length > 0 ? (
    <ul>
      {contentList.map((content, index) => (
        <li
          key={content._id || `content-${index}`}
          className="border-b border-gray-300 py-4"
        >
          <h3 className="text-xl font-semibold text-blue-600">
            {content.title}
          </h3>
          <ul className="mt-2">
            {content.resources && content.resources.length > 0 ? (

              content.resources.map((resource, resourceIndex) => (
                <li
                  key={`${content._id || "no-id"}-${resource.filePath}-${resourceIndex}`}
                  className="flex items-center gap-2"
                >
                  <a
                    href={`${backend_url}${resource.filePath}`}
                    download
                    className="text-blue-500 hover:underline"
                  >
                    {resource.originalName} ({resource.fileType})
                  </a>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No resources available.</li>
            )}
          </ul>
          
        </li>
      ))}
    </ul>
  ) : (
    <p>No contents available.</p>
  )}
</div>

    </div>
  );
};

export default ModulePage;
