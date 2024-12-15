'use client'
import Sidebar from "@/app/components/student-sidebar/page";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Link from "next/link";
import { useRouter } from 'next/navigation'
let backend_url = "http://localhost3002"

const TakeQuiz = () => {
    const quizzesData = [
        {
          id: 1,
          question: "What is the capital of France?",
          options: ["Berlin", "Madrid", "Paris", "Rome"],
        },
        {
          id: 2,
          question: "Which planet is known as the Red Planet?",
          options: ["Earth", "Mars", "Jupiter", "Venus"],
        },
        {
          id: 3,
          question: "Who wrote 'To Kill a Mockingbird'?",
          options: ["Harper Lee", "Mark Twain", "J.K. Rowling", "Ernest Hemingway"],
        },
    ];
    const [studentAnswers, setStudentAnswers] = useState(
        quizzesData.map(() => "") // Initialize an empty string for each question
      );
      const router = useRouter()

     async function HandleSubmit(){
        async () => {
            try {
                // Replace with your actual API endpoint
                const response = await axiosInstance.post(`${backend_url}/:quizId/:username/submit`, {
                    answers: studentAnswers,
                });
                console.log("Quiz submitted successfully", response.data);
                // You can add a success message or redirect the user
            } catch (error) {
                console.error("Error submitting quiz:", error);
            }
        }
     }
    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Take Quiz</h1>

                <form>
                    {quizzesData.map((quiz) => (
                        <div key={quiz.id} className="mb-6">
                            <h2 className="text-lg font-semibold">
                                {quiz.id}. {quiz.question}
                            </h2>
                            <ul className="mt-2 space-y-2">
                                {quiz.options.map((option, idx) => (
                                    <li key={idx}>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name={`question-${quiz.id}`}
                                                value={option}
                                                className="mr-2"
                                            />
                                            {option}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TakeQuiz;
