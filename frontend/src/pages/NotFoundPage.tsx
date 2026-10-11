import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 text-center">
      <Card variant="raised" className="max-w-md p-8 border-border/80 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red/15 text-red flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">404: Screen Not Found</h1>
        <p className="text-xs text-slate-400">
          The requested route is outside the active TrendLens domain.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Landing Page
            </Button>
          </Link>
          <Link to="/app/dashboard">
            <Button size="sm" leftIcon={<Home className="w-4 h-4" />}>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
