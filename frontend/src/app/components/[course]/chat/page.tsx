import React from 'react';
import { useParams } from 'next/navigation';

const ChatPage = () => {
    const { courseCode } = useParams(); // Dynamic course code from URL

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-4">
                    <h1 className="text-xl font-bold text-center">Group Chat - {courseCode}</h1>
                </div>
                <div className="flex flex-col h-[500px]">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <p className="text-gray-500 text-center">Start the conversation!</p>
                    </div>
                    {/* Input Box */}
                    <div className="flex items-center border-t border-gray-300 px-4 py-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button
                            className="ml-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
