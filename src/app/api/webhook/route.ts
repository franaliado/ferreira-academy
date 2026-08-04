import { POST as paypalPOST, GET as paypalGET } from '../webhooks/paypal/route';

export async function POST(request: Request) {
  return paypalPOST(request);
}

export async function GET() {
  return paypalGET();
}
