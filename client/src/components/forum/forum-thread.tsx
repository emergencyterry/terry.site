import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { ForumThread as ForumThreadType, ForumCategory, ForumPost, InsertForumPost } from '@shared/schema';
import { ArrowLeft, MessageCircle, Clock, User, Send } from 'lucide-react';

interface ForumThreadProps {
  thread: ForumThreadType;
  category: ForumCategory | null;
  onBack: () => void;
}

export default function ForumThread({ thread, category, onBack }: ForumThreadProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [newPost, setNewPost] = useState('');

  const { data: posts } = useQuery<ForumPost[]>({
    queryKey: ['/api/forum/threads', thread.id, 'posts'],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: InsertForumPost) => {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/threads', thread.id, 'posts'] });
      setNewPost('');
      toast({
        title: 'Post created',
        description: 'Your reply has been posted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast({
        title: 'Content required',
        description: 'Post content cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    createPostMutation.mutate({
      threadId: thread.id,
      content: newPost,
    });
  };

  return (
    <div>
      {/* Thread Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan hover:text-background"
            data-testid="button-back-thread"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            BACK
          </Button>
          <div>
            <div className="terminal-green text-lg">{thread.title}</div>
            <div className="text-sm terminal-gray">
              in {category?.name || 'Unknown Category'} • Started {new Date(thread.createdAt!).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="text-right text-sm">
          <div className="terminal-cyan">{thread.postCount || 0} replies</div>
          <div className="terminal-amber">{thread.viewCount || 0} views</div>
        </div>
      </div>

      {/* Original Thread Content */}
      <div className="terminal-border bg-background p-6 mb-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-12 h-12 bg-terminal-blue/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 terminal-cyan" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="terminal-green font-bold">@{thread.userId}</span>
              <span className="terminal-gray text-sm">•</span>
              <span className="terminal-gray text-sm">{new Date(thread.createdAt!).toLocaleString()}</span>
            </div>
            <div className="terminal-gray whitespace-pre-wrap">{thread.content}</div>
          </div>
        </div>
      </div>

      {/* Thread Posts */}
      <div className="space-y-4 mb-6">
        {posts?.map((post, index) => (
          <div key={post.id} className="terminal-border bg-background p-4">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-terminal-green/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 terminal-green" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="terminal-green">@{post.userId}</span>
                  <span className="terminal-gray text-sm">•</span>
                  <span className="terminal-gray text-sm">#{index + 1}</span>
                  <span className="terminal-gray text-sm">•</span>
                  <span className="terminal-gray text-sm">{new Date(post.createdAt!).toLocaleString()}</span>
                  {post.editedAt && (
                    <>
                      <span className="terminal-gray text-sm">•</span>
                      <span className="terminal-amber text-sm">Edited</span>
                    </>
                  )}
                </div>
                <div className="terminal-gray whitespace-pre-wrap">{post.content}</div>
              </div>
            </div>
          </div>
        ))}

        {(!posts || posts.length === 0) && (
          <div className="text-center py-8">
            <div className="terminal-gray">No replies yet.</div>
            {isAuthenticated && (
              <div className="terminal-amber mt-2">Be the first to reply!</div>
            )}
          </div>
        )}
      </div>

      {/* Reply Form */}
      {isAuthenticated ? (
        <div className="terminal-border bg-background p-6">
          <div className="terminal-green text-lg mb-4">POST REPLY</div>
          <div className="space-y-4">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write your reply..."
              rows={6}
              className="bg-background border-terminal-blue text-terminal-green font-mono resize-none"
              data-testid="input-post-content"
            />
            <div className="flex items-center justify-between">
              <div className="text-sm terminal-gray">
                Remember to follow forum rules and keep discussions constructive.
              </div>
              <Button
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending || !newPost.trim()}
                className="bg-terminal-green text-background hover:bg-terminal-cyan"
                data-testid="button-submit-post"
              >
                <Send className="w-4 h-4 mr-1" />
                {createPostMutation.isPending ? 'POSTING...' : 'POST REPLY'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="terminal-border bg-background p-6 text-center">
          <div className="terminal-amber mb-2">LOGIN REQUIRED</div>
          <div className="terminal-gray text-sm">
            You must be logged in to post replies. Please login or register to participate in discussions.
          </div>
        </div>
      )}

      {/* Terry Davis Quote */}
      <div className="mt-6 p-4 border border-terminal-blue bg-background/50">
        <div className="terminal-amber text-sm mb-2">TERRY'S WISDOM:</div>
        <div className="text-xs terminal-gray">
          "The best discussions happen when people share their true thoughts without fear. 
          Code should be discussed openly, and so should ideas about programming."
        </div>
      </div>
    </div>
  );
}