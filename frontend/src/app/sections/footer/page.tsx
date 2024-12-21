import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t-8 border-teal-400 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-blue-800">
              <span className="mr-2">&#8592;</span>Topic
            </Link>
          </div>
          <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
            <h6 className="text-lg font-semibold mb-4">Resources</h6>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-blue-800">Home</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-800">How it works</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-800">FAQs</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-800">Contact</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 px-4 mb-8 md:mb-0">
            <h6 className="text-lg font-semibold mb-4">Information</h6>
            <p className="text-gray-600 mb-2">
              <a href="tel:305-240-9671" className="hover:text-blue-800">305-240-9671</a>
            </p>
            <p className="text-gray-600">
              <a href="mailto:info@company.com" className="hover:text-blue-800">info@company.com</a>
            </p>
          </div>
          <div className="w-full md:w-1/4 px-4">
            <select className="w-full p-2 border rounded-md mb-4">
              <option>English</option>
              <option>Thai</option>
              <option>Myanmar</option>
              <option>Arabic</option>
            </select>
            <p className="text-sm text-gray-600">
              &copy; 2023 Topic Listing Center. All rights reserved.<br />
              Design: <a href="https://templatemo.com" target="_blank" rel="noopener noreferrer" className="text-blue-800">TemplateMo</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
