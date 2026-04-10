import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings } from 'lucide-react';
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
    connectionStatus === 'connected' ? 'bg-foreground' :
    connectionStatus === 'error' ? 'bg-destructive' : 'bg-hint';

  const statusText =
    connectionStatus === 'connected'
      ? `${config.username}@${config.host}`
      : 'Not connected';

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="hidden md:flex items-center justify-between border-b border-border px-6 h-11 shrink-0">
        <span className="text-[11px] font-display font-medium text-foreground uppercase tracking-[0.1em]">
          New Conversation
        </span>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          <span className="text-[10px] text-muted-foreground font-mono">{statusText}</span>
        </div>
        <button
          onClick={clearMessages}
          className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-surface uppercase tracking-wider"
        >
          <Plus className="w-3 h-3" />
          New
        </button>
      </div>

      {notConfigured ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Settings className="w-7 h-7 text-hint/15 mb-4" strokeWidth={1} />
          <h2 className="font-display text-sm font-bold text-foreground mb-1 uppercase tracking-[0.12em]">
            Configure Connection
          </h2>
          <p className="text-[12px] text-muted-foreground text-center max-w-xs mb-5">
            Set up SSH access in Settings to start chatting.
          </p>
          <Link
            to="/settings"
            className="px-5 py-2 bg-foreground text-background text-[11px] font-display font-bold uppercase tracking-[0.15em] rounded hover:bg-foreground/85 active:scale-[0.98] transition-all"
          >
            Settings
          </Link>
        </div>
      ) : messages.length === 0 && !isThinking ? (
        <EmptyState onSuggestion={handleSend} />
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-[720px] mx-auto px-6 py-6 space-y-5">
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
