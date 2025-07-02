import React from 'react';
import { ArrowLeft, Users, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConsultationSelectorProps {
  onBack: () => void;
  onSelectMentorView: () => void;
  onSelectMenteeView: () => void;
}

export const ConsultationSelector = ({ onBack, onSelectMentorView, onSelectMenteeView }: ConsultationSelectorProps) => {
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

      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">내 상담 관리</h2>
        <p className="text-gray-600">멘토 또는 멘티로서의 상담 내역을 확인해보세요</p>
      </div>

      {/* Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Mentor Consultation Management */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelectMentorView}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">멘토 상담 관리</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              멘티들로부터 받은 상담 신청을 관리하고 승인/거절할 수 있습니다.
            </p>
            <Button onClick={onSelectMentorView} className="w-full">
              멘토로서 상담 관리
            </Button>
          </CardContent>
        </Card>

        {/* Mentee Consultation Management */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelectMenteeView}>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">멘티 상담 관리</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              멘토들에게 신청한 상담의 진행 상황을 확인할 수 있습니다.
            </p>
            <Button onClick={onSelectMenteeView} variant="outline" className="w-full">
              멘티로서 상담 관리
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};