'use client';

import axiosInstance from '@/app/utils/axiosInstance';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Picker from 'emoji-picker-react';

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
  const [error, setError] = useState<string>('');
  const [chat, setChat] = useState<MessageData[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number | null>(null);

  const fetchCookieData = async () => {
    const response = await fetch('http://localhost:3002/auth/get-cookie-data', {
      credentials: 'include',
    });
    const { userData } = await response.json();

    if (!userData?.payload?.username) {
      console.error('No cookie data found');
      setError('No cookie data found');
      return;
    }

    setUsername(userData.payload.username);
  };

  const createOrLoadChat = async () => {
    try {
      await axiosInstance.post<ChatData[]>(`http://localhost:3002/private-chat/create/${currentUsername}/${receiverUsername}`);

      const myChats = await axiosInstance.get<ChatData[]>(`http://localhost:3002/private-chat/user/${currentUsername}`);
      const otherMembers = myChats.data.map(chat =>
        chat.member1 === currentUsername ? chat.member2 : chat.member1
      );
      setUsers([...new Set(otherMembers)]);
    } catch (err) {
      console.error('Error creating or loading chat:', err);
      setError('Error fetching cookie data');
    }
  };

 const fetchUpdatedChat = async () => {
    if (!selectedUser || loading) return; // Prevent redundant fetches
    setLoading(true);

    try {
      const getChatResponse = await axiosInstance.get<ChatData>(
        `http://localhost:3002/private-chat/get-chat/${currentUsername}/${selectedUser}`
      );

      // Only update chat if new messages are fetched
      if (getChatResponse.data.Message && getChatResponse.data.Message.length !== chat.length) {
        setChat(getChatResponse.data.Message);
        setCurrentChatId(getChatResponse.data._id);
      }
    } catch (error) {
      console.error('Error fetching updated chat:', error);
      setError('Error fetching chat messages');
    } finally {
      setLoading(false);
    }
  };


  const handleSentMessage = async () => {
    if (!inputMessage || !currentChatId) return;
    const newMessage = {
      content: inputMessage,
      sentBy: Array.isArray(currentUsername) ? currentUsername.join(', ') : currentUsername || '', // Ensure it's a string
      sentAt: new Date(),  // Temporary timestamp for UI
    };
    
    // Optimistically update local state
    setChat(prevChat => [...prevChat, newMessage]);
    setInputMessage(''); // Clear input field immediately

    try {
      const response = await axiosInstance.post(
        `http://localhost:3002/private-chat/${currentChatId}/message`,
        { content: inputMessage, sentBy: currentUsername }
      );  
      
      const response2 =await axiosInstance.post(`http://localhost:3002/notification/private-chatsent/${currentUsername}/${selectedUser}`);    
      console.log(response2.data)

    } catch (error) {
        console.error('Error sending message:', error);
      setError('Error sending message');

      // Rollback: Remove the optimistic message on error
      setChat(prevChat => prevChat.filter(msg => msg !== newMessage));
    }
  };


  const handleUserClick = async (user: string) => {
    if (user === selectedUser) return;
    setSelectedUser(user);
    setChat([]);

    try {
      const chatData = await axiosInstance.get<ChatData>(
        `http://localhost:3002/private-chat/get-chat/${currentUsername}/${user}`
      );
      setChat(chatData.data.Message);
      setCurrentChatId(chatData.data._id);
 //     setLastMessageTimestamp(new Date(chatData.data.Message[chatData.data.Message.length - 1].sentAt).getTime());
    } catch (error) {
      console.error('Error opening chat:', error);
      setError('Error opening chat');
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputMessage(prev => prev + emoji);
    setEmojiPickerVisible(false);
  };

  const handleThemeToggle = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };


  useEffect(() => {
    const safeCurrentUsername = Array.isArray(currentUsername) ? currentUsername[0] : currentUsername;
  
    if (safeCurrentUsername) {
      setUsername(safeCurrentUsername);
      fetchCookieData();
      createOrLoadChat();
    }
  
    // Auto-select the chat with `receiverUsername` if it exists
    if (receiverUsername) {
      const safeReceiverUsername = Array.isArray(receiverUsername) ? receiverUsername[0] : receiverUsername;
  
      setSelectedUser(safeReceiverUsername);
  
      // Fetch chat for the selected user
      const initializeChat = async () => {
        try {
          const chatData = await axiosInstance.get<ChatData>(
            `http://localhost:3002/private-chat/get-chat/${safeCurrentUsername}/${safeReceiverUsername}`
          );
          setChat(chatData.data.Message);
          setCurrentChatId(chatData.data._id);
        } catch (error) {
          console.error('Error fetching chat for receiverUsername:', error);
          setError('Error initializing chat');
        }
      };
  
      initializeChat();
    }
  }, [currentUsername, receiverUsername]);
  
  

useEffect(() => {
    if (selectedUser) {
      fetchUpdatedChat();
    }
    const interval = setInterval(() => {
      fetchUpdatedChat();
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedUser]);




  return (
    <div className={`flex h-screen ${theme === 'light' ? 'bg-gradient-to-r from-blue-100 via-green-100 to-purple-100' : 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600'}`}>
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => handleThemeToggle(theme === 'light' ? 'dark' : 'light')}
          className="p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-600"
        >
          {theme === 'light' ? '🌙 Dark' : '🌞 Light'}
        </button>
      </div>

      {/* Left Panel - Users List */}
      <div className={`w-1/4 p-4 ${theme === 'light' ? 'bg-gradient-to-b from-green-200 to-blue-300' : 'bg-gradient-to-b from-gray-800 to-gray-900'} shadow-lg rounded-lg`}>
        <h2 className="text-xl font-semibold text-blue-600">Chats </h2>
        <div className="mt-4 space-y-2">
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <div
                key={index}
                className={`p-2 cursor-pointer hover:bg-gray-200 rounded ${selectedUser === user ? 'bg-indigo-400' : ''}`}
                onClick={() => handleUserClick(user)}
              >
                <span className="font-medium text-blue-700">{user}</span>
              </div>
            ))
          ) : (
            <div>No users to chat with.</div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat Box */}
      <div className={`w-3/4 p-6 flex flex-col space-y-4 rounded-lg shadow-xl ${theme === 'light' ? 'bg-gradient-to-tr from-slate-100 to-teal-100' : 'bg-gradient-to-tr from-slate-800 to-cyan-800 text-white'}`}>
        <h2 className={`text-xl font-semibold" ${theme === 'light' ? 'text-purple-700' : ' text-white'}`}>{selectedUser ? `Chat with ${selectedUser}` : 'No user selected'}</h2>

{/* Chat History */}
<div className="flex-1 overflow-y-auto space-y-4 text-gray-600">
          {chat && chat.length > 0 ? (
            chat.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sentBy === username ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-white ${
                    message.sentBy === username ? 'bg-blue-500' : 'bg-gray-500'
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs text-gray-700">
                    {new Date(message.sentAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div>No messages yet.</div>
          )}
        </div>


        {/* Send Message */}
        {selectedUser && (
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
              placeholder="Type a message..."
              onKeyDown={e => {
                if (e.key === 'Enter') handleSentMessage();
              }}
            />
            <button
              className="p-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-700"
              onClick={handleSentMessage}
            >
              <span role="img" aria-label="send">📤</span> Send
            </button>

            <button
              className="p-1 bg-yellow-500 text-white rounded-full"
              onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
            >
              😊
            </button>
          </div>
        )}

        {/* Emoji Picker */}
        {emojiPickerVisible && (
          <div className="absolute bottom-16 right-4 z-10">
            <Picker onEmojiClick={(emojiData) => handleEmojiClick(emojiData.emoji)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
