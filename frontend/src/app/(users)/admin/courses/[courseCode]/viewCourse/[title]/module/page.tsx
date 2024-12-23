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
  enableNotes: boolean;
}

export interface Content {
  _id: string;
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
  const [contentList, setContentList] = useState<
    { _id: string; title: string; resources: any[] }[] | null
  >(null);
  const [showForm, setShowForm] = useState(false);
  const [moduleLevel, setModuleLevel] = useState<
    "easy" | "medium" | "hard" | "Select Difficulty Level"
  >("easy");
  const [actionType, setActionType] = useState<"update" | "delete" | null>(null);

  const router = useRouter();

  async function fetchModule() {
    try {
      // Check user session
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
      const username = userData.payload.username;

      // Fetch module data
      try {
        const response = await axiosInstance.get<Module>(
          `${backend_url}/modules/mtitle/${moduleTitle}`
        );
        setModule(response.data);

        // Fetch content data
        try {
          const contentResponse = await axios.get(
            `${backend_url}/modules/${username}/${moduleTitle}/content`,
            { withCredentials: true }
          );
          const contents = contentResponse.data;

          // Add download function if resources exist
          const modifiedContent: ContentWithDownload[] = contents.map(
            (item: any) => ({
              ...item,
              download:
                item.resources && item.resources.length > 0
                  ? () =>
                      downloadFile(
                        item.resources[0].filePath,
                        item.resources[0].originalName
                      )
                  : undefined,
            })
          );

          setContentList(modifiedContent);
        } catch (err) {
          console.error("Error fetching content:", err);
          setError("Failed to fetch content. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching module:", err);
        setError("Failed to load the module. Please try again.");
      } finally {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to get cookie. Please try again.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadFile = (filePath: string, fileName: string) => {
    const anchor = document.createElement("a");
    anchor.href = `${backend_url}${filePath}`;
    anchor.download = fileName;
    anchor.click();
  };

  const handleToggleOutdated = async () => {
    if (!module) return;
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

      await axiosInstance.put(`${backend_url}/modules/toggle/${username}/${moduleTitle}`);
      setModule((prev) =>
        prev ? { ...prev, isOutdated: !prev.isOutdated } : null
      );
    } catch (err) {
      console.error("Error toggling outdated status:", err);
      setError("Failed to update module status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async () => {
    if (!module) return;
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
      const username = userData.payload.username;

      await axiosInstance.put(
        `${backend_url}/courses/${username}/${courseCode}/modules/${moduleTitle}`
      );
      router.push(`/admin/courses/${courseCode}/viewCourse`);
    } catch (err) {
      console.error("Error deleting module:", err);
      setError("Failed to delete module. Please try again.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async (moduleId: string) => {
    if (!module) return;
    if (!contentTitle || !file) {
      setError("Please provide a title and select a file.");
      return;
    }

    try {
      // Check user data
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }

      const username = userData.payload.username;
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("contentTitle", contentTitle);

      await axiosInstance.post(
        `${backend_url}/modules/${username}/${moduleId}/upload`,
        formData
      );
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
  };

  const handleDeleteContent = async (objectid: string) => {
    try {
      await axiosInstance.delete(
        `${backend_url}/content/${objectid}/${moduleTitle}/deleteContent`
      );
      fetchModule(); // Refresh after deleting
    } catch (err) {
      console.error("Error deleting content:", err);
      setError("Failed to delete content. Please try again.");
    }
  };

  const handleEnableNotes = async () => {
    if (!module) return;
    try {
      await axiosInstance.put<Module>(
        `${backend_url}/modules/toggleNote/${moduleTitle}`
      );
      fetchModule(); // Refresh after enabling/disabling notes
    } catch (err) {
      console.error("Error toggling notes:", err);
      setError("Failed to toggle notes. Please try again.");
    }
  };

  const handleUpdateModuleLevel = async () => {
    if (!module) return;
    try {
      const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
        credentials: "include",
      });
      const { userData } = await cookieResponse.json();

      if (!userData || !userData.payload?.username) {
        throw new Error("No valid user data found in cookies.");
      }
      const username = userData.payload.username;

      const moduleDto = {
        level: moduleLevel,
      };

      await axiosInstance.put<Module>(
        `${backend_url}/modules/${username}/${moduleTitle}/updateModule,moduleDto`,
        moduleDto
      );
      setModuleLevel("Select Difficulty Level");
      fetchModule();
      setShowForm(false);
    } catch (err) {
      console.error("Error updating module level:", err);
      setError("Failed to update module level. Please try again.");
    }
  };

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (loading) {
    return <div className="text-center mt-10">Loading module...</div>;
  }

  if (!module) {
    return <div className="text-center mt-10">No module found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Module Header */}
      <div className="mb-6 bg-white border border-gray-200 p-6 rounded-md shadow-md">
        <h1 className="text-3xl font-semibold text-blue-600 mb-2">
          {module.title}
        </h1>
        <p className="text-lg text-gray-700">
          <span className="font-semibold">Level:</span> {module.level}
        </p>

        <div className="flex flex-wrap gap-3 mt-4">
          {/* Toggle Outdated Button */}
          <button
            onClick={handleToggleOutdated}
            className={`
              px-4 py-2 rounded-md text-white font-semibold shadow-md hover:shadow-lg transition-transform
              transform hover:-translate-y-0.5
              ${
                module.isOutdated
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }
            `}
          >
            {module.isOutdated ? "Outdated" : "Up-to-date"}
          </button>

          {/* Update Module Button */}
          <button
            onClick={() => {
              setActionType("update");
              setShowForm(true);
            }}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
          >
            Update Module Level
          </button>

          {/* Delete Module Button */}
          <button
            onClick={handleDeleteModule}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
          >
            Delete Module
          </button>

          {/* Add Content Button */}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
          >
            Add Content
          </button>

          {/* Toggle Notes Button */}
          <button
            onClick={handleEnableNotes}
            className={`
              px-4 py-2 font-semibold rounded-md shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5
              ${
                module.enableNotes
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }
            `}
          >
            {module.enableNotes ? "Disable Notes" : "Enable Notes"}
          </button>
        </div>
      </div>

      {/* Add Content Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>

            <h2 className="text-lg font-bold mb-4">Add Content to Module</h2>

            <label className="block mb-2 text-sm font-medium">Content Title:</label>
            <input
              type="text"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
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
                className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpload(module._id)}
                className={`
                  px-4 py-2 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5
                  ${
                    isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }
                `}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Module Level Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md relative">
            {/* Close Button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Update Module Level
            </h3>
            <div className="mb-4">
              <label
                htmlFor="moduleLevel"
                className="block text-gray-700 font-medium mb-1"
              >
                Select Level:
              </label>
              <select
                id="moduleLevel"
                value={moduleLevel}
                onChange={(e) =>
                  setModuleLevel(e.target.value as "easy" | "medium" | "hard")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleUpdateModuleLevel}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                Confirm Update
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Contents Section */}
      <div className="mt-8 bg-white border border-gray-200 p-6 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contents</h2>
        {contentList && contentList.length > 0 ? (
          <ul>
            {contentList.map((content, index) => (
              <li
                key={content._id || `content-${index}`}
                className="border-b border-gray-300 py-4 flex items-center relative"
              >
                <h3 className="text-xl font-semibold text-blue-600 pr-16">
                  {content.title}
                </h3>
                {/* Delete Content Button */}
                <button
                  onClick={() => handleDeleteContent(content._id)}
                  className="absolute right-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
                >
                  Delete
                </button>

                {/* Resource List */}
                <ul className="mt-2 w-full">
                  {content.resources && content.resources.length > 0 ? (
                    content.resources.map((resource, resourceIndex) => (
                      <li
                        key={`res-${resource.filePath}-${resourceIndex}`}
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