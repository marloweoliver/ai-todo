"use client"

import { useTodoStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useState } from "react"

export default function TagsPage() {
    const { tasks } = useTodoStore()
    const [showShareDialog, setShowShareDialog] = useState(false)
    const [shareableLink, setShareableLink] = useState("")

    const tagStats = tasks.reduce(
        (acc, task) => {
            task.tags?.forEach((tag) => {
                if (!acc[tag]) {
                    acc[tag] = { count: 0 }
                }
                acc[tag].count++
            })
            return acc
        },
        {} as Record<string, { count: number; }>,
    )

    return (
        <div className="container max-w-4xl py-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Tags</h1>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4 md:grid-cols-2"
            >
                {Object.entries(tagStats).map(([tag, { count }]) => (
                    <Card key={tag} className="p-4">
                        <div className="flex items-center justify-between">
                            <Badge
                                variant="secondary"
                                
                            >
                                {tag}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {count} task{count !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </Card>
                ))}
            </motion.div>
        </div>
    )
}

