export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 animate-message-in">
      <div className="w-7 h-7 rounded-full gradient-accent flex items-center justify-center shrink-0 shadow-sm shadow-primary/20">
        <span className="text-[9px] font-bold text-white">AI</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-2 bg-card rounded-xl border border-border">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-dot-1" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-dot-2" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-dot-3" />
      </div>
    </div>
  );
}
