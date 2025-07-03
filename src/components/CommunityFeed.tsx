
import React, { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, Plus, User, Clock, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface Post {
  id: number;
  author: string;
  role: string;
  company: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timeAgo: string;
  liked: boolean;
  avatar?: string;
}

interface CommunityFeedProps {
  onBack: () => void;
  onStartChat: (recipientName: string, recipientRole: 'mentor' | 'mentee') => void;
}

export const CommunityFeed = ({ onBack, onStartChat }: CommunityFeedProps) => {
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock data for community posts
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: '김개발자',
      role: '시니어 개발자',
      company: '네이버',
      content: '주니어 개발자분들께 드리는 조언: 완벽한 코드를 작성하려고 하지 마세요. 일단 작동하는 코드를 만들고, 점진적으로 개선해나가는 것이 중요합니다. 실패를 두려워하지 말고 많이 시도해보세요! 💪',
      tags: ['개발', '주니어', '조언'],
      likes: 24,
      comments: 8,
      timeAgo: '2시간 전',
      liked: false
    },
    {
      id: 2,
      author: '박마케터',
      role: 'UX 디자이너',
      company: '카카오',
      content: '디자인 시스템 구축 경험을 공유합니다. 처음엔 복잡해 보이지만, 일관성 있는 UI/UX를 위해선 정말 중요한 작업이에요. 특히 컴포넌트 재사용성을 고려한 설계가 핵심입니다.',
      tags: ['디자인', 'UX', '디자인시스템'],
      likes: 18,
      comments: 5,
      timeAgo: '4시간 전',
      liked: true
    },
    {
      id: 3,
      author: '이취준생',
      role: '취업준비생',
      company: '구직중',
      content: '포트폴리오 피드백 받고 싶어요 😅 백엔드 개발자로 취업을 준비하고 있는데, 어떤 프로젝트를 더 추가하면 좋을까요? 현재 스프링부트로 REST API와 간단한 웹 서비스를 만들어놨습니다.',
      tags: ['취업', '포트폴리오', '백엔드'],
      likes: 12,
      comments: 15,
      timeAgo: '6시간 전',
      liked: false
    },
    {
      id: 4,
      author: '최시니어',
      role: '인사팀 과장',
      company: '삼성전자',
      content: '채용 담당자 입장에서 본 좋은 이력서 작성법을 공유드립니다. 1) 구체적인 성과와 수치 2) 업무에 대한 본인만의 인사이트 3) 성장 과정과 학습 능력. 이 세 가지만 잘 어필해도 충분히 좋은 인상을 줄 수 있어요!',
      tags: ['채용', '이력서', '인사'],
      likes: 31,
      comments: 12,
      timeAgo: '1일 전',
      liked: false
    }
  ]);

  const availableTags = ['개발', '디자인', 'UX', '마케팅', '인사', '채용', '취업', '포트폴리오', '조언', '경험공유', '질문'];

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleNewPost = () => {
    if (!newPostContent.trim()) {
      toast({
        title: "내용을 입력해주세요",
        description: "게시글 내용을 작성해주세요.",
        variant: "destructive",
      });
      return;
    }

    const newPost: Post = {
      id: posts.length + 1,
      author: '나',
      role: 'UX 디자이너',
      company: '테크 스타트업',
      content: newPostContent,
      tags: selectedTags,
      likes: 0,
      comments: 0,
      timeAgo: '방금 전',
      liked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setSelectedTags([]);
    setShowNewPost(false);

    toast({
      title: "게시글이 등록되었습니다!",
      description: "커뮤니티에서 다른 사용자들과 소통해보세요.",
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
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

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">커뮤니티</h1>
          <p className="text-gray-600 mt-1">현직자들과 경험을 나누고 소통해보세요</p>
        </div>
        
        <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>글 작성</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 게시글 작성</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                <Textarea
                  placeholder="경험, 조언, 질문 등을 자유롭게 공유해주세요..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">태그 선택</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewPost(false)}>
                  취소
                </Button>
                <Button onClick={handleNewPost}>
                  게시하기
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{post.author}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {post.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{post.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.timeAgo}
                  </span>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 text-sm transition-colors ${
                      post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-500 transition-colors">
                    <Share className="h-4 w-4" />
                    <span>공유</span>
                  </button>
                </div>

                {post.author !== '나' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onStartChat(post.author, post.company === '구직중' ? 'mentee' : 'mentor')}
                    className="text-xs"
                  >
                    대화하기
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
