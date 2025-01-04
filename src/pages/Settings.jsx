import { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import gsap from 'gsap';

const Settings = ({ language, posts, setPosts }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const backupRef = useRef(null);
  const restoreRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set initial states
    gsap.set([titleRef.current, backupRef.current, restoreRef.current], {
      opacity: 0,
      y: 30
    });

    // Create timeline for better control
    const tl = gsap.timeline();

    // Animate elements
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .to(backupRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.6")
    .to(restoreRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.6");

    return () => {
      tl.kill();
    };
  }, []);

  const handleBackup = () => {
    const data = {
      posts,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-notes-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(language === 'ar' ? 'تم حفظ النسخة الاحتياطية' : 'Backup saved successfully');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          console.log('Parsed data:', data);
          if (data.posts) {
            if (data.posts.length === 0) {
              toast.warning(
                language === 'ar'
                  ? 'ملف النسخ الاحتياطي فارغ'
                  : 'Backup file is empty'
              );
              setSelectedFile(null);
              setPreviewData(null);
            } else {
              setPreviewData(data);
              setSelectedFile(file);
              console.log('Preview data set:', data);
            }
          } else {
            toast.error(
              language === 'ar'
                ? 'ملف غير صالح'
                : 'Invalid backup file'
            );
            setSelectedFile(null);
            setPreviewData(null);
          }
        } catch (error) {
          console.error('Error parsing file:', error);
          toast.error(
            language === 'ar'
              ? 'حدث خطأ أثناء قراءة الملف'
              : 'Error reading file'
          );
          setSelectedFile(null);
          setPreviewData(null);
        }
        setIsLoading(false);
      };
      reader.readAsText(file);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFile(null);
    setPreviewData(null);
  };

  const handleRestore = () => {
    if (previewData?.posts) {
      setPosts(previewData.posts);
      localStorage.setItem('posts', JSON.stringify(previewData.posts));
      toast.success(
        language === 'ar' 
          ? 'تم استعادة البيانات بنجاح' 
          : 'Data restored successfully'
      );
      resetFileInput();
    }
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 animate-fade-in-up">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {/* Header */}
          <div ref={titleRef} className="text-center mb-8 opacity-0">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Backup Section */}
            <div 
              ref={backupRef}
              className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden opacity-0"
            >
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {language === 'ar' ? 'نسخ البيانات' : 'Backup Data'}
                </h2>
                <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-300">
                  <p>
                    {language === 'ar' 
                      ? 'قم بحفظ نسخة احتياطية من بياناتك للاحتفاظ بها'
                      : 'Save a backup copy of your data for safekeeping'}
                  </p>
                </div>
                <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-md p-4">
                  <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-auto max-h-40">
                    {JSON.stringify({ posts: posts.length }, null, 2)}
                  </pre>
                </div>
                <div className="mt-5">
                  <button
                    onClick={handleBackup}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {language === 'ar' ? 'تحميل نسخة احتياطية' : 'Download Backup'}
                  </button>
                </div>
              </div>
            </div>

            {/* Restore Section */}
            <div 
              ref={restoreRef}
              className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden opacity-0"
            >
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {language === 'ar' ? 'استعادة البيانات' : 'Restore Data'}
                </h2>
                <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-300">
                  <p>
                    {language === 'ar'
                      ? 'قم باستعادة بياناتك من نسخة احتياطية سابقة'
                      : 'Restore your data from a previous backup'}
                  </p>
                </div>
                
                <div className="mt-5 space-y-4">
                  {/* File Input */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        dark:file:bg-blue-900/50 dark:file:text-blue-200
                        hover:file:bg-blue-100 dark:hover:file:bg-blue-900
                        file:cursor-pointer"
                    />
                  </div>

                  {/* Loading State */}
                  {isLoading && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
                    </div>
                  )}

                  {/* Preview */}
                  {previewData && !isLoading && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-md p-4">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          {language === 'ar' ? 'معاينة البيانات' : 'Data Preview'}
                        </h3>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {language === 'ar' ? 'عدد المنشورات:' : 'Number of posts:'} {previewData.posts.length}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {language === 'ar' ? 'تاريخ النسخ:' : 'Backup date:'} {new Date(previewData.exportDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                        {/* Restore Button */}
                        <button
                          onClick={handleRestore}
                          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          {language === 'ar' ? 'استعادة البيانات' : 'Restore Data'}
                        </button>

                        {/* Cancel Button */}
                        <button
                          onClick={resetFileInput}
                          className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
