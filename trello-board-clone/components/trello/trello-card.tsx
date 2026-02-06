"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Pencil, Archive, CheckCircle2, Circle } from "lucide-react"
import { QuickEditMenu } from "./quick-edit-menu"
import { LabelsEditor } from "./labels-editor"
import { CardModal } from "./card-modal"

export interface LabelData {
  color: string
  text?: string
  name?: string
}

export interface CardData {
  id: string
  title: string
  labels?: LabelData[]
  completed?: boolean
  description?: string
  cover?: string
}

interface TrelloCardProps {
  card: CardData
  listTitle?: string
  onEdit?: (card: CardData) => void
  onUpdate?: (cardId: string, newTitle: string) => void
  onUpdateCard?: (cardId: string, updates: Partial<CardData>) => void
  onArchive?: (cardId: string) => void
  onToggleComplete?: (cardId: string) => void
  onUpdateLabels?: (cardId: string, labels: LabelData[]) => void
}

// Label tooltip component
function LabelTooltip({ label, children }: { label: LabelData; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setPosition({ x: rect.left + rect.width / 2, y: rect.top - 8 })
    }
    setIsVisible(true)
  }

  const colorName = label.name || getColorName(label.color)
  const titleText = label.text ? `"${label.text}"` : "none"

  return (
    <div 
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[200] px-2 py-1 text-xs text-white bg-black/90 rounded shadow-lg whitespace-nowrap pointer-events-none"
            style={{ 
              left: position.x, 
              top: position.y,
              transform: "translate(-50%, -100%)"
            }}
          >
            Color: {colorName}, title: {titleText}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getColorName(color: string): string {
  const colorMap: Record<string, string> = {
    "#61BD4F": "Green",
    "#F2D600": "Yellow",
    "#FF9F1A": "Orange",
    "#EB5A46": "Red",
    "#C377E0": "Purple",
    "#0079BF": "Blue",
    "#00C2E0": "Sky",
  }
  return colorMap[color.toUpperCase()] || colorMap[color] || "Custom"
}

export function TrelloCard({ 
  card, 
  listTitle = "List",
  onEdit, 
  onUpdate, 
  onUpdateCard,
  onArchive, 
  onToggleComplete,
  onUpdateLabels
}: TrelloCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false)
  const [isLabelsOpen, setIsLabelsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const cardRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleComplete?.(card.id)
  }

  const handleArchive = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    onArchive?.(card.id)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setMenuPosition({ 
        x: rect.right + 8, 
        y: rect.top 
      })
    }
    setIsQuickEditOpen(true)
  }

  const handleOpenCard = () => {
    setIsQuickEditOpen(false)
    setIsModalOpen(true)
  }

  const handleEditLabels = () => {
    setIsQuickEditOpen(false)
    setIsLabelsOpen(true)
  }

  const handleUpdateLabels = (labels: LabelData[]) => {
    onUpdateLabels?.(card.id, labels)
  }

  const handleUpdateCard = (cardId: string, updates: Partial<CardData>) => {
    if (updates.title && onUpdate) {
      onUpdate(cardId, updates.title)
    }
    onUpdateCard?.(cardId, updates)
  }

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle.trim() !== card.title) {
      onUpdate?.(card.id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSaveTitle()
    }
    if (e.key === "Escape") {
      setEditTitle(card.title)
      setIsEditing(false)
    }
  }

  // Quick edit with textarea overlay
  if (isEditing) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 z-[80]"
          onClick={() => {
            setEditTitle(card.title)
            setIsEditing(false)
          }}
        />
        
        {/* Editing Card */}
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.02 }}
          className="relative z-[81]"
        >
          <textarea
            ref={textareaRef}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 text-sm rounded-lg border-2 border-blue-500 shadow-lg resize-none focus:outline-none bg-[#22272b] text-white/80 min-h-[80px]"
            rows={3}
          />
          <button
            onClick={handleSaveTitle}
            className="mt-2 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </motion.div>
      </>
    )
  }

  return (
    <>
      <motion.div
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`group relative rounded-lg shadow-sm cursor-pointer transition-all duration-150 active:scale-[0.98] ${
          isHovered ? "ring-2 ring-blue-400" : ""
        }`}
        style={{ 
          padding: "8px",
          backgroundColor: "#22272b",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Labels - 40px wide bars with tooltips */}
        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels.map((label, index) => (
              <LabelTooltip key={index} label={label}>
                <div
                  className="block rounded cursor-pointer hover:brightness-110 transition-all"
                  style={{ 
                    backgroundColor: label.color,
                    width: "40px",
                    height: "8px",
                    borderRadius: "4px",
                    minHeight: "8px",
                  }}
                />
              </LabelTooltip>
            ))}
          </div>
        )}

        {/* Card Content with Checkbox */}
        <div className="flex items-start gap-2">
          {/* Completion Toggle */}
          <button
            onClick={handleToggleComplete}
            className="flex-shrink-0 mt-0.5 transition-all duration-150 hover:scale-110"
            aria-label={card.completed ? "Mark incomplete" : "Mark complete"}
          >
            {card.completed ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 text-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
            )}
          </button>

          {/* Card Title */}
          <p 
            className={`text-sm leading-5 break-words flex-1 ${
              card.completed ? "line-through text-white/50" : "text-white/80"
            }`} 
            style={{ overflowWrap: "anywhere" }}
          >
            {card.title}
          </p>
        </div>

        {/* Hover Icons - Archive and Edit */}
        <div 
          className={`absolute top-2 right-2 flex items-center gap-1 transition-all duration-150 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleArchive()
            }}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Archive card"
          >
            <Archive className="w-3.5 h-3.5 text-white/70" />
          </button>
          <button
            onClick={handleEditClick}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Quick edit"
          >
            <Pencil className="w-3.5 h-3.5 text-white/70" />
          </button>
        </div>
      </motion.div>

      {/* Quick Edit Menu */}
      <QuickEditMenu
        card={card}
        isOpen={isQuickEditOpen}
        position={menuPosition}
        onClose={() => setIsQuickEditOpen(false)}
        onOpenCard={handleOpenCard}
        onEditLabels={handleEditLabels}
        onArchive={() => handleArchive()}
      />

      {/* Labels Editor */}
      <LabelsEditor
        isOpen={isLabelsOpen}
        currentLabels={card.labels || []}
        onClose={() => setIsLabelsOpen(false)}
        onUpdateLabels={handleUpdateLabels}
      />

      {/* Card Modal */}
      <CardModal
        card={card}
        listTitle={listTitle}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateCard}
        onArchive={(cardId) => {
          onArchive?.(cardId)
          setIsModalOpen(false)
        }}
      />
    </>
  )
}
