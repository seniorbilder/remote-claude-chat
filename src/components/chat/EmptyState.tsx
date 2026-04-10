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
      <Terminal className="w-10 h-10 text-hint/20 mb-5" strokeWidth={1.5} />
      <h2 className="text-base font-semibold text-foreground mb-1 tracking-tight">Claude Remote</h2>
      <p className="text-[13px] text-muted-foreground text-center max-w-sm mb-6 leading-relaxed">
        Send a message to Claude Code on your remote server via SSH.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="px-3 py-1.5 text-[12px] text-muted-foreground border border-border rounded-md hover:bg-surface hover:text-foreground transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
