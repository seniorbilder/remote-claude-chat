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
      <div className="hidden md:flex items-center justify-between border-b border-border px-6 h-12 shrink-0">
        <span className="text-[13px] font-medium text-foreground">New Conversation</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          <span className="text-[11px] text-muted-foreground font-mono">{statusText}</span>
        </div>
        <button
          onClick={clearMessages}
          className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-surface"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </button>
      </div>

      {notConfigured ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Settings className="w-8 h-8 text-hint/20 mb-4" strokeWidth={1.5} />
          <h2 className="text-base font-semibold text-foreground mb-1 tracking-tight">
            Configure connection
          </h2>
          <p className="text-[13px] text-muted-foreground text-center max-w-sm mb-5">
            Set up SSH access in Settings to start chatting with Claude Code.
          </p>
          <Link
            to="/settings"
            className="px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-md hover:bg-foreground/90 active:scale-[0.98] transition-all"
          >
            Go to Settings
          </Link>
        </div>
      ) : messages.length === 0 && !isThinking ? (
        <EmptyState onSuggestion={handleSend} />
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-[760px] mx-auto px-6 py-6 space-y-5">
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
