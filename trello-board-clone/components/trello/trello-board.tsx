"use client"

import { useState } from "react"

import { TrelloList, type ListData } from "./trello-list"
import { AddListButton } from "./add-list-button"
import { BoardHeader } from "./board-header"
import type { CardData } from "./trello-card"

const initialData: ListData[] = [
  {
    id: "list-1",
    title: "To Do",
    cards: [
      {
        id: "card-1",
        title: "Research competitor pricing strategies",
        labels: [{ color: "#61BD4F" }, { color: "#F2D600" }],
      },
      {
        id: "card-2",
        title: "Create wireframes for new landing page",
        labels: [{ color: "#0079BF" }],
      },
      {
        id: "card-3",
        title: "Review Q4 marketing budget",
      },
    ],
  },
  {
    id: "list-2",
    title: "Doing",
    cards: [
      {
        id: "card-4",
        title: "Implement user authentication flow",
        labels: [{ color: "#EB5A46" }],
      },
      {
        id: "card-5",
        title: "Design email newsletter template",
        labels: [{ color: "#C377E0" }, { color: "#FF9F1A" }],
      },
    ],
  },
  {
    id: "list-3",
    title: "Done",
    cards: [
      {
        id: "card-6",
        title: "Set up development environment",
        labels: [{ color: "#61BD4F" }],
      },
      {
        id: "card-7",
        title: "Complete onboarding documentation",
        labels: [{ color: "#0079BF" }, { color: "#61BD4F" }],
      },
      {
        id: "card-8",
        title: "Fix navigation bug on mobile",
        labels: [{ color: "#EB5A46" }],
      },
    ],
  },
]

export function TrelloBoard() {
  const [lists, setLists] = useState<ListData[]>(initialData)

  const handleAddCard = (listId: string, title: string) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: [
                ...list.cards,
                {
                  id: `card-${Date.now()}`,
                  title,
                },
              ],
            }
          : list
      )
    )
  }

  const handleAddList = (title: string) => {
    setLists((prevLists) => [
      ...prevLists,
      {
        id: `list-${Date.now()}`,
        title,
        cards: [],
      },
    ])
  }

  const handleEditCard = (card: CardData) => {
    // Placeholder for edit functionality
    console.log("Edit card:", card)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ 
        background: "linear-gradient(to bottom right, #1e1b4b, #4c1d95)"
      }}
    >
      {/* Board Header */}
      <BoardHeader title="My Trello Board" />

      {/* Board Content */}
      <div className="flex-1 overflow-hidden">
        <div
          className="board-scroll h-full overflow-x-auto overflow-y-hidden px-4 pb-4"
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className="flex items-start gap-3 h-full">
            {lists.map((list) => (
              <TrelloList
                key={list.id}
                list={list}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
              />
            ))}
            <AddListButton onAddList={handleAddList} />
          </div>
        </div>
      </div>
    </div>
  )
}
