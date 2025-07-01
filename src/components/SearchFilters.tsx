
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const SearchFilters = ({ onFilterChange }) => {
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [selectedConsultationType, setSelectedConsultationType] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const expertiseOptions = [
    '인사관리', '리더십', '조직문화', '커리어 전환',
    '백엔드 개발', 'AI/ML', '기술 스택 선택', '스타트업 경험',
    '디지털 마케팅', '브랜딩', '포트폴리오 리뷰', '실무 경험'
  ];

  const consultationTypes = [
    '커리어 상담', '면접 준비', '조직 적응',
    '기술 상담', '커리어 로드맵', '이직 준비',
    '포트폴리오 피드백', '실무 상담', '취업 준비'
  ];

  const handleExpertiseToggle = (expertise) => {
    const updated = selectedExpertise.includes(expertise)
      ? selectedExpertise.filter(e => e !== expertise)
      : [...selectedExpertise, expertise];
    setSelectedExpertise(updated);
    updateFilters({ expertise: updated });
  };

  const handleConsultationTypeToggle = (type) => {
    const updated = selectedConsultationType.includes(type)
      ? selectedConsultationType.filter(t => t !== type)
      : [...selectedConsultationType, type];
    setSelectedConsultationType(updated);
    updateFilters({ consultationType: updated });
  };

  const handleAvailabilityChange = (availability) => {
    const newAvailability = selectedAvailability === availability ? '' : availability;
    setSelectedAvailability(newAvailability);
    updateFilters({ availability: newAvailability });
  };

  const updateFilters = (newFilter) => {
    onFilterChange({
      expertise: newFilter.expertise || selectedExpertise,
      consultationType: newFilter.consultationType || selectedConsultationType,
      availability: newFilter.availability !== undefined ? newFilter.availability : selectedAvailability
    });
  };

  const clearAllFilters = () => {
    setSelectedExpertise([]);
    setSelectedConsultationType([]);
    setSelectedAvailability('');
    onFilterChange({
      expertise: [],
      consultationType: [],
      availability: ''
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">멘토 검색 및 필터</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1"
          >
            <Filter className="h-4 w-4" />
            <span>필터 {showFilters ? '숨기기' : '보기'}</span>
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-6">
            {/* 전문 분야 필터 */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">전문 분야</h4>
              <div className="flex flex-wrap gap-2">
                {expertiseOptions.map((expertise) => (
                  <Badge
                    key={expertise}
                    variant={selectedExpertise.includes(expertise) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleExpertiseToggle(expertise)}
                  >
                    {expertise}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 상담 유형 필터 */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">상담 유형</h4>
              <div className="flex flex-wrap gap-2">
                {consultationTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedConsultationType.includes(type) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleConsultationTypeToggle(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 상담 방식 필터 */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">상담 방식</h4>
              <div className="flex gap-2">
                <Badge
                  variant={selectedAvailability === 'online' ? "default" : "outline"}
                  className="cursor-pointer hover:bg-green-100 transition-colors"
                  onClick={() => handleAvailabilityChange('online')}
                >
                  온라인
                </Badge>
                <Badge
                  variant={selectedAvailability === 'offline' ? "default" : "outline"}
                  className="cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => handleAvailabilityChange('offline')}
                >
                  오프라인
                </Badge>
              </div>
            </div>

            {/* 필터 초기화 */}
            {(selectedExpertise.length > 0 || selectedConsultationType.length > 0 || selectedAvailability) && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-600 hover:text-gray-800"
                >
                  모든 필터 초기화
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
