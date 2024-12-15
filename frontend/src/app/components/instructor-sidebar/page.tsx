'use client'
import { useState } from 'react';

const InstructorSidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{ backgroundColor: '#003366' }} // Custom dark blue background
      className={`fixed top-0 left-0 bottom-0 z-[60] w-64 pt-7 pb-10 overflow-y-auto transition-all duration-300 transform lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 ${
        isHovered ? 'translate-x-0' : '-translate-x-full'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sidebar Header */}
      <div className="px-6">
        <a className="flex-none font-semibold text-xl text-sky-200 focus:outline-none focus:opacity-80" href="#" aria-label="Brand">
          Academiq
        </a>
      </div>

      {/* Sidebar Navigation */}
      <nav className="hs-accordion-group p-6 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
        <ul className="space-y-1.5">
          {/* Home Link */}
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 text-sky-200 rounded-lg hover:bg-sky-700"
              href="#home"
            >
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
              </svg>
              Home
            </a>
          </li>

          {/* My Courses Link */}
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 text-sky-200 rounded-lg hover:bg-sky-700"
              href="#my-courses"
            >
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 7V4h12v3M6 14v-3h12v3M6 21v-3h12v3" />
              </svg>
              My Courses
            </a>
          </li>

          {/* Quizzes Link */}
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 text-sky-200 rounded-lg hover:bg-sky-700"
              href="/components/instuctor/quiz"
            >
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Create Quiz
            </a>
          </li>

          {/* Question Bank Link (New) */}
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 text-sky-200 rounded-lg hover:bg-sky-700"
              href="#question-bank"
            >
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 4v16h12V4H6zm6 2h4v4h-4V6zm-2 0H6v4h4V6zm4 6h4v4h-4v-4zm-6 0h4v4H6v-4z" />
              </svg>
              Question Bank
            </a>
          </li>

          {/* Progress Link */}
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 text-sky-200 rounded-lg hover:bg-sky-700"
              href="#progress"
            >
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12l6 6L20 6" />
              </svg>
              Analytics
            </a>
          </li>

          {/* Discussions Link */}
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 text-sky-200 rounded-lg hover:bg-sky-700"
              href="#discussions"
            >
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="9" r="7" />
                <circle cx="9" cy="9" r="2" />
                <line x1="14" y1="14" x2="20" y2="20" />
              </svg>
              Discussions
            </a>
          </li>

          {/* Chats Link */}
          <li>
            <a
              className="flex items-center gap-x-3.5 py-2 px-2.5 text-sky-200 rounded-lg hover:bg-sky-700"
              href="#chats"
            >
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a3 3 0 0 1-3 3h-3v3l-3-3H9a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h3V3l3 3h3a3 3 0 0 1 3 3v6z" />
              </svg>
              Chats
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default InstructorSidebar;
