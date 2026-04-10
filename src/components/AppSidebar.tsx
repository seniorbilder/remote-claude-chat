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

  const statusColor =
    connectionStatus === 'connected'
      ? 'text-success'
      : connectionStatus === 'error'
      ? 'text-destructive'
      : 'text-hint';

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
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-60 flex flex-col border-r border-border bg-sidebar transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="font-mono font-bold text-xs text-primary">CR</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">Claude Remote</span>
            <span className="text-[10px] uppercase tracking-widest text-hint font-medium">
              Terminal Chat
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path === '/chat' && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  active
                    ? 'bg-primary/10 text-primary font-medium shadow-glow'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Connection status */}
        <div className="px-5 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${statusColor} ${
                connectionStatus === 'connected' ? 'animate-pulse-glow' : ''
              }`}
              style={{ backgroundColor: 'currentColor' }}
            />
            <span className="text-xs text-muted-foreground">{statusText}</span>
          </div>
          {connectionStatus === 'connected' && config.host && (
            <p className="text-[10px] text-hint mt-1 truncate">
              {config.username}@{config.host}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
