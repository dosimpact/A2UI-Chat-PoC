'use client';

import Link from 'next/link';
import { useSurface } from '../providers';

export default function DetailsPage() {
  const { surface, status, error } = useSurface();

  return (
    <main>
      <h2>Details Route</h2>
      <p data-testid="details-policy">
        Surface state persists while moving between Home and Details routes.
      </p>
      <div className="viewer" data-testid="details-viewer">
        {surface}
      </div>
      <p data-testid="details-status">Status: {status}</p>
      {error ? (
        <p className="alert" data-testid="details-error">
          {error}
        </p>
      ) : null}
      <Link href="/">Back to Home</Link>
    </main>
  );
}
