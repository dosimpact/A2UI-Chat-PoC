const SURFACE_ID = 'default';

function buildMessageDefinitions() {
  return [
    {
      id: 'root-column',
      component: {
        Column: {
          children: {
            explicitList: ['title-heading', 'message-text', 'action-button'],
          },
        },
      },
    },
    {
      id: 'title-heading',
      component: {
        Text: {
          usageHint: 'h3',
          text: { literalString: 'A2UI Surface' },
        },
      },
    },
    {
      id: 'message-text',
      component: {
        Text: {
          text: { path: '/message' },
        },
      },
    },
    {
      id: 'action-button',
      component: {
        Button: {
          child: 'action-label',
          primary: true,
          action: {
            name: 'refresh_surface',
            context: [{ key: 'message', value: { path: '/message' } }],
          },
        },
      },
    },
    {
      id: 'action-label',
      component: {
        Text: {
          text: { literalString: 'Refresh' },
        },
      },
    },
  ];
}

function buildMessagePayload(surfaceMessage) {
  return [
    {
      beginRendering: {
        surfaceId: SURFACE_ID,
        root: 'root-column',
        styles: {
          primaryColor: '#334155',
          font: 'Inter',
        },
      },
    },
    {
      surfaceUpdate: {
        surfaceId: SURFACE_ID,
        components: buildMessageDefinitions(),
      },
    },
    {
      dataModelUpdate: {
        surfaceId: SURFACE_ID,
        path: '/',
        contents: [{ key: 'message', valueString: surfaceMessage }],
      },
    },
  ];
}

function extractMessage(payload) {
  if (typeof payload === 'string') {
    return payload.trim();
  }

  if (payload?.userAction && payload.userAction.name === 'refresh_surface') {
    if (payload.userAction.context?.message) {
      return payload.userAction.context.message;
    }
    return 'action-refresh';
  }

  if (payload?.message && typeof payload.message === 'string') {
    return payload.message.trim();
  }

  return '';
}

function hasFailure(payload) {
  return extractMessage(payload).toLowerCase().includes('fail');
}

export function buildSurfaceSummary(payload) {
  const normalized = extractMessage(payload);
  if (payload?.userAction?.name === 'refresh_surface') {
    return `Action surface: ${normalized || 'manual refresh'}`;
  }
  return `Echo surface: ${normalized || 'mock request'}`;
}

export function runMockA2UIMessageFlow(payload) {
  if (!payload) {
    throw new Error('empty payload');
  }

  if (hasFailure(payload)) {
    throw new Error('mock api failure');
  }

  const normalized = extractMessage(payload) || 'Hello from A2UI';
  const surfaceMessage =
    payload?.userAction?.name === 'refresh_surface'
      ? `Action surface: ${normalized}`
      : `Echo surface: ${normalized}`;

  return buildMessagePayload(surfaceMessage);
}
