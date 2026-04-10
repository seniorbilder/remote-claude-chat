import { Terminal, Sparkles } from 'lucide-react';

interface Props {
  onSuggestion: (text: string) => void;
}

const suggestions = [
  { text: 'Explain this codebase', emoji: '📖' },
  { text: 'Find all TODO comments', emoji: '🔍' },
  { text: 'Refactor the auth module', emoji: '🔧' },
];

export function EmptyState({ onSuggestion }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
        <Sparkles className="w-7 h-7 text-white" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">
        Welcome to ChatMe
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-8 leading-relaxed">
        Send a message to Claude Code on your remote server. Everything runs via SSH — nothing leaves your infrastructure.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((s) => (
          <button
            key={s.text}
            onClick={() => onSuggestion(s.text)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground bg-card border border-border rounded-xl hover:bg-secondary hover:text-foreground hover:border-primary/20 transition-all duration-200 card-glow"
          >
            <span>{s.emoji}</span>
            <span>{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
