import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      displayName: '',
      bio: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
      toast({
        title: 'Registration successful',
        description: 'Welcome to the Terry A. Davis Forum',
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong during registration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="terminal-border bg-background p-6 max-w-md mx-auto">
      <div className="terminal-green text-lg mb-4 text-center">JOIN THE FORUM</div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username" className="terminal-amber">USERNAME*:</Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono text-sm"
              data-testid="input-username"
              {...form.register('username')}
            />
            {form.formState.errors.username && (
              <div className="text-terminal-red text-xs mt-1">
                {form.formState.errors.username.message}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="terminal-amber">EMAIL*:</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono text-sm"
              data-testid="input-email"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <div className="text-terminal-red text-xs mt-1">
                {form.formState.errors.email.message}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password" className="terminal-amber">PASSWORD*:</Label>
            <Input
              id="password"
              type="password"
              placeholder="Min 8 chars"
              className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono text-sm"
              data-testid="input-password"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <div className="text-terminal-red text-xs mt-1">
                {form.formState.errors.password.message}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="terminal-amber">CONFIRM*:</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono text-sm"
              data-testid="input-confirm-password"
              {...form.register('confirmPassword')}
            />
            {form.formState.errors.confirmPassword && (
              <div className="text-terminal-red text-xs mt-1">
                {form.formState.errors.confirmPassword.message}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="terminal-gray">FIRST NAME:</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Optional"
              className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono text-sm"
              data-testid="input-firstname"
              {...form.register('firstName')}
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="terminal-gray">LAST NAME:</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Optional"
              className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono text-sm"
              data-testid="input-lastname"
              {...form.register('lastName')}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="displayName" className="terminal-gray">DISPLAY NAME:</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="How others will see you"
            className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono text-sm"
            data-testid="input-displayname"
            {...form.register('displayName')}
          />
        </div>

        <div>
          <Label htmlFor="bio" className="terminal-gray">BIO:</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself..."
            rows={3}
            className="mt-1 bg-background border-terminal-blue text-terminal-green font-mono text-sm resize-none"
            data-testid="input-bio"
            {...form.register('bio')}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-terminal-green text-background hover:bg-terminal-cyan"
          data-testid="button-register"
        >
          {isLoading ? 'REGISTERING...' : 'REGISTER'}
        </Button>

        {onSwitchToLogin && (
          <div className="text-center mt-4">
            <span className="text-sm terminal-gray">Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm terminal-cyan hover:terminal-green underline"
              data-testid="button-switch-login"
            >
              Login here
            </button>
          </div>
        )}
      </form>

      <div className="mt-6 p-4 border border-terminal-blue bg-background/50">
        <div className="terminal-amber text-sm mb-2">FORUM RULES:</div>
        <div className="text-xs terminal-gray">
          • Respect Terry's memory and contributions<br/>
          • Keep discussions constructive<br/>
          • No spam or off-topic posts<br/>
          • Follow the divine programming principles
        </div>
      </div>
    </div>
  );
}