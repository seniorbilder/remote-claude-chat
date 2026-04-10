import { Terminal } from 'lucide-react';

interface Props {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  'Explain this codebase',
  'Find all TODO comments',
  'Refactor the auth module',
];

export function EmptyState({ onSuggestion }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <Terminal className="w-8 h-8 text-hint/15 mb-5" strokeWidth={1} />
      <h2 className="font-display text-base font-bold text-foreground mb-1 tracking-[0.12em] uppercase">
        ChatMe
      </h2>
      <p className="text-[12px] text-muted-foreground text-center max-w-xs mb-7 leading-relaxed">
        Send a message to Claude Code on your remote server via SSH.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="px-3 py-1.5 text-[11px] text-muted-foreground border border-border rounded hover:bg-surface hover:text-foreground transition-colors uppercase tracking-wider"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
