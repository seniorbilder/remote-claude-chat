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
      <Terminal className="w-12 h-12 text-hint/30 mb-4" />
      <h2 className="text-lg font-semibold text-foreground mb-1">Claude Remote Chat</h2>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
        Send a message to Claude Code running on your remote server. Your messages are sent via SSH — nothing leaves your infrastructure.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="px-3 py-1.5 text-xs text-muted-foreground bg-surface border border-border rounded-lg hover:bg-surface-elevated hover:text-foreground transition-all hover:scale-[1.02]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
