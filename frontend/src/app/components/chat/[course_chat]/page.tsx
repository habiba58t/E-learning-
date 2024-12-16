"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axiosInstance from '@/app/utils/axiosInstance';
import { ObjectId } from 'mongodb';
import axios from "axios";

const fetchUsernameFromCookies = async (): Promise<string | null> => {
    try {
        const response = await axiosInstance.get('http://localhost:3002/auth/get-cookie-data', {
            withCredentials: true,
        });
        const { userData } = response.data;
        return userData?.payload?.username || null;
    } catch (err) {
        console.error('Failed to fetch username from cookies:', err);
        return null;
    }
};


// Define the Chat type (adjust according to your backend response)
interface Chat  {
  messages: Message[];
  group_name:string
};

interface Message {
    sentBy: string;
    content: string;
    sentAt: Date;
  }

const ChatPage: React.FC = () => {
  const params = useParams(); // Unwrap params using useParams
  const course_code = params.course_chat; // Get courseCode from route params
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null); // Store the selected chat
  const [messageInput, setMessageInput] = useState<string>("");
  // Fetch chats when the course_code is available
  useEffect(() => {
    console.log("course_code:", course_code);
    if (!course_code) return; // Don't run if course_code is not available yet

    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<Chat[]>(`http://localhost:3002/group-chat/course/${course_code}`);
        console.log('Fetched chats:', response.data);
        setChats(response.data);
    
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [course_code]);

  const fetchMessages = async (groupId: string) => {
    // Check that the groupId is not undefined or empty
    if (!groupId) {
      console.error('groupId is undefined or empty');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching messages for groupId:', groupId);  // Debug log
      const response = await axiosInstance.get<Chat>(`http://localhost:3002/group-chat/${groupId}/messages`);
      setSelectedChat(response.data); // Set the selected chat and its messages
    } catch (error) {
      console.error('Error fetching group messages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading chats...</div>;

  // Send a message to the selected chat
//   const sendMessage = async () => {
//     if (selectedChat && messageInput.trim()) {
//         const username = await fetchUsernameFromCookies();
//       const newMessage: Message = {
//         content: messageInput,
//         sentBy:  username ?? "Anonymous",
//         sentAt: new Date(),
//       };

//       try {
//         // Send the message to the backend
//         await axiosInstance.post(`http://localhost:3002/group-chat/${grouo_name}/${module_title}`, {
//           group_name: selectedChat.group_name,
//           messageDto: newMessage,
//         });

//         // Update the selected chat state with the new message
//         setSelectedChat((prevChat) => {
//           if (prevChat) {
//             return {
//               group_name: prevChat.group_name,
//               messages: [...prevChat.messages, newMessage],
//             };
//           }
//           return prevChat;
//         });

//         // Clear the input field after sending
//         setMessageInput("");
//       } catch (error) {
//         console.error("Error sending message:", error);
//       }
//     }
//   };

const sendMessage = async () => {
    if (selectedChat && messageInput.trim()) {
      const username = await fetchUsernameFromCookies(); // Assuming this returns 'string | null'
  
      // Create the message data object in the correct format
      const newMessage: Message = {
        content: messageInput,
        sentBy: username ?? "Anonymous", // Fallback if username is null
       // timestamp: new Date().toISOString(), // The current timestamp
        sentAt: new Date()
      };
  
      try {
        // Call the backend API to add the message to the group
        const response = await axiosInstance.post(
          `http://localhost:3002/group-chat/${selectedChat.group_name}/message`, 
          newMessage
        );
  
        // Update the selected chat state with the new message
        setSelectedChat((prevChat) => {
          if (prevChat) {
            return {
              group_name: prevChat.group_name,
              messages: [...prevChat.messages, newMessage],  // Ensure adding a valid Message object
            };
          }
          return prevChat;
        });
  
        // Clear the input field after sending
        setMessageInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  
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
                selectedChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${message.sentBy === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex-shrink-0">
                      <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg">
                        {message.sentBy?.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="bg-blue-100 p-4 rounded-lg max-w-xs shadow-md">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold">{message.sentBy}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(message.sentAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))
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
