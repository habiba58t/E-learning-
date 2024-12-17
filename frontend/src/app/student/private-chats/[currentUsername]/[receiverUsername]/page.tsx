"use client"

import axiosInstance from '@/app/utils/axiosInstance';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ChatData {
  member1: string;
  member2: string;
  Message: MessageData[];
  _id: string;
}

interface MessageData {
  content: string;
  sentBy: string;
  sentAt: Date;
}

const ChatPage = () => {
  const { currentUsername, receiverUsername } = useParams();
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [chat, setChat] = useState<MessageData[]>([]); // Initialize with empty array
  const [users, setUsers] = useState<string[]>([]);  // Initialize with empty array
  const [currentChatId, setCurrentChatId] = useState<string | null>(null); // Store the current chat ID

  const fetchCookieData = async () => {
    try {
      const response = await fetch('http://localhost:3002/auth/get-cookie-data', {
        credentials: 'include',
      });
      const { userData } = await response.json();

      if (!userData?.payload?.username) {
        console.error('No cookie data found');
        setError('No cookie data found');
        return;
      }

      const user = userData.payload.username;
      setUsername(user);
      console.log('User logged in:', user);

      // Fetch chat with selected user
      const createChat = await axiosInstance.post(`http://localhost:3002/private-chat/create/${currentUsername}/${receiverUsername}`)
      const messages = createChat.data.Message;
      setChat(messages);
      console.log(messages)
      setCurrentChatId(createChat.data._id); // Save the chat ID

      // Fetch all users for left panel (chat list)
      const myChats = await axiosInstance.get<ChatData[]>(`http://localhost:3002/private-chat/user/${currentUsername}`);
      const otherMembers = myChats.data.map(chat => chat.member1 === currentUsername ? chat.member2 : chat.member1);
      const uniqueUsers = [...new Set(otherMembers)]; // Remove duplicate usernames
      setUsers(uniqueUsers);
      

    } catch (err) {
      console.error('Error fetching cookie data:', err);
      setError('Error fetching cookie data');
    }
  };

  useEffect(() => {
  //  if (currentUsername && receiverUsername) {
      fetchCookieData();
    
  }, [currentUsername, receiverUsername]);
  
  // Handle sending a message
  const handleSentMessage = async (content: string) => {
    console.log(currentUsername)
    console.log(currentUsername)
    if (!content || !currentChatId) return;
    //console.log(currentUsername)
    const message = {
      content,
      sentBy: currentUsername,
    };

    try {
      // Send the message to the backend
      const response = await axiosInstance.post(`http://localhost:3002/private-chat/${currentChatId}/message`,  message );
      console.log(response.data)
      // After sending the message, update the chat with the new messages
      setChat(response.data.messages);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Error sending message');
    }
  };


  const handleUserClick = async (selectedUser: string) => {
    try {
      const chatData = await axiosInstance.get<ChatData>(`http://localhost:3002/private-chat/get-chat/${currentUsername}/${selectedUser}`);
      setChat(chatData.data.Message); // Update chat messages
      setCurrentChatId(chatData.data._id); // Update the current chat ID
    } catch (error) {
      console.error('Error opening chat:', error);
      setError('Error opening chat');
    }
  };

  
  useEffect(() => {
    // This useEffect will re-fetch the chat whenever a new message is sent
    if (currentChatId) {
      const fetchUpdatedChat = async () => {
        try {
          const getChatResponse = await axiosInstance.get<ChatData>(`http://localhost:3002/private-chat/get-chat/${currentUsername}/${receiverUsername}`);
          const updatedMessages = getChatResponse.data.Message;
          setChat(updatedMessages);
        } catch (error) {
          console.error('Error fetching updated chat:', error);
        }
      };

      fetchUpdatedChat();
    }
  }, [chat]); // This will run whenever the `chat` state changes (after sending a message)

  //repeat one for receiving a message by polling using use effect
  return (
    <div className="flex h-screen">
      {/* Left Panel - Users List */}
      <div className="w-1/4 bg-gray-300 p-4">
        <h2 className="text-xl font-semibold text-blue-500">Chats</h2>
        <div className="mt-4 space-y-2">
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <div key={index} 
                className="p-2 cursor-pointer hover:bg-gray-200 rounded text-blue-500" 
                onClick={() => handleUserClick(user)}
                >
              <span className="font-medium">{user}</span>
              </div>

            ))
          ) : (
            <div>No users to chat with.</div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat Box */}
      <div className="w-3/4 bg-white p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-gray-600">
          Chat between {currentUsername} and {receiverUsername}
        </h2>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-4 text-gray-600">
          {chat && chat.length > 0 ? (
            chat.map((message, index) => (
              <div key={index} className={`flex ${message  .sentBy === username ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg text-white ${message.sentBy === username ? 'bg-blue-500' : 'bg-gray-500'}`}>
                  <p>{message.content}</p>
                  <span className="text-xs text-gray-700">{new Date(message.sentAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div>No messages yet.</div>
          )}
        </div>

        {/* Send Message */}
        <div className="mt-4 flex items-center">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-l-lg text-gray-600"
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSentMessage((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';  // Clear input field
              }
            }}
          />
          <button
            className="p-2 bg-blue-500 text-white rounded-r-lg"
            onClick={() => handleSentMessage('vvv!')}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
