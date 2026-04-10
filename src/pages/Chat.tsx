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
    messages,
    isThinking,
    addMessage,
    setIsThinking,
    appendToLastAssistant,
    clearMessages,
    connectionStatus,
    configSaved,
    config,
  } = useAppStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const simulateResponse = (userMessage: string) => {
    setIsThinking(true);

    // Simulate streaming response
    const response = `I received your message: "${userMessage}"\n\nThis is a simulated response from Claude Code. In a production setup, this would be the actual output from Claude Code CLI running on your remote server via SSH.\n\n\`\`\`typescript\n// Example code output\nconst greeting = "Hello from the remote server!";\nconsole.log(greeting);\n\`\`\`\n\nThe response would stream in real-time as Claude processes your request.`;

    setTimeout(() => {
      setIsThinking(false);
      addMessage({ role: 'assistant', content: '' });

      // Simulate streaming chunks
      let i = 0;
      const chunks = response.split('');
      const interval = setInterval(() => {
        if (i < chunks.length) {
          const chunkSize = Math.floor(Math.random() * 4) + 1;
          appendToLastAssistant(chunks.slice(i, i + chunkSize).join(''));
          i += chunkSize;
        } else {
          clearInterval(interval);
        }
      }, 15);
    }, 1500);
  };

  const handleSend = (content: string) => {
    addMessage({ role: 'user', content });
    simulateResponse(content);
  };

  const notConfigured = !configSaved;

  const statusColor =
    connectionStatus === 'connected'
      ? 'bg-success'
      : connectionStatus === 'error'
      ? 'bg-destructive'
      : 'bg-hint';

  const statusText =
    connectionStatus === 'connected'
      ? `Connected to ${config.username}@${config.host}`
      : connectionStatus === 'not_configured'
      ? 'Not connected'
      : 'Disconnected';

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="hidden md:flex items-center justify-between border-b border-border px-6 h-14 shrink-0">
        <span className="text-sm font-medium text-foreground">New Conversation</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="text-xs text-muted-foreground">{statusText}</span>
        </div>
        <button
          onClick={clearMessages}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-surface"
        >
          <Plus className="w-3.5 h-3.5" />
          New Chat
        </button>
      </div>

      {notConfigured ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Settings className="w-10 h-10 text-hint/30 mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-1">Configure your connection</h2>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
            Set up your SSH connection in Settings to start chatting with Claude Code on your remote server.
          </p>
          <Link
            to="/settings"
            className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
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

      {!notConfigured && (
        <ChatInput onSend={handleSend} disabled={isThinking} />
      )}
    </div>
  );
}
