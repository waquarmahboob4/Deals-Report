'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Column, SortConfig, FilterConfig } from '@/types/deals';

const columns: Column[] = [
  { id: 'name', label: 'Deal Name', type: 'text', sortable: true, filterable: true, editable: true },
  { id: 'company', label: 'Company', type: 'text', sortable: true, filterable: true, editable: true },
  { id: 'owner', label: 'Owner', type: 'select', sortable: true, filterable: true, editable: true, options: ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Brown'] },
  { id: 'value', label: 'Deal Value', type: 'currency', sortable: true, filterable: false, editable: true },
  { id: 'stage', label: 'Stage', type: 'select', sortable: true, filterable: true, editable: true, options: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'] },
  { id: 'status', label: 'Status', type: 'select', sortable: true, filterable: true, editable: true, options: ['Active', 'On Hold', 'Closed'] },
  { id: 'probability', label: 'Probability', type: 'percentage', sortable: true, filterable: false, editable: true },
  { id: 'closeDate', label: 'Close Date', type: 'date', sortable: true, filterable: false, editable: true },
];

const STORAGE_KEY = 'deals-table-state';

interface TableState {
  sortConfig: SortConfig[];
  filterConfig: FilterConfig;
  selectedRows: string[];
  expandedRows: string[];
  visibleColumns: string[];
  columnOrder: string[];
  columnWidths: Record<string, number>;
}

const defaultState: TableState = {
  sortConfig: [],
  filterConfig: {},
  selectedRows: [],
  expandedRows: [],
  visibleColumns: columns.map(col => col.id),
  columnOrder: columns.map(col => col.id),
  columnWidths: {},
};

export function useTableState() {
  const [state, setState] = useState<TableState>(defaultState);

  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        setState(prevState => ({ ...prevState, ...parsedState }));
      } catch (error) {
        console.warn('Failed to parse saved table state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateSort = useCallback((columnId: string, shiftKey: boolean) => {
    setState(prev => {
      let newSortConfig = [...prev.sortConfig];
      const existingIndex = newSortConfig.findIndex(sort => sort.key === columnId);

      if (shiftKey) {
       
        if (existingIndex >= 0) {
          const existing = newSortConfig[existingIndex];
          if (existing.direction === 'asc') {
            newSortConfig[existingIndex] = { ...existing, direction: 'desc' };
          } else {
            newSortConfig.splice(existingIndex, 1);
          }
        } else {
          newSortConfig.push({ key: columnId, direction: 'asc' });
        }
      } else {
        if (existingIndex >= 0 && newSortConfig.length === 1) {
          const existing = newSortConfig[0];
          if (existing.direction === 'asc') {
            newSortConfig = [{ key: columnId, direction: 'desc' }];
          } else {
            newSortConfig = [];
          }
        } else {
          newSortConfig = [{ key: columnId, direction: 'asc' }];
        }
      }

      return { ...prev, sortConfig: newSortConfig };
    });
  }, []);

  const updateFilter = useCallback((columnId: string, value: string) => {
  setState(prev => {
    const newFilterConfig = { ...prev.filterConfig };
    if (!value || value==='all' || value.length===0) {
      delete newFilterConfig[columnId]; // Remove empty filter
    } else {
      newFilterConfig[columnId] = value;
    }

    return {
      ...prev,
      filterConfig: newFilterConfig,
    };
  });
}, []);


  const toggleRowSelection = useCallback((rowId: string) => {
    setState(prev => ({
      ...prev,
      selectedRows: prev.selectedRows.includes(rowId)
        ? prev.selectedRows.filter(id => id !== rowId)
        : [...prev.selectedRows, rowId],
    }));
  }, []);

  const toggleRowExpansion = useCallback((rowId: string) => {
    setState(prev => ({
      ...prev,
      expandedRows: prev.expandedRows.includes(rowId)
        ? prev.expandedRows.filter(id => id !== rowId)
        : [...prev.expandedRows, rowId],
    }));
  }, []);

  const selectAll = useCallback((checked: boolean) => {
    setState(prev => ({
      ...prev,
      selectedRows: checked ? [] : [],
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedRows: [] }));
  }, []);

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setState(prev => ({
      ...prev,
      visibleColumns: prev.visibleColumns.includes(columnId)
        ? prev.visibleColumns.filter(id => id !== columnId)
        : [...prev.visibleColumns, columnId],
    }));
  }, []);

  const reorderColumns = useCallback((newOrder: string[]) => {
    setState(prev => ({ ...prev, columnOrder: newOrder }));
  }, []);

  const resizeColumn = useCallback((columnId: string, width: number) => {
    setState(prev => ({
      ...prev,
      columnWidths: { ...prev.columnWidths, [columnId]: width },
    }));
  }, []);

  return {
    columns,
    sortConfig: state.sortConfig,
    filterConfig: state.filterConfig,
    selectedRows: state.selectedRows,
    expandedRows: state.expandedRows,
    visibleColumns: state.visibleColumns,
    columnOrder: state.columnOrder,
    columnWidths: state.columnWidths,
    updateSort,
    updateFilter,
    toggleRowSelection,
    toggleRowExpansion,
    selectAll,
    clearSelection,
    toggleColumnVisibility,
    reorderColumns,
    resizeColumn,
  };
}