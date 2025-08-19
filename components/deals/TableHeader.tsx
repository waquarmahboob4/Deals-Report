'use client';

import React, { useState } from 'react';
import { ArrowUp, ArrowDown, MoreHorizontal, GripVertical } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Column, SortConfig } from '@/types/deals';
import { cn } from '@/lib/utils';

interface TableHeaderProps {
  columns: Column[];
  sortConfig: SortConfig[];
  selectedRows: string[];
  totalRows: number;
  columnWidths: Record<string, number>;
  onSort: (columnId: string, shiftKey: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onContextMenu: (e: React.MouseEvent, type: 'column' | 'row', target: string) => void;
  onResize: (columnId: string, width: number) => void;
}

export function TableHeader({
  columns,
  sortConfig,
  selectedRows,
  totalRows,
  columnWidths,
  onSort,
  onSelectAll,
  onContextMenu,
  onResize,
}: TableHeaderProps) {
  const [resizing, setResizing] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  const getSortDirection = (columnId: string) => {
    const sort = sortConfig.find(s => s.key === columnId);
    return sort?.direction;
  };

  const getSortIndex = (columnId: string) => {
    const index = sortConfig.findIndex(s => s.key === columnId);
    return index >= 0 ? index + 1 : null;
  };

  const handleMouseDown = (e: React.MouseEvent, columnId: string) => {
    setResizing(columnId);
    setStartX(e.clientX);
    setStartWidth(columnWidths[columnId] || 150);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (resizing) {
        const diff = e.clientX - startX;
        const newWidth = Math.max(80, startWidth + diff);
        onResize(resizing, newWidth);
      }
    };

    const handleMouseUp = () => {
      setResizing(null);
    };

    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [resizing, startX, startWidth, onResize]);

  const isAllSelected = selectedRows.length === totalRows && totalRows > 0;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < totalRows;

  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        <th className="w-12 px-3 py-3 text-left">
          <Checkbox
  checked={isAllSelected}
  ref={(el: HTMLButtonElement | null) => {
    if (el) {
      const input = el.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
      if (input) input.indeterminate = isIndeterminate;
    }
  }}
  onCheckedChange={(checked:boolean) => onSelectAll(!!checked)}
          />
        </th>
        {columns.map((column) => (
          <th
            key={column.id}
            className={cn(
              'px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
              'border-r border-gray-200 last:border-r-0 relative group select-none',
              'hover:bg-gray-100 transition-colors cursor-pointer'
            )}
            style={{ width: columnWidths[column.id] || 150, minWidth: 80 }}
            onClick={(e) => onSort(column.id, e.shiftKey)}
            onContextMenu={(e) => onContextMenu(e, 'column', column.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span>{column.label}</span>
                {getSortIndex(column.id) && sortConfig.length > 1 && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                    {getSortIndex(column.id)}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                {getSortDirection(column.id) && (
                  getSortDirection(column.id) === 'asc' ? (
                    <ArrowUp className="w-3 h-3 text-blue-600" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-blue-600" />
                  )
                )}
                <button
                  className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 p-1 rounded transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContextMenu(e, 'column', column.id);
                  }}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div
              className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 transition-colors"
              onMouseDown={(e) => handleMouseDown(e, column.id)}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <GripVertical className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}