
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import Picker from 'emoji-picker-react';

// Add user to the group when they click "Join"
const joinGroupChat = async (groupName: string, username: string, onSuccess: () => void) => {
  try {
    await axiosInstance.post(`http://localhost:3002/group-chat/${groupName}/add-user/${username}`);
    alert("Successfully joined the group!");
    onSuccess();
  } catch (error) {
    console.error("Error adding user to group:", error);
    alert("Failed to join the group.");
  }
};



// Define the Chat type (adjust according to your backend response)
interface Chat {
  messages: Message[];
  group_name: string;
  members: string[];
  course_code: string;
}

interface Message {
  sentBy: string;
  content: string;
  sentAt: Date;
}

const ChatPage: React.FC = () => {
  const params = useParams();
  const course_code = params.course_chat && typeof params.course_chat === 'string' ? params.course_chat : "";
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [showGroupForm, setShowGroupForm] = useState<boolean>(false); // New state to toggle form visibility
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);// State to track which message menu is shown
  const [menuVisible, setMenuVisible] = useState(false);
  const [isChatListChanged, setIsChatListChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [menuTimeout, setMenuTimeout] = useState<NodeJS.Timeout | null>(null);

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

  const fetchMessages = async (groupName: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Chat>(`http://localhost:3002/group-chat/${groupName}/messages`);
      setSelectedChat(response.data);
    } catch (error) {
      console.error("Error fetching group messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setEmojiPickerVisible(false);
  };

  const sendMessage = async () => {
    if (selectedChat && messageInput.trim()) {
      const newMessage: Message = {
        content: messageInput,
        sentBy: username ?? "Anonymous",
        sentAt: new Date(),
      };

      try {
        await axiosInstance.post(
          `http://localhost:3002/group-chat/${selectedChat.group_name}/message`,
          newMessage
        );

        setSelectedChat((prevChat) =>
          prevChat
            ? {
                ...prevChat,
                messages: [...prevChat.messages, newMessage],
              }
            : prevChat
        );

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


  

  useEffect(() => {
    if (showMenu) {
      // Set timeout to hide the menu after 5 seconds
      const timeout = setTimeout(() => {
        setShowMenu(null);
      }, 5000); // 5 seconds timeout
      setMenuTimeout(timeout);
    }

    return () => {
      if (menuTimeout) {
        clearTimeout(menuTimeout); // Cleanup timeout if menu is closed early
      }
    };
  }, [showMenu]);
  

  const handleDeleteGroup = async (groupName: string, username: string, course_code: string) => {
    try {
      await axiosInstance.delete(`http://localhost:3002/group-chat/${groupName}/${username}/${course_code}/delete`);

      setSelectedChat((prevChat) => 
        prevChat ? {
          ...prevChat,
          messages: prevChat.messages.filter((message) => message.sentBy !== username)
        } : prevChat
      );
      setChats((prevChats) => prevChats.filter((chat) => chat.group_name !== groupName));
      
      setErrorMessage("Group chat deleted successfully!");
      setTimeout(() => setErrorMessage(null), 5000); // Hide after 5 seconds

      if (selectedChat?.group_name === groupName) {
        setSelectedChat(null);
      }
      setMenuVisible(false);
      if (selectedChat?.group_name === groupName) {
        setSelectedChat(null); // or set it to another valid group
      }
  
      // Hide the menu after deletion
   
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete the group.");
    }
  };


  const createGroupChat = async (courseCode: string, groupName: string, createdBy: string, onSuccess: () => void) => {
    try {
      await axiosInstance.post(`http://localhost:3002/group-chat/${courseCode}`, {
        group_name: groupName,
        createdBy: createdBy,
      });
      
      setErrorMessage("Group chat created successfully!");
      setTimeout(() => setErrorMessage(null), 5000); // Hide after 5 seconds
      onSuccess();
      
      
    } catch (error) {
      setErrorMessage("Failed to create group chat.");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };
  const handleExitGroup = async (groupName: string, username: string, course_code: string) => {
    if (!username) return; // Ensure username is available
    
    try {
      // Call the backend to handle the user exit (you already have this API)
      await axiosInstance.post(`http://localhost:3002/group-chat/${groupName}/${username}/${course_code}/exit`);
  
      // After the user exits, update the chats state to remove the user from the group
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.group_name === groupName
            ? { ...chat, members: chat.members.filter((member) => member !== username) }
            : chat
        )
      );
  
      // Optionally clear the selected chat (or adjust depending on your desired behavior)
      setSelectedChat(null);
  
      setErrorMessage("You have exited the group.");
      setTimeout(() => setErrorMessage(null), 5000);
      
    } catch (error) {
      setErrorMessage("Failed to exit the group.");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  if (loading) return <div>Loading chats...</div>;

  return (
    <div className="container mx-auto px-4 py-8 flex h-screen">
      {/* Sidebar with Chat Groups */}
      <div className="w-1/4 bg-blue-600 text-white rounded-lg shadow-lg p-6 mr-6 flex flex-col">
      {/* Error Message */}
      {errorMessage && (
          <div className="bg-green-500 text-white p-2 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
        <h1 className="text-3xl font-semibold text-center mb-8">Course Chats</h1>
        {/* Create Group Form */}
        <div className="mb-4">
          <button
            className="mb-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            onClick={() => setShowGroupForm(!showGroupForm)}
          >
            {showGroupForm ? "Cancel" : "Create Group"}
          </button>
          {showGroupForm && (
            <div className="mb-4">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter new group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <button
                className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                onClick={() =>
                  createGroupChat(course_code, newGroupName, username ?? "", () => {
                    setNewGroupName(""); // Clear input after creating group
                    setShowGroupForm(false); // Hide form after creating group
                    setChats((prevChats) => [
                      ...prevChats,
                      { group_name: newGroupName, messages: [], members: [username ?? ""], course_code },
                    ]);
                  })
                }
              >
                Create Group
              </button>
            </div>
          )}
        </div>
  
        {/* Chat Groups */}
        
        <div className="space-y-4">
          {chats.length > 0 ? (
            chats.map((chat) => {
              const isMember = chat.members.includes(username || "");
              return (
                <div
                  key={chat.group_name}
                  className="bg-blue-500 p-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-all flex justify-between items-center"
                >
                  <h2
                    className={`text-xl font-bold ${isMember ? "cursor-pointer" : "cursor-default"}`}
                    onClick={() => isMember && fetchMessages(chat.group_name)}
                  >
                    {chat.group_name}
                  </h2>
  
                  {!isMember ? (
                    <button
                      className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-700"
                      onClick={() =>
                        joinGroupChat(chat.group_name, username || "", () => {
                          const updatedChats = chats.map((c) =>
                            c.group_name === chat.group_name
                              ? { ...c, members: [...c.members, username!] }
                              : c
                          );
                          setChats(updatedChats);
                        })
                      }
                    >
                      Join
                    </button>
                  ) : (
                    <div className="relative">
                      {/* 3 dots button */}
                      <button
                        onClick={() => setShowMenu(chat.group_name)}
                        className="text-white"
                      >
                        ⋮
                      </button>
  
                      {/* Menu for delete and exit */}
                      {showMenu === chat.group_name && (
                        <div className="absolute right-0 top-8 bg-white shadow-md rounded-md text-black">
                          <button
                            onClick={() => handleDeleteGroup(chat.group_name,username || "",chat.course_code)
                              
                            }
                            
                            className="px-4 py-2 text-red-500 hover:bg-gray-100"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleExitGroup(chat.group_name,username || "",chat.course_code)}
                            className="px-4 py-2 text-blue-500 hover:bg-gray-100"
                          >
                            Exit
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-300">No group chats available for this course.</div>
          )}
        </div>
      </div>
  
      {/* Main Chat Area */}
      <div className="w-3/4 flex flex-col bg-gray-50 rounded-lg shadow-lg">
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
                      <div className={`flex-1 ${isYourMessage ? "mr-4" : "ml-4"} max-w-xs`}>
                        <div
                          className={`p-4 rounded-lg shadow-md ${
                            isYourMessage ? "bg-orange-200 text-black" : "bg-blue-100 text-black"
                          }`}
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
                <span className="material-icons">send</span>
              </button>
              <button
                className="p-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600"
                onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
              >
                😊
              </button>
              {emojiPickerVisible && (
                <Picker onEmojiClick={(emojiData, event) => handleEmojiClick(emojiData.emoji)} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  
  
};

export default ChatPage;