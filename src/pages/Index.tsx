
import React, { useState } from 'react';
import { MentorCard } from '@/components/MentorCard';
import { SearchFilters } from '@/components/SearchFilters';
import { MentorDetail } from '@/components/MentorDetail';
import { ProfileManager } from '@/components/ProfileManager';
import { ConsultationManager } from '@/components/ConsultationManager';
import { Star, Users, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [filteredMentors, setFilteredMentors] = useState([]);

  // Mock 데이터
  const mockMentors = [
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
      reviewCount: 24,
      availableSlots: [
        { date: '2025-07-05', time: '19:00', type: '온라인' },
        { date: '2025-07-08', time: '20:00', type: '온라인' },
        { date: '2025-07-12', time: '14:00', type: '오프라인', location: '강남역 카페' }
      ],
      consultationType: ['커리어 상담', '면접 준비', '조직 적응'],
      profileImage: '/placeholder.svg'
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
      reviewCount: 18,
      availableSlots: [
        { date: '2025-07-06', time: '19:30', type: '온라인' },
        { date: '2025-07-09', time: '21:00', type: '온라인' },
        { date: '2025-07-11', time: '18:00', type: '온라인' }
      ],
      consultationType: ['기술 상담', '커리어 로드맵', '이직 준비'],
      profileImage: '/placeholder.svg'
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
      reviewCount: 32,
      availableSlots: [
        { date: '2025-07-07', time: '18:00', type: '온라인' },
        { date: '2025-07-10', time: '19:00', type: '오프라인', location: '홍대입구역 카페' },
        { date: '2025-07-13', time: '15:00', type: '온라인' }
      ],
      consultationType: ['포트폴리오 피드백', '실무 상담', '취업 준비'],
      profileImage: '/placeholder.svg'
    }
  ];

  React.useEffect(() => {
    setFilteredMentors(mockMentors);
  }, []);

  const handleMentorClick = (mentor) => {
    setSelectedMentor(mentor);
    setCurrentView('mentorDetail');
  };

  const handleFilterChange = (filters) => {
    let filtered = mockMentors;
    
    if (filters.expertise && filters.expertise.length > 0) {
      filtered = filtered.filter(mentor => 
        filters.expertise.some(exp => mentor.expertise.includes(exp))
      );
    }
    
    if (filters.consultationType && filters.consultationType.length > 0) {
      filtered = filtered.filter(mentor => 
        filters.consultationType.some(type => mentor.consultationType.includes(type))
      );
    }
    
    if (filters.availability === 'online') {
      filtered = filtered.filter(mentor => 
        mentor.availableSlots.some(slot => slot.type === '온라인')
      );
    } else if (filters.availability === 'offline') {
      filtered = filtered.filter(mentor => 
        mentor.availableSlots.some(slot => slot.type === '오프라인')
      );
    }
    
    setFilteredMentors(filtered);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'mentorDetail':
        return (
          <MentorDetail 
            mentor={selectedMentor} 
            onBack={() => setCurrentView('home')}
            onBookingComplete={() => setCurrentView('consultations')}
          />
        );
      case 'profile':
        return <ProfileManager onBack={() => setCurrentView('home')} />;
      case 'consultations':
        return <ConsultationManager onBack={() => setCurrentView('home')} />;
      default:
        return (
          <div className="space-y-8">
            <SearchFilters onFilterChange={handleFilterChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentors.map(mentor => (
                <MentorCard 
                  key={mentor.id} 
                  mentor={mentor} 
                  onClick={() => handleMentorClick(mentor)}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setCurrentView('home')}
            >
              <Star className="h-8 w-8 text-blue-600 fill-current" />
              <h1 className="text-2xl font-bold text-gray-900">Connecting Star</h1>
            </div>
            
            <nav className="flex items-center space-x-4">
              <Button 
                variant={currentView === 'home' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('home')}
                className="flex items-center space-x-1"
              >
                <Users className="h-4 w-4" />
                <span>멘토 찾기</span>
              </Button>
              
              <Button 
                variant={currentView === 'consultations' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('consultations')}
                className="flex items-center space-x-1"
              >
                <Calendar className="h-4 w-4" />
                <span>내 상담</span>
              </Button>
              
              <Button 
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('profile')}
                className="flex items-center space-x-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span>프로필 관리</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              커리어의 별을 찾아보세요
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              경험 많은 현직자들과 연결되어 진짜 현장의 인사이트를 얻고, 
              당신만의 커리어 로드맵을 그려보세요.
            </p>
          </div>
        )}
        
        {renderCurrentView()}
      </main>
    </div>
  );
};

export default Index;
