import Image from 'next/image';
import Link from 'next/link';
import axiosInstance from '@/app/utils/axiosInstance';
import { useEffect, useState } from 'react';

const backend_url = 'http://localhost:3002';

interface Course {
  _id: string;
  title: string;
  description: string;
  level: string;
  imageUrl?: string; // Image URL is optional
  created_by: string;
  averageRating?: number;
}

export default function BrowseTopics() {
  const [categories, setCategories] = useState<string[]>([]); // Store categories
  const [activeCategory, setActiveCategory] = useState<string>(''); // Store active category
  const [courses, setCourses] = useState<Course[]>([]); // Store courses
  const [ratings, setRatings] = useState<Record<string, number | null>>({}); // Store ratings for courses

  // Fetch available categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axiosInstance.get(`${backend_url}/courses/categories/get`);
        setCategories(response.data);
        if (response.data.length > 0) {
          setActiveCategory(response.data[0]); // Default to the first category
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Fetch courses for the active category
  useEffect(() => {
    if (activeCategory) {
      async function fetchCourses() {
        try {
          const response = await axiosInstance.get(`${backend_url}/courses/${activeCategory}/courseCategory`);
          setCourses(response.data);
          fetchRatings(response.data); // Pass the courses directly to fetch ratings
        } catch (error) {
          console.error('Error fetching courses:', error);
        }
      }
      fetchCourses();
    }
  }, [activeCategory]);

  // Function to fetch ratings for a list of courses
  const fetchRatings = async (courses: Course[]) => {
    const ratingsData: Record<string, number | null> = {};
    for (const course of courses) {
      try {
        const response = await fetch(`${backend_url}/courses/getavg/${course._id}`);
        const averageRating = await response.json();
        ratingsData[course._id] = averageRating;
      } catch (error) {
        console.error('Error fetching rating for course', course._id, error);
        ratingsData[course._id] = null; // Set null if there's an error
      }
    }
    setRatings(ratingsData); // Store ratings in state
  };

  // Function to get rating by course ID
  const getRating = (courseId: string) => {
    return ratings[courseId] !== undefined ? ratings[courseId] : null;
  };

  return (
    <section className="py-20" id="section_2">
      <div className="container mx-auto px-4">
        <h2 className="text-gray-500 text-3xl font-bold text-center mb-10">Browse Topics</h2>
        <div className="flex justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`mx-2 px-4 py-2 rounded-full ${
                activeCategory === category ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course) => (
            <TopicItem
              key={course._id}
              course={course}
              getRating={getRating} // Pass the function to get rating
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <Link href="/courses">
            <button className="px-6 py-3 bg-blue-800 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300">
              View More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function TopicItem({ course, getRating }: { course: Course; getRating: (id: string) => number | null }) {
  const rating = getRating(course._id); // Call the function to get the rating

  return (
    <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-transform transform hover:scale-105">
      {/* Badge */}
      <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold rounded-full px-3 py-1">
        {course.level}
      </div>

       {/* Image section */}
       {course.imageUrl ? (
        <div className="relative w-full h-40">
          <Image
            src={course.imageUrl}
            alt={course.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      ) : (
        <div className="relative w-full h-40 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}

      {/* Content */}
      <div className="p-6 h-32">
        <h5 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h5>
        <p className="text-sm text-gray-600">{course.description}</p>
        <p className="text-sm text-gray-600">Course Rating: {rating !== null ? `${rating} ⭐` : 'Not Rated'}</p>
      </div>

      {/* Footer */}
      <div className="text-gray-300 flex items-center justify-between px-6 pb-4">
        <Link href={'/courses'} className="text-[var(--primary-color)] font-medium hover:underline">
          Learn More
        </Link>
        <span className="text-gray-500 text-sm">★ {course.created_by || 'N/A'}</span>
      </div>
    </div>
  );
}