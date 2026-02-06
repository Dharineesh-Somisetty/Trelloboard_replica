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

  const handleUpdateCard = (listId: string, cardId: string, newTitle: string) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId ? { ...card, title: newTitle } : card
              ),
            }
          : list
      )
    )
  }

  const handleArchiveCard = (listId: string, cardId: string) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.filter((card) => card.id !== cardId),
            }
          : list
      )
    )
  }

  const handleToggleCardComplete = (listId: string, cardId: string) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId ? { ...card, completed: !card.completed } : card
              ),
            }
          : list
      )
    )
  }

  const handleUpdateCardFull = (listId: string, cardId: string, updates: Partial<CardData>) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            }
          : list
      )
    )
  }

  const handleUpdateCardLabels = (listId: string, cardId: string, labels: CardData["labels"]) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId ? { ...card, labels } : card
              ),
            }
          : list
      )
    )
  }

  const handleArchiveList = (listId: string) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== listId))
  }

  const handleChangeListColor = (listId: string, color: string | null) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? { ...list, color: color || undefined }
          : list
      )
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ 
        background: "linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 25%, #4a1d6f 50%, #6b2d8f 75%, #8b4a9f 100%)"
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
                onUpdateCard={handleUpdateCard}
                onUpdateCardFull={handleUpdateCardFull}
                onArchiveCard={handleArchiveCard}
                onToggleCardComplete={handleToggleCardComplete}
                onUpdateCardLabels={handleUpdateCardLabels}
                onArchiveList={handleArchiveList}
                onChangeListColor={handleChangeListColor}
              />
            ))}
            <AddListButton onAddList={handleAddList} />
          </div>
        </div>
      </div>
    </div>
  )
}
