"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"

export interface CardData {
  id: string
  title: string
  labels?: { color: string; text?: string }[]
}

interface TrelloCardProps {
  card: CardData
  onEdit?: (card: CardData) => void
}

export function TrelloCard({ card, onEdit }: TrelloCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative bg-white/90 rounded-lg shadow-sm hover:bg-white cursor-pointer transition-all duration-150 active:scale-[0.98]"
      style={{ padding: "8px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label, index) => (
            <span
              key={index}
              className="h-2 w-10 rounded-sm"
              style={{ backgroundColor: label.color }}
            />
          ))}
        </div>
      )}

      {/* Card Title */}
      <p className="text-sm text-[#172B4D] leading-5 break-words" style={{ overflowWrap: "anywhere" }}>{card.title}</p>

      {/* Edit Button - appears on hover on the far right */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onEdit?.(card)
        }}
        className={`absolute top-2 right-2 p-1 rounded hover:bg-black/5 transition-all duration-150 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Edit card"
      >
        <Pencil className="w-3.5 h-3.5 text-[#6B778C]" />
      </button>
    </div>
  )
}
