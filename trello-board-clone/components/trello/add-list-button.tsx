"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Plus, X } from "lucide-react"

interface AddListButtonProps {
  onAddList: (title: string) => void
}

export function AddListButton({ onAddList }: AddListButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  const handleSubmit = () => {
    if (title.trim()) {
      onAddList(title.trim())
      setTitle("")
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === "Escape") {
      setIsAdding(false)
      setTitle("")
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setTitle("")
  }

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex-shrink-0 flex items-center gap-2 w-[272px] px-3 py-2.5 rounded-xl text-white/90 hover:bg-white/20 transition-colors text-sm font-medium"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.24)" }}
      >
        <Plus className="w-4 h-4" />
        <span>Add another list</span>
      </button>
    )
  }

  return (
    <div
      className="flex-shrink-0 w-[272px] rounded-xl p-2"
      style={{ backgroundColor: "#EBECF0" }}
    >
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter list title..."
        className="w-full px-3 py-2 text-sm rounded border-2 border-[#0079BF] focus:outline-none"
      />
      <div className="flex items-center gap-1 mt-2">
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="px-3 py-1.5 bg-[#0079BF] text-white text-sm font-medium rounded hover:bg-[#026AA7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add list
        </button>
        <button
          onClick={handleCancel}
          className="p-1.5 hover:bg-[#DFE1E6] rounded transition-colors"
          aria-label="Cancel"
        >
          <X className="w-5 h-5 text-[#6B778C]" />
        </button>
      </div>
    </div>
  )
}
