import { Menu } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import useAppStore from '@/store/useAppStore';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center h-11 border-b border-border px-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="ml-3 text-[12px] font-display font-bold text-foreground tracking-[0.15em] uppercase">
            ChatMe
          </span>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
