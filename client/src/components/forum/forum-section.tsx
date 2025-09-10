import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth';
import LoginForm from '@/components/auth/login-form';
import RegisterForm from '@/components/auth/register-form';
import UserProfile from '@/components/user/user-profile';
import ForumCategories from './forum-categories';
import ForumThread from './forum-thread';
import { ForumCategory, ForumThread as ForumThreadType } from '@shared/schema';
import { MessageCircle, Users, LogIn, UserPlus, User } from 'lucide-react';

export default function ForumSection() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(null);
  const [selectedThread, setSelectedThread] = useState<ForumThreadType | null>(null);

  const { data: categories } = useQuery<ForumCategory[]>({
    queryKey: ['/api/forum/categories'],
  });

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  const handleBackToCategories = () => {
    setSelectedThread(null);
    setSelectedCategory(null);
  };

  const handleBackToThreads = () => {
    setSelectedThread(null);
  };

  const handleCategorySelect = (category: ForumCategory) => {
    setSelectedCategory(category);
  };

  const handleThreadSelect = (thread: ForumThreadType) => {
    setSelectedThread(thread);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="terminal-border bg-background p-6">
          <div className="terminal-green text-lg mb-4">LOADING FORUM...</div>
          <div className="animate-blink terminal-amber">Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Forum Header */}
      <div className="terminal-border bg-background p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="terminal-green text-lg">TERRY A. DAVIS FORUM</div>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => setShowProfile(true)}
                  variant="outline"
                  size="sm"
                  className="border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan hover:text-background"
                  data-testid="button-profile"
                >
                  <User className="w-4 h-4 mr-1" />
                  {user?.displayName || user?.username}
                </Button>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="border-terminal-red text-terminal-red hover:bg-terminal-red hover:text-background"
                  data-testid="button-logout"
                >
                  LOGOUT
                </Button>
              </>
            ) : (
              <>
                <Dialog open={showAuth} onOpenChange={setShowAuth}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setAuthMode('login')}
                      variant="outline"
                      size="sm"
                      className="border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-background"
                      data-testid="button-open-login"
                    >
                      <LogIn className="w-4 h-4 mr-1" />
                      LOGIN
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="terminal-green">
                        {authMode === 'login' ? 'LOGIN TO FORUM' : 'JOIN THE FORUM'}
                      </DialogTitle>
                    </DialogHeader>
                    {authMode === 'login' ? (
                      <LoginForm
                        onSuccess={handleAuthSuccess}
                        onSwitchToRegister={() => setAuthMode('register')}
                      />
                    ) : (
                      <RegisterForm
                        onSuccess={handleAuthSuccess}
                        onSwitchToLogin={() => setAuthMode('login')}
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <Dialog open={showAuth && authMode === 'register'} onOpenChange={setShowAuth}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setAuthMode('register')}
                      variant="outline"
                      size="sm"
                      className="border-terminal-amber text-terminal-amber hover:bg-terminal-amber hover:text-background"
                      data-testid="button-open-register"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      REGISTER
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="terminal-amber mb-2">FORUM STATISTICS:</div>
            <div className="text-sm space-y-1">
              <div className="flex items-center">
                <MessageCircle className="w-3 h-3 mr-2 terminal-cyan" />
                <span className="terminal-gray">Categories: </span>
                <span className="terminal-green">{categories?.length || 0}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-2 terminal-cyan" />
                <span className="terminal-gray">Members: </span>
                <span className="terminal-green">Growing Daily</span>
              </div>
            </div>
          </div>
          <div>
            <div className="terminal-amber mb-2">FORUM RULES:</div>
            <div className="text-sm terminal-gray">
              • Respect Terry's memory<br/>
              • Stay on topic<br/>
              • No spam or trolling<br/>
              • Share knowledge freely
            </div>
          </div>
          <div>
            <div className="terminal-amber mb-2">DIVINE CODING:</div>
            <div className="text-sm terminal-gray">
              This forum celebrates Terry's vision of programming as a divine art form.
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Dialog */}
      {isAuthenticated && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="max-w-4xl">
            <UserProfile userId={user!.id} onClose={() => setShowProfile(false)} />
          </DialogContent>
        </Dialog>
      )}

      {/* Forum Content */}
      <div className="terminal-border bg-background p-6">
        {selectedThread ? (
          <ForumThread
            thread={selectedThread}
            onBack={handleBackToThreads}
            category={selectedCategory}
          />
        ) : selectedCategory ? (
          <ForumCategories
            selectedCategory={selectedCategory}
            onBack={handleBackToCategories}
            onThreadSelect={handleThreadSelect}
          />
        ) : (
          <ForumCategories
            onCategorySelect={handleCategorySelect}
            onThreadSelect={handleThreadSelect}
          />
        )}
      </div>

      {/* Terry Davis Quote */}
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">TERRY'S FORUM PHILOSOPHY</div>
        <div className="space-y-4 text-sm">
          <div className="border-l-2 border-terminal-amber pl-4">
            <div className="terminal-amber mb-2">COMMUNITY OVER COMPLEXITY:</div>
            <div className="terminal-gray">
              "A true community forms when people share knowledge freely, just like how God intended code to be shared among His children."
            </div>
          </div>
          <div className="border-l-2 border-terminal-amber pl-4">
            <div className="terminal-amber mb-2">DIRECT COMMUNICATION:</div>
            <div className="terminal-gray">
              "Don't hide behind corporate speak or technical jargon. Say what you mean, mean what you say, and help others understand."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}