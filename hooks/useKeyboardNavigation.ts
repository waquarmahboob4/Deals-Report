'use client';

import { useState, useCallback, RefObject } from 'react';

export function useKeyboardNavigation(
  tableRef: RefObject<HTMLDivElement>,
  rowCount: number,
  colCount: number
) {
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!focusedCell) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedCell({ row: 0, col: 0 });
        return;
      }
    }

    const { row, col } = focusedCell || { row: 0, col: 0 };

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setFocusedCell(prev => ({
          row: Math.max(0, row - 1),
          col: prev?.col || 0,
        }));
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        setFocusedCell(prev => ({
          row: Math.min(rowCount - 1, row + 1),
          col: prev?.col || 0,
        }));
        break;
      
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedCell(prev => ({
          row: prev?.row || 0,
          col: Math.max(0, col - 1),
        }));
        break;
      
      case 'ArrowRight':
        e.preventDefault();
        setFocusedCell(prev => ({
          row: prev?.row || 0,
          col: Math.min(colCount - 1, col + 1),
        }));
        break;
      
      case 'Escape':
        e.preventDefault();
        setFocusedCell(null);
        break;

      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          if (col > 0) {
            setFocusedCell({ row, col: col - 1 });
          } else if (row > 0) {
            setFocusedCell({ row: row - 1, col: colCount - 1 });
          }
        } else {
          if (col < colCount - 1) {
            setFocusedCell({ row, col: col + 1 });
          } else if (row < rowCount - 1) {
            setFocusedCell({ row: row + 1, col: 0 });
          }
        }
        break;
    }
  }, [focusedCell, rowCount, colCount]);

  return {
    focusedCell,
    handleKeyDown,
    setFocusedCell,
  };
}