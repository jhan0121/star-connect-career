
import React from 'react';
import { ArrowUpDown, Star, Clock, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface MentorSortFilterProps {
  currentSort: string;
  onSortChange: (sortType: string) => void;
}

export const MentorSortFilter = ({ currentSort, onSortChange }: MentorSortFilterProps) => {
  const sortOptions = [
    { key: 'latest', label: '최신순', icon: Clock },
    { key: 'rating', label: '별점순', icon: Star },
    { key: 'reviews', label: '후기 많은순', icon: Users },
    { key: 'popular', label: '인기순', icon: TrendingUp },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.key === currentSort);
    return option ? option.label : '최신순';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>{getCurrentSortLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.key}
              onClick={() => onSortChange(option.key)}
              className={`flex items-center space-x-2 ${
                currentSort === option.key ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
