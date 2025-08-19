'use client';

import React from 'react';
import { Search, Filter, Settings, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Column, FilterConfig } from '@/types/deals';

interface FilterBarProps {
  columns: Column[];
  filterConfig: FilterConfig;
  onUpdateFilter: (columnId: string, value: string) => void;
  onShowColumnSettings: () => void;
}

export function FilterBar({
  columns,
  filterConfig,
  onUpdateFilter,
  onShowColumnSettings,
}: FilterBarProps) {
  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search deals..."
              value={filterConfig.name || ''}
              onChange={(e) => onUpdateFilter('name', e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterConfig.stage || ''} onValueChange={(value:string) => onUpdateFilter('stage', value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Qualified">Qualified</SelectItem>
              <SelectItem value="Proposal">Proposal</SelectItem>
              <SelectItem value="Negotiation">Negotiation</SelectItem>
              <SelectItem value="Won">Won</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterConfig.status || 'all'} onValueChange={(value:string) => onUpdateFilter('status', value === 'all' ? '' : value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterConfig.owner || 'all'} onValueChange={(value:string) => onUpdateFilter('owner', value === 'all' ? '' : value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Owners" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              <SelectItem value="John Smith">John Smith</SelectItem>
              <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
              <SelectItem value="Mike Wilson">Mike Wilson</SelectItem>
              <SelectItem value="Lisa Brown">Lisa Brown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
          
          <Button variant="outline" size="sm" onClick={onShowColumnSettings}>
            <Settings className="w-4 h-4 mr-2" />
            Columns
          </Button>
          
          <Button variant="outline" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}