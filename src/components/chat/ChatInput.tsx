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
    <div className="border-t border-border bg-background/80 backdrop-blur-xl px-4 py-4">
      <div className="max-w-[760px] mx-auto">
        <div className="relative bg-card border border-border rounded-2xl focus-within:border-primary/30 focus-within:shadow-lg focus-within:shadow-primary/5 transition-all duration-300 card-glow">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatMe..."
            rows={1}
            className="w-full bg-transparent px-4 py-3.5 pr-14 text-sm text-foreground placeholder:text-hint resize-none focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            className="absolute right-2.5 bottom-2.5 w-8 h-8 flex items-center justify-center rounded-xl gradient-accent text-white shadow-md shadow-primary/20 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-20 disabled:shadow-none"
            aria-label="Send message"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-hint text-center mt-2.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
