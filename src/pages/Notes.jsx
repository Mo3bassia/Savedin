import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

export default function Notes({ language, posts, onDeletePost, onEditPost }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Get unique tags from all posts
  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [posts]);

  // Filter posts based on search criteria
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
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

  const formatDate = (date, locale) => {
    return format(new Date(date), 'PPpp', {
      locale: locale === 'ar' ? ar : enUS
    });
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 animate-fade-in-up">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {language === 'ar' ? 'مذكراتي' : 'My Notes'}
            </h1>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Search Input */}
            <div className="col-span-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ar' ? 'ابحث في المذكرات...' : 'Search notes...'}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

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
                <option value="">
                  {language === 'ar' ? 'كل الحالات' : 'All Statuses'}
                </option>
                <option value="to-read">
                  {language === 'ar' ? 'للقراءة لاحقاً' : 'To Read'}
                </option>
                <option value="reading">
                  {language === 'ar' ? 'قيد القراءة' : 'Reading'}
                </option>
                <option value="completed">
                  {language === 'ar' ? 'تمت القراءة' : 'Completed'}
                </option>
              </select>
            </div>

            {/* Tags Filter */}
            <div className="col-span-full">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">
                  {language === 'ar' ? 'كل التصنيفات' : 'All Tags'}
                </option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'لا توجد مذكرات' : 'No notes found'}
              </div>
            ) : (
              filteredPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(post.createdAt, language)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditPost(post)}
                        className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm ${
                        post.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : post.status === 'reading'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
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

                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>

                  {/* Notes */}
                  {post.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {post.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
