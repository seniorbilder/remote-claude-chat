import { MessageSquare, Settings, X, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAppStore from '@/store/useAppStore';

const navItems = [
  { title: 'Chat', path: '/chat', icon: MessageSquare },
  { title: 'Settings', path: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { connectionStatus, config, sidebarOpen, setSidebarOpen } = useAppStore();

  const statusColor =
    connectionStatus === 'connected'
      ? 'bg-success'
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
          className="fixed inset-0 bg-background/70 backdrop-blur-md z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-[220px] flex flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-foreground tracking-tight">ChatMe</span>
            <span className="text-[10px] text-muted-foreground font-medium">Remote Terminal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path === '/chat' && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  active
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div className="mx-3 mb-4 p-3 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${statusColor} ${
                connectionStatus === 'connected' ? 'animate-pulse-glow' : ''
              }`}
            />
            <span className="text-[11px] text-muted-foreground font-medium">{statusText}</span>
          </div>
          {connectionStatus === 'connected' && config.host && (
            <p className="text-[10px] text-hint mt-1.5 truncate font-mono">
              {config.username}@{config.host}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
