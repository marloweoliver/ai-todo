"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Settings, Menu, BarChart2, Tags, Share2 } from 'lucide-react'
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const routes = [
        {
            label: "Home",
            icon: Home,
            href: "/",
            color: "text-sky-500",
        },
        {
            label: "Statistics",
            icon: BarChart2,
            href: "/statistics",
            color: "text-violet-500",
        },
        {
            label: "Tags",
            icon: Tags,
            color: "text-pink-700",
            href: "/tags",
        },
        {
            label: "Shared",
            icon: Share2,
            color: "text-orange-700",
            href: "/shared",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/settings",
            color: "text-gray-500",
        },
    ]

    return (
        <>
            {/* Mobile Trigger */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden fixed top-4 left-4 z-40"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-6 w-6" />
            </Button>

            {/* Mobile Sheet */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="left" className="p-0">
                    <ScrollArea className="h-full py-6">
                        <div className="space-y-4 py-4">
                            <div className="px-3 py-2">
                                <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
                                <div className="space-y-1">
                                    {routes.map((route) => (
                                        <Link
                                            key={route.href}
                                            href={route.href}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Button
                                                variant={pathname === route.href ? "secondary" : "ghost"}
                                                className="w-full justify-start"
                                            >
                                                <route.icon className={cn("mr-2 h-4 w-4", route.color)} />
                                                {route.label}
                                            </Button>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className={cn("pb-12 hidden md:block", className)}>
                <div className="space-y-4 py-4">
                    <div className="px-3 py-2">
                        <div className="space-y-1">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                >
                                    <Button
                                        variant={pathname === route.href ? "secondary" : "ghost"}
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <motion.div
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className="flex items-center"
                                        >
                                            <route.icon className={cn("mr-2 h-4 w-4", route.color)} />
                                            {route.label}
                                            {pathname === route.href && (
                                                <motion.div
                                                    className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                                                    layoutId="sidebar-indicator"
                                                />
                                            )}
                                        </motion.div>
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
