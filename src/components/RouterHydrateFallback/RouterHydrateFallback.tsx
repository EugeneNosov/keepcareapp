export default function RouterHydrateFallback() {
  return (
    <div
      aria-live="polite"
      className="grid min-h-screen place-items-center bg-app text-[10px] tracking-[0.1em] text-text-muted uppercase"
      role="status"
    >
      Loading...
    </div>
  );
}
