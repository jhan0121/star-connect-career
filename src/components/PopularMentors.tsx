
import React from 'react';
import { Star, Users, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PopularMentorsProps {
  onMentorClick: (mentor: any) => void;
}

export const PopularMentors = ({ onMentorClick }: PopularMentorsProps) => {
  const popularMentors = [
    {
      id: 1,
      name: '최시니어',
      title: '대기업 인사팀 과장',
      rating: 4.9,
      reviewCount: 24,
      consultationCount: 47,
      expertise: ['인사관리', '리더십'],
      trend: 'hot'
    },
    {
      id: 3,
      name: '김마케터',
      title: '마케팅 팀장',
      rating: 4.8,
      reviewCount: 32,
      consultationCount: 38,
      expertise: ['디지털 마케팅', '브랜딩'],
      trend: 'rising'
    },
    {
      id: 2,
      name: '박주니어',
      title: 'IT 스타트업 개발자',
      rating: 4.7,
      reviewCount: 18,
      consultationCount: 25,
      expertise: ['백엔드 개발', 'AI/ML'],
      trend: 'new'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'hot':
        return <div className="text-red-500 text-xs">🔥 인기</div>;
      case 'rising':
        return <div className="text-orange-500 text-xs flex items-center"><TrendingUp className="h-3 w-3 mr-1" />급상승</div>;
      case 'new':
        return <div className="text-green-500 text-xs">✨ 신규</div>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <span>인기 멘토</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularMentors.map((mentor, index) => (
            <div key={mentor.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => onMentorClick(mentor)}>
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold">
                {index + 1}
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {mentor.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">{mentor.name}</h4>
                  <Shield className="h-3 w-3 text-green-600" />
                  {getTrendIcon(mentor.trend)}
                </div>
                <p className="text-sm text-gray-600 mb-1">{mentor.title}</p>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span>{mentor.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{mentor.consultationCount}회</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
