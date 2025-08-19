'use client';

import React from 'react';
import type { Deal, Column } from '@/types/deals';

interface TotalsBarProps {
  deals: Deal[];
  columns: Column[];
  columnWidths: Record<string, number>;
}

export function TotalsBar({ deals, columns, columnWidths }: TotalsBarProps) {
  const calculateTotal = (columnId: string, type: string) => {
    const values = deals.map(deal => deal[columnId as keyof Deal]).filter(val => val != null);
    
    switch (type) {
      case 'currency':
      case 'number':
        const sum = Number(values.reduce((acc, val) => Number(acc) + Number(val), 0));
        if (type === 'currency') {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(sum);
        }
        return sum.toLocaleString();
      case 'percentage':
        const avg = Number(values.reduce((acc, val) => Number(acc) + Number(val), 0)) / values.length;
        return `${avg.toFixed(1)}%`;
      default:
        return `${values.length} items`;
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 sticky bottom-0">
      <div className="flex">
        <div className="w-12 px-3 py-3 text-xs font-medium text-gray-500">
          Total
        </div>
        {columns.map((column) => (
          <div
            key={column.id}
            className="px-3 py-3 text-xs font-medium text-gray-900 border-r border-gray-200 last:border-r-0"
            style={{ width: columnWidths[column.id] || 150, minWidth: 80 }}
          >
            {(column.type === 'currency' || column.type === 'number' || column.type === 'percentage') 
              ? calculateTotal(column.id, column.type)
              : column.id === 'name' 
              ? `${deals.length} deals`
              : ''
            }
          </div>
        ))}
      </div>
    </div>
  );
}