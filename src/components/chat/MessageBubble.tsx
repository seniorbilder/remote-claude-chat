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
      <div className="text-center py-3 animate-message-in">
        <span className="text-xs italic text-muted-foreground bg-secondary px-3 py-1 rounded-full border border-border">
          {message.content}
        </span>
      </div>
    );
  }

  const isUser = message.role === 'user';

  return (
    <div className="flex gap-3 animate-message-in">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isUser
            ? 'bg-secondary border border-border'
            : 'gradient-accent shadow-sm shadow-primary/20'
        }`}
      >
        <span className={`text-[9px] font-bold ${isUser ? 'text-muted-foreground' : 'text-white'}`}>
          {isUser ? 'U' : 'AI'}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[11px] font-medium mb-1.5 ${isUser ? 'text-muted-foreground' : 'text-primary'}`}>
          {isUser ? 'You' : 'ChatMe'}
        </p>

        {isUser ? (
          <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3 text-sm text-foreground leading-relaxed card-glow">
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
                      className="bg-secondary border border-border rounded-md px-1.5 py-0.5 text-xs font-mono text-primary"
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
