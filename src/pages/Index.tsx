import React, { useState } from 'react';
import { MentorCard } from '@/components/MentorCard';
import { SearchFilters } from '@/components/SearchFilters';
import { MentorDetail } from '@/components/MentorDetail';
import { ProfileManager } from '@/components/ProfileManager';
import { ConsultationManager } from '@/components/ConsultationManager';
import { ConsultationSelector } from '@/components/ConsultationSelector';
import { ChatWindow } from '@/components/ChatWindow';
import { NotificationCenter } from '@/components/NotificationCenter';
import { PopularMentors } from '@/components/PopularMentors';
import { MentorSortFilter } from '@/components/MentorSortFilter';
import { MenteeReviewModal } from '@/components/MenteeReviewModal';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Star, Users, Calendar, MessageCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IndexContent = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenteeReview, setShowMenteeReview] = useState(false);
  const [chatRecipient, setChatRecipient] = useState<{ name: string; role: 'mentor' | 'mentee' }>({ name: '', role: 'mentor' });
  const [currentSort, setCurrentSort] = useState('latest');

  // Mock 데이터 with enhanced ratings
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

  const handleSortChange = (sortType: string) => {
    setCurrentSort(sortType);
    let sorted = [...filteredMentors];
    
    switch (sortType) {
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'reviews':
        sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'popular':
        sorted.sort((a, b) => (b.consultationCount || 0) - (a.consultationCount || 0));
        break;
      case 'latest':
      default:
        sorted.sort((a, b) => new Date(b.joinDate || '2024-01-01').getTime() - new Date(a.joinDate || '2024-01-01').getTime());
        break;
    }
    
    setFilteredMentors(sorted);
  };

  const handleStartChat = (recipientName: string, recipientRole: 'mentor' | 'mentee' = 'mentor') => {
    setChatRecipient({ name: recipientName, role: recipientRole });
    setShowChat(true);
  };

  const handleSubmitReview = (rating: number, review: string, tags: string[]) => {
    console.log('Review submitted:', { rating, review, tags });
    // Here you would typically send this to your backend
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'mentorDetail':
        return (
          <MentorDetail 
            mentor={selectedMentor} 
            onBack={() => setCurrentView('home')}
            onBookingComplete={() => setCurrentView('consultations')}
            onStartChat={handleStartChat}
          />
        );
      case 'profile':
        return <ProfileManager onBack={() => setCurrentView('home')} />;
      case 'consultations':
        return (
          <ConsultationSelector
            onBack={() => setCurrentView('home')}
            onSelectMentorView={() => setCurrentView('mentorConsultations')}
            onSelectMenteeView={() => setCurrentView('menteeConsultations')}
          />
        );
      case 'mentorConsultations':
        return (
          <ConsultationManager 
            onBack={() => setCurrentView('consultations')}
            onStartChat={handleStartChat}
            role="mentor"
          />
        );
      case 'menteeConsultations':
        return (
          <ConsultationManager 
            onBack={() => setCurrentView('consultations')}
            onStartChat={handleStartChat}
            role="mentee"
          />
        );
      default:
        return (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">멘토 찾기</h2>
                  <MentorSortFilter 
                    currentSort={currentSort}
                    onSortChange={handleSortChange}
                  />
                </div>
                <SearchFilters onFilterChange={handleFilterChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {filteredMentors.map(mentor => (
                    <MentorCard 
                      key={mentor.id} 
                      mentor={mentor} 
                      onClick={() => handleMentorClick(mentor)}
                    />
                  ))}
                </div>
              </div>
              <div className="lg:w-80">
                <PopularMentors onMentorClick={handleMentorClick} />
              </div>
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

              <Button
                variant="ghost"
                onClick={() => setShowNotifications(true)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'home' && (
          <div className="text-center mb-12">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 rounded-3xl p-12 mb-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
              <div className="relative z-10">
                <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  현직자와의 커피챗,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    당신의 커리어 성장을 연결합니다
                  </span>
                </h1>
                <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8 leading-relaxed">
                  경험 많은 현직자들과 1:1로 만나 진짜 현장의 인사이트를 얻고, 
                  당신만의 커리어 로드맵을 그려보세요.
                </p>
                
                {/* Hero Image Placeholder */}
                <div className="w-64 h-48 mx-auto bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">커피챗으로 성장하는 사람들</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center space-x-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">1,200+</div>
                    <div className="text-sm text-gray-600">등록된 멘토</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">5,000+</div>
                    <div className="text-sm text-gray-600">완료된 상담</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">4.8★</div>
                    <div className="text-sm text-gray-600">평균 만족도</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {renderCurrentView()}
      </main>

      {/* Chat Window */}
      <ChatWindow
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        recipientName={chatRecipient.name}
        recipientRole={chatRecipient.role}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Mentee Review Modal */}
      <MenteeReviewModal
        isOpen={showMenteeReview}
        onClose={() => setShowMenteeReview(false)}
        mentorName={selectedMentor?.name || ''}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
};

const Index = () => {
  return (
    <NotificationProvider>
      <IndexContent />
    </NotificationProvider>
  );
};

export default Index;
