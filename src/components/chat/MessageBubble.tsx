import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '@/store/useAppStore';
import { CodeBlock } from './CodeBlock';

interface Props {
  message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
  if (message.role === 'system') {
    return (
      <div className="text-center py-2 animate-message-in">
        <span className="text-xs italic text-muted-foreground">{message.content}</span>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className="flex gap-3 animate-message-in">
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isUser ? 'bg-surface-elevated' : 'bg-primary/20'
        }`}
      >
        <span
          className={`text-[10px] font-bold ${
            isUser ? 'text-muted-foreground' : 'text-primary'
          }`}
        >
          {isUser ? 'U' : 'AI'}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {/* Label */}
        <p className="text-[10px] uppercase tracking-widest text-hint font-medium mb-1">
          {isUser ? 'You' : 'Claude'}
        </p>

        {/* Content */}
        {isUser ? (
          <div className="bg-surface-elevated border border-border rounded-xl px-4 py-3 text-sm text-foreground leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div className="text-sm text-foreground/90 leading-relaxed markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeStr = String(children).replace(/\n$/, '');
                  if (match || (codeStr.includes('\n') && !className)) {
                    return <CodeBlock language={match?.[1]}>{codeStr}</CodeBlock>;
                  }
                  return (
                    <code
                      className="bg-surface-elevated border border-border rounded px-1.5 py-0.5 text-xs font-mono text-primary"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre({ children }) {
                  return <>{children}</>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
