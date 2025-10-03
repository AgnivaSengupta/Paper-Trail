import type { LucideIcon } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

const NavMain = ({items}: {
    items: {
        title: string,
        url: string,
        icon: LucideIcon
    }[]
} ) => {
  return (
    <SidebarGroup>
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-2 ">
                        {item.icon && <item.icon className='h-5 w-5' />}
                        <span className='text-base'>{item.title}</span>
                    </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain