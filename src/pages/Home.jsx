export default function Home({ language }) {
  return (
    <div className="min-h-screen pt-16 dark:bg-gray-900 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* Hero Section */}
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-300"
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
          <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {language === 'ar' ? 'احفظ أفكارك المهنية' : 'Save Your Professional Insights'}
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            {language === 'ar' 
              ? 'احفظ وصنف ونظم المنشورات المهمة من LinkedIn في مكان واحد'
              : 'Save, categorize, and organize important LinkedIn posts in one place'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-8 border-t border-gray-100 dark:border-gray-700">
          {/* Feature 1 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-300"
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
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ar' 
                ? 'واجهة بسيطة تركز على ما يهم'
                : 'Simple interface focused on what matters'}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-300"
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
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ar'
                ? 'احتفظ بملاحظاتك آمنة ومحمية'
                : 'Keep your notes safe and protected'}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600 dark:text-orange-300"
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
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ar'
                ? 'الوصول في أي وقت وأي مكان'
                : 'Access anytime, anywhere'}
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center p-8 border-t border-gray-100 dark:border-gray-700">
          <button className="bg-blue-600 text-white px-8 py-2.5 text-base rounded-lg font-medium hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">
            {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
}
