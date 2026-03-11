import { NextResponse } from 'next/server';
import { buildSurfaceSummary, runMockA2UIMessageFlow } from '../../a2uiMessages';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request) {
  const body = await request.json();
  const { message, action } = body ?? {};
  const payload = action ?? message ?? '';

  if (
    !action &&
    (typeof message !== 'string' || message.trim() === '')
  ) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  await wait(80);

  try {
    const messages = runMockA2UIMessageFlow(payload);
    const summary = buildSurfaceSummary(payload);

    return NextResponse.json({
      messages,
      summary,
    });
  } catch (caught) {
    return NextResponse.json(
      { error: caught instanceof Error ? caught.message : 'unknown api error' },
      { status: 500 }
    );
  }
}
