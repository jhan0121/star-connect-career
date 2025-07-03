
import React from 'react';
import { Star, Users, Shield, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PopularMentorsProps {
  onMentorClick: (mentor: any) => void;
}

export const PopularMentors = ({ onMentorClick }: PopularMentorsProps) => {
  const popularMentors = [
    {
      id: 1,
      name: '최시니어',
      age: 43,
      title: '대기업 인사팀 과장',
      experience: '15년차',
      expertise: ['인사관리', '리더십', '조직문화', '커리어 전환'],
      company: '대기업',
      description: '후배들의 성장을 도와주는 것을 즐기는 베테랑 인사 전문가입니다.',
      rating: 4.9,
      mentorRating: 4.9,
      menteeRating: 4.7,
      reviewCount: 24,
      consultationCount: 47,
      joinDate: '2024-01-15',
      availableSlots: [
        { date: '2025-07-05', time: '19:00', type: '온라인' },
        { date: '2025-07-08', time: '20:00', type: '온라인' },
        { date: '2025-07-12', time: '14:00', type: '오프라인', location: '강남역 카페' }
      ],
      consultationType: ['커리어 상담', '면접 준비', '조직 적응'],
      profileImage: '/placeholder.svg',
      trend: 'hot'
    },
    {
      id: 3,
      name: '김마케터',
      age: 35,
      title: '마케팅 팀장',
      experience: '8년차',
      expertise: ['디지털 마케팅', '브랜딩', '포트폴리오 리뷰', '실무 경험'],
      company: '중견기업',
      description: '실무 중심의 마케팅 인사이트를 전해드리는 마케팅 전문가입니다.',
      rating: 4.8,
      mentorRating: 4.8,
      menteeRating: 4.6,
      reviewCount: 32,
      consultationCount: 38,
      joinDate: '2024-03-10',
      availableSlots: [
        { date: '2025-07-07', time: '18:00', type: '온라인' },
        { date: '2025-07-10', time: '19:00', type: '오프라인', location: '홍대입구역 카페' },
        { date: '2025-07-13', time: '15:00', type: '온라인' }
      ],
      consultationType: ['포트폴리오 피드백', '실무 상담', '취업 준비'],
      profileImage: '/placeholder.svg',
      trend: 'rising'
    },
    {
      id: 2,
      name: '박주니어',
      age: 31,
      title: 'IT 스타트업 개발자',
      experience: '3년차',
      expertise: ['백엔드 개발', 'AI/ML', '기술 스택 선택', '스타트업 경험'],
      company: 'IT 스타트업',
      description: '최신 기술 트렌드와 스타트업 경험을 공유하는 개발자입니다.',
      rating: 4.7,
      mentorRating: 4.7,
      menteeRating: 4.8,
      reviewCount: 18,
      consultationCount: 25,
      joinDate: '2024-06-20',
      availableSlots: [
        { date: '2025-07-06', time: '19:30', type: '온라인' },
        { date: '2025-07-09', time: '21:00', type: '온라인' },
        { date: '2025-07-11', time: '18:00', type: '온라인' }
      ],
      consultationType: ['기술 상담', '커리어 로드맵', '이직 준비'],
      profileImage: '/placeholder.svg',
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
