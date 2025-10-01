import { Button } from "@/components/ui/button"
import BlogLayout from "../../components/layouts/BlogLayout"
import { BookOpen, CircleArrowRight, Clock, Eye, Heart, PenTool, Search, Users } from 'lucide-react'
import { useRef, useState } from "react"
import { mockPosts, mockTrendingPosts, mockStats, mockCategories } from './mock';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const BlogLandingPage = () => {

  const blogSectionRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const handleScrollToBlogs = () => {
    blogSectionRef.current?.scrollIntoView({behavior: "smooth"})
  }

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    // <BlogLayout>
    //   <section className="h-screen p-5">
    //     <div className="flex flex-col justify-center items-center gap-10 p-2 w-auto h-full font-playfair">
    //       <div className="flex flex-col justify-center items-center text-center gap-20 p-5 ">
    //         <h1 className="text-8xl">A journal of ideas, Open to all..</h1>
    //         <p className="text-3xl text-center italic text-gray-400">A minimal space where I share my thoughts, projects, and daily learnings — and where you can share yours too.</p>
    //       </div>

    //       <div className=" flex justify-center items-center gap-10 w-full p-5">
    //         <Button size="lg" className="border-1 border-[#F9F4EC] cursor-pointer">
    //           Start writting
    //         </Button>

    //         <Button size="lg" variant="secondary" className="cursor-pointer" onClick={handleScrollToBlogs}>
    //           Read blog
    //           <CircleArrowRight className="ml-1 size-6" />
    //         </Button>
    //       </div>
    //     </div>
    //   </section>

    //   <section
    //     ref={blogSectionRef}
    //     className="min-h-[calc(100vh-80px)] w-full p-5 bg-amber-100"
    //   >
    //     <div className="w-full h-[500px] border-red-500 border-2 border-dashed">
    //       <div className="grid grid-cols-[1fr_2fr_1fr] gap-4">
    //       <div className="col-span-full row-start-1 min-[800px]:col-start-1 bg-blue-300">
    //         <article>1</article>  
    //       </div>
    //       <div className="col-start-2 row-start-1 bg-purple-200">
    //         <article>2</article>
    //       </div>

    //       <div className="col-span-full row-start-1 min-[800px]:col-start-3 bg-pink-300">
    //         <article>3</article>
    //       </div>
    //       </div>
    //     </div>
    //   </section>

    // </BlogLayout>

    <div className="min-h-screen bg-[#212121]">
          {/* Header */}
          <header className="bg-[#212121] backdrop-blur-sm sticky top-0 z-50 text-sm">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl text-white font-playfair">Papertrail</h1>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant='tab' size="sm">Sign In</Button>
                <Button size="sm" variant='preview' className="text-white">
                  <PenTool className="w-4 h-4 mr-2" />
                  Write
                </Button>
              </div>
            </div>
          </div>
        </header>


      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            Join {mockStats.totalAuthors}+ writers in our community
          </div>
          <h1 className="text-5xl md:text-7xl font-playfair text-white mb-6 leading-tight">
            A journal of ideas, Open to all
          </h1>
          <p className="text-xl font-playfair italic text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          A minimal space where I share my thoughts, projects, and daily learnings — and where you can share yours too.
          </p>
          
          {/* Stats */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{mockStats.totalPosts}</div>
              <div className="text-sm text-gray-600">Published Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{mockStats.totalAuthors}+</div>
              <div className="text-sm text-gray-600">Active Writers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{mockStats.totalViews}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{mockStats.monthlyReaders}</div>
              <div className="text-sm text-gray-600">Monthly Readers</div>
            </div>
          </div> */}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 text-base h-12">
              <BookOpen className="w-5 h-5 mr-2" />
              Start Reading
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-12 text-base">
              <PenTool className="w-5 h-5 mr-2" />
              Write Your Story
            </Button>
          </div>
        </div>
      </section>


      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-5xl font-semibold text-white font-playfair">Latest Posts</h2>
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search posts, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/10 p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-3 group-hover:text-white/80 cursor-pointer transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-white font-extralight text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{post.author.name}</p>
                        <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {post.views}
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likes}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="bg-[#282727] text-white py-16 px-4 sm:px-6 lg:px-8 text-base">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">BlogSphere</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Where personal stories become community wisdom. Join thousands of writers sharing their experiences.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Latest Posts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trending</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Authors</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Write</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BlogSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>

  )
}

export default BlogLandingPage