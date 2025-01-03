import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Add from "./pages/Add";
import Notes from "./pages/Notes";
import Edit from "./pages/Edit";

function AppContent() {
  const navigate = useNavigate();
  const [language, setLanguage] = useLocalStorage('ar', 'lang');
  const [darkMode, setDarkMode] = useLocalStorage(false, 'darkMode');
  const [posts, setPosts] = useLocalStorage([], 'posts');

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

  const addPost = (newPost) => {
    const postWithTimestamp = {
      ...newPost,
      id: posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
    };
    setPosts([postWithTimestamp, ...posts]);
  };

  const deletePost = (postId) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه المذكرة؟' : 'Are you sure you want to delete this note?')) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const editPost = (editedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === editedPost.id ? editedPost : post
      )
    );
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
      <Navbar 
        toggleLanguage={toggleLanguage} 
        language={language}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="pt-10 px-4 dark:bg-gray-900">
        <Routes>
          <Route path="/" element={<Home language={language} posts={posts} />} />
          <Route path="/new" element={<Add language={language} onAddPost={addPost} />} />
          <Route path="/saved" element={
            <Notes 
              language={language} 
              posts={posts} 
              onDeletePost={deletePost}
              onEditPost={(post) => navigate(`/edit/${post.id}`)}
            />
          } />
          <Route path="/edit/:id" element={
            <Edit 
              language={language} 
              posts={posts} 
              onEditPost={editPost}
            />
          } />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
