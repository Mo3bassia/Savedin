import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Add from './pages/Add';
import Edit from "./pages/Edit";
import NotFound from './pages/NotFound';
import Data from './pages/Data';
import Stats from './pages/Stats';
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const navigate = useNavigate();
  const [language, setLanguage] = useLocalStorage('ar', 'lang');
  const [darkMode, setDarkMode] = useLocalStorage(false, 'darkMode');
  const [posts, setPosts] = useLocalStorage([], 'posts');

  const setPageTitle = (pageTitle) => {
    const appName = language === 'ar' ? 'محفوظاتي' : 'SavedIn';
    document.title = `${appName} | ${pageTitle}`;
  };

  // Get all unique tags from posts
  const getAllTags = () => {
    const allTags = posts.reduce((tags, post) => [...tags, ...post.tags], []);
    return [...new Set(allTags)];
  };

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
      createdAt: new Date().toISOString()
    };
    setPosts(prevPosts => [postWithTimestamp, ...prevPosts]);
    localStorage.setItem('posts', JSON.stringify([postWithTimestamp, ...posts]));
    toast.success(language === 'ar' ? 'تمت الإضافة بنجاح' : 'Added successfully');
  };

  const deletePost = (postId) => {
    const confirmDelete = () => {
      setPosts(posts.filter(post => post.id !== postId));
      // Delay success message to show after confirmation dismissal
      setTimeout(() => {
        toast.success(language === 'ar' ? 'تم حذف المنشور بنجاح' : 'Post deleted successfully', {
          position: language === 'ar' ? "bottom-right" : "bottom-left",
          rtl: language === 'ar',
          autoClose: 3000,
          style: {
            background: darkMode ? '#121212' : '#dcfce7',
            color: darkMode ? '#4ade80' : '#16a34a',
            borderRadius: '0.5rem'
          }
        });
      }, 300); // Small delay to ensure confirmation is dismissed first
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
        style: {
          background: darkMode ? '#121212' : '#fff',
          color: darkMode ? '#fff' : '#000',
          borderRadius: '0.5rem'
        }
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
            <Route path="/" element={<Home language={language} setPageTitle={setPageTitle} />} />
            <Route 
              path="/notes" 
              element={
                <Notes 
                  language={language}
                  posts={posts}
                  onDeletePost={deletePost}
                  onEditPost={editPost}
                  setPageTitle={setPageTitle}
                />
              } 
            />
            <Route 
              path="/add" 
              element={
                <Add 
                  language={language}
                  onAddPost={addPost}
                  existingTags={getAllTags()}
                  toast={toast}
                  darkMode={darkMode}
                  setPageTitle={setPageTitle}
                />
              } 
            />
            <Route 
              path="/stats" 
              element={
                <Stats 
                  language={language}
                  posts={posts}
                  setPageTitle={setPageTitle}
                  darkMode={darkMode}
                />
              } 
            />
            <Route 
              path="/data" 
              element={
                <Data 
                  language={language}
                  posts={posts}
                  setPosts={setPosts}
                />
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <Edit
                  language={language}
                  posts={posts}
                  onEditPost={editPost}
                  existingTags={getAllTags()}
                  setPageTitle={setPageTitle}
                />
              }
            />
            <Route path="*" element={<NotFound language={language} setPageTitle={setPageTitle} />} />
          </Routes>
        </main>
        <Footer language={language} darkMode={darkMode} posts={posts} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
