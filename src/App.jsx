import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { useLocalStorage } from "./hooks/useLocalStorage";
import Add from "./pages/Add";
import Notes from "./pages/Notes";
import Edit from "./pages/Edit";
import NotFound from './pages/NotFound';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    toast.success(language === 'ar' ? 'تم إضافة المنشور بنجاح' : 'Post added successfully', {
      position: language === 'ar' ? "bottom-right" : "bottom-left",
      rtl: language === 'ar'
    });
  };

  const deletePost = (postId) => {
    const confirmDelete = () => {
      setPosts(posts.filter(post => post.id !== postId));
      toast.success(language === 'ar' ? 'تم حذف المنشور بنجاح' : 'Post deleted successfully', {
        position: language === 'ar' ? "bottom-right" : "bottom-left",
        rtl: language === 'ar'
      });
    };

    toast.warn(
      <div>
        <div className="mb-3">{language === 'ar' ? 'هل أنت متأكد من حذف هذه المذكرة؟' : 'Are you sure you want to delete this note?'}</div>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              confirmDelete();
              toast.dismiss();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            {language === 'ar' ? 'نعم' : 'Yes'}
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {language === 'ar' ? 'لا' : 'No'}
          </button>
        </div>
      </div>,
      {
        position: language === 'ar' ? "bottom-right" : "bottom-left",
        rtl: language === 'ar',
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const editPost = (editedPost) => {
    const originalPost = posts.find(post => post.id === editedPost.id);
    
    // Check if anything has changed
    const hasChanges = JSON.stringify(originalPost) !== JSON.stringify(editedPost);
    
    if (!hasChanges) {
      toast.info(language === 'ar' ? 'لم يتم إجراء أي تغييرات' : 'No changes were made', {
        position: language === 'ar' ? "bottom-right" : "bottom-left",
        rtl: language === 'ar'
      });
      return;
    }

    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === editedPost.id ? editedPost : post
      )
    );
    toast.success(language === 'ar' ? 'تم تعديل المنشور بنجاح' : 'Post updated successfully', {
      position: language === 'ar' ? "bottom-right" : "bottom-left",
      rtl: language === 'ar'
    });
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
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar 
          language={language} 
          toggleLanguage={toggleLanguage}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <ToastContainer 
          theme={darkMode ? 'dark' : 'light'}
          position={language === 'ar' ? "bottom-right" : "bottom-left"}
          closeOnClick
          pauseOnHover
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
            <Route path="*" element={<NotFound language={language} />} />
          </Routes>
        </main>
      </div>
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
