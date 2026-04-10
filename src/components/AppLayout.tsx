import { Menu } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import useAppStore from '@/store/useAppStore';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="flex items-center h-12 border-b border-border px-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="ml-3 text-sm font-medium text-foreground">Claude Remote</span>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
