import { FaLinkedin, FaGithub, FaExternalLinkAlt, FaHome, FaBookOpen, FaPlus, FaChartBar, FaLink, FaRegClock, FaRegBookmark } from 'react-icons/fa';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import windsurfLogo from '../assets/image.svg';

export default function Footer({ language, darkMode, posts }) {
  // Get 3 random posts
  const randomPosts = useMemo(() => {
    if (!posts?.length) return [];
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [posts]);

  const links = [
    {
      title: language === 'ar' ? 'الرئيسية' : 'Home',
      path: '/',
      icon: <FaHome />
    },
    {
      title: language === 'ar' ? 'منشورات' : 'Posts',
      path: '/notes',
      icon: <FaBookOpen />
    },
    {
      title: language === 'ar' ? 'إضافة منشور' : 'Add Post',
      path: '/add',
      icon: <FaPlus />
    },
    {
      title: language === 'ar' ? 'الإحصائيات' : 'Statistics',
      path: '/stats',
      icon: <FaChartBar />
    }
  ];

  return (
    <footer className="mt-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4">
              {language === 'ar' ? 'عن التطبيق' : 'About'}
            </h3>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FaLinkedin className="text-[#0A66C2] dark:text-blue-400 text-2xl" />
              {language === 'ar' ? 'محفوظاتي' : 'SavedIn'}
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400">
              {language === 'ar' 
                ? 'منصة متكاملة لحفظ وتنظيم منشورات LinkedIn، تتيح لك إضافة الملاحظات والوسوم وتتبع تقدمك في القراءة'
                : 'A comprehensive platform for saving and organizing LinkedIn posts, allowing you to add notes, tags, and track your reading progress'}
            </p>
          </div>

          {/* Site Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4">
              {language === 'ar' ? 'روابط الموقع' : 'Site Links'}
            </h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors flex items-center gap-3"
                  >
                    <span className="w-5 h-5">{link.icon}</span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Random Posts */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4">
              {language === 'ar' ? 'منشورات عشوائية' : 'Random Posts'}
            </h3>
            <ul className="space-y-4">
              {randomPosts.map((post) => (
                <li key={post.id}>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="flex items-center gap-3 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white transition-colors">
                      {post.status === 'completed' ? (
                        <FaRegBookmark className="w-4 h-4 text-green-500" />
                      ) : post.status === 'reading' ? (
                        <FaRegClock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <FaLink className="w-4 h-4 text-blue-500" />
                      )}
                      <p className="text-base line-clamp-1 flex-1">
                        {post.title}
                      </p>
                      <FaExternalLinkAlt className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 flex-wrap justify-center">
              <span className="flex items-center gap-2">
                {language === 'ar' ? 'تم التطوير باستخدام' : 'Made with'}
                <a 
                  href="https://codeium.com/windsurf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img src={windsurfLogo} alt="Windsurf Logo" className="h-4" />
                </a>
              </span>
              <span>{language === 'ar' ? 'بواسطة' : 'by'}</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {language === 'ar' ? 'محمد عباسية' : 'Mohamed Abassia'}
              </span>
              <span> {new Date().getFullYear()} &copy;</span>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/mo3bassia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#0A66C2] dark:text-gray-400 dark:hover:text-[#0A66C2] transition-colors"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/Mo3bassia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label="GitHub Profile"
              >
                <FaGithub className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
