"use client";
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
} from "@/components/ui/sidebar"
import { Calendar, Inbox, Layers, UserCircleIcon, Wallet  } from "lucide-react"
import Image from 'next/image'
import { usePathname, useParams } from 'next/navigation'
import Link from "next/link"

export function AppSidebar() {
    const path = usePathname();
    const { chatid } = useParams(); // ✅ get chatid from dynamic route
  // Decide where "AI Tools" should point here chnages i have made at 3.10 min 
  let aiToolsUrl = "/ai-tools"; // fallback

  if (path.startsWith("/ai-tools/ai-chat")) {
    aiToolsUrl = chatid
      ? `/ai-tools/ai-chat/${chatid}`
      : "/ai-tools/ai-chat";
  } else if (path.startsWith("/ai-tools/ai-resume-analyzer")) {
    aiToolsUrl = "/ai-tools/ai-resume-analyzer";
  }
    const items = [
        {
            title: "Workspace",
            url: "/dashboard",
            icon: Layers,
        },
        {
          title: "AI Tools",
      url: aiToolsUrl,  // ✅ single link only
      icon: Inbox,
    },
    {
            title: "My History",
            url: "/history",
            icon: Calendar,
     },

        {
            title: "Billing",
            url: "/billing",
            icon: Wallet,
        },
        {
            title: "Profile",
            url: "/profile",
            icon: UserCircleIcon,
        },
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <div className='p-4'>
                    <Image src={'/logo.png'} alt='logo' width={100} height={70}
                        className='w-full' />
                    <h2 className='text-sm text-gray-400 text-center mt-3'>Build Awesome Skills</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className='mt-2'>
                            {items.map((item, index) => (
                                <Link
                                    href={item.url}
                                    key={index}
                                    className={`p-2 text-lg flex gap-2 items-center
                                    hover:bg-gray-100 rounded-lg ${path === item.url ? 'bg-gray-200' : ''}`}
                                >
                                    <item.icon className='h-5 w-5' />
                                    <span>{item.title}</span>
                                </Link>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <h2 className='p-2 text-gray-400 text-sm'>Crafted by Soham Gawade</h2>
            </SidebarFooter>
        </Sidebar>
    )
}
