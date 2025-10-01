// Mock data for the blogging site
export const mockPosts = [
    {
      id: 1,
      title: "The Future of Remote Work: Insights from Tech Leaders",
      excerpt: "Exploring how technology is reshaping the way we work and collaborate in distributed teams...",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        role: "Tech Writer"
      },
      category: "Technology",
      readTime: "5 min read",
      publishedAt: "2025-01-15T10:30:00Z",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
      tags: ["remote-work", "technology", "productivity"],
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: "Building Sustainable Communities: A Developer's Guide",
      excerpt: "Learn how to create and nurture thriving online communities that last...",
      author: {
        name: "Marcus Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Community Builder"
      },
      category: "Community",
      readTime: "8 min read",
      publishedAt: "2025-01-14T14:20:00Z",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop",
      tags: ["community", "development", "leadership"],
      views: 2100,
      likes: 156
    },
    {
      id: 3,
      title: "The Art of Technical Writing: Making Complex Simple",
      excerpt: "Transform complex technical concepts into clear, engaging content that resonates with your audience...",
      author: {
        name: "Emily Watson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",  
        role: "Technical Writer"
      },
      category: "Writing",
      readTime: "6 min read",
      publishedAt: "2025-01-13T09:15:00Z",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop",
      tags: ["writing", "communication", "technical"],
      views: 1800,
      likes: 124
    },
    {
      id: 4,
      title: "Design Systems That Scale: Lessons from Industry Giants",
      excerpt: "Discover how major companies build and maintain design systems that grow with their products...",
      author: {
        name: "Alex Kim",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        role: "Design Lead"
      },
      category: "Design", 
      readTime: "7 min read",
      publishedAt: "2025-01-12T16:45:00Z",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop",
      tags: ["design", "systems", "scalability"],
      views: 1650,
      likes: 98
    },
    {
      id: 5,
      title: "AI-Powered Content Creation: Tools and Techniques",
      excerpt: "Explore the latest AI tools revolutionizing content creation and how to leverage them effectively...",
      author: {
        name: "David Park",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        role: "AI Researcher"
      },
      category: "AI",
      readTime: "9 min read", 
      publishedAt: "2025-01-11T11:30:00Z",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      tags: ["ai", "content", "automation"],
      views: 3200,
      likes: 245
    },
    {
      id: 6,
      title: "From Startup to Scale: Building a Product Culture",
      excerpt: "Navigate the challenges of scaling product development while maintaining innovation and quality...",
      author: {
        name: "Lisa Chang",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        role: "Product Manager"
      },
      category: "Product",
      readTime: "10 min read",
      publishedAt: "2025-01-10T08:00:00Z",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
      tags: ["startup", "product", "culture"],
      views: 1920,
      likes: 167
    }
  ];
  
  export const mockTrendingPosts = [
    {
      id: 5,
      title: "AI-Powered Content Creation: Tools and Techniques",
      excerpt: "Explore the latest AI tools revolutionizing content creation and how to leverage them effectively...",
      author: {
        name: "David Park",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        role: "AI Researcher"
      },
      category: "AI",
      readTime: "9 min read",
      publishedAt: "2025-01-11T11:30:00Z",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      tags: ["ai", "content", "automation"],
      views: 3200,
      likes: 245,
      trending: true
    },
    {
      id: 2, 
      title: "Building Sustainable Communities: A Developer's Guide",
      excerpt: "Learn how to create and nurture thriving online communities that last...",
      author: {
        name: "Marcus Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        role: "Community Builder"
      },
      category: "Community",
      readTime: "8 min read",
      publishedAt: "2025-01-14T14:20:00Z",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop",
      tags: ["community", "development", "leadership"],
      views: 2100,
      likes: 156,
      trending: true
    },
    {
      id: 6,
      title: "From Startup to Scale: Building a Product Culture", 
      excerpt: "Navigate the challenges of scaling product development while maintaining innovation and quality...",
      author: {
        name: "Lisa Chang",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        role: "Product Manager"
      },
      category: "Product",
      readTime: "10 min read",
      publishedAt: "2025-01-10T08:00:00Z",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
      tags: ["startup", "product", "culture"],
      views: 1920,
      likes: 167,
      trending: true
    }
  ];
  
  export const mockStats = {
    totalPosts: 847,
    totalAuthors: 124,
    totalViews: "2.3M",
    monthlyReaders: "45K"
  };
  
  export const mockCategories = [
    "All",
    "Technology", 
    "Design",
    "Writing",
    "Community",
    "AI",
    "Product",
    "Startup"
  ];