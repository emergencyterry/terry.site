import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { ForumCategory, ForumThread, InsertForumCategory } from '@shared/schema';
import { MessageCircle, Plus, ArrowLeft, Clock, User } from 'lucide-react';

interface ForumCategoriesProps {
  selectedCategory?: ForumCategory | null;
  onCategorySelect?: (category: ForumCategory) => void;
  onThreadSelect?: (thread: ForumThread) => void;
  onBack?: () => void;
}

export default function ForumCategories({ 
  selectedCategory, 
  onCategorySelect, 
  onThreadSelect,
  onBack 
}: ForumCategoriesProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  const { data: categories } = useQuery<ForumCategory[]>({
    queryKey: ['/api/forum/categories'],
  });

  const { data: threads } = useQuery<ForumThread[]>({
    queryKey: ['/api/forum/categories', selectedCategory?.id, 'threads'],
    enabled: !!selectedCategory,
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: InsertForumCategory) => {
      const response = await fetch('/api/forum/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/categories'] });
      setShowCreateCategory(false);
      setNewCategory({ name: '', description: '' });
      toast({
        title: 'Category created',
        description: 'New forum category has been created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create category',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: 'Name required',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }

    createCategoryMutation.mutate({
      name: newCategory.name,
      description: newCategory.description || undefined,
    });
  };

  if (selectedCategory && threads !== undefined) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan hover:text-background"
              data-testid="button-back-categories"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              BACK
            </Button>
            <div>
              <div className="terminal-green text-lg">{selectedCategory.name}</div>
              {selectedCategory.description && (
                <div className="terminal-gray text-sm">{selectedCategory.description}</div>
              )}
            </div>
          </div>
          
          {isAuthenticated && (
            <Button
              className="bg-terminal-green text-background hover:bg-terminal-cyan"
              data-testid="button-new-thread"
            >
              <Plus className="w-4 h-4 mr-1" />
              NEW THREAD
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {threads.length === 0 ? (
            <div className="text-center py-8">
              <div className="terminal-gray">No threads in this category yet.</div>
              {isAuthenticated && (
                <div className="terminal-amber mt-2">Be the first to start a discussion!</div>
              )}
            </div>
          ) : (
            threads.map((thread) => (
              <div
                key={thread.id}
                className="border border-terminal-blue p-4 hover:bg-terminal-blue/10 cursor-pointer transition-colors"
                onClick={() => onThreadSelect?.(thread)}
                data-testid={`thread-${thread.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="terminal-green mb-1">{thread.title}</div>
                    <div className="terminal-gray text-sm line-clamp-2">{thread.content}</div>
                    <div className="flex items-center space-x-4 mt-2 text-xs terminal-gray">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        @{thread.userId}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(thread.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="terminal-cyan">{thread.postCount || 0} posts</div>
                    <div className="terminal-amber">{thread.viewCount || 0} views</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="terminal-green text-lg">FORUM CATEGORIES</div>
        
        {user?.role === 'admin' && (
          <Dialog open={showCreateCategory} onOpenChange={setShowCreateCategory}>
            <DialogTrigger asChild>
              <Button
                className="bg-terminal-magenta text-background hover:bg-terminal-cyan"
                data-testid="button-create-category"
              >
                <Plus className="w-4 h-4 mr-1" />
                NEW CATEGORY
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="terminal-green">CREATE NEW CATEGORY</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName" className="terminal-amber">CATEGORY NAME:</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name"
                    className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono"
                    data-testid="input-category-name"
                  />
                </div>
                <div>
                  <Label htmlFor="categoryDescription" className="terminal-gray">DESCRIPTION:</Label>
                  <Textarea
                    id="categoryDescription"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter category description (optional)"
                    rows={3}
                    className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono"
                    data-testid="input-category-description"
                  />
                </div>
                <Button
                  onClick={handleCreateCategory}
                  disabled={createCategoryMutation.isPending}
                  className="w-full bg-terminal-green text-background hover:bg-terminal-cyan"
                  data-testid="button-create-category-submit"
                >
                  {createCategoryMutation.isPending ? 'CREATING...' : 'CREATE CATEGORY'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="border border-terminal-blue p-6 hover:bg-terminal-blue/10 cursor-pointer transition-colors"
            onClick={() => onCategorySelect?.(category)}
            data-testid={`category-${category.id}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="terminal-green text-lg mb-2">{category.name}</div>
                {category.description && (
                  <div className="terminal-gray text-sm mb-3">{category.description}</div>
                )}
                <div className="flex items-center space-x-6 text-sm terminal-amber">
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {category.threadCount || 0} threads
                  </div>
                  <div>{category.postCount || 0} posts</div>
                </div>
              </div>
              <div className="text-right">
                <div className="terminal-cyan text-sm">ENTER →</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!categories || categories.length === 0) && (
        <div className="text-center py-12">
          <div className="terminal-gray text-lg mb-2">No categories available</div>
          <div className="terminal-amber text-sm">Check back soon for forum discussions!</div>
        </div>
      )}
    </div>
  );
}