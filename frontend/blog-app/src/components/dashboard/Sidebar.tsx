import Arrow from '@/assets/arrow'
import { ChartPie, FileText, MessageCircle, UserCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'



const Sidebar = () => {

    const navigate = useNavigate();

    return (
        <div className="w-58 border-r-1 border-gray-500 h-screen p-5 sticky top-0">
            {/* <div className="flex justify-start items-center mb-10">
                <h1 className="text-2xl">Papertrail</h1>
            </div> */}

            <div className="flex flex-col">
                <div className="flex justify-start gap-5 items-center border-b-1 border-gray-700 pb-2">
                    {/* <CircleUserRound className="size-7"/> */}
                    {/* <img src="../../../public/profilePicPlaceholder.png" alt="profilePic" className="size-7"/> */}
                    <img
                        src="https://api.dicebear.com/9.x/notionists/svg?seed=Kingston"
                        alt="avatar"
                        className="size-8 bg-amber-100 rounded shrink-0"
                    />

                    <div className="flex flex-col">
                        <h1 className="text-base font-semibold">Agniv</h1>
                        <p className="text-sm text-gray-300">agniva@gmai.com</p>
                    </div>

                </div>

                <div className="mt-5 flex flex-col gap-2">

                    <div className='text-base text-white/30 mb-2 '>Dashboard</div>
                    <div className="group text-base flex gap-3 items-center hover:bg-white/5 hover:px-7 py-1 rounded-md cursor-pointer"
                        onClick={() => navigate('/admin/overview')}   
                    >
                        <Arrow className="w-4 h-4 text-gray-500 group-hover:hidden" />
                        <ChartPie className="size-5" />
                        Overview
                    </div>

                    <div className="group text-base flex gap-3 items-center hover:bg-white/5 hover:px-7 py-1 rounded-md cursor-pointer"
                        onClick={() => navigate('/admin/posts')}    
                    >
                        <Arrow className="w-4 h-4 text-gray-500 group-hover:hidden" />
                        <FileText className="size-5" />
                        Blog Posts
                    </div>

                    <div className="group text-base flex gap-3 items-center hover:bg-white/5 hover:px-7 py-1 rounded-md cursor-pointer"
                        onClick={() => navigate('/admin/comments')}   
                    >
                        <Arrow className="w-4 h-4 text-gray-500 group-hover:hidden" />
                        <MessageCircle className="size-5" />
                        Comments
                    </div>

                    <div className="group text-base flex gap-3 items-center hover:bg-white/5 hover:px-7 py-1 rounded-md cursor-pointer"
                        onClick={() => navigate('/admin/profile')}  
                    >
                        <Arrow className="w-4 h-4 text-gray-500 group-hover:hidden" />
                        <UserCircle className="size-5" />
                        Profile
                    </div>
                </div>

                <div className="absolute bottom-18 left-5">
                    <Button variant='secondary' className="text-lg w-48 cursor-pointer">Logout</Button>
                </div>

                <div className="absolute bottom-5 left-15 font-playfair">
                    <h1 className="text-2xl text-white/60">Papertrail</h1>
                </div>
            </div>

        </div>
    )
}

export default Sidebar