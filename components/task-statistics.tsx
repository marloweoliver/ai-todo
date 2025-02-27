"use client"

import { useMemo } from "react"
import type { Task } from "@/types/task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/chart"
import { format, startOfWeek, endOfWeek } from "date-fns"

interface TaskStatisticsProps {
  tasks: Task[]
}

export default function TaskStatistics({ tasks }: TaskStatisticsProps) {
  const stats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.completed).length
    const overdueTasks = tasks.filter((task) => !task.completed && new Date(task.dueDate) < new Date()).length

    // Priority distribution
    const priorities = tasks.reduce(
      (acc, task) => {
        if (task.priority) {
          acc[task.priority]++
        }
        return acc
      },
      { high: 0, medium: 0, low: 0 },
    )

    // Tag usage
    const tagUsage = tasks.reduce(
      (acc, task) => {
        task.tags?.forEach((tag) => {
          if (typeof tag === "string") {
            acc[tag] = (acc[tag] || 0) + 1
          }
        })
        return acc
      },
      {} as Record<string, number>,
    )

    // Weekly completion trend
    const now = new Date()
    const startOfWeekDate = startOfWeek(now)
    const endOfWeekDate = endOfWeek(now)

    const weeklyCompletion = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(startOfWeekDate)
      date.setDate(date.getDate() + index)
      const dateStr = format(date, "yyyy-MM-dd")

      return {
        date: format(date, "EEE"),
        completed: tasks.filter((task) => task.completed && format(new Date(task.dueDate), "yyyy-MM-dd") === dateStr)
          .length,
        created: tasks.filter((task) => format(new Date(task.createdAt), "yyyy-MM-dd") === dateStr).length,
      }
    })

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
      priorities,
      tagUsage,
      weeklyCompletion,
    }
  }, [tasks])

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
        <TabsTrigger value="tags">Tags</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.overdueTasks}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={[
                { name: "High", value: stats.priorities.high },
                { name: "Medium", value: stats.priorities.medium },
                { name: "Low", value: stats.priorities.low },
              ]}
              categories={["value"]}
              index="name"
              colors={["red", "orange", "yellow"]}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="trends" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Task Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={stats.weeklyCompletion}
              categories={["created", "completed"]}
              index="date"
              colors={["blue", "green"]}
              stack
              valueFormatter={(value) => `${value} tasks`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={stats.weeklyCompletion}
              categories={["completed"]}
              index="date"
              colors={["green"]}
              valueFormatter={(value) => `${value} tasks`}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tags" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tag Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={Object.entries(stats.tagUsage).map(([tag, count]) => ({
                tag,
                count,
              }))}
              categories={["count"]}
              index="tag"
              colors={["purple"]}
              valueFormatter={(value) => `${value} tasks`}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

