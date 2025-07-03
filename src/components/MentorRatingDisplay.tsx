
import React from 'react';
import { Star, Award, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MentorRatingDisplayProps {
  mentorRating?: number;
  menteeRating?: number;
  reviewCount: number;
  role?: 'mentor' | 'mentee' | 'both';
  size?: 'sm' | 'md' | 'lg';
}

export const MentorRatingDisplay = ({ 
  mentorRating, 
  menteeRating, 
  reviewCount, 
  role = 'both', 
  size = 'md' 
}: MentorRatingDisplayProps) => {
  const getStarSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-6 w-6';
      default: return 'h-4 w-4';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-lg';
      default: return 'text-sm';
    }
  };

  const renderRating = (rating: number, type: 'mentor' | 'mentee') => (
    <div className={`flex items-center space-x-1 ${getTextSize()}`}>
      {type === 'mentor' ? (
        <Award className={`${getStarSize()} text-blue-500`} />
      ) : (
        <Users className={`${getStarSize()} text-green-500`} />
      )}
      <div className="flex items-center space-x-1">
        <Star className={`${getStarSize()} text-yellow-400 fill-current`} />
        <span className="font-medium">{rating}</span>
      </div>
      <Badge variant="outline" className="text-xs">
        {type === 'mentor' ? '멘토 평가' : '멘티 평가'}
      </Badge>
    </div>
  );

  if (role === 'mentor' && mentorRating) {
    return renderRating(mentorRating, 'mentor');
  }

  if (role === 'mentee' && menteeRating) {
    return renderRating(menteeRating, 'mentee');
  }

  if (role === 'both') {
    return (
      <div className="space-y-2">
        {mentorRating && renderRating(mentorRating, 'mentor')}
        {menteeRating && renderRating(menteeRating, 'mentee')}
        {!mentorRating && !menteeRating && (
          <div className={`flex items-center space-x-1 ${getTextSize()} text-gray-500`}>
            <Star className={`${getStarSize()} text-gray-400`} />
            <span>평가 없음 ({reviewCount}개 후기)</span>
          </div>
        )}
      </div>
    );
  }

  return null;
};
