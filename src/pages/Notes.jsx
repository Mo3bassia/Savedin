import { useState, useMemo, useEffect, useRef } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { FaFont, FaSearch, FaChevronDown, FaPen } from 'react-icons/fa';
import { useLocalStorage } from '../hooks/useLocalStorage';
import noResultsIllustration from '../assets/illustrations/no-results.svg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function Notes({ language, posts, onDeletePost, onEditPost, setPageTitle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilters, setTagFilters] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const defaultFontSize = 'md';
  const [fontSize, setFontSize] = useLocalStorage('postsFontSize', defaultFontSize);

  const fontSizes = {
    'xs': { title: '16px', content: '12px' },
    'sm': { title: '18px', content: '14px' },
    'md': { title: '20px', content: '16px' },
    'lg': { title: '22px', content: '18px' },
    'xl': { title: '24px', content: '20px' }
  };

  const getFontSize = (type) => {
    const currentSize = fontSize || defaultFontSize;
    return fontSizes[currentSize]?.[type] || fontSizes[defaultFontSize][type];
  };

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const postsRef = useRef(null);
  const postsContainerRef = useRef(null);

  // Function to clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTagFilters([]);
    setDateFilter('');
  };

  // Check if any filter is active
  const isFiltersActive = searchQuery || statusFilter !== 'all' || tagFilters.length > 0 || dateFilter;

  // Get unique tags from all posts
  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [posts]);

  // Filter posts based on search criteria
  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        const matchesSearch = searchQuery === '' || 
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || post.status === statusFilter;

        const matchesTags = tagFilters.length === 0 || tagFilters.every(tag => post.tags.includes(tag));

        const matchesDate = dateFilter === '' || 
          new Date(post.createdAt).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();

        return matchesSearch && matchesStatus && matchesTags && matchesDate;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date, newest first
  }, [posts, searchQuery, statusFilter, tagFilters, dateFilter]);

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

  useEffect(() => {
    setPageTitle(language === 'ar' ? 'المذكرات' : 'Notes');
  }, [language, setPageTitle]);

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), language === 'ar' ? 'dd MMMM yyyy hh:mm a' : 'dd MMMM yyyy hh:mm a', {
      locale: language === 'ar' ? arSA : enUS
    });
  };

  // Font size control component
  const FontSizeControl = () => {
    const fontSizeOptions = [
      { value: 'xs', labelAr: 'صغير جداً', labelEn: 'Extra Small', size: '16px' },
      { value: 'sm', labelAr: 'صغير', labelEn: 'Small', size: '18px' },
      { value: 'md', labelAr: 'متوسط', labelEn: 'Medium', size: '20px' },
      { value: 'lg', labelAr: 'كبير', labelEn: 'Large', size: '22px' },
      { value: 'xl', labelAr: 'كبير جداً', labelEn: 'Extra Large', size: '24px' }
    ];

    return (
      <div className="flex flex-col gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <FaFont className="text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {language === 'ar' ? 'حجم الخط' : 'Font Size'}
          </span>
        </div>
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2" 
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          {fontSizeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFontSize(option.value)}
              className={`
                py-2 px-3 rounded-lg flex flex-col items-center justify-center gap-1
                transition-all duration-200
                ${fontSize === option.value
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }
              `}
              title={language === 'ar' ? option.labelAr : option.labelEn}
            >
              <span style={{ fontSize: option.size }}>A</span>
              <span className="text-xs whitespace-nowrap">
                {language === 'ar' ? option.labelAr : option.labelEn}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Handle tag click to toggle filter
  const handleTagClick = (clickedTag) => {
    setTagFilters(prevFilters =>
      prevFilters.includes(clickedTag)
        ? prevFilters.filter(tag => tag !== clickedTag)
        : [...prevFilters, clickedTag]
    );
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 animate-fade-in-up">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {language === 'ar' ? 'منشوراتي' : 'My Notes'}
            </h1>
          </div>

          {/* Font Size Control */}
          <div className="mb-6">
            <FontSizeControl />
          </div>

          {/* Search and Filters */}
          <div ref={filtersRef} className="space-y-4 mb-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث عن مذكرة...' : 'Search notes...'}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
              />
              <FaSearch className={`absolute top-1/2 transform -translate-y-1/2 ${language === 'ar' ? 'left-3' : 'right-3'} text-gray-400`} />
            </div>

            {/* Other Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className="flex-1 min-w-[200px] relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent appearance-none cursor-pointer"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
                  <option value="reading">{language === 'ar' ? 'قيد القراءة' : 'Reading'}</option>
                  <option value="completed">{language === 'ar' ? 'مكتمل' : 'Completed'}</option>
                  <option value="new">{language === 'ar' ? 'جديد' : 'New'}</option>
                </select>
                <div className={`absolute inset-y-0 ${language === 'ar' ? 'left-4' : 'right-4'} flex items-center pointer-events-none`}>
                  <FaChevronDown className="text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              {/* Tags Filter */}
              <div className="flex-1 min-w-[200px] relative">
                <select
                  value={tagFilters[tagFilters.length - 1] || 'all'}
                  onChange={(e) => handleTagClick(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent appearance-none cursor-pointer"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                  <option value="all">{language === 'ar' ? 'جميع الوسوم' : 'All Tags'}</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <div className={`absolute inset-y-0 ${language === 'ar' ? 'left-4' : 'right-4'} flex items-center pointer-events-none`}>
                  <FaChevronDown className="text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              {/* Selected Tags */}
              {tagFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagFilters.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500 text-white"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagClick(tag)}
                        className="ml-2 hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Date Filter */}
              <div className="flex-1 min-w-[200px]">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent cursor-pointer"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {isFiltersActive && (
            <div className="flex justify-center mb-6">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-6 py-2.5 text-base font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl shadow-sm transition-all duration-200 transform hover:scale-105"
              >
                <span>{language === 'ar' ? 'مسح جميع الفلاتر' : 'Clear All Filters'}</span>
                <span className="text-lg">×</span>
              </button>
            </div>
          )}

          {/* Active Filters Display */}
          {isFiltersActive && (
            <div className="mb-4 flex flex-wrap gap-2 items-center text-sm text-gray-600 dark:text-gray-400">
              <span>{language === 'ar' ? 'الفلاتر النشطة:' : 'Active filters:'}</span>
              {searchQuery && (
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  {language === 'ar' ? 'بحث: ' : 'Search: '}{searchQuery}
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  {language === 'ar' ? 'الحالة: ' : 'Status: '}{statusFilter}
                </span>
              )}
              {tagFilters.length > 0 && (
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  {language === 'ar' ? 'الوسوم: ' : 'Tags: '}{tagFilters.join(', ')}
                </span>
              )}
              {dateFilter && (
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  {language === 'ar' ? 'التاريخ: ' : 'Date: '}
                  {new Date(dateFilter).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                </span>
              )}
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-6">
            {/* Results count when filters are active */}
            {isFiltersActive && filteredPosts.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' 
                  ? `تم العثور على ${filteredPosts.length} ${filteredPosts.length === 1 ? 'منشور' : 'منشورات'} من إجمالي ${posts.length}`
                  : `Found ${filteredPosts.length} ${filteredPosts.length === 1 ? 'post' : 'posts'} out of ${posts.length}`
                }
                {tagFilters.length > 0 && (
                  <span className="mx-1">
                    {language === 'ar' ? 'في تصنيف' : 'in tags'} "{tagFilters.join(', ')}"
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="mx-1">
                    {language === 'ar' ? 'بحالة' : 'with status'} "
                    {statusFilter === 'reading' 
                      ? language === 'ar' ? 'قيد القراءة' : 'Reading'
                      : statusFilter === 'completed'
                      ? language === 'ar' ? 'مكتمل' : 'Completed'
                      : language === 'ar' ? 'جديد' : 'New'
                    }"
                  </span>
                )}
                {searchQuery && (
                  <span className="mx-1">
                    {language === 'ar' ? 'تطابق البحث' : 'matching'} "{searchQuery}"
                  </span>
                )}
              </div>
            )}
            <div ref={postsContainerRef} className="grid gap-6">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-8" ref={postsRef}>
                  <img 
                    src={noResultsIllustration} 
                    alt="No results" 
                    className="w-64 h-64 mx-auto mb-4 opacity-75 transition-transform duration-1000 ease-in-out hover:scale-105"
                  />
                  <p className="text-gray-500 dark:text-gray-400 transition-opacity duration-500">
                    {isFiltersActive 
                      ? (language === 'ar' ? 'لا توجد نتائج تطابق معايير البحث' : 'No results match your search criteria')
                      : (language === 'ar' ? 'لا توجد منشورات بعد' : 'No posts yet')}
                  </p>
                  {isFiltersActive && (
                    <button
                      onClick={clearAllFilters}
                      className="mt-4 text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-300"
                    >
                      {language === 'ar' ? 'مسح عوامل التصفية' : 'Clear all filters'}
                    </button>
                  )}
                </div>
              ) : (
                filteredPosts.map(post => (
                  <div key={post.id} className="post-item">
                    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 
                            className="font-semibold text-gray-900 dark:text-white mb-2" 
                            style={{ fontSize: getFontSize('title') }}
                          >
                            {post.title}
                          </h3>
                          {post.description && (
                            <p 
                              className="text-gray-600 dark:text-gray-300 mb-4"
                              style={{ fontSize: getFontSize('content') }}
                            >
                              {post.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/edit/${post.id}`}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/50 transition-all"
                            title={language === 'ar' ? 'تعديل' : 'Edit'}
                          >
                            <FaPen className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => onDeletePost(post.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/50 transition-all"
                            title={language === 'ar' ? 'حذف' : 'Delete'}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                          <button
                            key={tagIndex}
                            onClick={() => handleTagClick(tag)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-all
                              ${tagFilters.includes(tag) 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                              } cursor-pointer`}
                          >
                            {tag}
                            {tagFilters.includes(tag) && (
                              <span className="ml-1.5 text-xs">×</span>
                            )}
                          </button>
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
                      {post.notes && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            {language === 'ar' ? 'ملاحظات:' : 'Notes:'}
                          </h4>
                          <p 
                            className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap"
                            style={{ fontSize: getFontSize('content') }}
                          >
                            {post.notes}
                          </p>
                        </div>
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
