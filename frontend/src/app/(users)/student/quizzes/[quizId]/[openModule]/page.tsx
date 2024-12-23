"use client"
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useRouter } from "next/navigation";
import axios from "axios";

interface CourseData {
  course_code: string;
}

interface Response {
  _id: string;
}

interface ResponseData {
  response: Response;
  message: string;
}

const TakeQuizPage = () => {
  const { quizId, openModule } = useParams(); // Access quizId from the dynamic URL

  const [quizData, setQuizData] = useState<any | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [course_code, setCourseCode] = useState<string>("");
  const [isRatingPopupVisible, setIsRatingPopupVisible] = useState(false); // State for showing rating popup
  const [rating, setRating] = useState<number | null>(null); // State to track the rating
  const [hasTakenQuiz, setHasTakenQuiz] = useState<boolean | null>(null); // Track if the student has taken the quiz
 // const[responseId, setResponse] = useState<ResponseData|any>();
  
  const router = useRouter();

  // Fetch cookie data to get the username
  const fetchCookieData = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:3002/auth/get-cookie-data",
        { withCredentials: true }
      );
      const result = response.data;

      if (result?.userData?.payload?.username) {
        setUsername(result.userData.payload.username);
      } else {
        throw new Error("No valid username found in cookie.");
      }
    } catch (err: any) {
      console.error("Error fetching cookie data:", err);
      setError(err.response?.data?.message || "Failed to fetch cookie data");
      setLoading(false);
    }
  };

  // Fetch quiz data from the API
  const fetchQuizData = async (user: string) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:3002/quizzes/prepare/${quizId}/${user}`,
        { withCredentials: true }
      );
      setQuizData(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching quiz data:", err);
      setError(err.response?.data?.message || "Failed to load quiz data");
      setLoading(false);
    }
  };

  // Check if the user has already taken the quiz
  const checkQuizStatus = async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:3002/quizzes/check-status/${quizId}/${username}`,
        { withCredentials: true }
      );

      // Only show rating popup if the student has not responded to the quiz
      if (response.data.message !== "Student has responded to the quiz") {
        setHasTakenQuiz(false);
        setIsRatingPopupVisible(true);
      } else {
        setHasTakenQuiz(true);
      }
    } catch (err: any) {
      console.error("Error checking quiz status:", err);
      setHasTakenQuiz(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      (async () => {
        await fetchCookieData();
      })();
    }
  }, [quizId]);

  useEffect(() => {
    if (username && quizId) {
      fetchQuizData(username);
      checkQuizStatus(); // Check if the quiz has been taken before
    }
  }, [username]);

  const handleOptionChange = (questionId: string, selectedOption: string) => {
    setAnswers((prev) => {
      const updatedAnswers = [...prev];
      const existingIndex = updatedAnswers.findIndex((ans) => ans.questionId === questionId);
      if (existingIndex !== -1) {
        updatedAnswers[existingIndex].answer = selectedOption;
      } else {
        updatedAnswers.push({ questionId, answer: selectedOption });
      }
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    try {
      // Get course code
      const course = await axiosInstance.get<CourseData>(`http://localhost:3002/courses/module/${openModule}`);
      console.log(course.data);

      // Prepare answers for submission
      const transformedAnswers = Object.fromEntries(
        answers.map(({ questionId, answer }) => [questionId, answer])
      );

      // Submit quiz answers
      const response1 = await axiosInstance.post<ResponseData>(
        `http://localhost:3002/quizzes/${course.data.course_code}/${quizId}/${username}/submit`,
        transformedAnswers,
        { withCredentials: true }
      );
     // setResponse(response1.data.response._id)
      console.log(response1.data.response._id);
      const responseId = response1.data.response._id;      alert("Your responses have been submitted successfully!");

      // After submission, check if the student has taken the quiz and show rating popup if applicable
      await checkQuizStatus(); // Ensure this is awaited to properly update the state
      router.push(`/student/quizzes/${quizId}/${openModule}/${responseId}`);
      // If the student hasn't taken the quiz before, show the rating popup
    } catch (err: any) {
      console.error("Error submitting responses:", err);
      alert(err.response?.data?.message || "Failed to submit your responses");
    }

  };

  const handleRateQuiz = async (rating: number) => {
    // Logic for handling the rating (e.g., save to the server)
    console.log("Rated quiz with rating:", rating);

    // Save the rating to the server (update the open module's rating)
    try {
      await axiosInstance.put(
        `http://localhost:3002/modules/setRating/${openModule}/${rating}`,
        { withCredentials: true }
      );
      // After rating, set the rating state and close the popup
      setRating(rating);
      setIsRatingPopupVisible(false);
    } catch (error) {
      console.error("Error updating module rating:", error);
    }
  };

  const closeRatePopup = () => {
    setIsRatingPopupVisible(false); // Close the popup if user clicks "Close"
  };

  if (loading) {
    return <div className="text-center text-xl text-blue-500">Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">{error}</div>;
  }

  if (!quizData) {
    return <div className="text-center text-xl text-gray-500">No quiz data found.</div>;
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(to bottom, #ffffff, #a8d0f0)",
      }}
    >
      <div className="max-w-4xl mx-auto bg-blue-50 rounded-lg shadow-lg border border-blue-200 p-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">Quiz</h1>
        <h2 className="text-2xl font-sans text-left mb-2 text-gray-600">Solve the following questions:</h2>

        <form>
          {quizData.map((question: any, index: number) => (
            <div
              key={question._id}
              className="mb-8 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200"
            >
              <h3 className="text-1xl font-semibold text-gray-800 mb-3">
                Question {index + 1}: {question.question_text || question.text}
              </h3>

              <div className="space-y-4">
                {question.options.map((option: string, optionIndex: number) => (
                  <label
                    key={optionIndex}
                    htmlFor={`${question._id}-option-${optionIndex}`}
                    className="flex items-center space-x-3 p-4 rounded-md border border-gray-300 hover:bg-blue-100 transition cursor-pointer"
                  >
                    <input
                      type="radio"
                      id={`${question._id}-option-${optionIndex}`}
                      name={question._id}
                      value={option}
                      onChange={() => handleOptionChange(question._id, option)}
                      checked={answers.find((ans) => ans.questionId === question._id)?.answer === option}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-lg text-gray-700 font-medium">
                      {String.fromCharCode(65 + optionIndex)}. {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Submit Answers
            </button>
          </div>
        </form>
      </div>

{/* Rating Popup */}
{!hasTakenQuiz && isRatingPopupVisible && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-gray-600 text-2xl font-bold mb-4 text-center">Please rate this Module!</h2>
      
      <div className="flex justify-center items-center space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRateQuiz(star)}
            onMouseEnter={() => setRating(star)} // Show hover effect
            onMouseLeave={() => setRating(null)} // Reset hover effect
            className={`w-10 h-10 text-2xl transition-colors ${
              rating && star <= rating ? "text-yellow-500" : "text-gray-300"
            }`}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={closeRatePopup}
          className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  )}
</div>
  );
};

export default TakeQuizPage;
