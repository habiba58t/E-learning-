'use client';

import axiosInstance from '@/app/utils/axiosInstance';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import router from 'next/router';
import { Module } from 'module';




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


interface Module {
    title: string;
    description: string;
    content: []
    level: string;
}


const moduleDetails = () => {
    const params = useParams(); // Unwrap params using useParams
    console.log('Params:', params);
    const module_title = params.module; // Get courseCode from route params

    console.log('Module Title:', module_title);

    const [error, setError] = useState<string | null>(null); // State to handle errors
    const [loading, setLoading] = useState<boolean>(true); // State for loading status
    const [module, setModules] = useState<Module| null>(null); // State to hold fetched modules
    const [note, setNote] = useState<string>(''); // State for the note input
    const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
    const [notePosition, setNotePosition] = useState<{ x: number; y: number }>({
      x: 100,
      y: 100,
    });
   

    useEffect(() => {
        const fetchModuleDetails = async () => {
          if (!module_title) {
            console.error("Module title is undefined!");
            return;  // Prevent making the request if module_title is undefined
        }
            try {
              
                const response = await axiosInstance.get<Module>(`http://localhost:3002/modules/mtitle/${module_title}`);
          
                setModules(response.data);
            } catch (err) {
                setError('Failed to load module  details.');
            } finally {
                setLoading(false);
            }
            
        };

        fetchModuleDetails();
        }, [module_title]);

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNote(e.target.value);
    };

    const saveNote = async () => {
      if (!note) {
        console.log('Note is empty!');
        return;
      }
    
      try {
        const username = await fetchUsernameFromCookies();
        if (!username) {
          console.log('Username not found.');
          return;
        }

        const noteData = {
          username: username,
          course_code: module_title, // The course code from the params
          content: note, // The note content from state
        };
    
        // Call your backend to create a new note
        const response = await axiosInstance.post(`http://localhost:3002/notes/note`,noteData)
    
        console.log('Note saved successfully:', response.data);
        
        // Reset the note and close the modal
        setNote('');
        setShowNoteModal(false);
    
      } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save note.');
      }
    };

    

    const handleDragStart = (e: React.MouseEvent) => {
      const offsetX = e.clientX - notePosition.x;
      const offsetY = e.clientY - notePosition.y;
  
      const handleMouseMove = (moveEvent: MouseEvent) => {
        setNotePosition({
          x: moveEvent.clientX - offsetX,
          y: moveEvent.clientY - offsetY,
        });
      };
  
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
  
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    


    
    
if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-500">Loading module details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold text-gray-500">No module found.</div>
      </div>
    );
}

return (
  <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{module?.title}</h1>
        <p className="text-gray-600 mb-6 text-lg">{module?.description}</p>
        <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Content</h2>
          <ul className="list-disc list-inside space-y-3">
            {module?.content.map((item, index) => (
              <li key={index} className="text-gray-600 text-lg">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <span className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Level: {module?.level}
          </span>
          <div className="space-x-4">
            <button
              onClick={() => setShowNoteModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Take a Note
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition">
              View Notes
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition">
              Take Quiz
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Movable Note */}
    {showNoteModal && (
      <div
        className="fixed z-50 bg-yellow-200 p-6 rounded-lg shadow-lg w-80"
        style={{ left: `${notePosition.x}px`, top: `${notePosition.y}px` }}
        onMouseDown={handleDragStart}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Write a Note</h2>
        <textarea
          value={note}
          onChange={handleNoteChange}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg h-40 resize-none"
          placeholder="Enter your note here..."
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowNoteModal(false)}
            className="bg-gray-300 text-black px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={saveNote}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Save Note
          </button>
        </div>
      </div>
    )}
  </div>
);
};



        
 export default moduleDetails;