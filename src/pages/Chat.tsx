import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings, Zap } from 'lucide-react';
import useAppStore from '@/store/useAppStore';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ThinkingIndicator } from '@/components/chat/ThinkingIndicator';
import { EmptyState } from '@/components/chat/EmptyState';
import { ChatInput } from '@/components/chat/ChatInput';

export default function ChatPage() {
  const {
    messages, isThinking, addMessage, setIsThinking, appendToLastAssistant,
    clearMessages, connectionStatus, configSaved, config,
  } = useAppStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const simulateResponse = (userMessage: string) => {
    setIsThinking(true);
    const response = `I received your message: "${userMessage}"\n\nThis is a simulated response from Claude Code. In production, this would be output from Claude Code CLI on your remote server via SSH.\n\n\`\`\`typescript\nconst greeting = "Hello from the remote server!";\nconsole.log(greeting);\n\`\`\`\n\nThe response streams in real-time as Claude processes your request.`;

    setTimeout(() => {
      setIsThinking(false);
      addMessage({ role: 'assistant', content: '' });
      let i = 0;
      const chars = response.split('');
      const interval = setInterval(() => {
        if (i < chars.length) {
          const size = Math.floor(Math.random() * 4) + 1;
          appendToLastAssistant(chars.slice(i, i + size).join(''));
          i += size;
        } else {
          clearInterval(interval);
        }
      }, 12);
    }, 1200);
  };

  const handleSend = (content: string) => {
    addMessage({ role: 'user', content });
    simulateResponse(content);
  };

  const notConfigured = !configSaved;

  const statusDot =
    connectionStatus === 'connected' ? 'bg-success' :
    connectionStatus === 'error' ? 'bg-destructive' : 'bg-hint';

  const statusText =
    connectionStatus === 'connected'
      ? `${config.username}@${config.host}`
      : 'Not connected';

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="hidden md:flex items-center justify-between border-b border-border px-6 h-14 shrink-0">
        <span className="text-sm font-semibold text-foreground">New Conversation</span>
        <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
          <div className={`w-2 h-2 rounded-full ${statusDot}`} />
          <span className="text-[11px] text-muted-foreground font-mono">{statusText}</span>
        </div>
        <button
          onClick={clearMessages}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary"
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </button>
      </div>

      {notConfigured ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2 tracking-tight">Configure Connection</h2>
          <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
            Set up SSH access in Settings to start chatting with Claude Code on your remote server.
          </p>
          <Link
            to="/settings"
            className="px-6 py-3 gradient-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200"
          >
            Go to Settings
          </Link>
        </div>
      ) : messages.length === 0 && !isThinking ? (
        <EmptyState onSuggestion={handleSend} />
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-[760px] mx-auto px-6 py-6 space-y-6">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isThinking && <ThinkingIndicator />}
          </div>
        </div>
      )}

      {!notConfigured && <ChatInput onSend={handleSend} disabled={isThinking} />}
    </div>
  );
}
