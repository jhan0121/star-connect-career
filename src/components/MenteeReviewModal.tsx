
import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface MenteeReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorName: string;
  onSubmitReview: (rating: number, review: string, tags: string[]) => void;
}

export const MenteeReviewModal = ({ isOpen, onClose, mentorName, onSubmitReview }: MenteeReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const reviewTags = [
    '친절함', '전문성', '실무도움', '시간준수', '소통원활',
    '포트폴리오도움', '면접준비', '커리어조언', '네트워킹', '실질적도움'
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "별점을 선택해주세요",
        description: "멘토에 대한 평가를 별점으로 남겨주세요.",
        variant: "destructive",
      });
      return;
    }

    if (review.trim().length < 10) {
      toast({
        title: "후기를 작성해주세요",
        description: "최소 10글자 이상의 상세한 후기를 작성해주세요.",
        variant: "destructive",
      });
      return;
    }

    onSubmitReview(rating, review, selectedTags);
    
    toast({
      title: "후기가 등록되었습니다!",
      description: "소중한 후기 감사합니다. 다른 멘티들에게 도움이 될 것입니다.",
    });

    // Reset form
    setRating(0);
    setReview('');
    setSelectedTags([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mentorName} 멘토 후기 작성</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전체적인 만족도를 평가해주세요
            </label>
            <div className="flex space-x-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {rating === 5 ? '매우 만족' : 
                 rating === 4 ? '만족' :
                 rating === 3 ? '보통' :
                 rating === 2 ? '불만족' : '매우 불만족'}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              어떤 점이 좋았나요? (선택사항)
            </label>
            <div className="flex flex-wrap gap-2">
              {reviewTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상세 후기 작성
            </label>
            <Textarea
              placeholder="멘토와의 상담 경험을 자세히 공유해주세요. 다른 멘티들에게 도움이 되는 솔직한 후기를 남겨주세요."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              {review.length}/500자 (최소 10자 이상)
            </p>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit} className="flex items-center space-x-2">
            <Send className="h-4 w-4" />
            <span>후기 등록</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
