'use client'
import { useEffect, useState } from "react";
import axiosInstance from "@/app/utils/axiosInstance";

const backend_url = "http://localhost:3002";

export interface Threads {
  _id: string;
  title: string;
  message: string;
  replies: Replies[]; // Changed from string[] for direct reply access
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
  category: string;
  level: "easy" | "medium" | "hard";
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

export default function ForumPage() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [threads, setThreads] = useState<Threads[]>([]);
  const [newReply, setNewReply] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchCookieData = async () => {
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

        const response = await axiosInstance.get<Course[]>(
          `${backend_url}/courses/coursesInstructor/${username}`
        );
        setCourseList(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCookieData();
  }, []);

  const fetchForums = async (course_code: string) => {
    try {
      const response = await axiosInstance.get<Threads[]>(
        `${backend_url}/forum/course/${course_code}`
      );
      setThreads(response.data);
    } catch (err) {
      console.error("Error fetching Threads:", err);
      setError("Failed to load Threads. Please try again.");
    }
  };

  const handleCreateReply = async (threadId: string, replyMessage: string) => {
    if (!replyMessage.trim()) return; // Prevent empty replies

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

      // Update the threads state to include the new reply
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread._id === threadId
            ? { ...thread, replies: [...thread.replies, newReply] }
            : thread
        )
      );
      setNewReply(""); // Reset reply input
    } catch (error) {
      console.error("Failed to reply:", error);
      setError("Failed to reply. Please try again.");
    }
  };

  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/4 p-6 bg-blue-50">
        <h2 className="text-xl font-semibold mb-4">Courses</h2>
        <ul>
          {courseList.map((course) => (
            <li
              key={course._id}
              className={`cursor-pointer p-2 rounded ${
                selectedCourse === course.course_code ? "bg-blue-200" : ""
              }`}
              onClick={() => {
                setSelectedCourse(course.course_code);
                fetchForums(course.course_code);
              }}
            >
              {course.title}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Discussion Forum</h1>
        <input
          type="text"
          className="w-full p-2 border border-blue-300 rounded mb-6"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="space-y-6">
            {filteredThreads.map((thread) => (
              <div
                key={thread._id}
                className="bg-white p-6 rounded-lg shadow-lg border border-blue-200"
              >
                <h2 className="text-2xl font-semibold text-blue-900">{thread.title}</h2>
                <p className="text-blue-700 mb-4">{thread.message}</p>
                <div className="space-y-2">
                  <h3 className="font-bold text-blue-800">Replies:</h3>
                  {thread.replies.map((reply) => (
                    <div
                      key={reply._id}
                      className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <p className="text-blue-800">{reply.message}</p>
                      <p className="text-sm text-blue-500">- {reply.username}</p>
                    </div>
                  ))}
                </div>
                <textarea
                  className="w-full p-2 border border-blue-300 rounded mb-2"
                  placeholder="Add a reply..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                ></textarea>
                <button
                  onClick={() => handleCreateReply(thread._id, newReply)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit Reply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
