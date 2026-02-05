"use client"

import { Star, Users, Filter, Zap, MoreHorizontal } from "lucide-react"

interface BoardHeaderProps {
  title: string
}

export function BoardHeader({ title }: BoardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-white">{title}</h1>
        <button className="p-1.5 hover:bg-white/20 rounded transition-colors">
          <Star className="w-4 h-4 text-white/80" />
        </button>
        <button className="flex items-center gap-1.5 px-2 py-1 text-sm text-white/90 hover:bg-white/20 rounded transition-colors">
          <Users className="w-4 h-4" />
          <span>Board</span>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/90 hover:bg-white/20 rounded transition-colors">
          <Zap className="w-4 h-4" />
          <span>Automation</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/90 hover:bg-white/20 rounded transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-medium">
          U
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-sm text-white font-medium rounded hover:bg-white/30 transition-colors">
          <Users className="w-4 h-4" />
          <span>Share</span>
        </button>
        <button className="p-1.5 hover:bg-white/20 rounded transition-colors">
          <MoreHorizontal className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}
