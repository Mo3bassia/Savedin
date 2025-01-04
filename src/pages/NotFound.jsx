import { Link } from 'react-router-dom';
import notFoundSearch from '../assets/illustrations/404-search.svg';

export default function NotFound({ language }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-blue-500/10 animate-float-slow" />
        <div className="absolute top-1/4 -left-12 w-32 h-32 rounded-full bg-purple-500/10 animate-float" />
        <div className="absolute bottom-1/3 right-8 w-20 h-20 rounded-full bg-green-500/10 animate-float-slower" />
        <div className="absolute -bottom-8 left-1/3 w-28 h-28 rounded-full bg-orange-500/10 animate-pulse-slow" />
        
        {/* Background Text */}
        <div className="absolute inset-0 select-none">
          <div className="absolute top-1/4 left-1/4 text-9xl font-bold text-gray-100 dark:text-gray-800 animate-float-slower">
            4
          </div>
          <div className="absolute top-1/3 right-1/4 text-9xl font-bold text-gray-100 dark:text-gray-800 animate-float-slow">
            0
          </div>
          <div className="absolute bottom-1/4 left-1/3 text-9xl font-bold text-gray-100 dark:text-gray-800 animate-float">
            4
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center px-4">
        <div className="inline-block mb-8 relative">
          <img src={notFoundSearch} alt="404" className="w-96 h-96 mx-auto animate-float-slow" />
          <div className="absolute -top-4 -right-4 text-5xl animate-bounce-slow opacity-50">
            ?
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          {language === 'ar' ? 'عفواً، الصفحة غير موجودة' : '404 - Page Not Found'}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {language === 'ar' 
            ? 'يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها'
            : 'The page you are looking for might have been removed or relocated'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200"
        >
          {language === 'ar' ? (
            <>
              العودة للرئيسية
              <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </>
          ) : (
            <>
              Back to Home
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
