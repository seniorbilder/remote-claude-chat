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
        <span className="text-[12px] italic text-muted-foreground">{message.content}</span>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className="flex gap-3 animate-message-in">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
          isUser ? 'border-border bg-surface' : 'border-border bg-surface-elevated'
        }`}
      >
        <span className="text-[9px] font-semibold text-muted-foreground">
          {isUser ? 'U' : 'AI'}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-[0.15em] text-hint font-medium mb-1">
          {isUser ? 'You' : 'Claude'}
        </p>

        {isUser ? (
          <div className="bg-surface border border-border rounded-md px-3.5 py-2.5 text-[13px] text-foreground leading-relaxed">
            {message.content}
          </div>
        ) : (
          <div className="text-[13px] text-foreground/85 leading-relaxed markdown-content">
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
                      className="bg-surface border border-border rounded px-1 py-0.5 text-[12px] font-mono"
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
