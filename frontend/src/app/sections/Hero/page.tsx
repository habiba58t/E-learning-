import { useState } from 'react';
import axiosInstance from '@/app/utils/axiosInstance';
import { Search } from 'lucide-react';

interface Course {
  _id: string;
  course_code: string;
  title: string;
  description: string;
  category: string;
  level: string;
  created_by: string;
  imageUrl: string;  // Assuming this is added to your course schema
  averageRating: number;
}

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Course[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const backendUrl = 'http://localhost:3002';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSearchResult(null);

    try {
      const response = await axiosInstance.get<Course[]>(`${backendUrl}/courses/search`, {
        params: { query: searchQuery },
      });
      setSearchResult(response.data);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setErrorMessage('No courses found for your search.');
      } else {
        setErrorMessage('An error occurred while searching.');
      }
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-800 to-teal-400 py-20" id="section_1">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover. Learn. Enjoy</h1>
          <h6 className="text-xl text-white mb-8">Platform for learners around the world</h6>
          <form className="mt-8" onSubmit={handleSearch}>
            <div className="flex items-center bg-white rounded-full overflow-hidden p-1">
              <div className="pl-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search for courses..."
                className="w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-800 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        
        {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}

        {searchResult && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {searchResult.map((course) => (
              <div
                key={course._id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <img
                  src={course.imageUrl || 'https://via.placeholder.com/300x200'}
                  alt={course.title}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                <p className="text-gray-500 text-xs">Instructor: {course.created_by}</p>
                <p className="text-yellow-500 font-semibold text-sm mt-2">Rating: {course.averageRating}</p>
                <button
                  className="mt-4 bg-blue-800 text-white py-2 px-6 rounded-full hover:bg-blue-700 transition duration-200"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
