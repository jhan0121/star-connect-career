import React, { useState } from 'react';
import { ArrowLeft, Calendar, Check, X, Clock, MapPin, User, MessageSquare, Star, MessageCircle } from 'lucide-react';
import { MenteeRatingModal } from './MenteeRatingModal';
import { CalendarScheduleView } from './CalendarScheduleView';
import { AvailableSlotManager } from './AvailableSlotManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useNotifications } from '@/contexts/NotificationContext';
import { toast } from '@/hooks/use-toast';

interface Consultation {
  id: number;
  mentorName: string;
  menteeName: string;
  date: string;
  time: string;
  type: string;
  location?: string; // Make location optional
  message: string;
  status: string;
  role: string;
  reviewed?: boolean;
  mentorRating?: number;
  menteeRating?: number;
  mentorReview?: string;
  menteeReview?: string;
}

interface ConsultationManagerProps {
  onBack: () => void;
  onStartChat: (recipientName: string, recipientRole: 'mentor' | 'mentee') => void;
  role: 'mentor' | 'mentee';
}

export const ConsultationManager = ({ onBack, onStartChat, role }: ConsultationManagerProps) => {
  const { addNotification } = useNotifications();
  
  // Mock data - filter by role
  const allConsultations = {
    pending: [
      // As mentor - receiving requests
      {
        id: 1,
        mentorName: '나',
        menteeName: '김취준생',
        date: '2025-07-10',
        time: '19:00',
        type: '온라인',
        message: '마케팅 직무로 취업을 준비하고 있는데, 포트폴리오 리뷰와 실무에 대한 조언을 받고 싶습니다.',
        status: 'pending',
        role: 'mentor'
      },
      // As mentee - making requests
      {
        id: 2,
        mentorName: '박주니어',
        menteeName: '나',
        date: '2025-07-12',
        time: '20:00',
        type: '온라인',
        message: 'AI 분야로 커리어 전환을 고려하고 있습니다. 어떤 기술 스택을 공부해야 할지 조언 부탁드립니다.',
        status: 'pending',
        role: 'mentee'
      }
    ],
    approved: [
      // As mentee
      {
        id: 3,
        mentorName: '김마케터',
        menteeName: '나',
        date: '2025-07-15',
        time: '18:00',
        type: '오프라인',
        location: '홍대입구역 카페',
        message: '디지털 마케팅 전략에 대해 상담받고 싶습니다.',
        status: 'approved',
        role: 'mentee'
      },
      // As mentor
      {
        id: 6,
        mentorName: '나',
        menteeName: '이신입생',
        date: '2025-07-16',
        time: '19:00',
        type: '온라인',
        message: '커리어 전환에 대한 조언을 구하고 싶습니다.',
        status: 'approved',
        role: 'mentor'
      }
    ],
    completed: [
      // As mentee
      {
        id: 4,
        mentorName: '최시니어',
        menteeName: '나',
        date: '2025-06-28',
        time: '19:00',
        type: '온라인',
        message: '인사 직무 커리어 패스에 대해 상담받았습니다.',
        status: 'completed',
        role: 'mentee',
        reviewed: false
      },
      // As mentor
      {
        id: 5,
        mentorName: '나',
        menteeName: '박신입생',
        date: '2025-06-25',
        time: '20:00',
        type: '온라인',
        message: 'UX 디자인 포트폴리오 피드백을 받고 싶어합니다.',
        status: 'completed',
        role: 'mentor',
        reviewed: false
      }
    ]
  };

  // Filter consultations by current role
  const [consultations, setConsultations] = useState<{
    pending: Consultation[];
    approved: Consultation[];
    completed: Consultation[];
  }>({
    pending: allConsultations.pending.filter(c => c.role === role),
    approved: allConsultations.approved.filter(c => c.role === role),
    completed: allConsultations.completed.filter(c => c.role === role)
  });

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showMenteeRating, setShowMenteeRating] = useState(false);

  const allConsultationsForCalendar = [...consultations.approved, ...consultations.completed];

  const handleApprove = (consultationId: number) => {
    const consultation = consultations.pending.find(c => c.id === consultationId);
    if (consultation) {
      setConsultations({
        ...consultations,
        pending: consultations.pending.filter(c => c.id !== consultationId),
        approved: [...consultations.approved, { ...consultation, status: 'approved' }]
      });
      
      // Send notification to mentee
      addNotification({
        type: 'consultation_accepted',
        title: '상담이 승인되었습니다!',
        message: `${consultation.role === 'mentor' ? consultation.menteeName : consultation.mentorName}님과의 상담이 승인되었습니다.`,
      });
      
      toast({
        title: "상담이 승인되었습니다!",
        description: `${consultation.menteeName}님에게 승인 알림이 전송됩니다.`,
      });
    }
  };

  const handleRejectWithReason = () => {
    if (!selectedConsultation || !rejectReason.trim()) {
      toast({
        title: "거절 사유를 입력해주세요",
        description: "명확한 거절 사유를 작성해주세요.",
        variant: "destructive",
      });
      return;
    }

    setConsultations({
      ...consultations,
      pending: consultations.pending.filter(c => c.id !== selectedConsultation.id)
    });
    
    // Send notification with rejection reason
    addNotification({
      type: 'consultation_rejected',
      title: '상담이 거절되었습니다',
      message: `거절 사유: ${rejectReason}`,
    });
    
    toast({
      title: "상담이 거절되었습니다",
      description: `${selectedConsultation.menteeName}님에게 거절 사유와 함께 알림이 전송됩니다.`,
    });

    setShowRejectDialog(false);
    setSelectedConsultation(null);
    setRejectReason('');
  };

  const handleStartReview = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowReviewDialog(true);
  };

  const handleSubmitReview = () => {
    if (!selectedConsultation || reviewRating === 0) {
      toast({
        title: "평가를 완료해주세요",
        description: "별점과 후기를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const updatedConsultations = consultations.completed.map(c => 
      c.id === selectedConsultation.id 
        ? { 
            ...c, 
            reviewed: true,
            [selectedConsultation.role === 'mentor' ? 'mentorRating' : 'menteeRating']: reviewRating,
            [selectedConsultation.role === 'mentor' ? 'mentorReview' : 'menteeReview']: reviewContent
          }
        : c
    );

    setConsultations({
      ...consultations,
      completed: updatedConsultations
    });

    toast({
      title: "후기가 등록되었습니다!",
      description: "소중한 피드백 감사합니다.",
    });

    setShowReviewDialog(false);
    setSelectedConsultation(null);
    setReviewRating(0);
    setReviewContent('');
  };

  const ConsultationCard = ({ consultation, showActions = false }: { consultation: Consultation; showActions?: boolean }) => (
    <Card key={consultation.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold text-lg">
              {consultation.role === 'mentor' 
                ? `${consultation.menteeName}님과의 상담`
                : `${consultation.mentorName} 멘토와의 상담`
              }
            </h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{consultation.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{consultation.time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{consultation.type} {consultation.location && `• ${consultation.location}`}</span>
              </div>
            </div>
          </div>
          <Badge variant={
            consultation.status === 'pending' ? 'default' :
            consultation.status === 'approved' ? 'secondary' : 'outline'
          }>
            {consultation.status === 'pending' ? '대기중' :
             consultation.status === 'approved' ? '승인됨' : '완료'}
          </Badge>
        </div>

        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 mb-1">상담 내용</h5>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{consultation.message}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {showActions && role === 'mentor' && consultation.status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => handleApprove(consultation.id)}
                className="flex items-center space-x-1"
              >
                <Check className="h-4 w-4" />
                <span>승인</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedConsultation(consultation);
                  setShowRejectDialog(true);
                }}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                <span>거절</span>
              </Button>
            </>
          )}

          {(consultation.status === 'approved' || consultation.status === 'completed') && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartChat(
                consultation.role === 'mentor' ? consultation.menteeName : consultation.mentorName,
                consultation.role === 'mentor' ? 'mentee' : 'mentor'
              )}
              className="flex items-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>채팅</span>
            </Button>
          )}

          {consultation.status === 'completed' && !consultation.reviewed && (
            <>
              {role === 'mentee' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStartReview(consultation)}
                  className="flex items-center space-x-1"
                >
                  <Star className="h-4 w-4" />
                  <span>후기 작성</span>
                </Button>
              )}
              {role === 'mentor' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedConsultation(consultation);
                    setShowMenteeRating(true);
                  }}
                  className="flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span>멘티 평가</span>
                </Button>
              )}
            </>
          )}
        </div>

        {consultation.status === 'completed' && consultation.reviewed && (
          <div className="mt-3 p-3 bg-green-50 rounded">
            <div className="flex items-center space-x-1 text-green-700">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">
                {role === 'mentee' ? '후기 작성 완료' : '멘티 평가 완료'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>메인으로 돌아가기</span>
      </Button>

      {/* Consultation Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>{role === 'mentor' ? '멘토 상담 관리' : '멘티 상담 관리'}</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                목록
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                캘린더
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'calendar' ? (
            <CalendarScheduleView 
              consultations={allConsultationsForCalendar}
              role={role}
            />
          ) : (
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending" className="flex items-center space-x-1">
                  <span>신청 대기</span>
                  {consultations.pending.length > 0 && (
                    <Badge variant="destructive" className="ml-1 text-xs px-1.5 py-0.5">
                      {consultations.pending.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center space-x-1">
                  <span>승인된 상담</span>
                  {consultations.approved.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5">
                      {consultations.approved.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed">완료된 상담</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6">
                {consultations.pending.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>대기 중인 상담 신청이 없습니다.</p>
                  </div>
                ) : (
                  <div>
                    {consultations.pending.map(consultation => (
                      <ConsultationCard 
                        key={consultation.id}
                        consultation={consultation} 
                        showActions={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="mt-6">
                {consultations.approved.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Check className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>승인된 상담이 없습니다.</p>
                  </div>
                ) : (
                  <div>
                    {consultations.approved.map(consultation => (
                      <ConsultationCard 
                        key={consultation.id}
                        consultation={consultation}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                {consultations.completed.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>완료된 상담이 없습니다.</p>
                  </div>
                ) : (
                  <div>
                    {consultations.completed.map(consultation => (
                      <ConsultationCard 
                        key={consultation.id}
                        consultation={consultation}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Available Slot Manager for Mentors */}
      {role === 'mentor' && (
        <AvailableSlotManager />
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>상담 거절 사유</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              멘티에게 전달할 거절 사유를 작성해주세요. 명확한 사유는 멘티의 성장에 도움이 됩니다.
            </p>
            <Textarea
              placeholder="예: 현재 전문 분야와 거리가 있어 다른 멘토님께 더 좋은 도움을 받으실 수 있을 것 같습니다."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              취소
            </Button>
            <Button onClick={handleRejectWithReason}>
              거절 사유 전송
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>멘토 후기 작성</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">별점 평가</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl ${
                      star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">후기 내용</label>
              <Textarea
                placeholder="상담 경험을 자세히 공유해주세요..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              취소
            </Button>
            <Button onClick={handleSubmitReview}>
              후기 등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mentee Rating Modal */}
      <MenteeRatingModal
        isOpen={showMenteeRating}
        onClose={() => setShowMenteeRating(false)}
        menteeName={selectedConsultation?.menteeName || ''}
        onSubmitRating={(rating, comment) => {
          // Handle mentee rating submission
          console.log('Mentee rating:', rating, comment);
          
          // Update consultation as reviewed
          const updatedConsultations = consultations.completed.map(c => 
            c.id === selectedConsultation?.id 
              ? { ...c, reviewed: true }
              : c
          );

          setConsultations({
            ...consultations,
            completed: updatedConsultations
          });

          setShowMenteeRating(false);
        }}
      />
    </div>
  );
};
