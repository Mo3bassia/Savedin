export default function Home({ language }) {
  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-block p-3 mb-6 rounded-2xl bg-gradient-to-tr from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
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
            <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {language === 'ar' ? 'احفظ أفكارك المهنية' : 'Save Your Professional Insights'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
              {language === 'ar' 
                ? 'احفظ وصنف ونظم المنشورات المهمة من LinkedIn في مكان واحد'
                : 'Save, categorize, and organize important LinkedIn posts in one place'}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {/* Feature 1 */}
            <div className="group hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg shadow-blue-500/5 dark:shadow-blue-500/2">
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ar' 
                    ? 'واجهة بسيطة تركز على ما يهم'
                    : 'Simple interface focused on what matters'}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg shadow-purple-500/5 dark:shadow-purple-500/2">
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'ar'
                    ? 'احتفظ بملاحظاتك آمنة ومحمية'
                    : 'Keep your notes safe and protected'}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group hover:-translate-y-1 transition-transform duration-300">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg shadow-orange-500/5 dark:shadow-orange-500/2">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-orange-600 dark:text-orange-400"
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
          </div>

          {/* CTA Section */}
          <div className="text-center pb-12">
            <button className="inline-flex items-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {language === 'ar' ? 'ابدأ الآن' : 'Get Started'}
              <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
