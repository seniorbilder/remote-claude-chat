import { MessageSquare, Settings, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAppStore from '@/store/useAppStore';

const navItems = [
  { title: 'Chat', path: '/chat', icon: MessageSquare },
  { title: 'Settings', path: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { connectionStatus, config, sidebarOpen, setSidebarOpen } = useAppStore();

  const statusDot =
    connectionStatus === 'connected'
      ? 'bg-foreground'
      : connectionStatus === 'error'
      ? 'bg-destructive'
      : 'bg-hint';

  const statusText =
    connectionStatus === 'connected'
      ? 'Connected'
      : connectionStatus === 'connecting'
      ? 'Connecting...'
      : connectionStatus === 'not_configured'
      ? 'Not configured'
      : connectionStatus === 'error'
      ? 'Error'
      : 'Disconnected';

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-52 flex flex-col border-r border-border bg-sidebar transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="w-7 h-7 rounded border border-border flex items-center justify-center bg-surface">
            <span className="font-display font-bold text-[10px] text-foreground tracking-wider">CM</span>
          </div>
          <span className="font-display text-sm font-bold text-foreground tracking-[0.15em] uppercase">
            ChatMe
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-1 space-y-0.5">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path === '/chat' && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded text-[12px] uppercase tracking-[0.1em] transition-colors ${
                  active
                    ? 'bg-secondary text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div className="px-5 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${statusDot} ${
                connectionStatus === 'connected' ? 'animate-pulse-glow' : ''
              }`}
            />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{statusText}</span>
          </div>
          {connectionStatus === 'connected' && config.host && (
            <p className="text-[9px] text-hint mt-1 truncate font-mono">
              {config.username}@{config.host}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
