import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { useCampaigns } from '../hooks/useCampaigns';
import CampaignCard from '../components/campaigns/CampaignCard';
import { CampaignCardSkeleton } from '../components/common/Skeleton';

const FEATURES = [
  {
    icon: Zap,
    title: 'Real-time tracking',
    desc: 'Watch donations roll in live with DynamoDB-powered counters.',
  },
  {
    icon: Shield,
    title: 'Secure payments',
    desc: 'Every transaction secured by Stripe with instant email receipts via AWS SES.',
  },
  {
    icon: Globe,
    title: 'Cloud-native scale',
    desc: 'Built on AWS ECS Fargate with Multi-AZ failover. Zero downtime.',
  },
];

export default function Home() {
  const { campaigns, loading } = useCampaigns({ limit: 6, status: 'active' });

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-surface-950 text-white overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/20 rounded-full
                        blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-800/20 rounded-full
                        blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
          <div className="max-w-3xl">
            <div className="badge bg-brand-900 text-brand-300 border border-brand-800
                            mb-6 animate-fade-in">
              ⚡ Powered by AWS ap-south-1 Mumbai
            </div>
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight
                           animate-fade-up stagger-1">
              Fund what
              <span className="block text-transparent bg-clip-text
                               bg-gradient-to-r from-brand-400 to-brand-300">
                matters most.
              </span>
            </h1>
            <p className="mt-6 text-xl text-surface-300 leading-relaxed
                          max-w-xl animate-fade-up stagger-2">
              Create campaigns, collect donations, and track your progress in real time.
              Everything you need to bring your idea to life.
            </p>
            <div className="flex flex-wrap gap-4 mt-10 animate-fade-up stagger-3">
              <Link to="/browse"
                className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                Explore Campaigns
                <ArrowRight size={18} />
              </Link>
              <Link to="/register"
                className="btn-outline border-surface-600 text-white hover:bg-surface-800
                           flex items-center gap-2 text-base px-8 py-4">
                Start Fundraising
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div key={f.title}
                className={`flex gap-4 animate-fade-up stagger-${i + 1}`}>
                <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center
                                justify-center flex-shrink-0 mt-0.5">
                  <f.icon size={18} className="text-brand-600" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-surface-900 mb-1">
                    {f.title}
                  </h3>
                  <p className="text-surface-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-600 text-sm font-medium mb-2">Live on the platform</p>
            <h2 className="font-display text-4xl font-bold text-surface-900">
              Active campaigns
            </h2>
          </div>
          <Link to="/browse"
            className="hidden sm:flex items-center gap-2 text-brand-600 font-medium
                       hover:text-brand-700 transition-colors">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <CampaignCardSkeleton key={i} />)
            : campaigns.map((c, i) => (
                <CampaignCard key={c.id} campaign={c} index={i} />
              ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link to="/browse" className="btn-outline">View all campaigns</Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            Ready to start your campaign?
          </h2>
          <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of creators already funding their dreams on CrowdFund.
          </p>
          <Link to="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-700
                       font-medium px-8 py-4 rounded-xl hover:bg-brand-50
                       transition-colors text-base">
            Get started for free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
