import ThrowOnRender from '../../components/ThrowOnRender';

export default function CrashPage({ searchParams }) {
  if (searchParams.mode === 'throw') {
    return <ThrowOnRender />;
  }

  return <p>Crash page loaded without throwing.</p>;
}
