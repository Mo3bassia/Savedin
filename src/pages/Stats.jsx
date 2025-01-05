import { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  TimeScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { arSA, enUS } from "date-fns/locale";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  TimeScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function Stats({ language, posts, darkMode, setPageTitle }) {
  const titleRef = useRef(null);
  const chartsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    setPageTitle(language === 'ar' ? 'الإحصائيات' : 'Statistics');
  }, [language, setPageTitle]);

  // Calculate statistics
  const stats = useMemo(() => {
    // Check if posts array is empty or undefined
    if (!posts || posts.length === 0) {
      return {
        totalPosts: 0,
        statusCount: { reading: 0, completed: 0, "in-progress": 0 },
        avgPostsPerMonth: 0,
        postsWithNotes: 0,
        postsWithLinks: 0,
        avgTagsPerPost: 0,
        totalTags: 0,
        topTags: [],
        mostActiveMonth: null,
        cumulativePosts: [],
        avgDescriptionLength: 0,
        longestDescription: { title: '', length: 0 },
        shortestDescription: { title: '', length: Infinity },
        postsWithoutTags: 0,
        mostUsedStatus: { status: '', count: 0 },
        lastAddedPost: null,
        oldestPost: null,
        daysSinceLastPost: 0,
        postsThisWeek: 0,
        postsThisMonth: 0,
        mostActiveDay: { date: '', count: 0 },
        avgPostsPerDay: 0,
        statusOverTime: {},
        postsMetadata: {},
        postsPerDay: []
      };
    }

    const totalPosts = posts.length;

    // Status distribution
    const statusCount = posts.reduce((acc, post) => {
      acc[post.status] = (acc[post.status] || 0) + 1;
      return acc;
    }, {});

    // Tags statistics
    const allTags = posts.reduce((acc, post) => {
      post.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    // Sort tags by frequency
    const topTags = Object.entries(allTags)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Posts per month
    const postsPerMonth = posts.reduce((acc, post) => {
      const date = new Date(post.createdAt);
      const monthYear = date.toLocaleDateString(
        language === "ar" ? "ar-EG" : "en-US",
        {
          year: "numeric",
          month: "short",
        }
      );
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    // Average posts per month
    const months = Object.keys(postsPerMonth).length;
    const avgPostsPerMonth = months ? (totalPosts / months).toFixed(1) : 0;

    // Most active month
    const mostActiveMonth = Object.entries(postsPerMonth).sort(
      ([, a], [, b]) => b - a
    )[0];

    // Posts with notes vs without notes
    const postsWithNotes = posts.filter(
      (post) => post.notes && post.notes.trim()
    ).length;
    const postsWithoutNotes = totalPosts - postsWithNotes;

    // Posts with links vs without links
    const postsWithLinks = posts.filter(
      (post) => post.link && post.link.trim()
    ).length;
    const postsWithoutLinks = totalPosts - postsWithLinks;

    // Average tags per post
    const totalTags = posts.reduce((sum, post) => sum + post.tags.length, 0);
    const avgTagsPerPost =
      totalTags > 0 ? (totalTags / totalPosts).toFixed(1) : 0;

    // Posts growth over time
    const postsOverTime = posts
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .reduce((acc, post) => {
        const date = new Date(post.createdAt);
        const key = date.toISOString().split("T")[0];
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

    // Convert to array format for the chart
    const postsPerDay = Object.entries(postsOverTime).map(([date, count]) => ({
      date,
      count
    }));

    // Calculate cumulative sum
    let sum = 0;
    const cumulativePosts = Object.entries(postsOverTime).map(
      ([date, count]) => {
        sum += count;
        return { date, total: sum };
      }
    );

    // New calculations
    const descriptionLengths = posts.map(post => ({
      title: post.title,
      length: post.description.length
    }));
    const avgDescriptionLength = (descriptionLengths.reduce((sum, item) => sum + item.length, 0) / totalPosts).toFixed(1);
    const longestDescription = descriptionLengths.reduce((max, item) => item.length > max.length ? item : max, { length: 0 });
    const shortestDescription = descriptionLengths.reduce((min, item) => item.length < min.length ? item : min, { length: Infinity });

    const postsWithoutTags = posts.filter(post => !post.tags.length).length;

    const statusCounts = Object.entries(statusCount);
    const mostUsedStatus = statusCounts.reduce((max, [status, count]) => 
      count > max.count ? { status, count } : max, 
      { status: '', count: 0 }
    );

    const lastAddedPost = posts.reduce((latest, post) => 
      new Date(post.createdAt) > new Date(latest?.createdAt || 0) ? post : latest
    );

    const oldestPost = posts.reduce((oldest, post) => 
      new Date(post.createdAt) < new Date(oldest?.createdAt || Infinity) ? post : oldest
    );

    const now = new Date();
    const daysSinceLastPost = Math.floor((now - new Date(lastAddedPost.createdAt)) / (1000 * 60 * 60 * 24));

    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const postsThisWeek = posts.filter(post => new Date(post.createdAt) > oneWeekAgo).length;
    const postsThisMonth = posts.filter(post => new Date(post.createdAt) > oneMonthAgo).length;

    const postsByDay = posts.reduce((acc, post) => {
      const date = new Date(post.createdAt).toLocaleDateString(
        language === 'ar' ? 'ar-EG' : 'en-US',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        }
      );
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const mostActiveDay = Object.entries(postsByDay)
      .reduce((max, [date, count]) => count > max.count ? { date, count } : max, { date: '', count: 0 });

    const totalDays = Math.ceil((new Date(lastAddedPost.createdAt) - new Date(oldestPost.createdAt)) / (1000 * 60 * 60 * 24)) || 1;
    const avgPostsPerDay = (totalPosts / totalDays).toFixed(2);

    // Add new chart data for post status distribution over time
    const statusOverTime = posts
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .reduce((acc, post) => {
        const month = new Date(post.createdAt).toLocaleDateString(
          language === 'ar' ? 'ar-EG' : 'en-US',
          { year: 'numeric', month: 'short' }
        );
        
        if (!acc[month]) {
          acc[month] = { reading: 0, completed: 0, "in-progress": 0 };
        }
        acc[month][post.status]++;
        return acc;
      }, {});

    // Add new chart data for posts with/without links and notes
    const postsMetadata = {
      withLinks: postsWithLinks,
      withoutLinks: postsWithoutLinks,
      withNotes: postsWithNotes,
      withoutNotes: postsWithoutNotes,
      withTags: totalPosts - postsWithoutTags,
      withoutTags: postsWithoutTags
    };

    return {
      totalPosts,
      statusCount,
      topTags,
      postsPerMonth,
      avgPostsPerMonth,
      mostActiveMonth: mostActiveMonth
        ? {
            month: mostActiveMonth[0],
            count: mostActiveMonth[1],
          }
        : null,
      cumulativePosts,
      postsWithNotes,
      postsWithoutNotes,
      postsWithLinks,
      postsWithoutLinks,
      avgTagsPerPost,
      totalTags,
      avgDescriptionLength,
      longestDescription,
      shortestDescription,
      postsWithoutTags,
      mostUsedStatus,
      lastAddedPost,
      oldestPost,
      daysSinceLastPost,
      postsThisWeek,
      postsThisMonth,
      mostActiveDay,
      avgPostsPerDay,
      statusOverTime,
      postsMetadata,
      postsPerDay
    };
  }, [posts, language]);

  // Chart colors based on dark mode
  const chartColors = {
    pie: {
      reading: darkMode ? "#4ade80" : "#10b981",
      completed: darkMode ? "#3b82f6" : "#2563eb",
      inProgress: darkMode ? "#f472b6" : "#db2777",
    },
    bar: darkMode
      ? ["#4ade80", "#3b82f6", "#f472b6", "#fbbf24", "#a78bfa"]
      : ["#10b981", "#2563eb", "#db2777", "#d97706", "#7c3aed"],
  };

  // Chart themes based on dark mode
  const chartTheme = {
    color: darkMode ? "rgba(255, 255, 255, 0.9)" : "#000",
    grid: {
      color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    },
    background: darkMode ? "#1f2937" : "#ffffff",
  };

  // Status distribution chart data
  const statusChartData = {
    labels: Object.keys(stats.statusCount).map((status) =>
      status === "reading"
        ? language === "ar"
          ? "قيد القراءة"
          : "Reading"
        : status === "completed"
        ? language === "ar"
          ? "مكتملة"
          : "Completed"
        : language === "ar"
        ? "قيد التقدم"
        : "In Progress"
    ),
    datasets: [
      {
        data: Object.values(stats.statusCount),
        backgroundColor: [
          chartColors.pie.reading,
          chartColors.pie.completed,
          chartColors.pie.inProgress,
        ],
        borderColor: darkMode ? "rgba(17, 24, 39, 0.8)" : "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Status distribution chart options
  const statusChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: darkMode ? "#fff" : "#000",
          padding: 20,
          font: {
            size: 12,
            weight: "bold",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
        titleColor: darkMode ? "#fff" : "#000",
        bodyColor: darkMode ? "#fff" : "#000",
        titleFont: {
          size: 12,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
      },
    },
  };

  // Tags chart data
  const tagsChartData = {
    labels: stats.topTags.map((tag) => tag[0]),
    datasets: [
      {
        label: language === "ar" ? "عدد المرات" : "Count",
        data: stats.topTags.map((tag) => tag[1]),
        backgroundColor: chartColors.bar,
        borderColor: darkMode ? "rgba(17, 24, 39, 0.8)" : "#fff",
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  // Tags chart options
  const tagsChartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: language === "ar" ? "الوسوم الأكثر استخداماً" : "Most Used Tags",
        color: darkMode ? "#fff" : "#000",
        font: {
          size: 14,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
        titleColor: darkMode ? "#fff" : "#000",
        bodyColor: darkMode ? "#fff" : "#000",
        titleFont: {
          size: 12,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
      },
    },
  };

  // Prepare chart data
  const growthChartData = {
    datasets: [
      {
        label: language === "ar" ? "عدد المنشورات" : "Posts Count",
        data: stats.postsPerDay.map((item) => ({
          x: new Date(item.date),
          y: item.count,
        })),
        borderColor: darkMode ? "#4ade80" : "rgba(75, 192, 192, 1)",
        backgroundColor: darkMode ? "rgba(74, 222, 128, 0.2)" : "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: darkMode ? "#4ade80" : "rgba(75, 192, 192, 1)",
        pointBorderColor: darkMode ? "#4ade80" : "rgba(75, 192, 192, 1)",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: darkMode ? "#fff" : "#fff",
        pointHoverBorderColor: darkMode ? "#4ade80" : "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const growthChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
          displayFormats: {
            day: 'MMM d'
          }
        },
        adapters: {
          date: {
            locale: language === "ar" ? arSA : enUS,
          },
        },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
          font: {
            size: 12,
            weight: "bold",
          },
          maxRotation: 45,
          minRotation: 45
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
          font: {
            size: 12,
            weight: "bold",
          },
          stepSize: 1
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: language === "ar" ? "عدد المنشورات لكل يوم" : "Posts Count Per Day",
        color: darkMode ? "#fff" : "#000",
        font: {
          size: 14,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      legend: {
        labels: {
          color: darkMode ? "#fff" : "#000",
          font: {
            size: 12,
            weight: "bold",
          },
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "rgba(17, 24, 39, 0.9)" : "rgba(255, 255, 255, 0.9)",
        titleColor: darkMode ? "#fff" : "#000",
        bodyColor: darkMode ? "#fff" : "#000",
        borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        callbacks: {
          title: function(context) {
            const date = new Date(context[0].parsed.x);
            return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: function(context) {
            return language === "ar" 
              ? `عدد المنشورات: ${context.parsed.y}`
              : `Posts Count: ${context.parsed.y}`;
          }
        },
        titleFont: {
          size: 12,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
      },
    },
  };

  // Add new chart data
  const metadataChartData = {
    labels: [
      language === "ar" ? "المنشورات مع روابط" : "Posts with Links",
      language === "ar" ? "المنشورات بدون روابط" : "Posts without Links",
      language === "ar" ? "المنشورات مع ملاحظات" : "Posts with Notes",
      language === "ar" ? "المنشورات بدون ملاحظات" : "Posts without Notes",
      language === "ar" ? "المنشورات مع وسوم" : "Posts with Tags",
      language === "ar" ? "المنشورات بدون وسوم" : "Posts without Tags"
    ],
    datasets: [{
      data: [
        stats.postsWithLinks,
        stats.postsWithoutLinks,
        stats.postsWithNotes,
        stats.postsWithoutNotes,
        stats.totalPosts - stats.postsWithoutTags,
        stats.postsWithoutTags
      ],
      backgroundColor: chartColors.bar,
      borderColor: darkMode ? "rgba(17, 24, 39, 0.8)" : "#fff",
      borderWidth: 2,
      borderRadius: 4,
    }]
  };

  const metadataChartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
          font: {
            size: 11,
            weight: "bold"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: false
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
          font: {
            size: 12,
            weight: "bold"
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: language === "ar" ? "توزيع بيانات المنشورات" : "Posts Metadata Distribution",
        color: darkMode ? "#fff" : "#000",
        font: {
          size: 14,
          weight: "bold"
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    }
  };

  const statusOverTimeChartData = {
    labels: Object.keys(stats.statusOverTime),
    datasets: [
      {
        label: language === "ar" ? "قيد القراءة" : "Reading",
        data: Object.values(stats.statusOverTime).map(month => month.reading),
        backgroundColor: chartColors.pie.reading,
        borderColor: darkMode ? "rgba(17, 24, 39, 0.8)" : "#fff",
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: language === "ar" ? "مكتملة" : "Completed",
        data: Object.values(stats.statusOverTime).map(month => month.completed),
        backgroundColor: chartColors.pie.completed,
        borderColor: darkMode ? "rgba(17, 24, 39, 0.8)" : "#fff",
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: language === "ar" ? "قيد التقدم" : "In Progress",
        data: Object.values(stats.statusOverTime).map(month => month["in-progress"]),
        backgroundColor: chartColors.pie.inProgress,
        borderColor: darkMode ? "rgba(17, 24, 39, 0.8)" : "#fff",
        borderWidth: 2,
        borderRadius: 4,
      }
    ]
  };

  const statusOverTimeChartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
          font: {
            size: 12,
            weight: "bold"
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: false
        },
        ticks: {
          color: darkMode ? "#fff" : "#000",
          font: {
            size: 12,
            weight: "bold"
          }
        }
      }
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: darkMode ? "#fff" : "#000",
          font: {
            size: 12,
            weight: "bold"
          },
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      title: {
        display: true,
        text: language === "ar" ? "توزيع حالات المنشورات عبر الزمن" : "Post Status Distribution Over Time",
        color: darkMode ? "#fff" : "#000",
        font: {
          size: 14,
          weight: "bold"
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    }
  };

  useEffect(() => {
    const tl = gsap.timeline();

    // Title animation
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    );

    // Stats cards animation
    const cards = document.querySelectorAll(".stat-card");
    cards.forEach((card, index) => {
      tl.fromTo(
        card,
        {
          opacity: 0,
          y: 20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        index * 0.1 + 0.2
      );
    });

    // Charts animation
    tl.fromTo(
      chartsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.5
    );

    return () => tl.kill();
  }, []);

  // Empty state message component
  const EmptyState = () => {
    const emptyStateRef = useRef(null);

    useEffect(() => {
      const element = emptyStateRef.current;
      gsap.fromTo(element,
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        }
      );
    }, []);

    return (
      <div 
        ref={emptyStateRef}
        className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="text-6xl mb-4 animate-bounce">📊</div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          {language === "ar" ? "لا توجد بيانات للعرض" : "No Data to Display"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          {language === "ar"
            ? "قم بإضافة بعض المنشورات لتظهر هنا الإحصائيات الخاصة بك"
            : "Add some posts to see your statistics here"}
        </p>
      </div>
    );
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1
            ref={titleRef}
            className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
          >
            {language === "ar" ? "الإحصائيات" : "Statistics"}
          </h1>

          {!posts || posts.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Key Statistics */}
              <div
                ref={statsRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "إجمالي المنشورات" : "Total Posts"}
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalPosts}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar"
                      ? "متوسط المنشورات شهرياً"
                      : "Average Posts/Month"}
                  </h3>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.avgPostsPerMonth}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "المنشورات المكتملة" : "Completed Posts"}
                  </h3>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.statusCount["completed"] || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {`${Math.round(
                      ((stats.statusCount["completed"] || 0) / stats.totalPosts) *
                        100
                    )}%`}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar"
                      ? "الشهر الأكثر نشاطاً"
                      : "Most Active Month"}
                  </h3>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.mostActiveMonth ? stats.mostActiveMonth.count : 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.mostActiveMonth ? stats.mostActiveMonth.month : "-"}
                  </p>
                </div>
              </div>

              {/* Additional Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar"
                      ? "المنشورات مع ملاحظات"
                      : "Posts with Comments"}
                  </h3>
                  <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    {stats.postsWithNotes}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {`${Math.round(
                      (stats.postsWithNotes / stats.totalPosts) * 100
                    )}%`}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "المنشورات مع روابط" : "Posts with Links"}
                  </h3>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {stats.postsWithLinks}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {`${Math.round(
                      (stats.postsWithLinks / stats.totalPosts) * 100
                    )}%`}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar"
                      ? "متوسط الوسوم لكل منشور"
                      : "Average Tags/Post"}
                  </h3>
                  <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                    {stats.avgTagsPerPost}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === "ar" ? "إجمالي الوسوم:" : "Total Tags:"}{" "}
                    {stats.totalTags}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "المنشورات قيد القراءة" : "Reading Posts"}
                  </h3>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.statusCount["reading"] || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {`${Math.round(
                      ((stats.statusCount["reading"] || 0) / stats.totalPosts) * 100
                    )}%`}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "المنشورات هذا الأسبوع" : "Posts This Week"}
                  </h3>
                  <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                    {stats.postsThisWeek}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "المنشورات هذا الشهر" : "Posts This Month"}
                  </h3>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {stats.postsThisMonth}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "أيام منذ آخر منشور" : "Days Since Last Post"}
                  </h3>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {stats.daysSinceLastPost}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "المنشورات بدون وسوم" : "Posts Without Tags"}
                  </h3>
                  <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.postsWithoutTags}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {`${Math.round((stats.postsWithoutTags / stats.totalPosts) * 100)}%`}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "متوسط طول الوصف" : "Avg Description Length"}
                  </h3>
                  <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                    {stats.avgDescriptionLength}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === "ar" ? "حرف" : "characters"}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "اليوم الأكثر نشاطاً" : "Most Active Day"}
                  </h3>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.mostActiveDay.count}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.mostActiveDay.date}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "متوسط المنشورات يومياً" : "Avg Posts/Day"}
                  </h3>
                  <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                    {stats.avgPostsPerDay}
                  </p>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {language === "ar" ? "الحالة الأكثر استخداماً" : "Most Used Status"}
                  </h3>
                  <p className="text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
                    {stats.mostUsedStatus.count}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stats.mostUsedStatus.status === "reading"
                      ? language === "ar"
                        ? "قيد القراءة"
                        : "Reading"
                      : stats.mostUsedStatus.status === "completed"
                      ? language === "ar"
                        ? "مكتملة"
                        : "Completed"
                      : language === "ar"
                      ? "قيد التقدم"
                      : "In Progress"}
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div ref={chartsRef} className="opacity-0 space-y-6 mb-8">
                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
                    {language === "ar" ? "توزيع بيانات المنشورات" : "Posts Metadata Distribution"}
                  </h3>
                  <div className="h-[400px] w-full">
                    <Bar data={metadataChartData} options={metadataChartOptions} />
                  </div>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
                    {language === "ar" ? "توزيع حالات المنشورات عبر الزمن" : "Post Status Distribution Over Time"}
                  </h3>
                  <div className="h-[400px] w-full">
                    <Bar data={statusOverTimeChartData} options={statusOverTimeChartOptions} />
                  </div>
                </div>

                <div className="stat-card opacity-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-105">
                  <h3 className="text-lg font-semibold mb-4 dark:text-gray-200">
                    {language === "ar" ? "عدد المنشورات لكل يوم" : "Posts Count Per Day"}
                  </h3>
                  <div className="h-[400px] w-full">
                    <Line data={growthChartData} options={growthChartOptions} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
