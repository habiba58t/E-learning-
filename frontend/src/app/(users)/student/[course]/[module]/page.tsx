'use client';

import axiosInstance from '@/app/utils/axiosInstance';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Module {
  title: string;
  description: string;
  content: [];
  level: string;
}

interface Note {
  _id: string;
  content: string;
  Title:string
}

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

const ModuleDetails = () => {
  const params = useParams();
  const module_title = params.module;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [module, setModules] = useState<Module | null>(null);
  const [note, setNote] = useState<string>('');
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [noteTitle, setNoteTitle] = useState(''); // State for note title
  //const [noteContent, setNoteContent] = useState(''); // State for note title
  const [notePosition, setNotePosition] = useState<{ x: number; y: number }>({
    x: 100,
    y: 100,
  });

  const [showNotesDropdown, setShowNotesDropdown] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      if (!module_title) {
        console.error('Module title is undefined!');
        return;
      }
      try {
        const response = await axiosInstance.get<Module>(
          `http://localhost:3002/modules/mtitle/${module_title}`
        );
        setModules(response.data);
      } catch (err) {
        setError('Failed to load module details.');
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
        course_code: module_title,
        content: note,
        Title: noteTitle, 
      };

      const response = await axiosInstance.post(
        `http://localhost:3002/notes/note/${module_title}`,
        noteData
      );

      console.log('Note saved successfully:', response.data);

      setNote('');
      setNoteTitle('');
      setShowNoteModal(false);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note.');
    }
  };

  const updateNote = async () => {
    // if (!note || !noteTitle) {
    //   alert("Note content and title are required!");
    //   return;
    // }

    if (!selectedNote) {
      //alert("No note selected for update");
      return;
    }

    const updatedNote = {
      Title: noteTitle,
      content: note,
    };

    try {
      // Send PUT request to update the note
      const response = await axiosInstance.put(
        `http://localhost:3002/notes/${selectedNote._id}`, // Assuming selectedNote contains the ID of the note
        updatedNote
      );

      // Handle the response (optional)
      console.log("Note updated successfully:", response.data);
      // Optionally, update the UI or show a success message
     // setSelectedNote(null); // Close the note modal after saving
     // setNote(""); // Clear note content
     // setNoteTitle(""); // Clear note title
    } catch (error) {
      console.error("Error updating the note:", error);
    }
  };

  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout); // Clear any previous timeout if the user is typing again
    }

    const timeout = setTimeout(() => {
      updateNote(); // Auto-save the note after 2 seconds of inactivity
    }, 2000);

    setAutoSaveTimeout(timeout); // Set the timeout for future clearing

    return () => {
      if (timeout) {
        clearTimeout(timeout); // Clean up timeout when the component unmounts
      }
    };
  }, [note]);

  const fetchNotes = async () => {
    try {
      const username = await fetchUsernameFromCookies();
      if (!username) {
        console.log('Username not found.');
        return;
      }
      let encodedTitle: string;
      if (typeof module_title === 'string') {
         encodedTitle = encodeURIComponent(module_title);  // This is now safe
        // Now you can use encodedTitle in the request
      }else {
        // If it's not a string (undefined or array), use a default
        encodedTitle = encodeURIComponent('default module title');
      }

      const response = await axiosInstance.get<Note[]>(
        `http://localhost:3002/modules/${username}/${encodedTitle}`
        
      );
      console.log('Module Title:', module_title);
      console.log('Notes fetched:', response.data);
      const data = Array.isArray(response.data) ? response.data : [response.data];
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      alert('Failed to fetch notes.');
    }
  };

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setShowNoteModal(true);
    setNoteTitle(note.Title); // Set the title of the note for editing
   setNote(note.content);
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

  

  // Function to open note for editing
  // const openNoteForEditing = (note: Note) => {
  //   setSelectedNote(note);
  //   setNoteTitle(note.Title); // Set existing title
  //   setNoteContent(note.content); // Set existing content
  //   setShowNoteModal(true); // Show the modal for editing the note
  // };

 
  
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
                onClick={() => {
                  setShowNotesDropdown(!showNotesDropdown);
                  if (!showNotesDropdown) fetchNotes();
                }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition"
              >
                View Notes
              </button>
              {showNotesDropdown && (
                <ul className="absolute bg-white shadow-md border rounded-lg mt-2 w-64">
                  {notes.map((note) => (
                    <li
                      key={note._id}
                      onClick={() => openNote(note)}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    >
                      {note.Title}
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => setShowNoteModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
              >
                Take a Note
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
          {/* Display the title of the selected note */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {selectedNote ? selectedNote.Title : 'Write a Note'}
          </h2>
          
          {/* Note Title Field */}
          {selectedNote ? (
            <div>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)} // Update noteTitle state on change
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                placeholder="Edit note title"
              />
            </div>
          ) : (
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)} // Update noteTitle state on change
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              placeholder="Enter note title"
            />
            
            
          )}
  
          {/* Note Content Field */}
          {selectedNote ? (
            <textarea
              value={note} // Use the content state to display the existing content
              onChange={(e) => setNote(e.target.value)} // Update noteContent state on change
              className="w-full p-4 mb-4 border border-gray-300 rounded-lg h-40 resize-none"
              placeholder="Edit your note here..."
            />
          ) : (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)} // Update noteContent state on change
              className="w-full p-4 mb-4 border border-gray-300 rounded-lg h-40 resize-none"
              placeholder="Enter your note here..."
            />
          )}
  
          <div className="flex justify-end mt-4 space-x-4">
            <button
              onClick={() => {
                setSelectedNote(null);
                setShowNoteModal(false);
              }}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            >
              Close
            </button>
            {/* Save or Update Note */}
      <button
        onClick={selectedNote ? updateNote : saveNote} // Conditional logic to call saveNote or updateNote function
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        {selectedNote ? 'Update' : 'Save Note'}
      </button>
            {selectedNote && (
              <div className="space-x-4">
               
                <button
                 // onClick={deleteNote} // Add logic to delete the note
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
  

  
};

export default ModuleDetails;