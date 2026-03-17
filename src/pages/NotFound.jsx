import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-8xl font-bold text-surface-200 mb-4">404</p>
      <h1 className="font-display text-3xl font-bold text-surface-900 mb-2">
        Page not found
      </h1>
      <p className="text-surface-500 mb-8 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary flex items-center gap-2">
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </div>
  );
}
