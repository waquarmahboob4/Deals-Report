'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusChip } from '@/components/deals/StatusChip';
import { EditableCell } from '@/components/deals/EditableCell';
import { ExpandedRowContent } from '@/components/deals/ExpandedRowContent';
import type { Deal, Column } from '@/types/deals';
import { cn } from '@/lib/utils';

interface TableRowProps {
  deal: Deal;
  columns: Column[];
  isSelected: boolean;
  isExpanded: boolean;
  rowIndex: number;
  focusedCell: { row: number; col: number } | null;
  columnWidths: Record<string, number>;
  onToggleSelection: () => void;
  onToggleExpansion: () => void;
  onUpdateDeal: (id: string, updates: Partial<Deal>) => void;
  onContextMenu: (e: React.MouseEvent, type: 'column' | 'row', target: string) => void;
}

export function TableRow({
  deal,
  columns,
  isSelected,
  isExpanded,
  rowIndex,
  focusedCell,
  columnWidths,
  onToggleSelection,
  onToggleExpansion,
  onUpdateDeal,
  onContextMenu,
}: TableRowProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'percentage':
        return `${value}%`;
      default:
        return value.toString();
    }
  };

  const renderCell = (column: Column, colIndex: number) => {
    const value = deal[column.id as keyof Deal];
    const isFocused = focusedCell?.row === rowIndex && focusedCell?.col === colIndex;
    const isHovered = hoveredCell === column.id;

    if (column.id === 'status' || column.id === 'stage') {
      return (
        <StatusChip
          status={value as string}
          type={column.id}
          onClick={() => setHoveredCell(column.id)}
        />
      );
    }

    if (column.editable) {
      return (
        <EditableCell
          value={value}
          type={column.type}
          options={column.options}
          isFocused={isFocused}
          isHovered={isHovered}
          onUpdate={(newValue) => onUpdateDeal(deal.id, { [column.id]: newValue })}
          onMouseEnter={() => setHoveredCell(column.id)}
          onMouseLeave={() => setHoveredCell(null)}
        />
      );
    }

    return (
      <span
        className={cn(
          'block truncate',
          isFocused && 'ring-2 ring-blue-500 ring-inset rounded px-1'
        )}
        onMouseEnter={() => setHoveredCell(column.id)}
        onMouseLeave={() => setHoveredCell(null)}
      >
        {formatCellValue(value, column.type)}
      </span>
    );
  };

  return (
    <>
      <tr
        className={cn(
          'hover:bg-gray-50 transition-colors group',
          isSelected && 'bg-blue-50 border-blue-200',
          isExpanded && 'border-b-0'
        )}
        onContextMenu={(e) => onContextMenu(e, 'row', deal.id)}
      >
        <td className="w-12 px-3 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleExpansion}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelection}
            />
          </div>
        </td>
        {columns.map((column, colIndex) => (
          <td
            key={column.id}
            className={cn(
              'px-3 py-4 border-r border-gray-200 last:border-r-0 relative',
              'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-inset'
            )}
            style={{ width: columnWidths[column.id] || 150, minWidth: 80 }}
          >
            {renderCell(column, colIndex)}
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:bg-gray-200 p-1 rounded transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onContextMenu(e, 'row', deal.id);
              }}
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </td>
        ))}
      </tr>
      {isExpanded && (
        <tr className="border-b border-gray-200">
          <td colSpan={columns.length + 1} className="p-0">
            <ExpandedRowContent deal={deal} />
          </td>
        </tr>
      )}
    </>
  );
}