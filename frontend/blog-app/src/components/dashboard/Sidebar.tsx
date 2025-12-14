import Arrow from '@/assets/arrow'
import { Box, ChartPie, FileText, HelpCircle, LayoutDashboard, MessageCircle, MessageSquare, PanelLeft, PanelLeftClose, Settings, UserCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';


const SidebarItem = ({ icon: Icon, label, active, badge, collapsed, path }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`
      flex items-center 
      ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} 
      py-3 mb-1 cursor-pointer rounded-lg transition-colors 
      ${active
          ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-white'
          : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200'}
    `}
      title={collapsed ? label : ''}
      onClick={() => navigate(path)}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        {!collapsed && <span className="text-base whitespace-nowrap">{label}</span>}
      </div>
      {!collapsed && badge && (
        <span className="bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 text-sm px-2 py-0.5 rounded">{badge}</span>
      )}
      {collapsed && badge && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
      )}
    </div>
  )
};


const Sidebar = ({isSidebarOpen, setIsSidebarOpen}) => {
  const navigate = useNavigate();
    return (
        <aside 
          className={`
            border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 fixed h-full left-0 top-0 overflow-y-auto hide-scrollbar z-50 
            bg-white dark:bg-[#0f1014]
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          <div className={`flex items-center ${isSidebarOpen ? 'justify-between px-2' : 'justify-center'} mb-8 transition-all duration-300`}>
            <div className={`flex items-center gap-2 cursor-pointer ${!isSidebarOpen && 'hidden'}`} onClick={() => navigate('/')}>
              <div className="w-6 h-6 bg-zinc-900 dark:bg-zinc-700 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-zinc-400 rounded-sm"></div>
              </div>
              <span className="font-primary text-3xl tracking-tight whitespace-nowrap dark:text-white text-zinc-900">PaperTrails</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white transition-colors p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
          </div>

          <div className="space-y-1 flex-1">
            <SidebarItem icon={LayoutDashboard} label="Home" collapsed={!isSidebarOpen} path='/admin/overview' />
            <SidebarItem icon={FileText} label="Posts" collapsed={!isSidebarOpen} badge='12' path='/admin/posts'/>
            <SidebarItem icon={MessageSquare} label="Comments" collapsed={!isSidebarOpen} badge='3' path='/admin/comments'/>
            {/*<SidebarItem icon={Box} label="Models" collapsed={!isSidebarOpen} />*/}
            <SidebarItem icon={Settings} label="Profile" active collapsed={!isSidebarOpen} path='/admin/profile' />
          </div>
          
          <div className="space-y-1">
             <SidebarItem icon={Settings} label="Settings" collapsed={!isSidebarOpen}/>
             <SidebarItem icon={HelpCircle} label="Help Center" collapsed={!isSidebarOpen} />
          </div>
        </aside>
    )
}

export default Sidebar