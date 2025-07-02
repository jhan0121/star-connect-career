import React, { useState } from 'react';
import { Star, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface MenteeRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  menteeName: string;
  onSubmitRating: (rating: number, comment: string) => void;
}

export const MenteeRatingModal = ({ 
  isOpen, 
  onClose, 
  menteeName, 
  onSubmitRating 
}: MenteeRatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "평점을 선택해주세요",
        description: "멘티의 매너에 대해 1-5점으로 평가해주세요.",
        variant: "destructive",
      });
      return;
    }

    onSubmitRating(rating, comment);
    toast({
      title: "멘티 평가가 완료되었습니다!",
      description: `${menteeName}님에게 ${rating}점을 주셨습니다.`,
    });
    
    // Reset form
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>멘티 평가하기</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Mentee Info */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">{menteeName}</h3>
            <p className="text-sm text-gray-600">상담을 완료한 멘티입니다</p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              매너 점수 (1-5점)
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-colors"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {rating}점 - {
                  rating === 5 ? '매우 좋음' :
                  rating === 4 ? '좋음' :
                  rating === 3 ? '보통' :
                  rating === 2 ? '아쉬움' : '개선 필요'
                }
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              간단 코멘트 (선택사항)
            </label>
            <Textarea
              placeholder="멘티의 매너나 상담 태도에 대한 간단한 코멘트를 남겨주세요..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleSubmit}
              className="flex-1"
              disabled={rating === 0}
            >
              평가 완료
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              나중에 하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};