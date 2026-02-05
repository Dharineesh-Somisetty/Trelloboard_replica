"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  CreditCard, 
  AlignLeft, 
  Activity, 
  Tag, 
  Clock, 
  CheckSquare, 
  Users, 
  Paperclip,
  Image,
  ArrowRight,
  Copy,
  Archive,
  Share2
} from "lucide-react"
import type { CardData, LabelData } from "./trello-card"

interface CardModalProps {
  card: CardData
  listTitle: string
  isOpen: boolean
  onClose: () => void
  onUpdate: (cardId: string, updates: Partial<CardData>) => void
  onArchive: (cardId: string) => void
}

export function CardModal({ 
  card, 
  listTitle,
  isOpen, 
  onClose, 
  onUpdate,
  onArchive 
}: CardModalProps) {
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || "")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const titleRef = useRef<HTMLTextAreaElement>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setTitle(card.title)
    setDescription(card.description || "")
  }, [card])

  useEffect(() => {
    if (isEditingTitle && titleRef.current) {
      titleRef.current.focus()
      titleRef.current.select()
    }
  }, [isEditingTitle])

  useEffect(() => {
    if (isEditingDescription && descRef.current) {
      descRef.current.focus()
    }
  }, [isEditingDescription])

  const handleTitleSave = () => {
    if (title.trim() && title.trim() !== card.title) {
      onUpdate(card.id, { title: title.trim() })
    }
    setIsEditingTitle(false)
  }

  const handleDescriptionSave = () => {
    onUpdate(card.id, { description: description.trim() })
    setIsEditingDescription(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent, saveHandler: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      saveHandler()
    }
    if (e.key === "Escape") {
      setTitle(card.title)
      setDescription(card.description || "")
      setIsEditingTitle(false)
      setIsEditingDescription(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 z-[101] flex items-start justify-center pt-12 px-4 overflow-y-auto"
            onClick={onClose}
          >
            <div
              className="w-full max-w-[768px] rounded-xl shadow-2xl mb-12"
              style={{ backgroundColor: "#22272b" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Cover Area */}
              {card.cover && (
                <div 
                  className="h-32 rounded-t-xl"
                  style={{ backgroundColor: card.cover }}
                />
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>

              <div className="p-6">
                {/* Card Title Section */}
                <div className="flex items-start gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-white/70 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    {isEditingTitle ? (
                      <textarea
                        ref={titleRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={(e) => handleKeyDown(e, handleTitleSave)}
                        className="w-full text-xl font-semibold bg-[#22272b] text-white border-2 border-blue-500 rounded px-2 py-1 resize-none focus:outline-none"
                        rows={1}
                      />
                    ) : (
                      <h2 
                        className="text-xl font-semibold text-white cursor-pointer hover:bg-white/5 px-2 py-1 rounded -ml-2"
                        onClick={() => setIsEditingTitle(true)}
                      >
                        {card.title}
                      </h2>
                    )}
                    <p className="text-sm text-white/60 mt-1 px-2">
                      in list <span className="underline">{listTitle}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* Left Column - Main Content */}
                  <div className="flex-1 space-y-6">
                    {/* Labels */}
                    {card.labels && card.labels.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-white/60 uppercase mb-2">Labels</h4>
                        <div className="flex flex-wrap gap-1">
                          {card.labels.map((label, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded text-sm font-medium text-white"
                              style={{ backgroundColor: label.color }}
                            >
                              {label.text || ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <AlignLeft className="w-5 h-5 text-white/70" />
                        <h3 className="text-base font-semibold text-white">Description</h3>
                      </div>
                      {isEditingDescription ? (
                        <div className="ml-8">
                          <textarea
                            ref={descRef}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, handleDescriptionSave)}
                            placeholder="Add a more detailed description..."
                            className="w-full p-3 text-sm bg-[#22272b] text-white border border-white/20 rounded-lg resize-none focus:outline-none focus:border-blue-500 min-h-[120px]"
                            rows={5}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={handleDescriptionSave}
                              className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setDescription(card.description || "")
                                setIsEditingDescription(false)
                              }}
                              className="px-3 py-1.5 text-white/70 text-sm hover:bg-white/10 rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="ml-8 p-3 text-sm text-white/70 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors min-h-[80px]"
                          onClick={() => setIsEditingDescription(true)}
                        >
                          {description || "Add a more detailed description..."}
                        </div>
                      )}
                    </div>

                    {/* Activity */}
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Activity className="w-5 h-5 text-white/70" />
                        <h3 className="text-base font-semibold text-white">Activity</h3>
                      </div>
                      <div className="ml-8 space-y-3">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            U
                          </div>
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-2 text-sm bg-white/5 text-white/80 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500 placeholder:text-white/40"
                          />
                        </div>
                        <p className="text-xs text-white/40 ml-11">
                          No activity yet
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Actions */}
                  <div className="w-48 space-y-2">
                    <p className="text-xs font-semibold text-white/60 uppercase mb-2">Add to card</p>
                    
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 bg-white/5 hover:bg-white/10 rounded transition-colors">
                      <Users className="w-4 h-4" />
                      Members
                    </button>
                    
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 bg-white/5 hover:bg-white/10 rounded transition-colors">
                      <Tag className="w-4 h-4" />
                      Labels
                    </button>
                    
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 bg-white/5 hover:bg-white/10 rounded transition-colors">
                      <CheckSquare className="w-4 h-4" />
                      Checklist
                    </button>
                    
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 bg-white/5 hover:bg-white/10 rounded transition-colors">
                      <Clock className="w-4 h-4" />
                      Dates
                    </button>
                    
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 bg-white/5 hover:bg-white/10 rounded transition-colors">
                      <Paperclip className="w-4 h-4" />
                      Attachment
                    </button>
                    
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 bg-white/5 hover:bg-white/10 rounded transition-colors">
                      <Image className="w-4 h-4" />
                      Cover
                    </button>

                    <p className="text-xs font-semibold text-white/60 uppercase mt-4 mb-2">Actions</p>
                    
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 bg-white/5 hover:bg-white/10 rounded transition-colors">
                      <ArrowRight className="w-4 h-4" />
                      Move
                    </button>
                    
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 bg-white/5 hover:bg-white/10 rounded transition-colors">
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 bg-white/5 hover:bg-white/10 rounded transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    
                    <button 
                      onClick={() => {
                        onArchive(card.id)
                        onClose()
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 bg-white/5 hover:bg-white/10 rounded transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
