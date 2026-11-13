import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import WhatsAppButton from '@/components/public/WhatsAppButton';

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07080b]">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  );
}

export default function PublicLayout() {
  const initializing = useSelector((state) => state.auth.initializing);

  if (initializing) return <RouteLoader />;

  return (
    <div className="min-h-screen bg-[#06070a] text-white selection:bg-brand-500 selection:text-white w-full max-w-full overflow-x-hidden">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
      <WhatsAppButton />
    </div>
  );
}
