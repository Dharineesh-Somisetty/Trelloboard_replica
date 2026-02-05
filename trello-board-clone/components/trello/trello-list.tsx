"use client"

import { MoreHorizontal } from "lucide-react"
import { TrelloCard, type CardData } from "./trello-card"
import { AddCardForm } from "./add-card-form"

export interface ListData {
  id: string
  title: string
  cards: CardData[]
}

interface TrelloListProps {
  list: ListData
  onAddCard: (listId: string, title: string) => void
  onEditCard?: (card: CardData) => void
}

export function TrelloList({ list, onAddCard, onEditCard }: TrelloListProps) {
  return (
    <div
      className="flex-shrink-0 flex flex-col rounded-xl max-h-full"
      style={{
        width: "272px",
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "10px",
      }}
    >
      {/* List Header - Sticky */}
      <div className="flex items-center justify-between mb-2 sticky top-0 z-10 pb-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}>
        <h3 className="text-sm font-bold text-white px-1.5">
          {list.title}
        </h3>
        <button
          className="p-1.5 hover:bg-white/10 rounded transition-colors"
          aria-label="List options"
        >
          <MoreHorizontal className="w-4 h-4 text-white/70" />
        </button>
      </div>

      {/* Cards Container - Scrollable */}
      <div className="trello-list-content flex-1 overflow-y-auto overflow-x-hidden space-y-2 min-h-0 pr-1">
        {list.cards.map((card) => (
          <TrelloCard key={card.id} card={card} onEdit={onEditCard} />
        ))}
      </div>

      {/* Add Card Section */}
      <div className="mt-2 pt-1">
        <AddCardForm onAddCard={(title) => onAddCard(list.id, title)} />
      </div>
    </div>
  )
}
