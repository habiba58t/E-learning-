'use client';

export default function Quiz() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Create a Quiz</h1>

        {/* Step 1: Choose Course */}
        <div className="mb-6">
          <label htmlFor="course" className="block text-gray-700 font-medium mb-2">Choose Course</label>
          <select id="course" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="course1">Course 1</option>
            <option value="course2">Course 2</option>
            <option value="course3">Course 3</option>
          </select>
        </div>

        {/* Step 2: Choose Module */}
        <div className="mb-6">
          <label htmlFor="module" className="block text-gray-700 font-medium mb-2">Choose Module</label>
          <select id="module" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="module1">Module 1</option>
            <option value="module2">Module 2</option>
            <option value="module3">Module 3</option>
          </select>
        </div>

        {/* Step 3: Create Quiz */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Quiz Details</h2>
          <form>
            {/* Number of Questions */}
            <div className="mb-4">
              <label htmlFor="numQuestions" className="block text-gray-700 font-medium mb-2">Number of Questions</label>
              <input
                type="number"
                id="numQuestions"
                placeholder="Enter number of questions"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Question Type */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Question Type</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">True/False</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">Multiple Choice (MCQ)</span>
                </label>
              </div>
            </div>

            {/* Create Quiz Button */}
            <button
              type="button"
              className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-indigo-500"
            >
              Generate Quiz
            </button>
          </form>
        </div>

        {/* Existing Quizzes */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Manage Quizzes</h2>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-800">Quiz 1</h3>
                <p className="text-sm text-gray-600">Course: Course 1 | Module: Module 1</p>
              </div>
              <div className="space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Quiz 2</h3>
                <p className="text-sm text-gray-600">Course: Course 2 | Module: Module 2</p>
              </div>
              <div className="space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
