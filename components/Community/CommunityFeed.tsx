'use client';

import React, { useState } from 'react';
import { Post } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useCommunityFeed } from '@/hooks/useCommunityFeed';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function CommunityFeed() {
  const {
    posts,
    loading,
    error,
    newPostContent,
    setNewPostContent,
    handlePostSubmit,
    handleLike,
    handleCommentSubmit,
    isAuthenticated,
  } = useCommunityFeed();

  if (loading) {
    return <div className="flex justify-center items-center p-4"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">오류: {error}</div>;
  }
  
  return (
    <div className="space-y-4">
      {isAuthenticated && (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handlePostSubmit} className="space-y-2">
              <Textarea
                placeholder="새로운 소식을 공유해보세요..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  게시
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onLike={handleLike} 
            onCommentSubmit={handleCommentSubmit}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onCommentSubmit: (postId: string, text: string) => void;
  isAuthenticated: boolean;
}

function PostCard({ post, onLike, onCommentSubmit, isAuthenticated }: PostCardProps) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommentSubmit(post.id, commentText);
    setCommentText('');
  };

  return (
    <Card key={post.id}>
      <CardHeader className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${post.author.name}`} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-semibold">{post.author.name}</CardTitle>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-gray-500">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm" onClick={() => onLike(post.id)} disabled={!isAuthenticated} className="flex items-center space-x-1">
            <Heart className={`w-4 h-4 ${post.likedByMe ? 'text-red-500 fill-current' : ''}`} />
            <span>{post._count.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments.length}</span>
          </Button>
        </div>
      </CardFooter>
      {showComments && (
        <div className="p-4 border-t">
          {isAuthenticated && (
            <form onSubmit={handleCommentSubmit} className="flex space-x-2 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user?.name}`} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글을 입력하세요..."
                rows={1}
                className="flex-grow"
              />
              <Button type="submit" size="icon" variant="ghost">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          )}
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${comment.author.name}`} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold text-sm">{comment.author.name}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
} 