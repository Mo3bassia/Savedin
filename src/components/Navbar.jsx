import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBookmark, FaPlus, FaGlobe, FaBars, FaTimes, FaLinkedin, FaMoon, FaSun, FaCog, FaBook, FaChartBar, FaDatabase } from 'react-icons/fa';
import {useLocalStorage} from '../hooks/useLocalStorage';
import { NavLink } from 'react-router-dom';

export default function Navbar({language, toggleLanguage, darkMode, toggleDarkMode}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const links = [
    {
      to: '/add',
      icon: FaPlus,
      text: language === 'ar' ? 'إضافة منشور' : 'Add Post'
    },
    {
      to: '/notes',
      icon: FaBook,
      text: language === 'ar' ? 'منشورات' : 'My Notes'
    },
    {
      to: '/stats',
      icon: FaChartBar,
      text: language === 'ar' ? 'الإحصائيات' : 'Statistics'
    },
    {
      to: '/data',
      icon: FaDatabase,
      text: language === 'ar' ? 'البيانات' : 'Data'
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50">
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Title */}
          <Link 
            to="/" 
            className={`flex items-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 ${
              isActivePath('/') 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/50'
            }`}
          >
            <FaLinkedin className="text-[#0A66C2] dark:text-blue-400 text-2xl" />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              {language === 'ar' ? 'محفوظاتي' : 'SavedIn'}
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-800/50"
            aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `flex items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50 font-medium dark:bg-blue-900 dark:text-blue-300' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <link.icon className={`${isActivePath(link.to) ? 'text-blue-600 dark:text-blue-300' : ''} min-[1000px]:block hidden`} />
                <span>{link.text}</span>
              </NavLink>
            ))}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1 px-2 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              aria-label={language === 'ar' ? 'Switch to English' : 'Switch to Arabic'}
            >
              <FaGlobe />
              <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`absolute right-0 top-0 h-screen w-72 bg-white/95 dark:bg-gray-800/95 shadow-xl transform transition-transform duration-300 overflow-y-auto ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaLinkedin className="text-[#0A66C2] dark:text-blue-400 text-2xl" />
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {language === 'ar' ? 'محفوظاتي' : 'SavedIn'}
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-500 dark:text-gray-400" size={20} />
                </button>
              </div>
            </div>

            <div className="py-4 px-2 space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => 
                    `flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50/80 font-medium dark:bg-blue-900/30 dark:text-blue-300' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80 dark:text-gray-300 dark:hover:bg-gray-700/30'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className={isActivePath(link.to) ? 'text-blue-600 dark:text-blue-300' : ''} size={20} />
                  <span>{link.text}</span>
                </NavLink>
              ))}
            </div>
            
            <div className="px-2 py-4 border-t dark:border-gray-700">
              {/* Dark Mode Toggle - Mobile */}
              <button
                onClick={() => {
                  toggleDarkMode();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-2 rounded-lg w-full text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                <span>{language === 'ar' ? (darkMode ? 'وضع النهار' : 'وضع الليل') : (darkMode ? 'Light Mode' : 'Dark Mode')}</span>
              </button>

              {/* Language Toggle - Mobile */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-2 rounded-lg w-full text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <FaGlobe size={20} />
                <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}