'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  A2UIProvider,
  A2UIRenderer,
  initializeDefaultCatalog,
  useA2UIActions,
} from '@a2ui/react';
import { useSurface } from '../app/providers';

initializeDefaultCatalog();

function getSurfaceLabels(actions) {
  return Array.from(actions.getSurfaces().keys());
}

function ChatSurfaceContent({ actionHandlerRef }) {
  const [input, setInput] = useState('');
  const { surface, setSurface, status, setStatus, error, setError, hydrated } = useSurface();
  const sendAndProcessRef = useRef(null);
  const { processMessages, clearSurfaces, getSurfaces } = useA2UIActions();

  const surfaceIds = getSurfaceLabels({ getSurfaces });
  const hasSurfaces = surfaceIds.length > 0;

  const sendAndProcess = useCallback(
    async (payload) => {
      try {
        setStatus('loading');
        setError('');
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(
            typeof payload === 'string' ? { message: payload } : { action: payload }
          ),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'unknown api error');
        }

        clearSurfaces();
        processMessages(result.messages);
        setSurface(result.summary);
        setStatus('idle');
      } catch (caught) {
        clearSurfaces();
        setSurface('Unable to render surface');
        setStatus('error');
        setError(`Fallback active: ${caught.message}`);
      }
    },
    [processMessages, clearSurfaces, setError, setSurface, setStatus]
  );

  useEffect(() => {
    sendAndProcessRef.current = sendAndProcess;
  }, [sendAndProcess]);

  useEffect(() => {
    actionHandlerRef.current = (actionMessage) => {
      if (sendAndProcessRef.current) {
        void sendAndProcess(actionMessage);
      }
    };
  }, [actionHandlerRef, sendAndProcess]);

  const onSubmit = useCallback(
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
    <section>
      <p data-testid="hydration-status">{hydrated ? 'hydrated' : 'ssr'}</p>
      <p data-testid="status">Status: {status}</p>
      <p data-testid="persistence-policy">
        Persistence policy: keep surface state during route transitions in the same tab.
      </p>
      <div className="viewer" data-testid="viewer-surface">
        {hasSurfaces ? (
          <div>
            {surfaceIds.map((surfaceId) => (
              <A2UIRenderer key={surfaceId} surfaceId={surfaceId} />
            ))}
          </div>
        ) : (
          <p>{surface}</p>
        )}
      </div>
      {error ? (
        <p className="alert" role="alert" data-testid="fallback-message">
          {error}
        </p>
      ) : null}
      <form onSubmit={onSubmit}>
        <label htmlFor="message-input">Message</label>
        <input
          id="message-input"
          data-testid="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}

export default function ChatSurface() {
  const actionHandlerRef = useRef(null);
  const handleAction = useCallback(
    (actionMessage) => {
      if (!actionHandlerRef.current) {
        return;
      }
      actionHandlerRef.current(actionMessage);
    },
    []
  );

  return (
    <A2UIProvider onAction={handleAction}>
      <ChatSurfaceContent actionHandlerRef={actionHandlerRef} />
    </A2UIProvider>
  );
}
