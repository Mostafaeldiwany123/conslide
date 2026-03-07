import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const port = searchParams.get('port');

  useEffect(() => {
    if (port) {
      localStorage.setItem('app_port', port);
    }
  }, [port]);

  const { signUpWithEmail, signInWithGoogle, signInWithMicrosoft } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signUpWithEmail(email, password, name);
      if (result.needsVerification) {
        setShowVerification(true);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-screen bg-white">
        <div className="absolute top-0 left-0 right-0 z-10 p-6">
          <button
            onClick={() => navigate('/')}
            type="button"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>
        </div>

        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 mb-6">
              We've sent a verification link to<br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Click the link in the email to verify your account and get started.
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Continue to Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <button
          onClick={() => navigate('/')}
          type="button"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img
                src="/conslide_favicon.png"
                alt="Conslide"
                className="w-10 h-10 rounded-xl"
              />
              <span className="text-xl font-semibold text-gray-900">Conslide</span>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-500 mt-2">Start using Conslide today</p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-center gap-3 h-11 border-gray-200 hover:bg-gray-50 text-gray-700"
              onClick={() => signInWithGoogle()}
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full justify-center gap-3 h-11 border-gray-200 hover:bg-gray-50 text-gray-700"
              onClick={() => signInWithMicrosoft()}
              type="button"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                alt="Microsoft"
                className="w-5 h-5"
              />
              Continue with Microsoft
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>
              )}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 h-11"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 h-11"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 pt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;