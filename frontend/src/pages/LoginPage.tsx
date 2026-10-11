import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { RiskNotice } from '../components/ui/RiskNotice';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('analyst@trendlens.internal');
  const [password, setPassword] = useState('demo-password');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/app/dashboard');
    }, 600);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-control bg-primary/20 border border-primary/40 items-center justify-center text-primary mb-2">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to TrendLens</h2>
          <p className="text-xs text-slate-400">
            Access quantitative price estimation models & portfolio history
          </p>
        </div>

        <Card variant="raised" className="border-border/80">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-base">Authentication</CardTitle>
              <CardDescription>Enter your analyst credentials to continue</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@trendlens.internal"
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-border bg-raised text-primary focus:ring-primary"
                  />
                  <span>Remember session</span>
                </label>
                <Link to="/login" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                leftIcon={<Lock className="w-4 h-4" />}
              >
                Sign In
              </Button>

              <div className="text-center text-xs text-slate-400">
                Don't have an analyst account?{' '}
                <Link to="/register" className="text-teal hover:underline font-medium">
                  Create one now
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <RiskNotice variant="inline" className="justify-center text-center" />
      </div>
    </div>
  );
};
