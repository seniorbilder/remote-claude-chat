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
        <div className="relative bg-surface border border-border rounded-xl focus-within:border-primary transition-all focus-within:shadow-glow">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Claude on your remote server..."
            rows={1}
            className="w-full bg-transparent px-4 py-3 pr-12 text-sm text-foreground placeholder:text-hint resize-none focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
            aria-label="Send message"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-hint text-center mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
