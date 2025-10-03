import {BookOpen, Menu, PenTool} from 'lucide-react'
import { Button } from '../ui/button'

const BlogNavbar = () => {
  return (
    // <div className="flex justify-between  items-center w-full text-2xl p-5 font-playfair">
    //   <div >PaperTrail</div>
    //   <div>
    //     <Menu/>
    //   </div>
    // </div>

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
            <Button variant='tab' size="sm">Sign In</Button>
            <Button size="sm" variant='preview' className="text-white">
              <PenTool className="w-4 h-4 mr-2" />
              Write
            </Button>
          </div>
        </div>
      </div>
    </header>
  </div>
  )
}

export default BlogNavbar