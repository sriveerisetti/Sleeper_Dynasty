import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-8xl text-warm-300 leading-none">404</p>
      <h1 className="text-3xl mt-4 mb-3">Page Not Found</h1>
      <p className="text-ink-500 max-w-sm mb-8">
        We can't find that page. Maybe it got traded to another division?
      </p>
      <Link to="/" className="btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
