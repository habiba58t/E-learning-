'use client';
import Sidebar from "@/app/components/student-sidebar/page";
import axiosInstance from '@/app/utils/axiosInstance';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import router from 'next/router';
import Link from 'next/link';
import Navbar from "@/app/components/Navbar_s/page";


interface CourseParams {
    course: string;
}



interface Course {
    _id: string;
    course_code: string;
    title: string;
    description: string;
    category: string;
    level: string;
    modules: string[];
    averageRating:string
    totalStudents:string
    created_by: string;
}

interface Module {
    title: string;
    description: string;
    level: string;
}

const CourseDetails = () => {
    const params = useParams(); // Unwrap params using useParams
    const courseCode = params.course; // Get courseCode from route params

    const [course, setCourse] = useState<Course | null>(null); // State to hold course data
    const [error, setError] = useState<string | null>(null); // State to handle errors
    const [loading, setLoading] = useState<boolean>(true); // State for loading status
    const [modules, setModules] = useState<Module[] | null>(null); // State to hold fetched modules
    const [students, setStudents] = useState<string[]>([]); // State to store enrolled students
    const [studentsLoading, setStudentsLoading] = useState<boolean>(false);
    const [studentsError, setStudentsError] = useState<string | null>(null);
    const [isRatingPopupVisible, setIsRatingPopupVisible] = useState(false); // State for showing rating popup
    const [totalRating, setTotalRating] =  useState<number | 0>();
    const [totalStudents, setTotalStudents] =  useState<number | 0>();
  const [rating, setRating] = useState<number | null>(null); // State to track the rating
    const router = useRouter();
     const [isClient, setIsClient] = useState(false);

     useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                // Fetch course details
                const response = await axiosInstance.get<Course>(`http://localhost:3002/courses/${courseCode}`);
                const courseData = response.data;
                setCourse(courseData);
    
                // Fetch course rating
                if (courseData && courseData._id) {
                    try {
                        const ratingResponse = await axiosInstance.get<number>(`http://localhost:3002/courses/getavg/${courseData._id}`);
                        const averageRating = ratingResponse.data;
                        setTotalRating(averageRating);
                        console.log('Average Rating:', averageRating);
                        try {
                            const response = await axiosInstance.get<number>(`http://localhost:3002/progress/enrolled/${courseCode}`);
                           const answer = response.data;
                            setTotalStudents(answer | 0);
                          } catch (error) {
                            console.error('Failed to fetch total students:', error);
                             setError('Error fetching data');
                          }
                    } catch (ratingError) {
                        console.error('Failed to fetch course rating:', ratingError);
                        setError('Error fetching course rating.');
                    }
                }
         //enrolled students
                
            } catch (err) {
                console.error('Failed to fetch course details:', err);
                setError('Failed to load course details.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchCourseDetails();
        setIsClient(true);
    }, [courseCode]);
    

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

    const handleViewModules = async () => {
        setError(null); // Clear previous errors
        try {
            const username = await fetchUsernameFromCookies();
            if (!username) {
                setError('Failed to retrieve username from cookies.');
                return;
            }

            const response = await axiosInstance.get<Module[]>(
                `http://localhost:3002/courses/${username}/${courseCode}/modules`
            );
            setModules(response.data);
        } catch (err) {
            setError('Failed to load modules for this course.');
        }
    };

    const handleViewstudents = async () => {
        setStudentsLoading(true);
        setStudentsError(null);
        try {
            const response = await axiosInstance.get<string[]>(
                `http://localhost:3002/progress/enrolledStudents/${courseCode}`
            );
            console.log(response.data)
            setStudents(response.data); // Set the students in the state
        } catch (err) {
            setStudentsError('Failed to load enrolled students.');
        } finally {
            setStudentsLoading(false);
        }
        
    };




    const handleViewModuleDetails = (module_title: string) => {
        if (isClient) {
            router.push(`${courseCode}/${module_title}`);
          }
      };

      const handleChatButtonClick = () => {
        // Redirect to the chat page for this course_code
        router.push(`/student/chat/${courseCode}`);
      };
  

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex">
            {/* Sidebar */}
            <Navbar />
        <div className="container mx-auto px-4 py-8">
            {/* Course Header */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 shadow-lg rounded-lg p-8 text-white">
                <h1 className="text-5xl font-extrabold mb-4 text-center">{course?.title}</h1>
                <p className="text-lg text-center mb-2">
                    <span className="font-semibold">Description:</span> {course?.description}
                </p>
                <div className="flex justify-center gap-8 text-sm md:text-md mt-4">
                    <p className="bg-blue-800 py-2 px-4 rounded-full shadow-md">
                        <span className="font-semibold">Category:</span> {course?.category}
                    </p>
                    <p className="bg-blue-800 py-2 px-4 rounded-full shadow-md">
                        <span className="font-semibold">Course Rating:</span>{' '}
                        {totalRating !== null ? totalRating : 'Loading...'}
                    </p>
                    <p className="bg-blue-800 py-2 px-4 rounded-full shadow-md">
                        <span className="font-semibold">Total Students:</span> {totalStudents}
                    </p>
                    <p className="bg-blue-800 py-2 px-4 rounded-full shadow-md">
        <span className="font-semibold">Instructor:</span> 
        {course?.created_by ? (
            <Link href={`/profile/${course.created_by}`} className="text-white hover:underline">
                {course.created_by}
            </Link>
        ) : 'N/A'}
    </p>
                </div>
                <div className="flex justify-center mt-6">
                <button
                        onClick={handleViewstudents}
                        className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-100 transition-all"
                    >
                        View Other Students
                    </button>
                    <button
                        onClick={handleViewModules}
                        className="bg-white text-blue-600 font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-100 transition-all"
                    >
                        View Course Modules
                    </button>
                </div>

                <div className="flex justify-center mt-6">
                <button
                    onClick={handleChatButtonClick}
                    className="bg-white text-purple-700 font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-100 transition-all"
                >
                  Chat
                </button>
                </div>
            </div>

            {/* Enrolled Students Section */}
            {studentsLoading && <div>Loading students...</div>}
            {studentsError && <div>{studentsError}</div>}
            {students.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center">Enrolled Students</h2>
                    <ul>
                        {students.map((student, index) => (
                            <li key={index} className="text-lg text-center">{student}</li>
                        ))}
                    </ul>
                </div>
            )}
            
            

           {/* Modules Section */}
           {modules && (
                <div className="mt-12">
                    <h2 className="text-3xl font-semibold text-blue-800 mb-6 text-center">Modules</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {modules.length > 0 ? (
                            modules.map((module, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-lg p-6 hover:shadow-2xl transition-transform transform hover:-translate-y-1"
                                >
                                    <h3 className="text-lg font-bold text-blue-700 mb-2">{module.title}</h3>
                                    <p className="text-gray-700 mb-4">{module.level}</p>
                                    <button
                                        onClick={() => handleViewModuleDetails(module.title)}
                                        className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-full hover:opacity-90 transition-all"
                                    >
                                        View Module
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No modules available for this course.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Footer or Additional Information */}
            <div className="mt-12 text-center text-gray-500">
                <p>
                    Need help? Contact <span className="text-blue-600 font-medium">support@example.com</span>
                </p>
            </div>
        </div>
        </div>
    );
    
};


export default CourseDetails;