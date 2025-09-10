import { useQuery } from '@tanstack/react-query';
import { SafeUser } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { Calendar, MessageCircle, FileText, User } from 'lucide-react';

interface UserProfileProps {
  userId: string;
  onClose?: () => void;
}

export default function UserProfile({ userId, onClose }: UserProfileProps) {
  const { user: currentUser } = useAuth();
  
  const { data: user, isLoading } = useQuery<SafeUser>({
    queryKey: ['/api/users', userId],
  });

  if (isLoading) {
    return (
      <div className="terminal-border bg-background p-6">
        <div className="terminal-green text-lg mb-4">LOADING USER PROFILE...</div>
        <div className="animate-blink terminal-amber">Please wait...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="terminal-border bg-background p-6">
        <div className="terminal-red text-lg mb-4">USER NOT FOUND</div>
        <div className="terminal-gray">The requested user profile could not be loaded.</div>
        {onClose && (
          <Button 
            onClick={onClose} 
            className="mt-4 bg-terminal-blue text-background hover:bg-terminal-cyan"
            data-testid="button-close"
          >
            CLOSE
          </Button>
        )}
      </div>
    );
  }

  const displayName = user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
  const joinDate = new Date(user.createdAt!).toLocaleDateString();
  const lastSeen = user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never';
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="terminal-border bg-background p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="terminal-green text-lg">USER PROFILE</div>
        {onClose && (
          <Button 
            onClick={onClose} 
            variant="outline"
            size="sm"
            className="border-terminal-blue text-terminal-cyan hover:bg-terminal-blue hover:text-background"
            data-testid="button-close-profile"
          >
            ✕ CLOSE
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <User className="w-4 h-4 terminal-cyan mr-2" />
              <span className="terminal-amber">IDENTITY</span>
            </div>
            <div className="pl-6 space-y-1">
              <div className="terminal-green text-lg">{displayName}</div>
              <div className="terminal-gray">@{user.username}</div>
              {user.email && isOwnProfile && (
                <div className="text-sm terminal-gray">{user.email}</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Calendar className="w-4 h-4 terminal-cyan mr-2" />
              <span className="terminal-amber">MEMBERSHIP</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div>
                <span className="terminal-gray">Joined: </span>
                <span className="terminal-green">{joinDate}</span>
              </div>
              <div>
                <span className="terminal-gray">Last seen: </span>
                <span className="terminal-green">{lastSeen}</span>
              </div>
              <div>
                <span className="terminal-gray">Role: </span>
                <span className={
                  user.role === 'admin' ? 'terminal-red' : 
                  user.role === 'moderator' ? 'terminal-amber' : 
                  'terminal-cyan'
                }>
                  {user.role?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <MessageCircle className="w-4 h-4 terminal-cyan mr-2" />
              <span className="terminal-amber">ACTIVITY</span>
            </div>
            <div className="pl-6 space-y-1 text-sm">
              <div>
                <span className="terminal-gray">Threads: </span>
                <span className="terminal-green">{user.threadCount || 0}</span>
              </div>
              <div>
                <span className="terminal-gray">Posts: </span>
                <span className="terminal-green">{user.postCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio and Additional Info */}
        <div>
          {user.bio && (
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <FileText className="w-4 h-4 terminal-cyan mr-2" />
                <span className="terminal-amber">BIOGRAPHY</span>
              </div>
              <div className="pl-6">
                <div className="terminal-border bg-background/50 p-3 text-sm terminal-gray whitespace-pre-wrap">
                  {user.bio}
                </div>
              </div>
            </div>
          )}

          <div className="terminal-border bg-background/50 p-4">
            <div className="terminal-amber text-sm mb-2">TERRY'S INSPIRATION:</div>
            <div className="text-xs terminal-gray">
              "Every programmer is a unique individual with their own perspective. 
              Like Terry, we all have something valuable to contribute to the divine art of programming."
            </div>
          </div>

          {isOwnProfile && (
            <div className="mt-4">
              <Button 
                className="w-full bg-terminal-magenta text-background hover:bg-terminal-cyan"
                data-testid="button-edit-profile"
              >
                EDIT PROFILE
              </Button>
            </div>
          )}
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="mt-6 p-4 border-2 border-terminal-red bg-background/50">
          <div className="terminal-red text-sm mb-2">SYSTEM ADMINISTRATOR</div>
          <div className="text-xs terminal-gray">
            This user has administrative privileges and can manage the forum system.
          </div>
        </div>
      )}

      {user.role === 'moderator' && (
        <div className="mt-6 p-4 border border-terminal-amber bg-background/50">
          <div className="terminal-amber text-sm mb-2">FORUM MODERATOR</div>
          <div className="text-xs terminal-gray">
            This user helps maintain forum order and assists community members.
          </div>
        </div>
      )}
    </div>
  );
}