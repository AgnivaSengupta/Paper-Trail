import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  ChartPie,
  FileText,
  MessageCircle,
  UserCircle,
} from "lucide-react";
import NavMain from "./NavMain";
import { useNavigate } from "react-router-dom";

const data = {
  user: {
    name: "Agniva Sengupta",
    email: "agnivasengupta11@gmail.com",
    avatarSrc: "https://api.dicebear.com/9.x/notionists/svg?seed=Kingston",
  },

  navItems: [
    {
      title: "Overview",
      url: "/admin/overview",
      icon: ChartPie,
    },
    {
      title: "Blog Posts",
      url: "/admin/posts",
      icon: FileText,
    },
    {
      title: "Comments",
      url: "/admin/comments",
      icon: MessageCircle,
    },
    {
      title: "Profile",
      url: "/admin/profile",
      icon: UserCircle,
    },
  ],
};

const CustomSidebarHeader = () => {
  const navigate = useNavigate();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground my-1 hover:bg-background cursor-pointer"
          onClick={() => navigate("/")}
        >
          {/*<div className="bg-sidebar-primary text-sidebar-primary-foreground text-base aspect-square font-medium flex size-8 items-center justify-center rounded-lg">
                        <h1>P</h1>
                    </div>*/}

          <div>
            <BookOpen className="h-5 w-5"/>
          </div>

          <div className="grid flex-1 text-left ">
            <span className="truncate font-medium text-2xl font-playfair">
              PaperTrail
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const CustomSidebarFooter = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground my-5 h-15 cursor-pointer"
        >
          <img
            src="https://api.dicebear.com/9.x/notionists/svg?seed=Kingston"
            alt="avatar"
            className="size-10 bg-amber-100 rounded shrink-0"
          />

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Agniva Sengupta</span>
            <span className="truncate text-xs">agnivasengupta11@gmail.com</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CustomSidebarHeader />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navItems} />
      </SidebarContent>

      <SidebarFooter>
        <CustomSidebarFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
