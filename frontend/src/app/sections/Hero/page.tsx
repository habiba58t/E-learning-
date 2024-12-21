import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-800 to-teal-400 py-20" id="section_1">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover. Learn. Enjoy</h1>
          <h6 className="text-xl text-white mb-8">platform for creatives around the world</h6>
          <form className="mt-8">
            <div className="flex items-center bg-white rounded-full overflow-hidden p-1">
              <div className="pl-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Design, Code, Marketing, Finance ..."
                className="w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none"
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
      </div>
    </section>
  );
}