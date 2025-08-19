export interface Deal {
  id: string;
  name: string;
  company: string;
  owner: string;
  value: number;
  stage: string;
  status: string;
  probability: number;
  closeDate: Date;
  createdAt: Date;
  updatedAt: Date;
  source?: string;
  priority?: string;
}

export interface Column {
  id: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'select' | 'percentage';
  sortable: boolean;
  filterable: boolean;
  editable: boolean;
  options?: string[];
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  [key: string]: string;
}