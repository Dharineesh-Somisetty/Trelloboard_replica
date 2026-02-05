"use client"

import React from "react"
import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react"
import { Plus, X, Copy } from "lucide-react"

interface AddCardFormProps {
  onAddCard: (title: string) => void
}

export interface AddCardFormRef {
  triggerAdd: () => void
}

export const AddCardForm = forwardRef<AddCardFormRef, AddCardFormProps>(
  function AddCardForm({ onAddCard }, ref) {
    const [isAdding, setIsAdding] = useState(false)
    const [title, setTitle] = useState("")
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      triggerAdd: () => setIsAdding(true),
    }))

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
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 flex-1 px-2 py-1.5 text-white/85 hover:bg-white/10 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add a card</span>
          </button>
          <button
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            aria-label="Create from template"
          >
            <Copy className="w-4 h-4 text-white/70" />
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-2 animate-slide-down">
        <textarea
          ref={textareaRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a title for this card..."
          rows={3}
          className="w-full p-2 text-sm rounded-lg border-none shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[#172B4D] placeholder:text-gray-400"
        />
        <div className="flex items-center gap-1">
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-3 py-1.5 bg-[#22c55e] text-white text-sm font-medium rounded hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add card
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            aria-label="Cancel"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>
    )
  }
)
