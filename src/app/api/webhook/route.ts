import { POST as lemonsqueezyPOST } from '../webhooks/lemonsqueezy/route';

export async function POST(request: Request) {
  return lemonsqueezyPOST(request);
}

export async function GET() {
  return Response.json({
    status: 'ok',
    endpoint: 'Lemon Squeezy Webhook (Legacy Forwarder)',
    timestamp: new Date().toISOString(),
  });
}
