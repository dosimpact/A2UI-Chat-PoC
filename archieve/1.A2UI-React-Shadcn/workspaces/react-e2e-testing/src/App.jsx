import { useCallback, useEffect, useRef, useState } from 'react';
import { A2UIProvider, A2UIRenderer, initializeDefaultCatalog, useA2UIActions } from '@a2ui/react';
import { runMockAction } from './mockAgent.js';

const PLACEHOLDER = 'Viewer placeholder surface';

function getLatestLabel(messages) {
  const latest = messages.at(-1);
  const dataModel = latest && latest.dataModelUpdate;
  if (!dataModel) return PLACEHOLDER;
  const messageValue = dataModel.contents?.find((entry) => entry.key === 'message');
  if (!messageValue) return PLACEHOLDER;

  return messageValue.valueString ?? messageValue.valueNumber?.toString() ?? PLACEHOLDER;
}

function AppShell({ actionHandlerRef }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [surfaceSummary, setSurfaceSummary] = useState(PLACEHOLDER);
  const { clearSurfaces, getSurfaces, processMessages } = useA2UIActions();
  const sendAndProcessRef = useRef(null);

  const surfaceEntries = Array.from(getSurfaces().keys());
  const hasSurfaces = surfaceEntries.length > 0;

  const sendAndProcess = useCallback(
    async (payload) => {
      try {
        setStatus('loading');
        setError('');
        const response = await runMockAction(payload);
        clearSurfaces();
        processMessages(response);
        setSurfaceSummary(getLatestLabel(response));
        setStatus('idle');
      } catch (caught) {
        clearSurfaces();
        setSurfaceSummary('Unable to render surface');
        setError(`Fallback state active: ${caught.message}`);
        setStatus('error');
      }
    },
    [clearSurfaces, processMessages]
  );

  useEffect(() => {
    sendAndProcessRef.current = sendAndProcess;
  }, [sendAndProcess]);

  useEffect(() => {
    actionHandlerRef.current = (actionMessage) => {
      if (sendAndProcessRef.current) {
        void sendAndProcessRef.current(actionMessage);
      }
    };
  }, [actionHandlerRef, sendAndProcess]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const message = input.trim();
      if (!message) {
        return;
      }
      setInput('');
      void sendAndProcess(message);
    },
    [input, sendAndProcess]
  );

  return (
    <main>
      <h1>React Consumer Lane</h1>
      <p data-testid="status">Status: {status}</p>
      <section aria-label="viewer">
        <h2>Viewer</h2>
        <div data-testid="viewer-surface">
          {hasSurfaces ? (
            <div>
              {surfaceEntries.map((surfaceId) => (
                <A2UIRenderer key={surfaceId} surfaceId={surfaceId} />
              ))}
            </div>
          ) : (
            surfaceSummary
          )}
        </div>
      </section>
      {error ? (
        <p role="alert" data-testid="fallback-message">
          {error}
        </p>
      ) : null}
      <form onSubmit={handleSubmit}>
        <label htmlFor="chat-input">Message</label>
        <input
          id="chat-input"
          data-testid="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}

export default function App() {
  const actionHandlerRef = useRef(null);
  const handleAction = useCallback((actionMessage) => {
    if (!actionHandlerRef.current) {
      return;
    }
    actionHandlerRef.current(actionMessage);
  }, []);

  initializeDefaultCatalog();

  return (
    <A2UIProvider onAction={handleAction}>
      <AppShell actionHandlerRef={actionHandlerRef} />
    </A2UIProvider>
  );
}
