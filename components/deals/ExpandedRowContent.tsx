'use client';

import React from 'react';
import { Calendar, MessageSquare, User, Clock, DollarSign } from 'lucide-react';
import type { Deal } from '@/types/deals';

interface ExpandedRowContentProps {
  deal: Deal;
}

export function ExpandedRowContent({ deal }: ExpandedRowContentProps) {
  const activities = [
    {
      id: 1,
      type: 'call',
      description: 'Call with customer about proposal',
      user: 'John Smith',
      date: new Date('2024-01-15T10:30:00'),
      icon: MessageSquare,
    },
    {
      id: 2,
      type: 'meeting',
      description: 'Demo session scheduled',
      user: 'Sarah Johnson',
      date: new Date('2024-01-14T14:00:00'),
      icon: Calendar,
    },
    {
      id: 3,
      type: 'update',
      description: 'Deal value updated to $50,000',
      user: 'Mike Wilson',
      date: new Date('2024-01-13T09:15:00'),
      icon: DollarSign,
    },
  ];

  return (
    <div className="bg-gray-50 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Recent Activity
          </h4>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <activity.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{activity.user}</span>
                    <Clock className="w-3 h-3 ml-2" />
                    <span>{activity.date.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Deal Details</h4>
          <div className="bg-white rounded-lg border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Created Date:</span>
              <span className="text-sm font-medium">
                {new Date(deal.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Modified:</span>
              <span className="text-sm font-medium">
                {new Date(deal.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Source:</span>
              <span className="text-sm font-medium">
                {deal.source || 'Website'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Priority:</span>
              <span className="text-sm font-medium">
                {deal.priority || 'Medium'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}