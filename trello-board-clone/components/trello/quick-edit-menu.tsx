"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CreditCard, 
  Tag, 
  Users, 
  Image, 
  Clock, 
  ArrowRight, 
  Copy, 
  Link2, 
  Layers, 
  Archive 
} from "lucide-react"
import type { CardData } from "./trello-card"

interface QuickEditMenuProps {
  card: CardData
  isOpen: boolean
  position: { x: number; y: number }
  onClose: () => void
  onOpenCard: () => void
  onEditLabels: () => void
  onArchive: () => void
}

const menuItems = [
  { icon: CreditCard, label: "Open card", action: "open" },
  { icon: Tag, label: "Edit labels", action: "labels" },
  { icon: Users, label: "Change members", action: "members" },
  { icon: Image, label: "Change cover", action: "cover" },
  { icon: Clock, label: "Edit dates", action: "dates" },
  { icon: ArrowRight, label: "Move", action: "move" },
  { icon: Copy, label: "Copy card", action: "copy" },
  { icon: Link2, label: "Copy link", action: "link" },
  { icon: Layers, label: "Mirror", action: "mirror" },
  { icon: Archive, label: "Archive", action: "archive" },
]

export function QuickEditMenu({ 
  card, 
  isOpen, 
  position,
  onClose, 
  onOpenCard,
  onEditLabels,
  onArchive 
}: QuickEditMenuProps) {
  const handleAction = (action: string) => {
    switch (action) {
      case "open":
        onOpenCard()
        break
      case "labels":
        onEditLabels()
        break
      case "archive":
        onArchive()
        break
      default:
        console.log(`Action: ${action}`)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[90]"
            onClick={onClose}
          />

          {/* Menu positioned next to card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -10 }}
            transition={{ type: "spring", duration: 0.25 }}
            className="fixed z-[91] py-1"
            style={{ 
              top: position.y,
              left: position.x,
              backgroundColor: "#282e33",
              borderRadius: "8px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
              minWidth: "160px"
            }}
          >
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleAction(item.action)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors text-left"
                style={{ backgroundColor: "#282e33" }}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
                {item.action === "open" && (
                  <span className="ml-auto text-xs text-white/40 bg-white/10 px-1.5 py-0.5 rounded">
                    Enter
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
