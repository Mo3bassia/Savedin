import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

export default function Add({ language, onAddPost, existingTags, toast, darkMode, setPageTitle }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [status, setStatus] = useState('to-read');
  const [notes, setNotes] = useState('');

  // Refs for animations
  const titleRef = useRef(null);
  const titleInputRef = useRef(null);
  const descriptionRef = useRef(null);
  const linkRef = useRef(null);
  const statusRef = useRef(null);
  const tagsRef = useRef(null);
  const notesRef = useRef(null);
  const submitRef = useRef(null);
  const tagInputRef = useRef(null);

  // Filter existing tags based on current input
  const filteredTags = existingTags.filter(tag => 
    tag.toLowerCase().includes(currentTag.toLowerCase()) && 
    !tags.includes(tag)
  );

  useEffect(() => {
    setPageTitle(language === 'ar' ? 'إضافة منشور' : 'Add Post');
  }, [language, setPageTitle]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLink('');
    setTags([]);
    setCurrentTag('');
    setStatus('to-read');
    setNotes('');
    titleInputRef.current?.focus();
  };

  const handleTagSelect = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setCurrentTag('');
    tagInputRef.current?.focus();
  };

  const handleTagInputChange = (e) => {
    setCurrentTag(e.target.value);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    } else if (e.key === 'Backspace' && !currentTag && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  useEffect(() => {
    // Set initial states
    gsap.set(
      [
        titleRef.current,
        titleInputRef.current,
        descriptionRef.current,
        linkRef.current,
        statusRef.current,
        tagsRef.current,
        notesRef.current,
        submitRef.current
      ],
      {
        opacity: 0,
        y: 30
      }
    );

    // Create timeline for better control
    const tl = gsap.timeline();

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    })
    .to(titleInputRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(linkRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(statusRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(tagsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(notesRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3")
    .to(submitRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)"
    }, "-=0.3");

    return () => {
      tl.kill();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check required fields
    if (!title.trim() || !link.trim()) {
      toast.error(language === 'ar' 
        ? 'يرجى ملء جميع الحقول المطلوبة (العنوان والرابط)' 
        : 'Please fill in all required fields (Title and Link)', {
        position: language === 'ar' ? "bottom-right" : "bottom-left",
        rtl: language === 'ar',
        autoClose: 3000,
        style: {
          background: darkMode ? '#121212' : '#fee2e2',
          color: darkMode ? '#f87171' : '#dc2626',
          borderRadius: '0.5rem'
        }
      });
      return;
    }

    onAddPost({
      title: title.trim(),
      description: description.trim(),
      link: link.trim(),
      tags,
      status,
      notes: notes.trim()
    });
    resetForm();
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 animate-fade-in-up">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <h1 ref={titleRef} className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 opacity-0">
            {language === 'ar' ? 'إضافة منشور جديد' : 'Add New Post'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div ref={titleInputRef} className="opacity-0">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'عنوان المنشور' : 'Post Title'} 
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'ar' ? '10 نصائح للمقابلات الشخصية في شركات التكنولوجيا' : '10 Tips for Tech Job Interviews'}
              />
            </div>

            {/* Description Input */}
            <div ref={descriptionRef} className="opacity-0">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'وصف المنشور' : 'Post Description'}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'ar' ? 'منشور مفيد من محمد أحمد عن تجربته في المقابلات الشخصية مع كبرى شركات التكنولوجيا...' : 'Helpful post by John Smith about his experience with tech interviews at major companies...'}
              />
            </div>

            {/* Link Input */}
            <div ref={linkRef} className="opacity-0">
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'رابط المنشور' : 'Post Link'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="url"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'ar' ? 'https://www.linkedin.com/posts/mohamedahmed_tech-interviews-tips-activity-7142856937264' : 'https://www.linkedin.com/posts/johnsmith_tech-interviews-tips-activity-7142856937264'}
              />
            </div>

            {/* Status Buttons */}
            <div ref={statusRef} className="opacity-0">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'الحالة' : 'Status'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('to-read')}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    status === 'to-read'
                      ? 'bg-blue-500 border-blue-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {language === 'ar' ? 'للقراءة لاحقاً' : 'To Read'}
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('reading')}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    status === 'reading'
                      ? 'bg-yellow-500 border-yellow-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {language === 'ar' ? 'قيد القراءة' : 'Reading'}
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('completed')}
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    status === 'completed'
                      ? 'bg-green-500 border-green-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {language === 'ar' ? 'تمت القراءة' : 'Completed'}
                </button>
              </div>
            </div>

            {/* Tags Input */}
            <div ref={tagsRef} className="opacity-0">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="tags" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {language === 'ar' ? 'الوسوم' : 'Tags'}
                </label>
                {tags.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTags([])}
                    className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    {language === 'ar' ? 'مسح الوسوم' : 'Clear Tags'}
                  </button>
                )}
              </div>

              {/* Previous Tags Suggestions */}
              {existingTags.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {language === 'ar' ? 'الوسوم السابقة:' : 'Previous tags:'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {existingTags.map((tag, index) => (
                      !tags.includes(tag) && (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            setTags([...tags, tag]);
                          }}
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {tag}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <input
                    ref={tagInputRef}
                    type="text"
                    id="tags"
                    value={currentTag}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagKeyDown}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'ar' ? 'مثال: مقابلات_شخصية، نصائح_مهنية، تطوير' : 'e.g. interviews, career_tips, development'}
                  />
                  
                  {/* Tag Suggestions */}
                  {currentTag && existingTags.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-300 dark:border-gray-700">
                      {existingTags
                        .filter(tag => 
                          tag.toLowerCase().includes(currentTag.toLowerCase()) && 
                          !tags.includes(tag)
                        )
                        .map((tag, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setTags([...tags, tag]);
                              setCurrentTag('');
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
                      setTags([...tags, currentTag.trim()]);
                      setCurrentTag('');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {language === 'ar' ? 'إضافة' : 'Add'}
                </button>
              </div>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter(t => t !== tag))}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Notes Input */}
            <div ref={notesRef} className="opacity-0">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'الملاحظات' : 'Notes'}
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={language === 'ar' ? 'نقاط مهمة من المنشور:\n- التحضير الجيد للمقابلة\n- الأسئلة الشائعة وكيفية الإجابة عليها\n- نصائح عن لغة الجسد والتواصل' : 'Key points from the post:\n- Interview preparation\n- Common questions and how to answer them\n- Body language and communication tips'}
              />
            </div>

            {/* Submit Button */}
            <div ref={submitRef} className="text-center opacity-0">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {language === 'ar' ? 'حفظ المنشور' : 'Save Post'}
                <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}