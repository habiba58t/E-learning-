"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";

const fetchUsernameFromCookies = async (): Promise<string | null> => {
  try {
    const response = await axiosInstance.get("http://localhost:3002/auth/get-cookie-data", {
      withCredentials: true,
    });
    const { userData } = response.data;
    return userData?.payload?.username || null;
  } catch (err) {
    console.error("Failed to fetch username from cookies:", err);
    return null;
  }
};


// Add user to the group when they click "Join"
const joinGroupChat = async (groupName: string, username: string) => {
  try {
    await axiosInstance.post(`http://localhost:3002/group-chat/${groupName}/add-user/${username}`);
    alert("Successfully joined the group!");
  } catch (error) {
    console.error("Error adding user to group:", error);
    alert("Failed to join the group.");
  }
};

// Define the Chat type (adjust according to your backend response)
interface Chat {
  messages: Message[];
  group_name: string;
  members: string[]
}

interface Message {
  sentBy: string;
  content: string;
  sentAt: Date;
}

const ChatPage: React.FC = () => {
  const params = useParams();
  const course_code = params.course_chat;
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const usernameFromCookies = await fetchUsernameFromCookies();
      setUsername(usernameFromCookies);
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    if (!course_code) return;

    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<Chat[]>(`http://localhost:3002/group-chat/course/${course_code}`);
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [course_code]);

  const fetchMessages = async (groupId: string) => {
    if (!groupId) {
      console.error("groupId is undefined or empty");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get<Chat>(`http://localhost:3002/group-chat/${groupId}/messages`);
      setSelectedChat(response.data);
    } catch (error) {
      console.error("Error fetching group messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (selectedChat && messageInput.trim()) {
      const newMessage: Message = {
        content: messageInput,
        sentBy: username ?? "Anonymous",
        sentAt: new Date(),
      };

      try {
        const response = await axiosInstance.post(
          `http://localhost:3002/group-chat/${selectedChat.group_name}/message`,
          newMessage
        );

        setSelectedChat((prevChat) => {
          if (prevChat) {
            return {
              group_name: prevChat.group_name,
              messages: [...prevChat.messages, newMessage],
              members: prevChat.members,
            };
          }
          return prevChat;
        });

        setMessageInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Polling for new messages
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (selectedChat) {
      interval = setInterval(async () => {
        try {
          const response = await axiosInstance.get<Chat>(`http://localhost:3002/group-chat/${selectedChat.group_name}/messages`);

          // Compare new messages with the current state to prevent unnecessary updates
          if (JSON.stringify(response.data.messages) !== JSON.stringify(selectedChat.messages)) {
            setSelectedChat({
              ...selectedChat,
              messages: response.data.messages,
            });
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }, 1000); // Poll every 1 second
    }

    return () => {
      if (interval) clearInterval(interval); // Cleanup interval on unmount or selectedChat change
    };
  }, [selectedChat]);

  if (loading) return <div>Loading chats...</div>;

  return (
    <div className="container mx-auto px-4 py-8 flex h-screen">
      {/* Sidebar with Chat Groups */}
      <div className="w-1/4 bg-blue-600 text-white rounded-lg shadow-lg p-6 mr-6 flex flex-col">
        <h1 className="text-3xl font-semibold text-center mb-8">Course Chats</h1>
        {/* Chat Groups */}
        <div className="space-y-4">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.group_name}
                className="bg-blue-500 p-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-all"
                onClick={() => fetchMessages(chat.group_name)} // Fetch messages for the selected chat
              >
                <h2 className="text-xl font-bold">{chat.group_name}</h2>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-300">No group chats available for this course.</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-3/4 flex flex-col bg-gray-50 rounded-lg shadow-lg">
        {/* Selected Chat Messages */}
        {selectedChat && (
          <div className="flex flex-col p-6 h-full overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-blue-600">{selectedChat.group_name}</h2>
              <span className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((message, index) => {
                  const isYourMessage = message.sentBy === username;

                  return (
                    <div
                      key={index}
                      className={`flex items-start ${isYourMessage ? "justify-end" : "justify-start"}`}
                    >
                      {!isYourMessage && (
                        <div className="flex-shrink-0">
                          <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">
                            {message.sentBy?.charAt(0)}
                          </div>
                        </div>
                      )}
                      <div
                        className={`flex-1 ${isYourMessage ? "mr-4" : "ml-4"} max-w-xs`}
                      >
                        <div
                          className={`p-4 rounded-lg shadow-md ${isYourMessage ? "bg-orange-200 text-black" : "bg-blue-100 text-black"}`}
                        >
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">
                              {isYourMessage ? "You" : message.sentBy}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(message.sentAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500">No messages in this group yet.</div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex items-center space-x-4 mt-4 border-t pt-4">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-all"
                onClick={sendMessage} // Send the message
              >
                <span className="material-icons">send</span> {/* You can use any icon */}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
  


export default ChatPage;
