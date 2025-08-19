'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface EditableCellProps {
  value: any;
  type: string;
  options?: string[];
  isFocused: boolean;
  isHovered: boolean;
  onUpdate: (value: any) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function EditableCell({
  value,
  type,
  options,
  isFocused,
  isHovered,
  onUpdate,
  onMouseEnter,
  onMouseLeave,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isFocused && !isEditing) {
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          setIsEditing(true);
        }
      };
      document.addEventListener('keydown', handleEnter);
      return () => document.removeEventListener('keydown', handleEnter);
    }
  }, [isFocused, isEditing]);

  const handleSave = () => {
    onUpdate(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDisplayValue = () => {
    if (value === null || value === undefined) return '';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'date':
        return value ? format(new Date(value), 'MMM dd, yyyy') : '';
      case 'percentage':
        return `${value}%`;
      default:
        return value.toString();
    }
  };

  if (!isEditing) {
    return (
      <div
        className={cn(
          'group cursor-pointer px-2 py-1 rounded transition-colors min-h-[28px] flex items-center',
          (isHovered || isFocused) && 'bg-blue-50 border border-blue-200',
          isFocused && 'ring-2 ring-blue-500 ring-inset'
        )}
        onClick={() => setIsEditing(true)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        title="Click to edit"
      >
        <span className="truncate">{formatDisplayValue()}</span>
      </div>
    );
  }

  if (options) {
    return (
      <div className="flex items-center space-x-1" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Select value={editValue} onValueChange={setEditValue}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleSave}>
          <Check className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancel}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  if (type === 'date') {
    return (
      <div className="flex items-center space-x-1" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 text-xs justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-3 w-3" />
              {editValue ? format(new Date(editValue), 'MMM dd, yyyy') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={editValue ? new Date(editValue) : undefined}
              onSelect={(date) => {
                setEditValue(date);
                setIsDatePickerOpen(false);
                handleSave();
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancel}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(type === 'number' || type === 'currency' ? Number(e.target.value) : e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSave}
        className="h-8 text-xs"
        type={type === 'number' || type === 'currency' ? 'number' : 'text'}
      />
      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleSave}>
        <Check className="h-3 w-3" />
      </Button>
      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleCancel}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}