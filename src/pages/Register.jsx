import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { Heart, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'donor',
  });
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const { data } = await authService.register(form);
      setAuth(data.user, data.token);
      toast.success('Account created! Welcome to CrowdFund.');
      navigate(data.user.role === 'creator' ? '/create' : '/browse');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-600
                          rounded-2xl mb-4">
            <Heart size={22} className="text-white fill-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-surface-900">Create account</h1>
          <p className="text-surface-500 mt-2 text-sm">Join thousands of fundraisers</p>
        </div>

        <div className="bg-white rounded-3xl border border-surface-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Full name
              </label>
              <input type="text" value={form.name} onChange={set('name')}
                className="input" placeholder="Your name" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Email
              </label>
              <input type="email" value={form.email} onChange={set('email')}
                className="input" placeholder="you@example.com" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  className="input pr-10"
                  placeholder="Min. 6 characters"
                  required
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-surface-400 hover:text-surface-600">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-3">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'donor',   label: '💝 Donate',        desc: 'Support campaigns' },
                  { value: 'creator', label: '🚀 Fundraise',     desc: 'Create campaigns' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                    className={`p-4 rounded-xl border text-left transition-all
                      ${form.role === r.value
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-surface-200 hover:border-surface-300'}`}
                  >
                    <p className="font-medium text-sm text-surface-900">{r.label}</p>
                    <p className="text-xs text-surface-400 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 text-base">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
