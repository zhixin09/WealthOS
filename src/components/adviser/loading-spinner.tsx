export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-zinc-400">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-primary" />
      {label ? (
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      ) : null}
    </div>
  );
}
