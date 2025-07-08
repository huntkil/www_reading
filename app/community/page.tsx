'use client'

import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Send, User } from 'lucide-react';

export default function CommunityPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const {
    posts,
    loading,
    error,
    newPostContent,
    setNewPostContent,
    handlePostSubmit,
    handleLike,
    handleCommentSubmit,
  } = useCommunityFeed();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
          <p className="text-muted-foreground mb-6">
            커뮤니티에 참여하려면 로그인해주세요.
          </p>
          <Button onClick={openAuthModal}>
            <User className="mr-2 h-4 w-4" />
            로그인하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">커뮤니티</h1>
        <p className="text-muted-foreground">
          다른 사용자들과 읽기 훈련 경험을 공유해보세요.
        </p>
      </div>

      {/* 새 게시글 작성 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>새 게시글 작성</CardTitle>
          <CardDescription>오늘의 훈련 경험이나 꿀팁을 공유해보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <Textarea
              placeholder="무엇을 공유하고 싶으신가요?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{user?.name}</span>
              </div>
              <Button type="submit" disabled={!newPostContent.trim()}>
                <Send className="mr-2 h-4 w-4" />
                게시하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 게시글 목록 */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">게시글을 불러오는 중...</p>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">아직 게시글이 없습니다</h3>
                <p className="text-muted-foreground">
                  첫 번째 게시글을 작성해보세요!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{post.author.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleTimeString('ko-KR')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                
                {/* 액션 버튼 */}
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 ${
                      post.likedByMe ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${post.likedByMe ? 'fill-current' : ''}`} />
                    <span>{post._count.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post._count.comments}</span>
                  </Button>
                </div>

                {/* 댓글 목록 */}
                {post.comments.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="" alt={comment.author.name} />
                          <AvatarFallback className="text-xs">
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{comment.author.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 댓글 작성 */}
                <div className="pt-4 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const text = formData.get('comment') as string;
                      if (text.trim()) {
                        handleCommentSubmit(post.id, text);
                        e.currentTarget.reset();
                      }
                    }}
                    className="flex gap-2"
                  >
                    <Textarea
                      name="comment"
                      placeholder="댓글을 작성하세요..."
                      className="flex-1 min-h-[60px]"
                    />
                    <Button type="submit" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 