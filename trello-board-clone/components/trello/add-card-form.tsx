"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Plus, X } from "lucide-react"

interface AddCardFormProps {
  onAddCard: (title: string) => void
}

export function AddCardForm({ onAddCard }: AddCardFormProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isAdding && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isAdding])

  const handleSubmit = () => {
    if (title.trim()) {
      onAddCard(title.trim())
      setTitle("")
      setIsAdding(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
        className="flex items-center gap-1 w-full px-2 py-1.5 text-[#5E6C84] hover:bg-[#DFE1E6] rounded-lg transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        <span>Add a card</span>
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a title for this card..."
        className="w-full min-h-[54px] p-2 text-sm rounded-lg border-none shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#0079BF]"
        style={{ backgroundColor: "#FFFFFF" }}
      />
      <div className="flex items-center gap-1">
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="px-3 py-1.5 bg-[#0079BF] text-white text-sm font-medium rounded hover:bg-[#026AA7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add card
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
