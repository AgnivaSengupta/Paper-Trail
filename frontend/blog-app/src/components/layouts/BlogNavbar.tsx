import {Menu} from 'lucide-react'

const BlogNavbar = () => {
  return (
    <div className="flex justify-between  items-center w-full text-2xl p-5 font-playfair">
      <div >PaperTrail</div>
      <div>
        <Menu/>
      </div>
    </div>
  )
}

export default BlogNavbar