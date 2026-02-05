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
      className="group relative bg-white rounded-lg shadow-sm hover:bg-[#F4F5F7] cursor-pointer transition-colors duration-150"
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
      <p className="text-sm text-[#172B4D] leading-5 pr-6">{card.title}</p>

      {/* Edit Button - appears on hover */}
      {isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(card)
          }}
          className="absolute top-2 right-2 p-1 rounded hover:bg-[#EBECF0] transition-colors"
          aria-label="Edit card"
        >
          <Pencil className="w-3.5 h-3.5 text-[#6B778C]" />
        </button>
      )}
    </div>
  )
}
