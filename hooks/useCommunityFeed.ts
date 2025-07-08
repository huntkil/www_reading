import { useState, useEffect, useCallback } from 'react';
import { Post } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export function useCommunityFeed() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState('');

  const fetchPosts = useCallback(async () => {
    // Do not set loading to true here to avoid entire feed flashing on refetch
    // setLoading(true); 
    try {
      const res = await fetch('/api/post');
      if (!res.ok) throw new Error('게시글을 불러오는데 실패했습니다.');
      const data = await res.json();
      setPosts(data.posts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user) return;

    const tempPost = {
      id: `temp-${Date.now()}`,
      content: newPostContent,
      createdAt: new Date().toISOString(),
      author: { id: user.id, name: user.name, email: user.email },
      comments: [],
      _count: { likes: 0 },
      likedByMe: false,
    };

    setPosts(prevPosts => [tempPost, ...prevPosts]);
    setNewPostContent('');

    try {
      const res = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent }),
      });
      if (!res.ok) throw new Error('게시글 작성에 실패했습니다.');
      
      await fetchPosts(); // Re-fetch to get the real post ID and data
    } catch (err: any) {
      setError(err.message);
      await fetchPosts(); // Revert on failure
    }
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) return;
    
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              _count: {
                ...p._count,
                likes: p.likedByMe ? p._count.likes - 1 : p._count.likes + 1,
              },
            }
          : p
      )
    );

    try {
      const res = await fetch(`/api/post/${postId}/like`, { method: 'POST' });
      if (!res.ok) {
        await fetchPosts();
        throw new Error('요청에 실패했습니다.');
      }
    } catch (err: any) {
      setError(err.message);
      await fetchPosts();
    }
  };

  const handleCommentSubmit = async (postId: string, text: string) => {
    if (!text.trim() || !user) return;

    const tempComment = {
        id: `temp-${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        author: { id: user.id, name: user.name, email: user.email }
    };

    setPosts(prevPosts =>
        prevPosts.map(p =>
            p.id === postId
                ? { ...p, comments: [...p.comments, tempComment] }
                : p
        )
    );

    try {
      const res = await fetch(`/api/post/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
          throw new Error('댓글 작성에 실패했습니다.');
      }
      await fetchPosts();
    } catch (err: any) {
      setError(err.message);
      await fetchPosts();
    }
  };

  return {
    posts,
    loading,
    error,
    newPostContent,
    setNewPostContent,
    handlePostSubmit,
    handleLike,
    handleCommentSubmit,
    isAuthenticated,
    user
  };
} 