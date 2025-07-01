import React, { useState } from 'react';
import { ArrowLeft, Calendar, Check, X, Clock, MapPin, User, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
}

export const ConsultationManager = ({ onBack }) => {
  const [consultations, setConsultations] = useState<{
    pending: Consultation[];
    approved: Consultation[];
    completed: Consultation[];
  }>({
    pending: [
      {
        id: 1,
        mentorName: '최시니어',
        menteeName: '김취준생',
        date: '2025-07-10',
        time: '19:00',
        type: '온라인',
        message: '마케팅 직무로 취업을 준비하고 있는데, 포트폴리오 리뷰와 실무에 대한 조언을 받고 싶습니다.',
        status: 'pending',
        role: 'mentor'
      },
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
      }
    ],
    completed: [
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
        reviewed: true
      },
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
  });

  const handleApprove = (consultationId: number) => {
    const consultation = consultations.pending.find(c => c.id === consultationId);
    if (consultation) {
      setConsultations({
        ...consultations,
        pending: consultations.pending.filter(c => c.id !== consultationId),
        approved: [...consultations.approved, { ...consultation, status: 'approved' }]
      });
      
      toast({
        title: "상담이 승인되었습니다!",
        description: `${consultation.menteeName}님에게 승인 알림이 전송됩니다.`,
      });
    }
  };

  const handleReject = (consultationId: number) => {
    const consultation = consultations.pending.find(c => c.id === consultationId);
    if (consultation) {
      setConsultations({
        ...consultations,
        pending: consultations.pending.filter(c => c.id !== consultationId)
      });
      
      toast({
        title: "상담이 거절되었습니다",
        description: `${consultation.menteeName}님에게 거절 알림이 전송됩니다.`,
      });
    }
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

        {showActions && consultation.role === 'mentor' && consultation.status === 'pending' && (
          <div className="flex space-x-2">
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
              onClick={() => handleReject(consultation.id)}
              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              <span>거절</span>
            </Button>
          </div>
        )}

        {consultation.status === 'completed' && consultation.role === 'mentee' && !consultation.reviewed && (
          <Button
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
            onClick={() => {
              toast({
                title: "후기 작성 페이지로 이동합니다",
                description: "멘토에게 도움이 되는 솔직한 후기를 남겨주세요!",
              });
            }}
          >
            <MessageSquare className="h-4 w-4" />
            <span>후기 작성</span>
          </Button>
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
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>내 상담 관리</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};
