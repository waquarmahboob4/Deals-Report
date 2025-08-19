'use client';

import { useState, useCallback } from 'react';
import type { Deal } from '@/types/deals';

const initialDeals: Deal[] = [
  {
    id: '1',
    name: 'Enterprise Software License',
    company: 'TechCorp Solutions',
    owner: 'John Smith',
    value: 125000,
    stage: 'Negotiation',
    status: 'Active',
    probability: 85,
    closeDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    source: 'Website',
    priority: 'High',
  },
  {
    id: '2',
    name: 'Cloud Migration Project',
    company: 'Global Industries Inc',
    owner: 'Sarah Johnson',
    value: 85000,
    stage: 'Proposal',
    status: 'Active',
    probability: 65,
    closeDate: new Date('2024-03-01'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
    source: 'Referral',
    priority: 'Medium',
  },
  {
    id: '3',
    name: 'Security Audit Services',
    company: 'SecureBank Ltd',
    owner: 'Mike Wilson',
    value: 45000,
    stage: 'Qualified',
    status: 'Active',
    probability: 40,
    closeDate: new Date('2024-02-28'),
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-15'),
    source: 'Cold Outreach',
    priority: 'Low',
  },
  {
    id: '4',
    name: 'CRM Implementation',
    company: 'StartupXYZ',
    owner: 'Lisa Brown',
    value: 32000,
    stage: 'Won',
    status: 'Closed',
    probability: 100,
    closeDate: new Date('2024-01-20'),
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-20'),
    source: 'Partnership',
    priority: 'Medium',
  },
  {
    id: '5',
    name: 'Mobile App Development',
    company: 'RetailChain Corp',
    owner: 'John Smith',
    value: 95000,
    stage: 'Lead',
    status: 'Active',
    probability: 20,
    closeDate: new Date('2024-04-15'),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16'),
    source: 'Website',
    priority: 'High',
  },
  {
    id: '6',
    name: 'Data Analytics Platform',
    company: 'FinanceFirst Bank',
    owner: 'Sarah Johnson',
    value: 150000,
    stage: 'Negotiation',
    status: 'Active',
    probability: 75,
    closeDate: new Date('2024-03-10'),
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-19'),
    source: 'Trade Show',
    priority: 'High',
  },
  {
    id: '7',
    name: 'Website Redesign',
    company: 'Creative Agency',
    owner: 'Mike Wilson',
    value: 25000,
    stage: 'Lost',
    status: 'Closed',
    probability: 0,
    closeDate: new Date('2024-01-10'),
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2024-01-10'),
    source: 'Referral',
    priority: 'Low',
  },
  {
    id: '8',
    name: 'Training Services',
    company: 'EducationCorp',
    owner: 'Lisa Brown',
    value: 18000,
    stage: 'Proposal',
    status: 'On Hold',
    probability: 30,
    closeDate: new Date('2024-03-20'),
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-17'),
    source: 'Website',
    priority: 'Medium',
  },
];

export function useDealsData() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);

  const updateDeal = useCallback((id: string, updates: Partial<Deal>) => {
    setDeals(prev => prev.map(deal => 
      deal.id === id 
        ? { ...deal, ...updates, updatedAt: new Date() }
        : deal
    ));
  }, []);

  const addDeal = useCallback((deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeal: Deal = {
      ...deal,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDeals(prev => [...prev, newDeal]);
  }, []);

  const deleteDeal = useCallback((id: string) => {
    setDeals(prev => prev.filter(deal => deal.id !== id));
  }, []);

  return {
    deals,
    updateDeal,
    addDeal,
    deleteDeal,
  };
}