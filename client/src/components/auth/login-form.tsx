import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      await login(data);
      toast({
        title: 'Login successful',
        description: 'Welcome back to the Terry A. Davis Memorial Forum',
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid username or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="terminal-border bg-background p-6 max-w-md mx-auto">
      <div className="terminal-green text-lg mb-4 text-center">LOGIN TO FORUM</div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="username" className="terminal-amber">USERNAME:</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono"
            data-testid="input-username"
            {...form.register('username')}
          />
          {form.formState.errors.username && (
            <div className="text-terminal-red text-sm mt-1">
              {form.formState.errors.username.message}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="terminal-amber">PASSWORD:</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono"
            data-testid="input-password"
            {...form.register('password')}
          />
          {form.formState.errors.password && (
            <div className="text-terminal-red text-sm mt-1">
              {form.formState.errors.password.message}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-terminal-green text-background hover:bg-terminal-cyan"
          data-testid="button-login"
        >
          {isLoading ? 'LOGGING IN...' : 'LOGIN'}
        </Button>

        {onSwitchToRegister && (
          <div className="text-center mt-4">
            <span className="text-sm terminal-gray">Don't have an account? </span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-sm terminal-cyan hover:terminal-green underline"
              data-testid="button-switch-register"
            >
              Register here
            </button>
          </div>
        )}
      </form>

      <div className="mt-6 p-4 border border-terminal-blue bg-background/50">
        <div className="terminal-amber text-sm mb-2">TERRY'S WISDOM:</div>
        <div className="text-xs terminal-gray">
          "A true programmer doesn't need complex frameworks. Simple, direct code is divine."
        </div>
      </div>
    </div>
  );
}