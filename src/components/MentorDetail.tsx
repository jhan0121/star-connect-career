
import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Calendar, User, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface MentorDetailProps {
  mentor: any;
  onBack: () => void;
  onBookingComplete: () => void;
  onStartChat: (recipientName: string, recipientRole?: string) => void;
}

export const MentorDetail = ({ mentor, onBack, onBookingComplete, onStartChat }: MentorDetailProps) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [consultationMessage, setConsultationMessage] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = () => {
    if (!consultationMessage.trim()) {
      toast({
        title: "상담 내용을 입력해주세요",
        description: "어떤 내용으로 상담받고 싶으신지 알려주세요.",
        variant: "destructive",
      });
      return;
    }

    // Mock booking logic
    toast({
      title: "상담 신청이 완료되었습니다!",
      description: `${mentor.name} 멘토에게 상담 신청이 전송되었습니다. 승인 결과를 기다려주세요.`,
    });

    // Reset form
    setSelectedSlot(null);
    setConsultationMessage('');
    setShowBookingForm(false);
    onBookingComplete();
  };

  const mockReviews = [
    {
      id: 1,
      author: "김취준생",
      rating: 5,
      content: "실무에 대한 구체적인 조언을 해주셔서 정말 도움이 되었습니다. 포트폴리오 피드백도 상세하게 해주셨어요!",
      date: "2025-06-28",
      tags: ["포트폴리오", "실무조언"]
    },
    {
      id: 2,
      author: "박신입생",
      rating: 5,
      content: "면접 준비에 대한 노하우를 알려주셔서 자신감이 생겼습니다. 따뜻하고 친절하게 상담해주셨어요.",
      date: "2025-06-25",
      tags: ["면접준비", "자신감상승"]
    },
    {
      id: 3,
      author: "이직준비중",
      rating: 4,
      content: "커리어 방향성에 대해 깊이 있게 상담받을 수 있어서 좋았습니다. 시간이 조금 짧았던 것이 아쉬워요.",
      date: "2025-06-20",
      tags: ["커리어상담", "방향성"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>멘토 목록으로 돌아가기</span>
      </Button>

      {/* Mentor Profile */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start space-x-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {mentor.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{mentor.name}</h1>
              <p className="text-xl text-gray-600 mb-1">{mentor.title}</p>
              <p className="text-gray-500 mb-4">{mentor.experience} • {mentor.company}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{mentor.rating}</span>
                  <span className="text-gray-500">({mentor.reviewCount}개 후기)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <User className="h-4 w-4" />
                  <span>멘토링 {mentor.reviewCount}회 완료</span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">{mentor.description}</p>
              
              <Button
                onClick={() => onStartChat(mentor.name, 'mentor')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>메시지 보내기</span>
              </Button>
            </div>
          </div>

          {/* Expertise */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">전문 분야</h3>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Consultation Types */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">제공 상담 유형</h3>
            <div className="flex flex-wrap gap-2">
              {mentor.consultationType.map((type, index) => (
                <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>상담 가능 일정</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentor.availableSlots.map((slot, index) => (
              <Card 
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedSlot === slot ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSlotSelect(slot)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{slot.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-semibold text-blue-600">{slot.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {slot.type} {slot.location && `• ${slot.location}`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      {showBookingForm && selectedSlot && (
        <Card>
          <CardHeader>
            <CardTitle>상담 신청</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">선택한 일정</h4>
              <p className="text-blue-800">
                {selectedSlot.date} {selectedSlot.time} • {selectedSlot.type}
                {selectedSlot.location && ` • ${selectedSlot.location}`}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상담 내용 및 질문사항
              </label>
              <Textarea
                placeholder="어떤 내용으로 상담받고 싶으신지, 궁금한 점이나 준비한 자료가 있는지 자세히 적어주세요..."
                value={consultationMessage}
                onChange={(e) => setConsultationMessage(e.target.value)}
                rows={5}
                className="w-full"
              />
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={handleBookingSubmit}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                상담 신청하기
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowBookingForm(false)}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>상담 후기 ({mockReviews.length}개)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockReviews.map(review => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                    {review.author.charAt(0)}
                  </div>
                  <span className="font-medium">{review.author}</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              <p className="text-gray-700 mb-2">{review.content}</p>
              <div className="flex gap-1">
                {review.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
