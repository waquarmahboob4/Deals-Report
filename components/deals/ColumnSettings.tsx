'use client';

import React, { useState } from 'react';
import { X, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { Column } from '@/types/deals';
import { cn } from '@/lib/utils';

interface ColumnSettingsProps {
  columns: Column[];
  visibleColumns: string[];
  columnOrder: string[];
  onToggleVisibility: (columnId: string) => void;
  onReorderColumns: (newOrder: string[]) => void;
  onClose: () => void;
}

export function ColumnSettings({
  columns,
  visibleColumns,
  columnOrder,
  onToggleVisibility,
  onReorderColumns,
  onClose,
}: ColumnSettingsProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const orderedColumns = columnOrder.map(id => 
    columns.find(col => col.id === id)
  ).filter(Boolean) as Column[];

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedItem(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverItem(columnId);
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedItem);
    const targetIndex = newOrder.indexOf(targetColumnId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    onReorderColumns(newOrder);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Column Settings</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {orderedColumns.map((column) => (
              <div
                key={column.id}
                draggable
                onDragStart={(e) => handleDragStart(e, column.id)}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
                className={cn(
                  'flex items-center space-x-3 p-3 rounded-lg border cursor-move transition-colors',
                  draggedItem === column.id && 'opacity-50',
                  dragOverItem === column.id && 'border-blue-400 bg-blue-50'
                )}
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
                
                <Checkbox
                  checked={visibleColumns.includes(column.id)}
                  onCheckedChange={() => onToggleVisibility(column.id)}
                />
                
                <div className="flex-1">
                  <div className="font-medium text-sm">{column.label}</div>
                  <div className="text-xs text-gray-500">{column.type}</div>
                </div>
                
                <button
                  onClick={() => onToggleVisibility(column.id)}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                >
                  {visibleColumns.includes(column.id) ? (
                    <Eye className="w-4 h-4 text-blue-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <Button 
            onClick={onClose} 
            className="w-full"
          >
            Done
          </Button>
        </div>
      </div>
    </>
  );
}