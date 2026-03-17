import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Heart size={16} className="text-white fill-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">CrowdFund</span>
            </div>
            <p className="text-sm leading-relaxed text-surface-300 max-w-xs">
              Empowering creators and changemakers to fund what matters.
              Built on AWS ap-south-1 Mumbai.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-body font-medium mb-4 text-sm uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-white transition-colors">Browse Campaigns</Link></li>
              <li><Link to="/create" className="hover:text-white transition-colors">Start a Campaign</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-white font-body font-medium mb-4 text-sm uppercase tracking-wider">
              Powered By
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="text-surface-400">AWS ECS Fargate</li>
              <li className="text-surface-400">Amazon RDS MySQL</li>
              <li className="text-surface-400">Amazon DynamoDB</li>
              <li className="text-surface-400">Stripe Payments</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-surface-800 flex flex-col sm:flex-row
                        items-center justify-between gap-4 text-xs text-surface-500">
          <p>© {new Date().getFullYear()} CrowdFund Platform. All rights reserved.</p>
          <p>AWS ap-south-1 (Mumbai) · Secured by Stripe</p>
        </div>
      </div>
    </footer>
  );
}
