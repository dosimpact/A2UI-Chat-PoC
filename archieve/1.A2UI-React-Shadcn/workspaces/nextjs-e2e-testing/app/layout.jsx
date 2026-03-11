import Link from 'next/link';
import './globals.css';
import { SurfaceProvider } from './providers';

export const metadata = {
  title: 'Next.js E2E Consumer Lane'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SurfaceProvider>
          <div className="layout">
            <header>
              <h1>Next.js Consumer Lane</h1>
              <nav className="nav">
                <Link href="/">Home</Link>
                <Link href="/details">Details</Link>
                <Link href="/crash?mode=throw">Crash Route</Link>
              </nav>
            </header>
            {children}
          </div>
        </SurfaceProvider>
      </body>
    </html>
  );
}
