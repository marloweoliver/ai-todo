"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTodoStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { Task } from "@/types/task"

interface SharePreviewProps {
  data: {
    tasks?: Task[]
    tags?: { tag: string; color: string }[]
  }
}

export function SharePreview({ data }: SharePreviewProps) {
  const router = useRouter()
  const { importTasks } = useTodoStore()

  const handleImport = () => {
    if (data.tasks) {
      importTasks(data.tasks)
    }
    router.push("/")
  }

  return (
    <div className="container max-w-2xl py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Shared Tasks</CardTitle>
            <CardDescription>Preview and import shared tasks to your todo list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.tasks && (
              <div className="space-y-4">
                <div className="font-medium">Tasks</div>
                <div className="space-y-2">
                  {data.tasks.map((task) => (
                    <div key={task.id} className="p-3 rounded-lg border bg-card">
                      <div className="font-medium">{task.title}</div>
                      {task.description && <div className="text-sm text-muted-foreground mt-1">{task.description}</div>}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map(({ tag, color }) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              style={{
                                backgroundColor: `${color}20`,
                                borderColor: color,
                                color: color,
                              }}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.tags && (
              <div className="space-y-4">
                <div className="font-medium">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map(({ tag, color }) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      style={{
                        backgroundColor: `${color}20`,
                        borderColor: color,
                        color: color,
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button onClick={handleImport}>Import</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

