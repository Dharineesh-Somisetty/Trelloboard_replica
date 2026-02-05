"use client"

import { useState, useRef } from "react"
import { MoreHorizontal, Plus, Copy, ArrowRight, Eye, X, ChevronUp, Archive } from "lucide-react"
import { TrelloCard, type CardData, type LabelData } from "./trello-card"
import { AddCardForm, type AddCardFormRef } from "./add-card-form"

export interface ListData {
  id: string
  title: string
  cards: CardData[]
  color?: string
}

interface TrelloListProps {
  list: ListData
  onAddCard: (listId: string, title: string) => void
  onEditCard?: (card: CardData) => void
  onUpdateCard?: (listId: string, cardId: string, newTitle: string) => void
  onUpdateCardFull?: (listId: string, cardId: string, updates: Partial<CardData>) => void
  onArchiveCard?: (listId: string, cardId: string) => void
  onToggleCardComplete?: (listId: string, cardId: string) => void
  onUpdateCardLabels?: (listId: string, cardId: string, labels: LabelData[]) => void
  onArchiveList?: (listId: string) => void
  onChangeListColor?: (listId: string, color: string | null) => void
}

const LIST_COLORS = [
  "#4d7c0f", // olive/dark green
  "#ca8a04", // amber/yellow
  "#ea580c", // orange
  "#dc2626", // red
  "#a855f7", // purple
  "#16a34a", // green
  "#0891b2", // cyan/teal
  "#22c55e", // lime green
  "#ec4899", // pink
  "#6b7280", // gray
]

export function TrelloList({ 
  list, 
  onAddCard, 
  onEditCard,
  onUpdateCard,
  onUpdateCardFull,
  onArchiveCard,
  onToggleCardComplete,
  onUpdateCardLabels,
  onArchiveList,
  onChangeListColor,
}: TrelloListProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(true)
  const addCardFormRef = useRef<AddCardFormRef>(null)

  const handleAddCardFromMenu = () => {
    setIsMenuOpen(false)
    addCardFormRef.current?.triggerAdd()
  }

  const handleArchiveList = () => {
    setIsMenuOpen(false)
    onArchiveList?.(list.id)
  }

  const handleColorChange = (color: string | null) => {
    onChangeListColor?.(list.id, color)
  }

  // Determine list header background based on color
  const listBgColor = list.color ? list.color : "rgba(0, 0, 0, 0.25)"
  const headerBgColor = list.color ? list.color : "rgba(0, 0, 0, 0.25)"

  return (
    <div
      className="flex-shrink-0 flex flex-col rounded-xl max-h-full relative"
      style={{
        width: "272px",
        backgroundColor: listBgColor,
        backdropFilter: list.color ? "none" : "blur(12px)",
        WebkitBackdropFilter: list.color ? "none" : "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "10px",
      }}
    >
      {/* List Header - Sticky */}
      <div 
        className="flex items-center justify-between mb-2 sticky top-0 z-10 pb-1" 
        style={{ backgroundColor: headerBgColor }}
      >
        <h3 className="text-sm font-bold text-white px-1.5">
          {list.title}
        </h3>
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Collapse list"
          >
            <ChevronUp className="w-4 h-4 text-white/70 rotate-90" />
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            aria-label="List options"
          >
            <MoreHorizontal className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* List Actions Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu */}
          <div 
            className="absolute top-10 right-0 z-50 w-72 rounded-lg shadow-xl overflow-hidden"
            style={{ backgroundColor: "#282e33" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
              <span className="text-sm font-medium text-white/90">List actions</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={handleAddCardFromMenu}
                className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                Add card
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                Copy list
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                Move list
              </button>
              <button
                className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                Watch
              </button>
            </div>

            {/* Color Picker Section */}
            <div className="border-t border-white/10">
              <button
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="w-full px-3 py-2 flex items-center justify-between text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  Change list color
                  <span className="text-xs px-1.5 py-0.5 bg-purple-600 text-white rounded">PREMIUM</span>
                </span>
                <ChevronUp className={`w-4 h-4 transition-transform ${isColorPickerOpen ? "" : "rotate-180"}`} />
              </button>
              
              {isColorPickerOpen && (
                <div className="px-3 pb-3">
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    {LIST_COLORS.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorChange(color)}
                        className={`w-10 h-8 rounded transition-all hover:scale-105 ${
                          list.color === color ? "ring-2 ring-white ring-offset-1 ring-offset-[#282e33]" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Set color to ${color}`}
                      >
                        {list.color === color && (
                          <span className="text-white text-lg">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleColorChange(null)}
                    className="w-full py-2 flex items-center justify-center gap-2 text-sm text-white/80 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Remove color
                  </button>
                </div>
              )}
            </div>

            {/* Automation Section */}
            <div className="border-t border-white/10">
              <button
                className="w-full px-3 py-2 flex items-center justify-between text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                <span>Automation</span>
                <ChevronUp className="w-4 h-4 rotate-180" />
              </button>
              <div className="px-3 pb-2">
                <button className="w-full py-1.5 text-left text-sm text-white/60 hover:bg-white/10 rounded px-2 transition-colors">
                  When a card is added to the list...
                </button>
                <button className="w-full py-1.5 text-left text-sm text-white/60 hover:bg-white/10 rounded px-2 transition-colors">
                  Every day, sort list by...
                </button>
                <button className="w-full py-1.5 text-left text-sm text-white/60 hover:bg-white/10 rounded px-2 transition-colors">
                  Every Monday, sort list by...
                </button>
                <button className="w-full py-1.5 text-left text-sm text-white/60 hover:bg-white/10 rounded px-2 transition-colors">
                  Create a rule
                </button>
              </div>
            </div>

            {/* Archive */}
            <div className="border-t border-white/10 py-1">
              <button
                onClick={handleArchiveList}
                className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                Archive this list
              </button>
            </div>
          </div>
        </>
      )}

      {/* Cards Container - Scrollable */}
      <div className="trello-list-content flex-1 overflow-y-auto overflow-x-hidden space-y-2 min-h-0 pr-1">
        {list.cards.map((card) => (
          <TrelloCard 
            key={card.id} 
            card={card}
            listTitle={list.title}
            onEdit={onEditCard}
            onUpdate={(cardId, newTitle) => onUpdateCard?.(list.id, cardId, newTitle)}
            onUpdateCard={(cardId, updates) => onUpdateCardFull?.(list.id, cardId, updates)}
            onArchive={(cardId) => onArchiveCard?.(list.id, cardId)}
            onToggleComplete={(cardId) => onToggleCardComplete?.(list.id, cardId)}
            onUpdateLabels={(cardId, labels) => onUpdateCardLabels?.(list.id, cardId, labels)}
          />
        ))}
      </div>

      {/* Add Card Section */}
      <div className="mt-2 pt-1">
        <AddCardForm 
          ref={addCardFormRef}
          onAddCard={(title) => onAddCard(list.id, title)} 
        />
      </div>
    </div>
  )
}
