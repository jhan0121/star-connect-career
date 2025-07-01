import React, { useState } from 'react';
import { ArrowLeft, User, Clock, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface AvailableSlot {
  id: number;
  date: string;
  time: string;
  type: string;
  location?: string;
}

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

  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([
    { id: 1, date: '2025-07-10', time: '19:00', type: '온라인' },
    { id: 2, date: '2025-07-12', time: '14:00', type: '오프라인', location: '강남역 카페' }
  ]);

  const [newSlot, setNewSlot] = useState({
    date: '',
    time: '',
    type: '온라인',
    location: ''
  });

  const [showAddSlot, setShowAddSlot] = useState(false);

  const handleProfileSave = () => {
    toast({
      title: "프로필이 저장되었습니다!",
      description: "멘토 목록에서 업데이트된 정보를 확인할 수 있습니다.",
    });
    setIsEditing(false);
  };

  const handleAddSlot = () => {
    if (!newSlot.date || !newSlot.time) {
      toast({
        title: "필수 정보를 입력해주세요",
        description: "날짜와 시간을 모두 입력해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    const slot: AvailableSlot = {
      ...newSlot,
      id: Date.now()
    };
    
    setAvailableSlots([...availableSlots, slot]);
    setNewSlot({ date: '', time: '', type: '온라인', location: '' });
    setShowAddSlot(false);
    
    toast({
      title: "상담 가능 일정이 추가되었습니다!",
      description: "멘티들이 새로운 일정으로 상담을 예약할 수 있습니다.",
    });
  };

  const handleRemoveSlot = (slotId: number) => {
    setAvailableSlots(availableSlots.filter(slot => slot.id !== slotId));
    toast({
      title: "일정이 삭제되었습니다",
      description: "해당 시간대의 예약이 불가능해집니다.",
    });
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
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>멘토 프로필 관리</span>
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

      {/* Schedule Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>상담 가능 일정 관리</span>
          </CardTitle>
          <Button
            onClick={() => setShowAddSlot(true)}
            size="sm"
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>일정 추가</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableSlots.map(slot => (
              <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm">
                    <span className="font-medium">{slot.date}</span>
                    <span className="mx-2">•</span>
                    <span>{slot.time}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{slot.type} {slot.location && `• ${slot.location}`}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveSlot(slot.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {showAddSlot && (
            <div className="mt-4 p-4 border rounded-lg bg-white">
              <h4 className="font-medium mb-3">새 일정 추가</h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">날짜</label>
                  <Input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">시간</label>
                  <Input
                    type="time"
                    value={newSlot.time}
                    onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">상담 방식</label>
                <Select
                  value={newSlot.type}
                  onValueChange={(value) => setNewSlot({...newSlot, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="온라인">온라인</SelectItem>
                    <SelectItem value="오프라인">오프라인</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newSlot.type === '오프라인' && (
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">장소</label>
                  <Input
                    placeholder="예: 강남역 카페"
                    value={newSlot.location}
                    onChange={(e) => setNewSlot({...newSlot, location: e.target.value})}
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <Button onClick={handleAddSlot} size="sm">추가</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddSlot(false)}
                  size="sm"
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
