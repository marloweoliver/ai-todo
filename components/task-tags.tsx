"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { X, Settings } from "lucide-react"
import { HexColorPicker } from "react-colorful"

interface TaskTagsProps {
  tags: string[]
  onRemoveTag: (tag: string) => void
  onUpdateTagColor: (tag: string, color: string) => void
}

export default function TaskTags({ tags, onRemoveTag, onUpdateTagColor }: TaskTagsProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  console.log("Tags are", tags)

  return (
    <div className="flex flex-wrap gap-1">
      <AnimatePresence>
        {tags.map((tag) => (
          console.log("Rendering tag", tag),
          <motion.div
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="text-xs cursor-default group px-2 py-0.5 flex items-center gap-1"
            >
              <div className="w-2 h-2 rounded-full" />
              {tag}
              <div className="flex items-center gap-0.5">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                      onClick={() => setSelectedTag(tag)}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <div className="space-y-2">
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                  onClick={() => onRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tag} tag</span>
                </Button>
              </div>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

