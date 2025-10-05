import { Button } from "@/components/ui/button"
import BlogLayout from "../../components/layouts/BlogLayout"
import { BookOpen, CircleArrowRight, Clock, Eye, Heart, PenTool, Search, Users } from 'lucide-react'
import { useRef, useState } from "react"
import { mockPosts, mockTrendingPosts, mockStats, mockCategories } from './mock';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import AuthForm from "@/components/auth/AuthForm";


const BlogLandingPage = () => {

  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogIn, setOpenLogIn] = useState(false);

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
    
    <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="flex justify-center items-end w-full backdrop-blur-sm sticky top-0 z-50 h-20">
          <header className="bg-[#212121] text-sm min-w-[400px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px] rounded-lg">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 ">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl text-white font-playfair">Papertrail</h1>
                </div>

                <div className="flex items-center space-x-4">
                  <Button size="sm" 
                  className="bg-secondary text-secondary-foreground cursor-pointer hover:bg-secondary/80"
                  onClick={() => setOpenSignUp(true)}
                  >
                    Sign In
                  </Button>
                  {/* <Button size="sm" className="text-white">
                    <PenTool className="w-4 h-4 mr-2" />
                    Write
                  </Button> */}
                </div>
              </div>
            </div>
          </header>
        </div>


      
      {/* Hero Section */}
      <section className="relative py-30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            Join {mockStats.totalAuthors}+ writers in our community
          </div>
          <h1 className="text-5xl md:text-7xl font-playfair text-foreground mb-6 leading-tight">
            A journal of ideas, Open to all
          </h1>
          <p className="text-xl font-playfair italic text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          A minimal space where I share my thoughts, projects, and daily learnings — and where you can share yours too.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" 
              className="bg-primary hover:bg-primary/90  text-foreground focus-visible:ring-ring cursor-pointer px-8 text-base h-12"
              onClick={() => {
                const element = document.getElementById("PostsSection");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Start Reading
            </Button>
            <Button size="lg" className="px-8 h-12 text-base bg-secondary hover:bg-secondary/80 focus-visible:ring-ring text-secondary-foreground cursor-pointer">
              <PenTool className="w-5 h-5 mr-2" />
              Write Your Story
            </Button>
          </div>
        </div>
      </section>


      <section id='PostsSection' className="py-25 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-semibold text-foreground font-playfair">Latest Posts</h2>
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search posts, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border-input focus-visible:ring-ring text-muted-foreground"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 shadow-md bg-card border-border border-1 p-0 cursor-pointer">
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
                  <h3 className="text-xl font-medium text-foreground mb-3 group-hover:text-white/80 cursor-pointer transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground font-extralight text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
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

        <div className="w-full flex justify-center mt-15">
          <Button className="bg-secondary hover:bg-secondary/80 text-base cursor-pointer">Load more</Button>
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

<Dialog open={openSignUp} onOpenChange={setOpenSignUp}>
  <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
    <DialogHeader className="p-6 pb-0 ">
      <DialogTitle className="text-center text-foreground text-2xl font-playfair">Papertrail</DialogTitle>
    </DialogHeader>
    <div className="p-6 pt-0">
      {/* <SignupForm /> */}
      <AuthForm/>
    </div>
  </DialogContent>
</Dialog>

    </div>

  )
}

export default BlogLandingPage