import { FaBrain, FaHandshake, FaChartLine, FaFilter, FaRobot } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import MatchingComponent from './components/MatchingComponent';

export default function MatchingPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar />
      
      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <MatchingComponent />

          <div className="grid gap-8 md:grid-cols-3 mb-16">
            <div className="bg-yellow-50 p-8 rounded-xl border border-yellow-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <FaBrain className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">AI Algorithms</h2>
                <h2>New algortithm</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Our machine learning models analyze 50+ factors to identify the most compatible matches.
              </p>
              <ul className="text-gray-600 space-y-2 pl-5 list-disc">
                <li>Investment history analysis</li>
                <li>Startup traction metrics</li>
                <li>Industry compatibility scoring</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-8 rounded-xl border border-yellow-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <FaChartLine className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Compatibility Scoring</h2>
              </div>
              <p className="text-gray-600 mb-4">
                See match percentages based on your investment thesis and startup goals.
              </p>
              <ul className="text-gray-600 space-y-2 pl-5 list-disc">
                <li>0-100% compatibility scores</li>
                <li>Key match factor breakdown</li>
                <li>Historical success predictions</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-8 rounded-xl border border-yellow-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <FaFilter className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Smart Suggestions</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Discover promising matches outside your usual criteria that our AI recommends.
              </p>
              <ul className="text-gray-600 space-y-2 pl-5 list-disc">
                <li>Unexpected high-potential matches</li>
                <li>Emerging market opportunities</li>
                <li>Diversification suggestions</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Our Matching Works</h2>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                {
                  title: "1. Set Preferences",
                  icon: <FaFilter className="w-6 h-6 text-yellow-600" />
                },
                {
                  title: "2. AI Analysis",
                  icon: <FaBrain className="w-6 h-6 text-yellow-600" />
                },
                {
                  title: "3. Get Matches",
                  icon: <FaHandshake className="w-6 h-6 text-yellow-600" />
                },
                {
                  title: "4. Start Connecting",
                  icon: <FaRobot className="w-6 h-6 text-yellow-600" />
                }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}