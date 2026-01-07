// pages/AuthSuccess.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokenFromOAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate(`/login?error=${error}`);
      return;
    }

    if (token) {
      setTokenFromOAuth(token).then(() => {
        navigate('/dashboard');
      });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setTokenFromOAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight">
                Authenticating...
              </h2>
              <p className="text-sm text-muted-foreground">
                Please wait while we sign you in.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSuccess;