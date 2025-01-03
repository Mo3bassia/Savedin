import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [language, setLanguage] = useLocalStorage('ar', 'lang');
  const [darkMode, setDarkMode] = useLocalStorage(false, 'darkMode');

  const toggleLanguage = () => {
    setLanguage(prev => {
      if (prev !== 'ar') {
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.lang = 'en';
      }
      return prev === 'ar' ? 'en' : 'ar';
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark:bg-gray-900' : 'bg-white'}`}>
      <BrowserRouter>
        <Navbar 
          toggleLanguage={toggleLanguage} 
          language={language}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="pt-10 px-4 dark:bg-gray-900">
          <Routes>
            <Route index element={<Home language={language} />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}
