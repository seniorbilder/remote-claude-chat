import { Menu, Zap } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import useAppStore from '@/store/useAppStore';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center h-12 border-b border-border px-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-3">
            <div className="w-6 h-6 rounded-lg gradient-accent flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" fill="white" />
            </div>
            <span className="text-sm font-semibold text-foreground">ChatMe</span>
          </div>
        </header>
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
