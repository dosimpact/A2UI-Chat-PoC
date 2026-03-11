'use client';

export default function CrashError({ error, reset }) {
  return (
    <main>
      <h2>Crash Boundary</h2>
      <p role="alert" data-testid="error-boundary-message">
        Error boundary fallback: {error.message}
      </p>
      <button type="button" onClick={reset}>
        Retry
      </button>
    </main>
  );
}
