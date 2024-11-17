import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { auth } from '../lib/api'; // API functions
import { useAuthStore } from '../store/auth'; // Store for auth state
import { AuthLayout } from '../components/auth/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

// Zod schema for validation
const schema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await auth.login(data.email, data.password);

      if (response.data?.token) {
        setAuth(response.data.token);
        toast.success('Login successful! Redirecting...');
        navigate('/'); // Redirect to home page
      } else {
        throw new Error('Unexpected response from server.');
      }
    } catch (error: any) {
      toast.error('Invalid email or password');
    }
  };

  return (
    <AuthLayout title="Sign in to your account">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email address"
          type="email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Button type="submit" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
      <div className="mt-6">
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
