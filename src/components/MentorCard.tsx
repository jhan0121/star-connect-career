
import React from 'react';
import { Star, MapPin, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const MentorCard = ({ mentor, onClick }) => {
  const nextAvailableSlot = mentor.availableSlots[0];
  
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {mentor.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{mentor.name}</h3>
            <p className="text-gray-600 text-sm">{mentor.title}</p>
            <p className="text-gray-500 text-xs">{mentor.experience} • {mentor.company}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{mentor.rating}</span>
            <span className="text-xs text-gray-500">({mentor.reviewCount})</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {mentor.description}
        </p>

        <div className="space-y-3 mb-4">
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-1">전문 분야</h4>
            <div className="flex flex-wrap gap-1">
              {mentor.expertise.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {mentor.expertise.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{mentor.expertise.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {nextAvailableSlot && (
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{nextAvailableSlot.date} {nextAvailableSlot.time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{nextAvailableSlot.type}</span>
              </div>
            </div>
          )}
        </div>

        <Button 
          onClick={onClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          상세보기 및 예약
        </Button>
      </CardContent>
    </Card>
  );
};
