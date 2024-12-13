'use client';
import { SetStateAction, use, useState } from 'react';

export interface questions{
    keywordTitle: string;
    question_text: string;
    difficulty_level: string;
    correct_answer: string;
    created_by: string;
    type:string;
}
export default function Questions() {
    const[question_text, setQuestionText]= useState('');
    const[difficulty_level, setDifficulityLevel]=useState('');
    const[correct_answer, setCorrectAswer]=useState('');
    const[type,setType]= useState('');
    const[created_by, setCreatedBy]=useState('');

    


  const [questions, setQuestions] = useState([
    {
      title: 'Capital of France',
      text: 'What is the capital of France?',
      answers: ['Paris', 'London', 'Berlin', 'Madrid'],
      correct: 'Paris',
      difficulty: 'Easy',
      type: 'MCQ',
    },
    {
      title: 'Solve Equation',
      text: 'Solve the equation: 2x + 3 = 7',
      answers: ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
      correct: 'x = 2',
      difficulty: 'Medium',
      type: 'MCQ',
    },
    {
      title: "Planck's Constant",
      text: 'What is the value of Planck\'s constant?',
      answers: ['6.626 x 10^-34', '3.14', '1.602 x 10^-19', '9.8'],
      correct: '6.626 x 10^-34',
      difficulty: 'Hard',
      type: 'MCQ',
    },
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  const handleDelete = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleEdit = (index: number | SetStateAction<null>) => {
    setEditIndex(index);
    setEditData(questions[index]);
  };

  const handleSave = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[editIndex] = editData;
    setQuestions(updatedQuestions);
    setEditIndex(null);
  };

  const handleChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleCreate = () => {
    const newQuestion = {
      title: '',
      text: '',
      answers: [],
      correct: '',
      difficulty: '',
      type: 'MCQ',
    };
    setQuestions([...questions, newQuestion]);
    setEditIndex(questions.length);
    setEditData(newQuestion);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Instructor Question Management</h1>

      <button
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mb-4"
        onClick={handleCreate}
      >
        Create New Question
      </button>

      {/* Display Questions */}
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Questions</h2>

        {questions.length === 0 ? (
          <p className="text-gray-600">No questions created yet.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q, index) => (
              <li key={index} className="bg-white shadow-md rounded-md p-4">
                {editIndex === index ? (
                  <div>
                    <input
                      type="text"
                      className="border rounded-md p-2 w-full mb-2"
                      value={editData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Title"
                    />
                    <textarea
                      className="border rounded-md p-2 w-full mb-2"
                      value={editData.text}
                      onChange={(e) => handleChange('text', e.target.value)}
                      placeholder="Question Text"
                    />
                    <input
                      type="text"
                      className="border rounded-md p-2 w-full mb-2"
                      value={editData.correct}
                      onChange={(e) => handleChange('correct', e.target.value)}
                      placeholder="Correct Answer"
                    />
                    <input
                      type="text"
                      className="border rounded-md p-2 w-full mb-2"
                      value={editData.difficulty}
                      onChange={(e) => handleChange('difficulty', e.target.value)}
                      placeholder="Difficulty"
                    />
                    <div className="flex space-x-4">
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600"
                        onClick={() => setEditIndex(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-800 font-medium">{index + 1}. {q.title}</p>
                    <p className="text-gray-600 mt-2">Question: <span className="text-gray-800">{q.text}</span></p>
                    <p className="text-gray-600 mt-2">Answers: <span className="text-gray-800">{q.answers.join(', ')}</span></p>
                    <p className="text-gray-600 mt-2">Correct: <span className="text-gray-800">{q.correct}</span></p>
                    <p className="text-gray-600 mt-2">Difficulty: <span className="text-gray-800">{q.difficulty}</span></p>
                    <p className="text-gray-600 mt-2">Type: <span className="text-gray-800">{q.type}</span></p>
                    <div className="mt-4 flex space-x-4">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                        onClick={() => handleEdit(index)}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}