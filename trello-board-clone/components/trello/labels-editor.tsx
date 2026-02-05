"use client"

import React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Pencil } from "lucide-react"
import type { LabelData } from "./trello-card"

interface LabelsEditorProps {
  isOpen: boolean
  currentLabels: LabelData[]
  onClose: () => void
  onUpdateLabels: (labels: LabelData[]) => void
}

// Standard Trello label colors with names
const STANDARD_LABELS: LabelData[] = [
  { color: "#61BD4F", text: "", name: "Green" },
  { color: "#F2D600", text: "", name: "Yellow" },
  { color: "#FF9F1A", text: "", name: "Orange" },
  { color: "#EB5A46", text: "", name: "Red" },
  { color: "#C377E0", text: "", name: "Purple" },
  { color: "#0079BF", text: "", name: "Blue" },
  { color: "#00C2E0", text: "lets see", name: "Sky" },
]

export function LabelsEditor({ 
  isOpen, 
  currentLabels, 
  onClose, 
  onUpdateLabels 
}: LabelsEditorProps) {
  const [labels, setLabels] = useState<LabelData[]>(currentLabels)
  const [editingLabel, setEditingLabel] = useState<number | null>(null)
  const [editText, setEditText] = useState("")

  const isLabelSelected = (color: string) => {
    return labels.some(l => l.color === color)
  }

  const toggleLabel = (standardLabel: LabelData) => {
    if (isLabelSelected(standardLabel.color)) {
      // Remove the label
      setLabels(labels.filter(l => l.color !== standardLabel.color))
    } else {
      // Add the label
      setLabels([...labels, { ...standardLabel }])
    }
  }

  const startEditing = (index: number, label: LabelData) => {
    setEditingLabel(index)
    setEditText(label.text || "")
  }

  const saveEdit = (index: number) => {
    const updatedLabels = [...STANDARD_LABELS]
    updatedLabels[index] = { ...updatedLabels[index], text: editText }
    setEditingLabel(null)
    // If this label is selected, update it
    if (isLabelSelected(STANDARD_LABELS[index].color)) {
      setLabels(labels.map(l => 
        l.color === STANDARD_LABELS[index].color 
          ? { ...l, text: editText }
          : l
      ))
    }
  }

  const handleSave = () => {
    onUpdateLabels(labels)
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
            className="fixed inset-0 bg-black/50 z-[92]"
            onClick={onClose}
          />

          {/* Labels Popover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", duration: 0.25 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[93] w-72 rounded-lg shadow-xl overflow-hidden"
            style={{ backgroundColor: "#282e33" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/10">
              <span className="text-sm font-medium text-white/90">Labels</span>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* Labels List */}
            <div className="p-3 space-y-2">
              {STANDARD_LABELS.map((label, index) => (
                <div key={index} className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLabel(label)}
                    className="flex-1 h-8 rounded flex items-center justify-between px-3 hover:brightness-110 transition-all"
                    style={{ backgroundColor: label.color }}
                  >
                    <span className="text-sm font-medium text-white truncate">
                      {label.text || label.name}
                    </span>
                    {isLabelSelected(label.color) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startEditing(index, label)
                    }}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-white/70" />
                  </button>
                </div>
              ))}
            </div>

            {/* Edit Label Modal */}
            {editingLabel !== null && (
              <div className="px-3 pb-3 pt-1 border-t border-white/10">
                <p className="text-xs text-white/60 mb-2">Label title</p>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Enter label title..."
                  className="w-full px-3 py-2 text-sm bg-white/5 text-white rounded border border-white/20 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => saveEdit(editingLabel)}
                    className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingLabel(null)}
                    className="px-3 py-1.5 text-white/70 text-sm hover:bg-white/10 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-3 pb-3 pt-2 border-t border-white/10">
              <button
                onClick={handleSave}
                className="w-full py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
