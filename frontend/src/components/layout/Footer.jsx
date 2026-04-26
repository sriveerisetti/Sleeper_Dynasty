export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-white/5 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏆</span>
            <span className="text-warm-300 font-display text-lg tracking-wider">Dynasty Daddies</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-warm-600">
            <span>© {new Date().getFullYear()}</span>
            <span className="w-px h-4 bg-warm-800" />
            <span>
              Powered by{' '}
              <a
                href="https://docs.sleeper.com/"
                target="_blank"
                rel="noreferrer"
                className="text-warm-400 hover:text-warm-200 transition-colors"
              >
                Sleeper API
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
