export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-red-500 text-xl leading-none mt-0.5">⚠</span>
        <div>
          <p className="font-semibold text-red-800">Something went wrong</p>
          <p className="text-sm text-red-600 mt-1">{error?.message || 'Unknown error'}</p>
        </div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary self-start text-red-700 border-red-200 hover:bg-red-100">
          Try again
        </button>
      )}
    </div>
  );
}
