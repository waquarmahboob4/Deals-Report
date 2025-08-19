'use client';

import React from 'react';
import { X, Trash2, Download, Edit3, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkExport: () => void;
  onBulkStatusChange: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onBulkDelete,
  onBulkExport,
  onBulkStatusChange,
}: BulkActionsToolbarProps) {
  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-900">
              {selectedCount} {selectedCount === 1 ? 'deal' : 'deals'} selected
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearSelection}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBulkStatusChange}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <Tag className="w-4 h-4 mr-2" />
              Change Status
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBulkExport}
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBulkDelete}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}