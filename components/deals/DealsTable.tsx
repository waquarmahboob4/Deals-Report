'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect, RefObject } from 'react';
import { TableHeader } from '@/components/deals/TableHeader';
import { TableRow } from '@/components/deals/TableRow';
import { FilterBar } from '@/components/deals/FilterBar';
import { BulkActionsToolbar } from '@/components/deals/BulkActionsToolbar';
import { TotalsBar } from '@/components/deals/TotalsBar';
import { ContextMenu } from '@/components/deals/ContextMenu';
import { ColumnSettings } from '@/components/deals/ColumnSettings';
import { useDealsData } from '@/hooks/useDealsData';
import { useTableState } from '@/hooks/useTableState';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import type { Deal, Column } from '@/types/deals';

export function DealsTable() {
  const { deals, updateDeal } = useDealsData();
  const {
    columns,
    sortConfig,
    filterConfig,
    selectedRows,
    expandedRows,
    visibleColumns,
    columnOrder,
    columnWidths,
    updateSort,
    updateFilter,
    toggleRowSelection,
    toggleRowExpansion,
    toggleColumnVisibility,
    reorderColumns,
    resizeColumn,
    clearSelection,
    selectAll,
  } = useTableState();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'column' | 'row';
    target: string;
  } | null>(null);
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  const tableRef = useRef<HTMLDivElement>(null);
  const { focusedCell, handleKeyDown } = useKeyboardNavigation(
    tableRef as RefObject<HTMLDivElement>,
    deals.length,
    visibleColumns.length
  );

  const processedDeals = useMemo(() => {
    let filtered = deals;

    Object.entries(filterConfig).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(deal => {
          const dealValue = deal[key as keyof Deal];
          if (typeof dealValue === 'string') {
            return dealValue.toLowerCase().includes(value.toLowerCase());
          }
          if (typeof dealValue === 'number') {
            return dealValue.toString().includes(value);
          }
          return false;
        });
      }
    });

    if (sortConfig.length > 0) {
      filtered = [...filtered].sort((a, b) => {
        for (const sort of sortConfig) {
          const aVal = a[sort.key as keyof Deal];
          const bVal = b[sort.key as keyof Deal];
          
          let comparison = 0;
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            comparison = aVal.localeCompare(bVal);
          } else if (typeof aVal === 'number' && typeof bVal === 'number') {
            comparison = aVal - bVal;
          } else if (aVal instanceof Date && bVal instanceof Date) {
            comparison = aVal.getTime() - bVal.getTime();
          }
          
          if (comparison !== 0) {
            return sort.direction === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    return filtered;
  }, [deals, filterConfig, sortConfig]);

  const handleContextMenu = useCallback((e: React.MouseEvent, type: 'column' | 'row', target: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      target,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [closeContextMenu]);

  const orderedColumns = useMemo(() => {
    return columnOrder.map(id => columns.find(col => col.id === id)).filter(Boolean) as Column[];
  }, [columns, columnOrder]);

  const displayedColumns = useMemo(() => {
    return orderedColumns.filter(col => visibleColumns.includes(col.id));
  }, [orderedColumns, visibleColumns]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <FilterBar
        columns={columns}
        filterConfig={filterConfig}
        onUpdateFilter={updateFilter}
        onShowColumnSettings={() => setShowColumnSettings(true)}
      />
      
      {selectedRows.length > 0 && (
        <BulkActionsToolbar
          selectedCount={selectedRows.length}
          onClearSelection={clearSelection}
          onBulkDelete={() => console.log('Bulk delete')}
          onBulkExport={() => console.log('Bulk export')}
          onBulkStatusChange={() => console.log('Bulk status change')}
        />
      )}

      <div 
        ref={tableRef}
        className="overflow-auto max-h-[calc(100vh-300px)]"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <table className="w-full">
          <TableHeader
            columns={displayedColumns}
            sortConfig={sortConfig}
            selectedRows={selectedRows}
            totalRows={processedDeals.length}
            columnWidths={columnWidths}
            onSort={updateSort}
            onSelectAll={selectAll}
            onContextMenu={handleContextMenu}
            onResize={resizeColumn}
          />
          <tbody className="divide-y divide-gray-100">
            {processedDeals.map((deal, index) => (
              <TableRow
                key={deal.id}
                deal={deal}
                columns={displayedColumns}
                isSelected={selectedRows.includes(deal.id)}
                isExpanded={expandedRows.includes(deal.id)}
                rowIndex={index}
                focusedCell={focusedCell}
                columnWidths={columnWidths}
                onToggleSelection={() => toggleRowSelection(deal.id)}
                onToggleExpansion={() => toggleRowExpansion(deal.id)}
                onUpdateDeal={updateDeal}
                onContextMenu={handleContextMenu}
              />
            ))}
          </tbody>
        </table>
      </div>

      <TotalsBar
        deals={processedDeals}
        columns={displayedColumns}
        columnWidths={columnWidths}
      />

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          target={contextMenu.target}
          onClose={closeContextMenu}
          onAction={(action) => {
            console.log('Context menu action:', action);
            closeContextMenu();
          }}
        />
      )}

      {showColumnSettings && (
        <ColumnSettings
          columns={columns}
          visibleColumns={visibleColumns}
          columnOrder={columnOrder}
          onToggleVisibility={toggleColumnVisibility}
          onReorderColumns={reorderColumns}
          onClose={() => setShowColumnSettings(false)}
        />
      )}
    </div>
  );
}