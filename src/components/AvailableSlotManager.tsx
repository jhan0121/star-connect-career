
import React, { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  type: 'online' | 'offline' | 'both';
  location?: string;
  isAvailable: boolean;
}

interface AvailableSlotManagerProps {
  onSlotChange?: (slots: TimeSlot[]) => void;
}

export const AvailableSlotManager = ({ onSlotChange }: AvailableSlotManagerProps) => {
  const [slots, setSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      date: '2025-07-05',
      time: '19:00',
      type: 'online',
      isAvailable: true
    },
    {
      id: '2',
      date: '2025-07-08',
      time: '20:00',
      type: 'both',
      location: '강남역 카페',
      isAvailable: true
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: '',
    time: '',
    type: 'online' as 'online' | 'offline' | 'both',
    location: ''
  });

  const handleAddSlot = () => {
    if (!newSlot.date || !newSlot.time) {
      toast({
        title: "필수 정보를 입력해주세요",
        description: "날짜와 시간을 모두 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (newSlot.type === 'offline' && !newSlot.location) {
      toast({
        title: "오프라인 상담 장소를 입력해주세요",
        description: "오프라인 상담을 위한 장소 정보가 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    const slot: TimeSlot = {
      id: Date.now().toString(),
      date: newSlot.date,
      time: newSlot.time,
      type: newSlot.type,
      location: newSlot.location || undefined,
      isAvailable: true
    };

    const updatedSlots = [...slots, slot];
    setSlots(updatedSlots);
    onSlotChange?.(updatedSlots);

    toast({
      title: "상담 가능 시간이 추가되었습니다!",
      description: "멘티들이 새로운 시간대에 상담을 신청할 수 있습니다.",
    });

    setNewSlot({ date: '', time: '', type: 'online', location: '' });
    setShowAddDialog(false);
  };

  const handleDeleteSlot = (id: string) => {
    const updatedSlots = slots.filter(slot => slot.id !== id);
    setSlots(updatedSlots);
    onSlotChange?.(updatedSlots);

    toast({
      title: "상담 시간이 삭제되었습니다",
      description: "해당 시간대는 더 이상 예약할 수 없습니다.",
    });
  };

  const handleToggleAvailability = (id: string) => {
    const updatedSlots = slots.map(slot =>
      slot.id === id ? { ...slot, isAvailable: !slot.isAvailable } : slot
    );
    setSlots(updatedSlots);
    onSlotChange?.(updatedSlots);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'online': return '온라인';
      case 'offline': return '오프라인';
      case 'both': return '온/오프라인';
      default: return type;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'online': return 'default';
      case 'offline': return 'secondary';
      case 'both': return 'outline';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>상담 가능 일정 관리</span>
          </CardTitle>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>일정 추가</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {slots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>등록된 상담 가능 시간이 없습니다.</p>
            <p className="text-sm">상담 시간을 추가해보세요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {slots.map(slot => (
              <div key={slot.id} className={`p-4 border rounded-lg ${!slot.isAvailable ? 'bg-gray-50 opacity-60' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{slot.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{slot.time}</span>
                      </div>
                      <Badge variant={getTypeBadgeVariant(slot.type)}>
                        {getTypeLabel(slot.type)}
                      </Badge>
                    </div>
                    {slot.location && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{slot.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={slot.isAvailable}
                        onCheckedChange={() => handleToggleAvailability(slot.id)}
                      />
                      <span className="text-xs text-gray-500">예약 가능</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Add Slot Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 상담 시간 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
              <Input
                type="date"
                value={newSlot.date}
                onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">시간</label>
              <Input
                type="time"
                value={newSlot.time}
                onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">상담 방식</label>
              <Select value={newSlot.type} onValueChange={(value: 'online' | 'offline' | 'both') => setNewSlot({ ...newSlot, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">온라인</SelectItem>
                  <SelectItem value="offline">오프라인</SelectItem>
                  <SelectItem value="both">온라인/오프라인 모두 가능</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(newSlot.type === 'offline' || newSlot.type === 'both') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  오프라인 상담 장소 {newSlot.type === 'offline' && <span className="text-red-500">*</span>}
                </label>
                <Input
                  placeholder="예: 강남역 2번출구 스타벅스"
                  value={newSlot.location}
                  onChange={(e) => setNewSlot({ ...newSlot, location: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              취소
            </Button>
            <Button onClick={handleAddSlot}>
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
