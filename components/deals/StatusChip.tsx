'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusChipProps {
  status: string;
  type: 'status' | 'stage';
  onClick?: () => void;
}

const statusColors = {
  'active': 'bg-green-100 text-green-800 border-green-200',
  'on hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'closed': 'bg-gray-100 text-gray-800 border-gray-200',
  
  'lead': 'bg-blue-100 text-blue-800 border-blue-200',
  'qualified': 'bg-purple-100 text-purple-800 border-purple-200',
  'proposal': 'bg-orange-100 text-orange-800 border-orange-200',
  'negotiation': 'bg-red-100 text-red-800 border-red-200',
  'won': 'bg-green-100 text-green-800 border-green-200',
  'lost': 'bg-gray-100 text-gray-800 border-gray-200',
};

export function StatusChip({ status, type, onClick }: StatusChipProps) {
  const normalizedStatus = status.toLowerCase();
  const colorClass = statusColors[normalizedStatus as keyof typeof statusColors] || 
    'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer',
        'hover:shadow-sm transition-shadow',
        colorClass
      )}
      onClick={onClick}
      title={`${type}: ${status}`}
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        normalizedStatus === 'won' || normalizedStatus === 'active' ? 'bg-green-500' :
        normalizedStatus === 'lost' || normalizedStatus === 'closed' ? 'bg-gray-500' :
        normalizedStatus === 'on hold' ? 'bg-yellow-500' :
        'bg-blue-500'
      )} />
      {status}
    </span>
  );
}