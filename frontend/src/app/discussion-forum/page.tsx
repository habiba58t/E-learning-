'use client';
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<"student" | "instructor" | "admin">("student");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newThreadTitle, setNewThreadTitle] = useState<string>("");
  const [newThreadMessage, setNewThreadMessage] = useState<string>("");
  const [reply, setReply] = useState<{ [key: string]: string }>({});
  const [showMyThreads, setShowMyThreads] = useState<boolean>(false);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedMessage, setEditedMessage] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const cookieResponse = await fetch(`${backend_url}/auth/get-cookie-data`, {
          credentials: "include",
        });
        const { userData } = await cookieResponse.json();

        if (!userData || !userData.payload?.username || !userData.payload?.role) {
          throw new Error("No valid user data found in cookies.");
        }

        const { username, role } = userData.payload;
        setUsername(username);
        setRole(role);

        let endpoint = "";

        if (role === "student") {
          endpoint = `${backend_url}/courses/studcour/${username}/courses`;
        } else if (role === "instructor") {
          endpoint = `${backend_url}/courses/coursesInstructor/${username}`;
        }

        const response = await axiosInstance.get<Course[]>(endpoint);
        setCourseList(response.data);
      } catch (err) {
        console.error("Error fetching user data or courses:", err);
        setError("Failed to load user data or courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  const fetchForums = async (course_code: string) => {
    setLoading(true);
    setError(null); // Reset error state before starting
    console.log(username)
    try {
      // Fetch threads for the given course
      const response = await axiosInstance.get<Threads[]>(`${backend_url}/forum/course/${course_code}`);
  
      // Fetch threads and their replies in parallel
      const threadsWithReplies = await Promise.all(
        response.data.map(async (thread) => {
          try {
            // Fetch reply IDs associated with the thread
            const replyResponse = await axiosInstance.get<string[]>(`${backend_url}/forum/thread/${thread._id}/replies`);
  
            if (replyResponse.data.length === 0) {
              // If no replies are found, return the thread with an empty replies array
              return {
                ...thread,
                replies: [],
              };
            }
  
            // Fetch full reply objects in parallel
            const replies = await Promise.all(
              replyResponse.data.map(async (replyId) => {
                try {
                  const fullReplyResponse = await axiosInstance.get<Replies>(`${backend_url}/forum/reply/${replyId}`);
                  return fullReplyResponse.data; // Return the reply object
                } catch (replyError) {
                  console.error(`Error fetching reply ${replyId}:`, replyError);
                  return null; // Gracefully handle missing or failed replies
                }
              })
            );
  
            // Filter out any `null` values in the replies array
            return {
              ...thread,
              replies: replies.filter((reply): reply is Replies => reply !== null), // Type guard to filter out null
            };
          } catch (threadError) {
            console.error(`Error fetching replies for thread ${thread._id}:`, threadError);
            return {
              ...thread,
              replies: [], // Default to an empty replies array on error
            };
          }
        })
      );
  
      // Update the state with threads and their replies
      setThreads(threadsWithReplies);
    } catch (error) {
      console.error("Error fetching Threads:", error);
      setError("Failed to load Threads. Please try again.");
    } finally {
      setLoading(false); // Always stop loading indicator
    }
  };

  


  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !newThreadMessage.trim()) {
      setError("Title and message cannot be empty.");
      return;
    }

    try {
      const response = await axiosInstance.post<Threads>(`${backend_url}/forum/threads`, {
        title: newThreadTitle,
        message: newThreadMessage,
        created_by: username,
        courseId: selectedCourse,
      });

      setThreads((prevThreads) => [response.data, ...prevThreads]);
      setNewThreadTitle("");
      setNewThreadMessage("");
      setShowModal(false);
    } catch (error) {
      console.error("Error creating Thread:", error);
      setError("Failed to create thread. Please try again.");
    }
  };

  const handleCreateReply = async (threadId: string) => {
    const replyMessage = reply[threadId]?.trim();
    if (!replyMessage) {
      setError("Reply message cannot be empty.");
      return;
    }

    try {
      const response = await axiosInstance.post<Replies>(`${backend_url}/forum/replies`, {
        threadId,
        username,
        message: replyMessage,
      });

      // Update the threads state with the new reply
      setThreads((prevThreads) =>
        prevThreads.map((thread) => {
          if (thread._id === threadId) {
            return {
              ...thread,
              replies: [...(thread.replies || []), response.data]
            };
          }
          return thread;
        })
      );

      // Clear the reply input
      setReply((prevReplies) => ({
        ...prevReplies,
        [threadId]: "",
      }));
    } catch (error) {
      console.error("Failed to reply:", error);
      setError("Failed to reply. Please try again.");
    }
  };

  const handleEditThread = (threadId: string) => {
    const threadToEdit = threads.find((thread) => thread._id === threadId);
    if (threadToEdit) {
      setEditingThreadId(threadId);
      setEditedTitle(threadToEdit.title);
      setEditedMessage(threadToEdit.message);
      setShowModal(true);
    }
  };

  const handleSaveEdit = async (threadId: string) => {
    if (!editedTitle.trim() || !editedMessage.trim()) {
      setError("Title and message cannot be empty.");
      return;
    }

    try {
      await axiosInstance.patch(
        `${backend_url}/forum/${selectedCourse}/${threadId}`,
        {
          title: editedTitle,
          message: editedMessage,
          updated_by: username,
        }
      );

      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread._id === threadId
            ? { ...thread, title: editedTitle, message: editedMessage }
            : thread
        )
      );

      setEditedTitle("");
      setEditedMessage("");
      setEditingThreadId(null);
      setShowModal(false);
    } catch (error) {
      console.error("Error saving thread edit:", error);
      setError("Failed to save thread edits. Please try again.");
    }
  };

  const handleDelete = async (threadId: string) => {
    try {
      await axiosInstance.delete(`${backend_url}/forum/threads/${selectedCourse}/${threadId}`);
      setThreads((prevThreads) => prevThreads.filter((thread) => thread._id !== threadId));
      setError(null); // Clear any existing error messages
    } catch (error) {
      console.error("Error deleting thread:", error);
      setError("Failed to delete the thread. Please try again.");
    }
  };

  const filteredThreads = threads
    .filter((thread) => {
      const titleMatches = thread.title && searchTerm
        ? thread.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return showMyThreads
        ? thread.created_by === username && titleMatches
        : titleMatches;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-white">
        {/* Sidebar for Courses */}
        <div className="w-full md:w-1/4 p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Courses</h2>
          <ul>
            {courseList.length > 0 ? (
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
    
        {/* Main Content for Threads */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-800">Discussion Forum</h1>
            <div className="space-x-2">
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create Thread
              </button>
              <button
                onClick={() => setShowMyThreads((prev) => !prev)}
                className={`px-4 py-2 rounded ${
                  showMyThreads ? "bg-blue-700 text-white" : "bg-gray-300 text-black"
                }`}
              >
                {showMyThreads ? "Show All Threads" : "Show My Threads"}
              </button>
            </div>
          </div>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded mb-6"
            placeholder="Search Threads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
    
          {/* Thread List */}
          {loading ? (
            <p className="text-gray-500">Loading threads...</p>
          ) : threads.length > 0 ? (
            <ul className="space-y-6">
              {filteredThreads.map((thread) => (
                <li
                  key={thread._id}
                  className="border p-4 rounded shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800">{thread.title}</h3>
                      <p className="text-sm text-gray-500">
                        Created by <span className="font-bold">{thread.created_by}</span> on{" "}
                        {new Date(thread.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    {(thread.created_by === username || role==='instructor')  && (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleEditThread(thread._id)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(thread._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2">{thread.message}</p>
    
                  {/* Display replies */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800">Replies</h4>
                    <ul className="space-y-2 mt-2">
                      {thread.replies && thread.replies.length > 0 ? (
                        thread.replies.map((reply) => (
                          <li key={reply._id} className="bg-gray-100 p-2 rounded">
                            <p className="text-sm text-gray-600">
                              <span className="font-bold">{reply.username}</span> replied on{" "}
                              {new Date(reply.timestamp).toLocaleString()}
                            </p>
                            <p className="text-gray-800">{reply.message}</p>
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500">No replies yet.</p>
                      )}
                    </ul>
    
                    {/* Reply input */}
                    <div className="mt-4">
                      <textarea
                        className="w-full p-2 border rounded"
                        rows={2}
                        placeholder="Write a reply..."
                        value={reply[thread._id] || ""}
                        onChange={(e) =>
                          setReply((prevReplies) => ({
                            ...prevReplies,
                            [thread._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        onClick={() => handleCreateReply(thread._id)}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No threads found.</p>
          )}
        </div>
    
        {/* Create/Edit Thread Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-xl font-semibold mb-4">
                {editingThreadId ? "Edit Thread" : "Create Thread"}
              </h2>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded mb-4"
                placeholder="Title"
                value={editingThreadId ? editedTitle : newThreadTitle}
                onChange={(e) =>
                  editingThreadId
                    ? setEditedTitle(e.target.value)
                    : setNewThreadTitle(e.target.value)
                }
              />
              <textarea
                className="w-full px-3 py-2 border rounded mb-4"
                rows={4}
                placeholder="Message"
                value={editingThreadId ? editedMessage : newThreadMessage}
                onChange={(e) =>
                  editingThreadId
                    ? setEditedMessage(e.target.value)
                    : setNewThreadMessage(e.target.value)
                }
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingThreadId(null);
                    setEditedTitle("");
                    setEditedMessage("");
                  }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    editingThreadId ? handleSaveEdit(editingThreadId) : handleCreateThread()
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingThreadId ? "Save Changes" : "Create Thread"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }