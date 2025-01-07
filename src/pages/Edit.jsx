import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const statusOptions = {
  'to-read': { ar: 'للقراءة لاحقاً', en: 'To Read' },
  'reading': { ar: 'قيد القراءة', en: 'Reading' },
  'completed': { ar: 'تمت القراءة', en: 'Completed' }
};

export default function Edit({ language, posts, onEditPost, existingTags, setPageTitle }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const post = posts.find(p => p.id === parseInt(id));
  const [title, setTitle] = useState(post?.title || '');
  const [description, setDescription] = useState(post?.description || '');
  const [link, setLink] = useState(post?.link || '');
  const [tags, setTags] = useState(post?.tags || []);
  const [status, setStatus] = useState(post?.status || 'to-read');
  const [notes, setNotes] = useState(post?.notes || '');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setPageTitle(language === 'ar' ? 'تعديل منشور' : 'Edit Post');
  }, [language, setPageTitle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const editedPost = {
      id: parseInt(id),
      title,
      description,
      link,
      tags,
      status,
      notes
    };

    onEditPost(editedPost);
    navigate('/notes');
  };

  const handleTagClick = (tag) => {
    setTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 animate-fade-in-up">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {language === 'ar' ? 'تعديل المذكرة' : 'Edit Note'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'العنوان' : 'Title'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'الوصف' : 'Description'}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>

            {/* Link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'الرابط' : 'Link'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'التصنيفات' : 'Tags'}
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {existingTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                      ${tags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
              <input
  type="text"
  name="customTag"
  value={newTag}
  onChange={(e) => setNewTag(e.target.value)}
  placeholder={language === 'ar' ? 'أضف تصنيف جديد' : 'Add custom tag'}
  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag(e);
    }
  }}
/>
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {language === 'ar' ? 'أضف' : 'Add'}
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'ar' ? 'التصنيفات المختارة:' : 'Selected tags:'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagClick(tag)}
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'الحالة' : 'Status'}
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusOptions).map(([value, labels]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStatus(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${status === value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                  >
                    {labels[language]}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'ملاحظات' : 'Notes'}
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/notes')}
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
