export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 animate-message-in">
      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold text-primary">AI</span>
      </div>
      <div className="flex items-center gap-1 px-3 py-2">
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-dot-1" />
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-dot-2" />
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-dot-3" />
      </div>
    </div>
  );
}
