import { useState, useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import List from './List';
import Card from './Card';

interface BoardProps {
  id: string;
}

export default function Board({ id }: BoardProps) {
  const { getBoard, moveCard } = useBoardStore();
  const board = getBoard(id);

  useEffect(() => {
    const handleDragStart = function (this: HTMLElement, e: DragEvent) {
      this.classList.add('dragging');
      const listId = this.closest('.list')?.getAttribute('data-list-id');
      const cardContainer = this.closest('.cards-container');
      if (cardContainer) {
        const index = Array.from(cardContainer.children).indexOf(this);
        e.dataTransfer?.setData('text/plain', JSON.stringify({ listId, index }));
      }
    };

    const handleDragEnd = function (this: HTMLElement) {
      this.classList.remove('dragging');
    };

    const handleDragOver = function (this: HTMLElement, e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();

      const draggingCard = document.querySelector<HTMLElement>('.dragging');
      if (!draggingCard) return;

      const afterCard = getDragAfterElement(this, e.clientY);
      if (afterCard) {
        this.insertBefore(draggingCard, afterCard);
      } else {
        this.appendChild(draggingCard);
      }
    };

    const handleDrop = function (this: HTMLElement, e: DragEvent) {
      e.preventDefault();
      e.stopPropagation();

      const draggingCard = document.querySelector<HTMLElement>('.dragging');
      if (!draggingCard) return;

      const data = e.dataTransfer?.getData('text/plain');
      if (!data) return;

      const { listId: fromListId, index: fromIndex } = JSON.parse(data);
      const toListId = this.closest('.list')?.getAttribute('data-list-id');
      if (!toListId) return;

      const toIndex = Array.from(this.children).indexOf(draggingCard);

      if (fromListId !== toListId || fromIndex !== toIndex) {
        moveCard(id, fromListId, toListId, fromIndex, toIndex);
      }
    };

    function getDragAfterElement(container: HTMLElement, y: number): HTMLElement | null {
      const draggableElements = [...container.querySelectorAll<HTMLElement>('.card:not(.dragging)')];

      if (draggableElements.length === 0) return null;

      let closestCard = draggableElements[0];
      let closestOffset = Number.NEGATIVE_INFINITY;

      draggableElements.forEach((card) => {
        const box = card.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closestOffset) {
          closestOffset = offset;
          closestCard = card;
        }
      });

      return closestOffset === Number.NEGATIVE_INFINITY ? null : closestCard;
    }

    // Add event listeners
    document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);
    });

    document.querySelectorAll<HTMLElement>('.cards-container').forEach((container) => {
      container.addEventListener('dragover', handleDragOver);
      container.addEventListener('drop', handleDrop);
    });

    // Cleanup
    return () => {
      document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
        card.removeEventListener('dragstart', handleDragStart);
        card.removeEventListener('dragend', handleDragEnd);
      });

      document.querySelectorAll<HTMLElement>('.cards-container').forEach((container) => {
        container.removeEventListener('dragover', handleDragOver);
        container.removeEventListener('drop', handleDrop);
      });
    };
  }, [board, id, moveCard]);

  if (!board) return null;

  return (
    <div
      className="flex-1 overflow-x-auto p-6"
      style={{
        backgroundImage: board.background.startsWith('http') ? `url(${board.background})` : undefined,
        backgroundColor: !board.background.startsWith('http') ? board.background : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex gap-3">
        {board.lists.map((list) => (
          <List key={list.id} boardId={board.id} list={list} />
        ))}
      </div>
    </div>
  );
}
