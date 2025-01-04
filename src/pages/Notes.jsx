import { useState, useMemo, useEffect, useRef } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { FaFont } from 'react-icons/fa';
import { useLocalStorage } from '../hooks/useLocalStorage';
import noResultsIllustration from '../assets/illustrations/no-results.svg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Notes({ language, posts, onDeletePost, onEditPost }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [fontSize, setFontSize] = useLocalStorage('medium', 'postsFontSize');

  const fontSizes = {
    small: '14px',
    medium: '16px',
    large: '18px'
  };

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const postsRef = useRef(null);
  const postsContainerRef = useRef(null);

  // Function to clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedDate('');
    setSelectedStatus('');
    setSelectedTag('');
  };

  // Check if any filter is active
  const isFiltersActive = searchQuery || selectedDate || selectedStatus || selectedTag;

  // Get unique tags from all posts
  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [posts]);

  // Filter posts based on search criteria
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      console.log('Post status:', post.status, 'Selected status:', selectedStatus); // Debug line
      
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDate = selectedDate === '' || 
        new Date(post.createdAt).toLocaleDateString() === new Date(selectedDate).toLocaleDateString();

      const matchesStatus = selectedStatus === '' || post.status === selectedStatus;

      const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);

      return matchesSearch && matchesDate && matchesStatus && matchesTag;
    });
  }, [posts, searchQuery, selectedDate, selectedStatus, selectedTag]);

  // Initial animations
  useEffect(() => {
    // Set initial states
    gsap.set([headerRef.current, filtersRef.current], {
      opacity: 0,
      y: 30
    });

    // Create timeline for better control
    const tl = gsap.timeline();

    tl.to(headerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
      clearProps: "all"
    })
    .to(filtersRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
      clearProps: "all"
    }, "-=0.3");

    return () => {
      tl.kill();
    };
  }, []); // Initial animation only runs once

  // Animation for filtered posts
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // Skip the animation on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const posts = postsRef.current?.querySelectorAll('.post-item');
    if (posts?.length) {
      const tl = gsap.timeline();

      // Set initial state for all posts
      gsap.set(posts, {
        opacity: 0,
        y: 30
      });

      // Animate each post with a delay
      posts.forEach((post, index) => {
        tl.to(post, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
          clearProps: "all"
        }, index * 0.3);
      });
    }
  }, [filteredPosts]);

  const formatDate = (date) => {
    return format(new Date(date), language === 'ar' ? 'dd MMMM yyyy hh:mm a' : 'dd MMMM yyyy hh:mm a', {
      locale: language === 'ar' ? arSA : enUS
    });
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 animate-fade-in-up">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {language === 'ar' ? 'مذكراتي' : 'My Notes'}
            </h1>
          </div>

          {/* Search and Filters */}
          <div ref={filtersRef} className="space-y-4 mb-8">
            {/* Font Size and Clear Filters */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <FaFont className="text-gray-500" />
                <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1">
                  {['small', 'medium', 'large'].map(size => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={`px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                        fontSize === size
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {language === 'ar' 
                        ? size === 'small' ? 'صغير' : size === 'medium' ? 'متوسط' : 'كبير'
                        : size === 'small' ? 'S' : size === 'medium' ? 'M' : 'L'
                      }
                    </button>
                  ))}
                </div>
              </div>
              
              {isFiltersActive && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-300 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  {language === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                </button>
              )}
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث في المذكرات...' : 'Search notes...'}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Filter */}
              <div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
                  <option value="to-read">{language === 'ar' ? 'للقراءة لاحقاً' : 'To Read'}</option>
                  <option value="reading">{language === 'ar' ? 'قيد القراءة' : 'Reading'}</option>
                  <option value="completed">{language === 'ar' ? 'تمت القراءة' : 'Completed'}</option>
                </select>
              </div>

              {/* Tags Filter */}
              <div>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{language === 'ar' ? 'جميع الوسوم' : 'All Tags'}</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            <div ref={postsRef} className="grid gap-6">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <img 
                    src={noResultsIllustration} 
                    alt="No results" 
                    className="w-64 h-64 mx-auto mb-4 animate-float"
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                  </p>
                </div>
              ) : (
                filteredPosts.map(post => (
                  <div key={post.id} className="post-item">
                    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2" style={{ fontSize: fontSizes[fontSize] }}>
                            {post.title}
                          </h3>
                          {post.description && (
                            <p className="text-gray-600 dark:text-gray-300 mb-4" style={{ fontSize: fontSizes[fontSize] }}>
                              {post.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEditPost(post)}
                            className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => onDeletePost(post.id)}
                            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatDate(post.createdAt)}</span>
                        <span
                          className={`px-3 py-1 rounded-full ${
                            post.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : post.status === 'reading'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          }`}
                        >
                          {post.status === 'completed'
                            ? language === 'ar'
                              ? 'تمت القراءة'
                              : 'Completed'
                            : post.status === 'reading'
                            ? language === 'ar'
                              ? 'قيد القراءة'
                              : 'Reading'
                            : language === 'ar'
                            ? 'للقراءة لاحقاً'
                            : 'To Read'}
                        </span>
                      </div>
                      {post.link && (
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {language === 'ar' ? 'فتح الرابط' : 'Open Link'}
                          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </article>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
