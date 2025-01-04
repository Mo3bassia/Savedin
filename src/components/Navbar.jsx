import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBookmark, FaPlus, FaGlobe, FaBars, FaTimes, FaLinkedin, FaMoon, FaSun, FaCog } from 'react-icons/fa';
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

  return (
    <nav className={`${darkMode ? 'dark:bg-gray-800 dark:text-white' : 'bg-white'} shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] fixed top-0 left-0 right-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link 
            to="/" 
            className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 ${
              isActivePath('/') 
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <FaLinkedin className="text-[#0A66C2] dark:text-blue-400 text-2xl" />
            <span className="font-bold text-xl">{language === 'ar' ? 'مذكرات' : 'Notes'}</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/saved"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-medium dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              <FaBookmark className={isActivePath('/saved') ? 'text-blue-600 dark:text-blue-300' : ''} />
              <span>{language === 'ar' ? 'المحفوظات' : 'Saved Posts'}</span>
            </NavLink>
            
            <NavLink
              to="/new"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-medium dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              <FaPlus className={isActivePath('/new') ? 'text-blue-600 dark:text-blue-300' : ''} />
              <span>{language === 'ar' ? 'إضافة منشور' : 'Add Post'}</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-medium dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
            >
              <FaCog className={isActivePath('/settings') ? 'text-blue-600 dark:text-blue-300' : ''} />
              <span>{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
            </NavLink>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <FaGlobe />
              <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          } md:hidden overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className="py-3 space-y-2">
            <NavLink
              to="/saved"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-medium dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <FaBookmark className={isActivePath('/saved') ? 'text-blue-600 dark:text-blue-300' : ''} />
              <span>{language === 'ar' ? 'المحفوظات' : 'Saved Posts'}</span>
            </NavLink>
            
            <NavLink
              to="/new"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-medium dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <FaPlus className={isActivePath('/new') ? 'text-blue-600 dark:text-blue-300' : ''} />
              <span>{language === 'ar' ? 'إضافة منشور' : 'Add Post'}</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-medium dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <FaCog className={isActivePath('/settings') ? 'text-blue-600 dark:text-blue-300' : ''} />
              <span>{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
            </NavLink>

            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={() => {
                toggleDarkMode();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-lg w-full text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
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
              className="flex items-center gap-2 px-4 py-3 rounded-lg w-full text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FaGlobe />
              <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}