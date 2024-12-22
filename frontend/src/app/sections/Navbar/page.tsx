import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, User } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-gray-600 text-xl font-bold">Academiq</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">Home</Link>
            <Link href="/courses" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">Browse Courses</Link>
            <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">About</Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/login">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <User className="h-6 w-6" />
              </button>
            </Link>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
            <Link href="#browse-topics" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Browse Courses</Link>
            <Link href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">About</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
