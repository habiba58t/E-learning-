"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";

const backend_url = "http://localhost:3002";

export interface Threads {
  _id: string;
  title: string;
  message: string;
  replies: Replies[];
  timestamp: Date;
  created_by: string;
}

export interface Replies {
  _id: string;
  username: string;
  message: string;
  timestamp: Date;
}

export interface Course {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  created_by: string;
}

export default function ForumPage() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [threads, setThreads] = useState<Threads[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newThreadTitle, setNewThreadTitle] = useState<string>("");
  const [newThreadMessage, setNewThreadMessage] = useState<string>("");

  // For handling replies
  const [repliesInput, setRepliesInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCookieData = async () => {
      setLoading(true);
      try {
        const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
          credentials: "include",
        });
        const { userData } = await cookieResponse.json();
        const username = userData?.payload?.username;

        if (!username) throw new Error("No valid user data found in cookies.");
        setUsername(username);

        const response = await axiosInstance.get<Course[]>(
          `${backend_url}/courses/coursesInstructor/${username}`
        );
        setCourseList(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCookieData();
  }, []);

  const fetchForums = async (course_code: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Threads[]>(
        `${backend_url}/forum/course/${course_code}`
      );
      setThreads(response.data);
    } catch (err) {
      console.error("Error fetching threads:", err);
      setError("Failed to load threads.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !newThreadMessage.trim()) {
      setError("Title and message cannot be empty.");
      return;
    }

    if (!selectedCourse) {
      setError("Please select a course before creating a thread.");
      return;
    }

    try {
      const response = await axiosInstance.post<Threads>(
        `${backend_url}/forum/threads`,
        {
          title: newThreadTitle,
          message: newThreadMessage,
          created_by: username,
          course_code: selectedCourse,
        }
      );

      setThreads((prevThreads) => [response.data, ...prevThreads]);
      setNewThreadTitle("");
      setNewThreadMessage("");
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error("Error creating thread:", err);
      setError("Failed to create thread. Please try again.");
    }
  };

  const handleCreateReply = async (threadId: string) => {
    const replyMessage = repliesInput[threadId];
    if (!replyMessage.trim()) return;

    try {
      const response = await axiosInstance.post<Replies>(
        `${backend_url}/forum/replies`,
        {
          threadId,
          username,
          message: replyMessage,
        }
      );

      const newReply = response.data;
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread._id === threadId
            ? { ...thread, replies: [...thread.replies, newReply] }
            : thread
        )
      );

      // Clear the reply input for this thread
      setRepliesInput((prevReplies) => ({ ...prevReplies, [threadId]: "" }));
    } catch (error) {
      console.error("Failed to reply:", error);
      setError("Failed to reply. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-1/4 p-6 bg-blue-50">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Courses</h2>
        <ul>
          {loading ? (
            <p className="text-blue-600">Loading...</p>
          ) : courseList.length > 0 ? (
            courseList.map((course) => (
              <li
                key={course._id}
                className={`cursor-pointer p-2 rounded ${
                  selectedCourse === course.course_code
                    ? "bg-blue-200 font-bold text-blue-800"
                    : "text-black"
                }`}
                onClick={() => {
                  setSelectedCourse(course.course_code);
                  fetchForums(course.course_code);
                }}
              >
                {course.title}
              </li>
            ))
          ) : (
            <p className="text-black">No courses available.</p>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Discussion Forum</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Thread
          </button>
        </div>
        <input
          type="text"
          className="w-full p-2 border border-blue-300 rounded mb-6 text-black"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <p className="text-blue-600">Loading...</p>
        ) : threads.length > 0 ? (
          threads
            .filter((thread) =>
              thread.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((thread) => (
              <div key={thread._id} className="bg-white p-4 mb-4 rounded shadow">
                <h2 className="text-xl font-semibold text-blue-800">{thread.title}</h2>
                <p className="text-black">{thread.message}</p>

                {/* Replies */}
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-blue-800">Replies</h3>
                  {thread.replies.length > 0 ? (
                    thread.replies.map((reply) => (
                      <div key={reply._id} className="p-2 border-b">
                        <p className="text-black">{reply.message}</p>
                        <p className="text-sm text-gray-500">- {reply.username}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No replies yet.</p>
                  )}
                </div>

                {/* Add Reply */}
                <textarea
                  className="w-full mt-2 p-2 border rounded text-black"
                  placeholder="Add a reply..."
                  value={repliesInput[thread._id] || ""}
                  onChange={(e) =>
                    setRepliesInput({
                      ...repliesInput,
                      [thread._id]: e.target.value,
                    })
                  }
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
                  onClick={() => handleCreateReply(thread._id)}
                >
                  Submit Reply
                </button>
              </div>
            ))
        ) : (
          <p className="text-black">No threads available for this course.</p>
        )}
      </div>

      {/* Create Thread Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4 text-blue-800">Create New Thread</h2>
            {error && <p className="text-red-500">{error}</p>}
            <input
              type="text"
              placeholder="Thread Title"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              className="border w-full p-2 rounded mb-2 text-black"
            />
            <textarea
              placeholder="Thread Message"
              value={newThreadMessage}
              onChange={(e) => setNewThreadMessage(e.target.value)}
              className="border w-full p-2 rounded mb-4 text-black"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateThread}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
