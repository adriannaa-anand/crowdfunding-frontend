import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Heart, Menu, X, LayoutDashboard, LogOut, User, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center
                            group-hover:bg-brand-700 transition-colors">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl text-surface-900">
              CrowdFund
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/browse"
              className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors
                ${isActive('/browse')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'}`}>
              Browse
            </Link>
            {user?.role === 'creator' || user?.role === 'admin' ? (
              <Link to="/create"
                className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors
                  ${isActive('/create')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'}`}>
                Start a Campaign
              </Link>
            ) : null}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl
                             hover:bg-surface-100 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center
                                  justify-center text-brand-700 text-xs font-medium">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-body font-medium text-surface-700">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl
                                  shadow-xl border border-surface-100 py-2 animate-scale-in">
                    {(user.role === 'creator' || user.role === 'admin') && (
                      <Link to="/dashboard"
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm
                                   text-surface-700 hover:bg-surface-50 transition-colors">
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    )}
                    <Link to="/my-donations"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm
                                 text-surface-700 hover:bg-surface-50 transition-colors">
                      <Heart size={16} />
                      My Donations
                    </Link>
                    <hr className="my-1 border-surface-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm w-full
                                 text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-surface-100"
            onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-surface-200 bg-white px-4 py-4 space-y-2">
          <Link to="/browse" onClick={() => setOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-medium
                       text-surface-700 hover:bg-surface-50">Browse</Link>
          {user ? (
            <>
              {(user.role === 'creator' || user.role === 'admin') && (
                <>
                  <Link to="/create" onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium
                               text-surface-700 hover:bg-surface-50">
                    Start a Campaign
                  </Link>
                  <Link to="/dashboard" onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm font-medium
                               text-surface-700 hover:bg-surface-50">Dashboard</Link>
                </>
              )}
              <Link to="/my-donations" onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium
                           text-surface-700 hover:bg-surface-50">My Donations</Link>
              <button onClick={handleLogout}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm
                           font-medium text-red-600 hover:bg-red-50">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium
                           text-surface-700 hover:bg-surface-50">Sign in</Link>
              <Link to="/register" onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium
                           bg-brand-600 text-white text-center">Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
