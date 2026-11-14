import { useEffect, useState } from 'react';
import {
  Dumbbell, Menu, X, LayoutDashboard, Users, UserPlus, CreditCard, Ruler,
  Package, ShoppingCart, Bell, Settings, LogOut, ClipboardList, UserRound,
  PanelsTopLeft, ChevronDown, PanelLeftClose, PanelLeftOpen, Sparkles,
} from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminAvatar from '@/components/admin/AdminAvatar';
import HeavenLogo from '@/components/public/HeavenLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import { signOut, signOutAll } from '@/redux/slices/authSlice';
import { authService } from '@/services/authService';
import LogoutConfirmDialog from '@/components/auth/LogoutConfirmDialog';
import { fetchUnreadCount } from '@/redux/slices/notificationSlice';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/admissions', icon: UserPlus, label: 'Admissions' },
  { to: '/admin/users', icon: Users, label: 'Members' },
  { to: '/admin/membership-plans', icon: CreditCard, label: 'Plans' },
  { to: '/admin/memberships', icon: ClipboardList, label: 'Memberships' },
  { to: '/admin/body-measurements', icon: Ruler, label: 'Measurements' },
  { to: '/admin/transformations', icon: Sparkles, label: 'Transformations' },
  { to: '/admin/products', icon: Package, label: 'Supplements' },
  { to: '/admin/gym-equipment', icon: Dumbbell, label: 'Gym Equipment' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { to: '/admin/banners', icon: PanelsTopLeft, label: 'Banner' },
  { to: '/admin/supplement-selling', icon: ShoppingCart, label: 'Supplement Selling' },
  { to: '/admin/supplement-sales-history', icon: ClipboardList, label: 'Sales History' },
  { to: '/admin/profile', icon: UserRound, label: 'My Profile' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

function getPageTitle(pathname) {
  const item = navItems.find((nav) => pathname === nav.to || pathname.startsWith(`${nav.to}/`));
  return item?.label || 'Dashboard';
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [readyPath, setReadyPath] = useState('');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({ activeDevices: 0, loading: false, error: '' });
  const [logoutSubmitting, setLogoutSubmitting] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state) => state.auth.profile);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const displayName = profile?.full_name || 'Administrator';
  const pageTitle = getPageTitle(location.pathname);
  const isSectionLoading = readyPath !== location.pathname;

  useEffect(() => {
    const timeoutId = setTimeout(() => setReadyPath(location.pathname), 180);
    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  async function loadSessionInfo() {
    setSessionInfo({ activeDevices: 0, loading: true, error: '' });
    try {
      const result = await authService.sessionSummary();
      setSessionInfo({ activeDevices: result.activeDevices ?? 1, loading: false, error: '' });
    } catch (error) {
      setSessionInfo({
        activeDevices: 0,
        loading: false,
        error: error.response?.data?.error || 'Could not check active devices. Please try again.',
      });
    }
  }

  async function handleSignOut() {
    setLogoutSubmitting(true);
    await dispatch(signOut());
    navigate('/');
  }

  async function handleSignOutAll() {
    setLogoutSubmitting(true);
    await dispatch(signOutAll());
    navigate('/');
  }

  const navLinkClass = ({ isActive }) => `group relative flex items-center rounded-xl transition-all duration-200 ${
    collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3.5 py-3'
  } ${
    isActive
      ? 'bg-brand-500 text-white shadow-[0_8px_24px_rgba(220,38,38,0.18)]'
      : 'text-surface-500 hover:bg-surface-100 hover:text-ink-900 dark:text-slate-400 dark:hover:bg-white/[0.055] dark:hover:text-white'
  }`;

  return (
    <div className="admin-shell min-h-screen bg-surface-50 text-ink-800 selection:bg-brand-500/20 dark:bg-[#08090c] dark:text-white">
      <LogoutConfirmDialog
        open={logoutOpen}
        activeDevices={sessionInfo.activeDevices}
        loading={sessionInfo.loading}
        error={sessionInfo.error}
        submitting={logoutSubmitting}
        onCancel={() => setLogoutOpen(false)}
        onRetry={loadSessionInfo}
        onLogout={handleSignOut}
        onLogoutAll={handleSignOutAll}
      />

      <aside className={`admin-sidebar fixed inset-y-0 left-0 z-50 hidden border-r border-surface-200 bg-white lg:flex lg:flex-col dark:border-white/[0.08] dark:bg-[#11131b] ${
        collapsed ? 'w-[84px]' : 'w-[286px]'
      }`}>
        <div className={`flex h-[72px] shrink-0 items-center border-b border-surface-200 dark:border-white/[0.08] ${
          collapsed ? 'justify-center px-3' : 'justify-between px-5'
        }`}>
          <Link to="/admin/dashboard" className="group flex min-w-0 items-center gap-3">
            {collapsed ? <HeavenLogo variant="emblem" theme="auto" size="xs" /> : <HeavenLogo variant="header" theme="auto" size="sm" />}
          </Link>
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="rounded-lg p-2 text-surface-400 transition hover:bg-surface-100 hover:text-ink-900 dark:text-slate-500 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              <PanelLeftClose size={17} />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            aria-label="Expand sidebar"
            className="mx-auto mt-4 rounded-lg p-2 text-surface-400 transition hover:bg-surface-100 hover:text-ink-900 dark:text-slate-500 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <PanelLeftOpen size={17} />
          </button>
        )}

        <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-surface-400 dark:text-slate-500">
              Main menu
            </p>
          )}
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin/dashboard'}
                title={collapsed ? item.label : undefined}
                className={navLinkClass}
              >
                <item.icon size={19} strokeWidth={2} className="shrink-0" />
                {!collapsed && <span className="text-[14px] font-semibold tracking-[-0.01em]">{item.label}</span>}
                {!collapsed && item.label === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto min-w-5 rounded-full bg-surface-200 px-1.5 py-0.5 text-center text-[10px] font-bold text-ink-800 dark:bg-white/15 dark:text-white">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="border-t border-surface-200 p-3 dark:border-white/[0.08]">
          <div className={`flex items-center rounded-xl bg-surface-100 dark:bg-white/[0.035] ${
            collapsed ? 'justify-center p-2' : 'gap-3 p-3'
          }`}>
            <Link to="/admin/profile" aria-label="Open admin profile" className="shrink-0 rounded-full">
              <AdminAvatar
                name={displayName}
                src={profile?.avatar_url}
                className="h-9 w-9 text-sm"
              />
            </Link>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink-900 dark:text-white">{displayName}</p>
                <p className="text-[11px] text-surface-500 dark:text-slate-500">Admin account</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <aside className={`fixed inset-y-0 left-0 z-[60] w-[286px] transform border-r border-surface-200 bg-white transition-transform duration-300 lg:hidden dark:border-white/[0.08] dark:bg-[#11131b] ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-[72px] items-center justify-between border-b border-surface-200 px-5 dark:border-white/[0.08]">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <HeavenLogo variant="header" theme="auto" size="sm" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-surface-500 hover:bg-surface-100 hover:text-ink-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="custom-scrollbar overflow-y-auto px-3 py-5" style={{ maxHeight: 'calc(100vh - 72px)' }}>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin/dashboard'}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-3 text-[14px] font-semibold transition ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-[0_8px_24px_rgba(220,38,38,0.18)]'
                    : 'text-surface-500 hover:bg-surface-100 hover:text-ink-900 dark:text-slate-400 dark:hover:bg-white/[0.055] dark:hover:text-white'
                }`}
              >
                <item.icon size={19} />
                <span>{item.label}</span>
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto min-w-5 rounded-full bg-surface-200 px-1.5 py-0.5 text-center text-[10px] font-bold text-ink-800 dark:bg-white/15 dark:text-white">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] lg:hidden dark:bg-black/70"
        />
      )}

      <div className={`min-h-screen transition-[padding] duration-300 ${
        collapsed ? 'lg:pl-[84px]' : 'lg:pl-[286px]'
      }`}>
        <header className="admin-topbar sticky top-0 z-40 h-[72px] border-b border-surface-200 bg-white/90 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#08090c]/90">
          <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-xl border border-surface-200 bg-surface-50 p-2.5 text-surface-500 hover:bg-surface-100 hover:text-ink-900 lg:hidden dark:border-white/[0.08] dark:bg-white/[0.025] dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <p className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-brand-500 sm:block">Heaven Gym</p>
                <h1 className="truncate font-display text-lg font-extrabold tracking-tight text-ink-900 sm:text-xl dark:text-white">
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle />
              <Link
                to="/admin/notifications"
                aria-label="Notifications"
                className="relative rounded-xl p-2.5 text-surface-500 transition hover:bg-surface-100 hover:text-ink-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-extrabold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <div className="relative ml-1 border-l border-surface-200 pl-2 sm:pl-3 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition hover:bg-surface-100 dark:hover:bg-white/[0.06]"
                >
                  <AdminAvatar name={displayName} src={profile?.avatar_url} className="h-9 w-9 text-sm" />
                  <span className="hidden max-w-[110px] truncate text-sm font-bold text-ink-900 md:block dark:text-white">
                    {displayName}
                  </span>
                  <ChevronDown size={16} className={`hidden text-surface-400 transition md:block dark:text-slate-500 ${
                    profileOpen ? 'rotate-180' : ''
                  }`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 overflow-hidden rounded-2xl border border-surface-200 bg-white p-1.5 shadow-2xl dark:border-white/[0.09] dark:bg-[#151821]">
                    <Link
                      to="/admin/profile"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-surface-600 hover:bg-surface-100 hover:text-ink-900 dark:text-slate-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
                    >
                      <UserRound size={17} /> My Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setLogoutOpen(true);
                        loadSessionInfo();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <LogOut size={17} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content min-h-[calc(100vh-72px)] bg-surface-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 dark:bg-[#08090c]">
          <div className="mx-auto w-full max-w-[1440px]">
            {isSectionLoading ? <AdminLoadingSkeleton variant="section" /> : <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
