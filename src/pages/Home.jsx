import { Link } from 'react-router-dom';

export default function Home({ language }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center pt-8 sm:pt-0">
      <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8 animate-fade-in-up">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 mb-8 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 dark:from-blue-500/20 dark:to-purple-500/20">
              <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-inner">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {language === 'ar' ? 'احفظ أفكارك المهنية' : 'Save Your Professional Insights'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-8">
              {language === 'ar' 
                ? 'احفظ وصنف ونظم المنشورات المهمة من LinkedIn في مكان واحد'
                : 'Save, categorize, and organize important LinkedIn posts in one place'}
            </p>
            <Link
              to="/notes"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-medium text-white rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 group"
            >
              {language === 'ar' ? (
                <>
                  <span>ابدأ الآن</span>
                  <svg 
                    className="w-5 h-5 animate-bounce-x" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              ) : (
                <>
                  Get Started
                  <svg 
                    className="w-5 h-5 animate-bounce-x" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-700/70">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                  {language === 'ar' ? 'سهل الاستخدام' : 'Easy to Use'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {language === 'ar' 
                    ? 'واجهة بسيطة تركز على ما يهم'
                    : 'Simple interface focused on what matters'}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-700/70">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                  {language === 'ar' ? 'خاص وآمن' : 'Private & Secure'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {language === 'ar'
                    ? 'احتفظ بملاحظاتك آمنة ومحمية'
                    : 'Keep your notes safe and protected'}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-700/70">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                  {language === 'ar' ? 'متاح دائماً' : 'Always Available'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {language === 'ar'
                    ? 'الوصول في أي وقت وأي مكان'
                    : 'Access anytime, anywhere'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
