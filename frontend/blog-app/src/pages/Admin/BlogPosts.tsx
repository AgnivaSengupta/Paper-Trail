import DashboardNavbar from "@/components/dashboard/DashboardNavbar"
import DashboardLayout from "@/components/layouts/DashboardLayout"
import { Button } from "@/components/ui/button"
import { API_PATHS } from "@/utils/apiPaths"
import axiosInstance from "@/utils/axiosInstance"
import { Eye, Heart } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Test from "./Test"

type Author = {
  name: string;
  profilePic: string;
};

type Post = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImageUrl?: string | null;
  tags: string[];
  author: Author;
  isDraft: boolean;
  views: number;
  likes: number;
  generatedByAi: boolean;
  createdAt: string;
  updatedAt: string;
}

const Count = ({ value }: { value: number }) => {
  return (
    <div className="bg-black flex justify-center items-center py-1 px-2 rounded-full">
      <h1 className="text-white text-xs">{value}</h1>
    </div>
  )
}

const BlogTableRow = ({ title, views, likes }: { title: string, views: number, likes: number }) => {
  return (
    <div className="w-auto h-36 border-b-1 border-gray-500 flex items-center gap-5 px-5 py-2">
      <div className="w-20 h-20 bg-gray-100 rounded-lg"></div>
      <div className="w-full h-25 flex flex-col justify-between p-2">
        <h1 className="text-lg">{title}</h1>
        <div className="flex gap-5">
          <div className="flex justify-center items-center text-xs px-2 bg-gray-200/20 rounded-md text-white shadow-lg">
            Updated 11/09/2025
          </div>
          <Button size='sm' className="text-xs bg-green-300/10 text-green-500 hover:bg-green-300/10">
            <Eye />
            {views} Views
          </Button>
          <Button size='sm' className="text-xs bg-red-400/10 text-red-600 hover:bg-red-400/10">
            <Heart />
            {likes} Likes
          </Button>
        </div>
      </div>
    </div>
  )
}



const BlogPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [counts, setCounts] = useState({ all: 0, published: 0, draft: 0 })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');

  const getAllPosts = async (pageNumber = 1, reset = false) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.POST.GET_ALL_POSTS, {
        params: {
          status: status.toLowerCase(),
          page: pageNumber
        }
      })

      const { posts: newPosts, totalPages, counts } = response.data;

      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
      setTotalPages(totalPages)
      setCounts(counts)


    } catch (error) {
      console.error("Error fetching posts: ", error)
    } finally {
      setLoading(false);
    }
  }


  // refresh on tab change

  useEffect(() => {
    setPage(1);
    getAllPosts(1, true);
  }, [status]);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          const nextPage = page + 1;
          setPage(nextPage);
          getAllPosts(nextPage); // --> appending the new posts, reset = false
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    }
  }, [loading, page, totalPages]);

  return (
    // <DashboardLayout>
    //   <div className="h-full flex flex-col"> 
    //     <DashboardNavbar page='Blog Posts'/>

    //       <div className="flex justify-between pl-5 pb-2 pr-10 bg-amber-50"
    //         onClick={() => navigate('/admin/create')}
    //       >
    //         <h1 className="text-xl">Blog Posts</h1>
    //         <Button variant='preview' className="text-base">Create new</Button>
    //       </div>

    //       {/* <div id='container' className="w-auto h-150 m-5 mt-0"> */}
    //         <div id='tabs' className="w-auto h-10 flex items-center gap-3 mx-10 mb-5">
    //           <Button variant='tab'
    //             onClick={() => setStatus('all')}
    //             className={`h-8 ${status === 'all' ? 'bg-black text-white hover:bg-black' : 'text-black bg-white'}`}
    //           >
    //             All
    //             <Count value={counts.all}/>
    //           </Button>

    //           <Button variant='tab'
    //             onClick={() => setStatus('published')}
    //             className={`h-8 ${status === 'published' ? 'bg-black text-white  hover:bg-black' : 'text-black bg-white'}`}
    //           >
    //             Published
    //             <Count value={counts.published}/>
    //           </Button>

    //           <Button variant='tab'
    //             onClick={() => setStatus('draft')}
    //             className={`h-8 ${status === 'draft' ? 'bg-black text-white  hover:bg-black' : 'text-black bg-white'}`}
    //           >
    //             Draft
    //             <Count value={counts.draft}/>
    //           </Button>
    //         </div>

    //         <div className="flex-1 flex flex-col gap-0 py-5 overflow-y-auto ml-10 custom-scrollbar">
    //           {posts.map((post, index) => (
    //             <BlogTableRow key={index} title={post.title} views={post.views} likes={post.likes}/>
    //           ))}
    //             {/* Here it will be like infinite loading */}
    //             <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
    //               {loading && <span className="text-sm text-gray-500">Loading...</span>}
    //             </div>
    //         </div>
    //       </div>
    //   {/* </div> */}
    // </DashboardLayout>

    <Test>
      <div className="flex justify-between pl-5 pr-10"
        onClick={() => navigate('/admin/create')}
      >
        <h1 className="text-xl">Blog Posts</h1>
        <Button className="text-base">Create new</Button>
      </div>

      {/* <div id='container' className="w-auto h-150 m-5 mt-0"> */}
      <div id='tabs' className="w-auto h-10 flex items-center gap-3 mx-5 ">
        <Button
          size='sm'
          onClick={() => setStatus('all')}
          className={`text-foreground border-1 border-input focus-visible:ring-ring ${status === 'all' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-background hover:bg-accent hover:text-accent-foreground'}`}
        >
          All
          <Count value={counts.all} />
        </Button>

        <Button
          size='sm'
          onClick={() => setStatus('published')}
          className={`text-foreground border-1 border-input focus-visible:ring-ring ${status === 'published' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-background hover:bg-accent hover:text-accent-foreground'}`}
        >
          Published
          <Count value={counts.published} />
        </Button>

        <Button
          size='sm'
          onClick={() => setStatus('draft')}
          className={`text-foreground border-1 border-input focus-visible:ring-ring ${status === 'draft' ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'bg-background hover:bg-accent hover:text-accent-foreground'}`}
        >
          Draft
          <Count value={counts.draft} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        {posts.map((post, index) => (
          <BlogTableRow key={index} title={post.title} views={post.views} likes={post.likes} />
        ))}
        {/* Here it will be like infinite loading */}
        <div ref={loadMoreRef} className="h-10 flex justify-center items-center">
          {loading && <span className="text-sm text-gray-500">Loading...</span>}
        </div>
      </div>
    </Test >
  )
}

export default BlogPosts