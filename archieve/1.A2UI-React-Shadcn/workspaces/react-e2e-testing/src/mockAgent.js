const SURFACE_ID = 'default';

function buildBaseComponentIds() {
  return {
    root: 'root-column',
    title: 'title-heading',
    body: 'body-text',
    action: 'action-button',
    actionLabel: 'action-label',
  };
}

function buildSurfaceMessages(messageText) {
  const ids = buildBaseComponentIds();

  return [
    {
      beginRendering: {
        surfaceId: SURFACE_ID,
        root: ids.root,
        styles: {
          primaryColor: '#334155',
          font: 'Inter',
        },
      },
    },
    {
      surfaceUpdate: {
        surfaceId: SURFACE_ID,
        components: [
          {
            id: ids.root,
            component: {
              Column: {
                children: {
                  explicitList: [ids.title, ids.body, ids.action],
                },
              },
            },
          },
          {
            id: ids.title,
            component: {
              Text: {
                usageHint: 'h3',
                text: { literalString: 'A2UI Surface' },
              },
            },
          },
          {
            id: ids.body,
            component: {
              Text: {
                text: { path: '/message' },
              },
            },
          },
          {
            id: ids.action,
            component: {
              Button: {
                child: ids.actionLabel,
                primary: true,
                action: {
                  name: 'refresh_surface',
                  context: [
                    {
                      key: 'message',
                      value: { path: '/message' },
                    },
                  ],
                },
              },
            },
          },
          {
            id: ids.actionLabel,
            component: {
              Text: {
                text: { literalString: 'Refresh' },
              },
            },
          },
        ],
      },
    },
    {
      dataModelUpdate: {
        surfaceId: SURFACE_ID,
        path: '/',
        contents: [{ key: 'message', valueString: messageText }],
      },
    },
  ];
}

function extractMessageFromAction(actionMessage) {
  const userAction = actionMessage?.userAction;
  if (!userAction) {
    return null;
  }

  if (userAction.context && typeof userAction.context === 'object' && 'message' in userAction.context) {
    return userAction.context.message;
  }

  return null;
}

function normalizePayload(payload) {
  if (typeof payload === 'string') {
    return payload.trim();
  }

  if (payload && payload.userAction && payload.userAction.name === 'refresh_surface') {
    const contextMessage = extractMessageFromAction(payload);
    if (typeof contextMessage === 'string' && contextMessage.length > 0) {
      return contextMessage;
    }
    return 'action-refresh';
  }

  if (payload && payload.message && typeof payload.message === 'string') {
    return payload.message.trim();
  }

  return '';
}

function getFailureText(payload) {
  const text = normalizePayload(payload).toLowerCase();
  return text.includes('fail');
}

export async function runMockAction(payload) {
  await new Promise((resolve) => setTimeout(resolve, 120));

  if (!payload) {
    throw new Error('empty payload');
  }

  if (getFailureText(payload)) {
    throw new Error('mock flow failed');
  }

  const normalized = normalizePayload(payload);
  const messageText = normalized || 'Hello from A2UI';
  const prefix = payload?.userAction?.name === 'refresh_surface' ? 'Action surface: ' : 'Echo surface: ';

  return buildSurfaceMessages(`${prefix}${messageText}`);
}
