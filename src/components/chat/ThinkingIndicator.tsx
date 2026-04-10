export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 animate-message-in">
      <div className="w-6 h-6 rounded-full border border-border bg-surface-elevated flex items-center justify-center shrink-0">
        <span className="text-[9px] font-semibold text-muted-foreground">AI</span>
      </div>
      <div className="flex items-center gap-1 px-2 py-2">
        <div className="w-1 h-1 rounded-full bg-muted-foreground animate-dot-1" />
        <div className="w-1 h-1 rounded-full bg-muted-foreground animate-dot-2" />
        <div className="w-1 h-1 rounded-full bg-muted-foreground animate-dot-3" />
      </div>
    </div>
  );
}
