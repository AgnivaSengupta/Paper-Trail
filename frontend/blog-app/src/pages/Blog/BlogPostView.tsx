import BlogLayout from "@/components/layouts/BlogLayout"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

const BlogPostView = () => {
  return (
    <BlogLayout>
      <div className=" w-full flex justify-center mt-20"> 
        <div className="w-5/10 flex p-10">
          <div id='BlogContainer' className="flex flex-col gap-2 w-full">
            
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold">
                  This is the blog heading
                </h1>
                
                <div className="text-base flex gap-5 mb-5">
                  <p>By Author</p>
                  <p>Date: 11/09/2025</p>
                </div>
              </div>

              <Button size='sm' className="text-sm h-9 bg-green-500">
                <Share2 />
                Share
              </Button>
            </div>

            <div  className="flex justify-center items-center w-full h-80 border-1 mb-5">
              {/* Image */}
              Image
            </div>

            <div className="flex flex-col gap-3 text-lg mb-5">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione eveniet temporibus voluptatem quos debitis, sit ad quo tenetur tempore enim, fugit distinctio itaque delectus! Suscipit deleniti in inventore dolores ipsam?</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, illo culpa? Consequuntur, illo. Nemo odit placeat sunt, impedit pariatur eos debitis, reprehenderit libero assumenda corrupti quia accusamus, eaque voluptas cum.</p>
              
            
            </div>

            <div className="border-1 border-gray-500"></div>

            <div className="flex flex-col mt-5 gap-5">
              <h1 className="text-4xl">Comments</h1>

              <div className="flex flex-col">

              </div>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  )
}

export default BlogPostView