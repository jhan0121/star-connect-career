
import React, { useState } from 'react';
import { ArrowLeft, User, Star, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AvailableSlotManager } from '@/components/AvailableSlotManager';
import { toast } from '@/hooks/use-toast';

interface Profile {
  name: string;
  title: string;
  company: string;
  experience: string;
  description: string;
  expertise: string[];
  consultationType: string[];
}

export const ProfileManager = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: '홍길동',
    title: 'UX 디자이너',
    company: '테크 스타트업',
    experience: '5년차',
    description: '사용자 중심의 디자인으로 서비스의 가치를 높이는 UX 디자이너입니다.',
    expertise: ['UX 디자인', '프로토타이핑', '사용자 리서치', '디자인 시스템'],
    consultationType: ['포트폴리오 리뷰', '디자인 피드백', '커리어 상담']
  });

  const [mentorRating] = useState(4.8); // Mock mentor rating
  const [menteeRating] = useState(4.7); // Mock mentee rating

  const handleProfileSave = () => {
    toast({
      title: "프로필이 저장되었습니다!",
      description: "멘토 목록에서 업데이트된 정보를 확인할 수 있습니다.",
    });
    setIsEditing(false);
  };

  const addExpertise = (expertise: string) => {
    if (expertise && !profile.expertise.includes(expertise)) {
      setProfile({
        ...profile,
        expertise: [...profile.expertise, expertise]
      });
    }
  };

  const removeExpertise = (expertise: string) => {
    setProfile({
      ...profile,
      expertise: profile.expertise.filter(e => e !== expertise)
    });
  };

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

      {/* Profile Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <User className="h-5 w-5" />
            <span>프로필 관리</span>
            <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
              <Shield className="h-3 w-3 text-green-600" />
              <span className="text-xs font-medium text-green-700">본인 인증 완료</span>
            </div>
            <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
              <Star className="h-3 w-3 text-blue-600 fill-current" />
              <span className="text-xs font-medium text-blue-700">멘토 평판 {mentorRating}점</span>
            </div>
            <div className="flex items-center space-x-1 bg-purple-50 px-2 py-1 rounded-full">
              <Star className="h-3 w-3 text-purple-600 fill-current" />
              <span className="text-xs font-medium text-purple-700">멘티 평판 {menteeRating}점</span>
            </div>
          </CardTitle>
          <Button
            onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
            variant={isEditing ? "default" : "outline"}
          >
            {isEditing ? '저장' : '편집'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">직책</label>
              <Input
                value={profile.title}
                onChange={(e) => setProfile({...profile, title: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">회사</label>
              <Input
                value={profile.company}
                onChange={(e) => setProfile({...profile, company: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">경력</label>
              <Input
                value={profile.experience}
                onChange={(e) => setProfile({...profile, experience: e.target.value})}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">소개</label>
            <Textarea
              value={profile.description}
              onChange={(e) => setProfile({...profile, description: e.target.value})}
              disabled={!isEditing}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">전문 분야</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profile.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{skill}</span>
                  {isEditing && (
                    <button
                      onClick={() => removeExpertise(skill)}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex space-x-2">
                <Input
                  placeholder="새 전문 분야 추가"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      addExpertise(target.value);
                      target.value = '';
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={(e) => {
                    const target = e.target as HTMLButtonElement;
                    const input = target.parentElement?.querySelector('input') as HTMLInputElement;
                    if (input) {
                      addExpertise(input.value);
                      input.value = '';
                    }
                  }}
                >
                  추가
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Slot Management */}
      <AvailableSlotManager />
    </div>
  );
};
