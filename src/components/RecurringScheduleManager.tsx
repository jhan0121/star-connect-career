
import React, { useState } from 'react';
import { Calendar, Clock, Plus, Copy, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';

interface TimeSlot {
  startTime: string;
  endTime: string;
  type: 'online' | 'offline' | 'both';
  location?: string;
}

interface DaySchedule {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dayName: string;
  isActive: boolean;
  timeSlots: TimeSlot[];
}

interface RecurringScheduleManagerProps {
  onScheduleChange?: (schedules: DaySchedule[]) => void;
}

export const RecurringScheduleManager = ({ onScheduleChange }: RecurringScheduleManagerProps) => {
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { id: '1', dayOfWeek: 1, dayName: '월요일', isActive: true, timeSlots: [{ startTime: '19:00', endTime: '20:00', type: 'online' }] },
    { id: '2', dayOfWeek: 3, dayName: '수요일', isActive: true, timeSlots: [{ startTime: '20:00', endTime: '21:00', type: 'both', location: '강남역 카페' }] }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [newTimeSlots, setNewTimeSlots] = useState<TimeSlot[]>([{ startTime: '', endTime: '', type: 'online' }]);
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);

  const daysOfWeek = [
    { value: 0, label: '일요일' },
    { value: 1, label: '월요일' },
    { value: 2, label: '화요일' },
    { value: 3, label: '수요일' },
    { value: 4, label: '목요일' },
    { value: 5, label: '금요일' },
    { value: 6, label: '토요일' }
  ];

  const handleAddSchedule = () => {
    if (selectedDays.length === 0) {
      toast({
        title: "요일을 선택해주세요",
        description: "최소 하나의 요일을 선택해야 합니다.",
        variant: "destructive",
      });
      return;
    }

    if (newTimeSlots.some(slot => !slot.startTime || !slot.endTime)) {
      toast({
        title: "시간을 입력해주세요",
        description: "모든 시간대의 시작 시간과 종료 시간을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const newSchedules = selectedDays.map(dayOfWeek => {
      const dayName = daysOfWeek.find(d => d.value === dayOfWeek)?.label || '';
      return {
        id: `${Date.now()}-${dayOfWeek}`,
        dayOfWeek,
        dayName,
        isActive: true,
        timeSlots: [...newTimeSlots]
      };
    });

    const updatedSchedules = [...schedules, ...newSchedules];
    setSchedules(updatedSchedules);
    onScheduleChange?.(updatedSchedules);

    toast({
      title: "주기적 상담 시간이 추가되었습니다!",
      description: `${selectedDays.length}개 요일에 상담 가능 시간이 설정되었습니다.`,
    });

    setSelectedDays([]);
    setNewTimeSlots([{ startTime: '', endTime: '', type: 'online' }]);
    setShowAddDialog(false);
  };

  const handleDeleteSchedule = (id: string) => {
    const updatedSchedules = schedules.filter(schedule => schedule.id !== id);
    setSchedules(updatedSchedules);
    onScheduleChange?.(updatedSchedules);

    toast({
      title: "상담 시간이 삭제되었습니다",
      description: "해당 요일의 상담 시간이 제거되었습니다.",
    });
  };

  const handleToggleSchedule = (id: string) => {
    const updatedSchedules = schedules.map(schedule =>
      schedule.id === id ? { ...schedule, isActive: !schedule.isActive } : schedule
    );
    setSchedules(updatedSchedules);
    onScheduleChange?.(updatedSchedules);
  };

  const handleCopySchedule = (schedule: DaySchedule) => {
    setNewTimeSlots([...schedule.timeSlots]);
    setShowAddDialog(true);
    toast({
      title: "일정이 복사되었습니다",
      description: "시간대 설정이 복사되었습니다. 원하는 요일을 선택해주세요.",
    });
  };

  const addTimeSlot = () => {
    setNewTimeSlots([...newTimeSlots, { startTime: '', endTime: '', type: 'online' }]);
  };

  const removeTimeSlot = (index: number) => {
    setNewTimeSlots(newTimeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const updated = newTimeSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    setNewTimeSlots(updated);
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
            <span>주기적 상담 시간 관리</span>
          </CardTitle>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>주기 일정 추가</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>등록된 주기적 상담 시간이 없습니다.</p>
            <p className="text-sm">주기적 상담 시간을 추가해보세요.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules
              .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
              .map(schedule => (
                <Collapsible key={schedule.id}>
                  <div className={`border rounded-lg ${!schedule.isActive ? 'bg-gray-50 opacity-60' : ''}`}>
                    <CollapsibleTrigger
                      className="w-full"
                      onClick={() => setExpandedSchedule(expandedSchedule === schedule.id ? null : schedule.id)}
                    >
                      <div className="p-4 flex justify-between items-center hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-lg">{schedule.dayName}</span>
                          </div>
                          <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
                            {schedule.isActive ? '활성' : '비활성'}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {schedule.timeSlots.length}개 시간대
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {expandedSchedule === schedule.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-4 pb-4 border-t bg-gray-50">
                        <div className="space-y-2 mt-3">
                          {schedule.timeSlots.map((slot, index) => (
                            <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                              <div className="flex items-center space-x-3">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                <Badge variant={getTypeBadgeVariant(slot.type)}>
                                  {getTypeLabel(slot.type)}
                                </Badge>
                                {slot.location && (
                                  <span className="text-sm text-gray-600">@ {slot.location}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-3 border-t">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={schedule.isActive}
                              onCheckedChange={() => handleToggleSchedule(schedule.id)}
                            />
                            <span className="text-sm text-gray-600">활성화</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopySchedule(schedule)}
                              className="flex items-center space-x-1"
                            >
                              <Copy className="h-3 w-3" />
                              <span>복사</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
          </div>
        )}
      </CardContent>

      {/* Add Schedule Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>주기적 상담 시간 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Day Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">상담 가능 요일 선택</label>
              <div className="grid grid-cols-4 gap-2">
                {daysOfWeek.map(day => (
                  <label key={day.value} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                    <Checkbox
                      checked={selectedDays.includes(day.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDays([...selectedDays, day.value]);
                        } else {
                          setSelectedDays(selectedDays.filter(d => d !== day.value));
                        }
                      }}
                    />
                    <span className="text-sm">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">시간대 설정</label>
                <Button variant="outline" size="sm" onClick={addTimeSlot}>
                  <Plus className="h-3 w-3 mr-1" />
                  시간대 추가
                </Button>
              </div>
              <div className="space-y-3">
                {newTimeSlots.map((slot, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">시간대 {index + 1}</span>
                      {newTimeSlots.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">시작 시간</label>
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">종료 시간</label>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">상담 방식</label>
                        <Select value={slot.type} onValueChange={(value: 'online' | 'offline' | 'both') => updateTimeSlot(index, 'type', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">온라인</SelectItem>
                            <SelectItem value="offline">오프라인</SelectItem>
                            <SelectItem value="both">온/오프라인</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {(slot.type === 'offline' || slot.type === 'both') && (
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          오프라인 상담 장소 {slot.type === 'offline' && <span className="text-red-500">*</span>}
                        </label>
                        <Input
                          placeholder="예: 강남역 2번출구 스타벅스"
                          value={slot.location || ''}
                          onChange={(e) => updateTimeSlot(index, 'location', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              취소
            </Button>
            <Button onClick={handleAddSchedule}>
              추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
