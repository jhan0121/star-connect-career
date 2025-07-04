
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, Calendar as CalendarIcon } from 'lucide-react';

interface Consultation {
  id: number;
  mentorName: string;
  menteeName: string;
  date: string;
  time: string;
  type: string;
  location?: string;
  status: string;
  role: string;
}

interface CalendarScheduleViewProps {
  consultations: Consultation[];
  role: 'mentor' | 'mentee';
}

export const CalendarScheduleView = ({ consultations, role }: CalendarScheduleViewProps) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  // Get consultations for the selected date
  const getConsultationsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return consultations.filter(consultation => consultation.date === dateStr);
  };

  // Get dates that have consultations
  const getDatesWithConsultations = () => {
    return consultations.map(consultation => new Date(consultation.date + 'T00:00:00'));
  };

  const selectedDateConsultations = selectedDate ? getConsultationsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>상담 일정 캘린더</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasConsultation: getDatesWithConsultations()
            }}
            modifiersStyles={{
              hasConsultation: {
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: 'bold'
              }
            }}
            className="rounded-md border w-full"
          />
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>상담 일정이 있는 날</span>
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate?.toLocaleDateString('ko-KR')} 상담 일정
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateConsultations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>선택한 날짜에 상담이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateConsultations.map(consultation => (
                <div key={consultation.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        {role === 'mentor' ? consultation.menteeName : consultation.mentorName}
                      </span>
                    </div>
                    <Badge variant={
                      consultation.status === 'pending' ? 'default' :
                      consultation.status === 'approved' ? 'secondary' : 'outline'
                    }>
                      {consultation.status === 'pending' ? '대기중' :
                       consultation.status === 'approved' ? '승인됨' : '완료'}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
