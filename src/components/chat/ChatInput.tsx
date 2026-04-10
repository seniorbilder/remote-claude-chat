import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background px-4 py-4">
      <div className="max-w-[760px] mx-auto">
        <div className="relative bg-surface border border-border rounded-md focus-within:border-muted-foreground transition-colors">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Claude..."
            rows={1}
            className="w-full bg-transparent px-3 py-2.5 pr-11 text-[13px] text-foreground placeholder:text-hint resize-none focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="absolute right-2 bottom-2 w-7 h-7 flex items-center justify-center rounded bg-foreground text-background transition-all hover:bg-foreground/85 disabled:opacity-20"
            aria-label="Send message"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-hint text-center mt-1.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
