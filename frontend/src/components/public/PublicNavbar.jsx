import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, User, Shield, Sparkles } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';
import HeavenLogo from '@/components/public/HeavenLogo';

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Facilities', path: '/facilities' },
    { label: 'Transformations', path: '/transformations' },
    { label: 'Membership', path: '/membership' },
    { label: 'Supplements', path: '/store' },
    { label: 'Equipment', path: '/gym-equipment' },
    { label: 'Franchise', path: '/franchise' },
    { label: 'Contact', path: '/contact' },
  ];

  const dashboardRoute = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-[#07080b]/95 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl py-3'
          : 'border-b border-white/5 bg-gradient-to-b from-[#07080b]/90 via-[#07080b]/50 to-transparent py-4 sm:py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg"
          aria-label="Heaven Gym Home"
        >
          <HeavenLogo variant="header" size="md" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-0.5 xl:gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur-md lg:flex"
          aria-label="Main Navigation"
        >
          {links.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-[11px] xl:text-xs font-mono uppercase tracking-wider transition-all duration-200 rounded-full ${
                  isActive
                    ? 'text-white bg-brand-600/90 shadow-sm shadow-brand-600/30 font-bold'
                    : 'text-surface-300 hover:text-white hover:bg-white/5 font-semibold'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls & Authentication */}
        <div className="hidden items-center gap-2.5 sm:flex">
          <ThemeToggle />

          {user ? (
            <Link to={dashboardRoute}>
              <Button
                size="sm"
                className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-brand-600/25 border border-brand-400/20"
              >
                <User size={14} className="mr-1.5" />
                {user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/15 bg-white/[0.02] text-xs font-mono font-semibold uppercase tracking-wider text-white hover:border-brand-500 hover:bg-brand-500/10 hover:text-white transition-colors"
                >
                  Sign In
                </Button>
              </Link>

              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-brand-600/25 border border-brand-400/20"
                >
                  Join Now <ArrowRight size={13} className="ml-1" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger & Theme Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-surface-200 transition hover:bg-brand-600 hover:text-white"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="border-b border-white/10 bg-[#090a0e]/98 px-5 pb-6 pt-3 shadow-2xl backdrop-blur-2xl lg:hidden animate-fade-up max-h-[85vh] overflow-y-auto">
          <nav className="divide-y divide-white/5">
            {links.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between py-3 text-xs font-mono uppercase tracking-wider transition ${
                    isActive
                      ? 'text-brand-400 font-bold'
                      : 'text-surface-300 hover:text-white'
                  }`
                }
              >
                <span>{label}</span>
                <span className="text-xs text-surface-500">&rarr;</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-5 flex flex-col gap-2.5 pt-4 border-t border-white/10">
            {user ? (
              <Link to={dashboardRoute} onClick={() => setOpen(false)}>
                <Button className="w-full justify-center bg-brand-600 text-white text-xs font-mono font-bold uppercase tracking-wider">
                  <User size={15} className="mr-2" />
                  {user.role === 'admin' ? 'Open Admin Panel' : 'Go to Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full justify-center border-white/20 text-white hover:border-brand-500 text-xs font-mono font-bold uppercase tracking-wider"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full justify-center bg-brand-600 text-white text-xs font-mono font-bold uppercase tracking-wider">
                    Join Heaven Gym <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
