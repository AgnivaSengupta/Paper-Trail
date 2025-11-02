import BlogLayout from "@/components/layouts/BlogLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Share2 } from "lucide-react";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import { useEffect, useState } from "react";
import { RedditComments } from "@/components/blogPage/RedditComments";
import { useLocation } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/apiPaths";


const BlogPostView = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [postId, setPostId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  const location = useLocation();

  const urlSplitArr = location.pathname.split("/");
  const slug = urlSplitArr[1];

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance(API_PATHS.POST.GET_POST_BY_SLUG(slug));
        const post = response.data;

        setHtmlContent(post.content.html)
        setPostId(post._id);
        setAuthor(post.author.name);
        setTitle(post.title);
        setProfilePic(post.author.profilePic);
        setCoverImage(post.coverImageUrl);
        setUpdatedAt(post.updatedAt);
        
        // console.log(typeof (post));

        // console.log(typeof(postId))

      } catch (error) {
        console.log("Blog Fetching failed")
        console.log(error)
      }
    }
    fetchBlog();
  }, []);

  return (
    <BlogLayout>
      <div className=" w-full flex justify-center mt-10 font-munoch">
        <div className="w-5/10 flex p-10">
          <div id="BlogContainer" className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold">{title}</h1>

                <div className="text-base flex items-center gap-3 mb-5 text-muted-foreground">
                  <img
                    src="https://api.dicebear.com/9.x/notionists/svg?seed=Kingston"
                    alt="avatar"
                    className="size-10 border-black border-2 bg-amber-100 rounded-full shrink-0"
                  />
                  <p>{ author }</p>
                  <Button size="sm" className="text-sm">
                    Follow
                  </Button>
                  <Separator
                    orientation="vertical"
                    className="bg-gray-500 mx-2 data-[orientation=vertical]:h-6"
                  />
                  <p>{`Date: ${updatedAt}`}</p>
                </div>
              </div>

              <Button
                size="sm"
                variant="link"
                className="text-sm h-9 text-foreground cursor-pointer"
              >
                <Share2 />
              </Button>
            </div>

            <div className="w-full h-[1px] bg-gray-600 mb-5"></div>

            <div className="flex justify-center items-center w-full h-80 border-1 mb-5">
              {/* Image */}
              Image
            </div>

            <div
              id="blog-content"
              className="flex flex-col gap-3 text-lg mb-5 text-foreground tiptap ProseMirror"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            >
            </div>

            <div className="h-[1px] w-full bg-gray-500"></div>

            <div className="flex flex-col mt-5 gap-5">
              {/*<h1 className="text-4xl">Comments</h1>*/}

              <RedditComments postId={postId}/>
              <div className="flex flex-col"></div>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default BlogPostView;
