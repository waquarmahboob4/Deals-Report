'use client';

import React from 'react';
import { Edit3, Copy, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, MoreHorizontal } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  type: 'column' | 'row';
  target: string;
  onClose: () => void;
  onAction: (action: string) => void;
}

export function ContextMenu({ x, y, type, target, onClose, onAction }: ContextMenuProps) {
  const columnActions = [
    { id: 'sort-asc', label: 'Sort Ascending', icon: ArrowUp },
    { id: 'sort-desc', label: 'Sort Descending', icon: ArrowDown },
    { id: 'hide-column', label: 'Hide Column', icon: EyeOff },
    { id: 'resize-column', label: 'Resize Column', icon: MoreHorizontal },
  ];

  const rowActions = [
    { id: 'edit', label: 'Edit Deal', icon: Edit3 },
    { id: 'duplicate', label: 'Duplicate', icon: Copy },
    { id: 'delete', label: 'Delete', icon: Trash2 },
    { id: 'view-details', label: 'View Details', icon: Eye },
  ];

  const actions = type === 'column' ? columnActions : rowActions;

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px]"
        style={{ left: x, top: y }}
      >
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
          >
            <action.icon className="w-4 h-4" />
            <span>{action.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}