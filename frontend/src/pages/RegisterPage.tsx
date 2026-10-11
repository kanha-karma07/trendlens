import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { RiskNotice } from '../components/ui/RiskNotice';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) return;
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
          <div className="inline-flex w-12 h-12 rounded-control bg-teal/20 border border-teal/40 items-center justify-center text-teal mb-2">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create TrendLens Account</h2>
          <p className="text-xs text-slate-400">
            Deploy short-horizon predictive pipelines for NSE/BSE securities
          </p>
        </div>

        <Card variant="raised" className="border-border/80">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-base">Analyst Registration</CardTitle>
              <CardDescription>Setup your quantitative workspace</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Sharma"
              />

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@example.com"
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                helperText="Must include uppercase, number, and symbol"
              />

              <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                  className="rounded border-border bg-raised text-primary focus:ring-primary mt-0.5"
                />
                <span>
                  I acknowledge that TrendLens provides probability estimates only, not financial advice, and agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms & Honesty Policy
                  </Link>.
                </span>
              </label>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                disabled={!acceptedTerms}
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Create Account
              </Button>

              <div className="text-center text-xs text-slate-400">
                Already registered?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in here
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
