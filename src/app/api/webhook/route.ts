import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, ensurePurchasesTable } from '@/lib/supabase';
import crypto from 'crypto';

// ─── Lemon Squeezy Webhook Handler ──────────────────────────────────
// Receives order_created (and other) events from Lemon Squeezy,
// verifies the HMAC signature, and stores purchase data in Supabase.
// ─────────────────────────────────────────────────────────────────────

export const runtime = 'nodejs'; // Required for crypto.createHmac

/**
 * Verify the X-Signature header from Lemon Squeezy.
 * Returns true if the HMAC-SHA256 hex digest matches.
 */
function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(rawBody).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  let rawBody = '';

  try {
    // 1. Read raw body for signature verification
    rawBody = await request.text();

    // 2. Retrieve the webhook secret
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('[Webhook] LEMON_SQUEEZY_WEBHOOK_SECRET is not set.');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // 3. Verify HMAC signature from Lemon Squeezy
    const signature = request.headers.get('x-signature') || '';
    if (!signature) {
      console.warn('[Webhook] Missing X-Signature header.');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    const isValid = verifySignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.warn('[Webhook] Invalid signature — rejecting request.');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 4. Parse the JSON payload
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error('[Webhook] Failed to parse JSON body.');
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    // 5. Extract the event name
    const meta = payload.meta as Record<string, unknown> | undefined;
    const eventName = meta?.event_name as string | undefined;

    console.log(`[Webhook] Received event: ${eventName}`);

    // 6. Only process order_created events
    if (eventName !== 'order_created') {
      // Acknowledge but don't process other events
      return NextResponse.json({ received: true, event: eventName });
    }

    // 7. Extract order data from the payload
    const data = payload.data as Record<string, unknown> | undefined;
    const attributes = data?.attributes as Record<string, unknown> | undefined;

    if (!attributes) {
      console.error('[Webhook] Missing data.attributes in payload.');
      return NextResponse.json(
        { error: 'Missing order attributes' },
        { status: 400 }
      );
    }

    // Extract customer and order information
    const customerName =
      (attributes.user_name as string) ||
      (attributes.customer_name as string) ||
      `${(attributes.first_name as string) || ''} ${(attributes.last_name as string) || ''}`.trim() ||
      'Unknown';
    const customerEmail =
      (attributes.user_email as string) ||
      (attributes.customer_email as string) ||
      '';
    const orderNumber =
      (attributes.order_number as number | string)?.toString() || '';
    const lemonOrderId = (data?.id as string) || '';
    const totalFormatted = (attributes.total_formatted as string) || '';
    const total = (attributes.total as number) || 0;
    const currency = (attributes.currency as string) || 'USD';
    const status = (attributes.status as string) || 'paid';

    // Extract first line item details if available
    const firstOrderItem = (
      (attributes.first_order_item as Record<string, unknown>) || {}
    );
    const variantId = (firstOrderItem.variant_id as string) || '';
    const productName = (firstOrderItem.product_name as string) || '';

    // Generate a unique internal order ID
    const internalOrderId = `FA-${currency}-${Date.now().toString().slice(-6)}-${orderNumber || Math.floor(1000 + Math.random() * 9000)}`;

    // 8. Ensure the purchases table exists
    await ensurePurchasesTable();

    // 9. Insert the purchase record into Supabase
    const admin = getSupabaseAdmin();
    const { error: insertError } = await admin.from('purchases').insert([
      {
        order_id: internalOrderId,
        customer_name: customerName,
        customer_email: customerEmail,
        phone: null, // Not available from Lemon Squeezy webhook
        country: null, // Not available from Lemon Squeezy webhook
        payment_method: 'lemon_squeezy',
        transaction_id: orderNumber,
        amount: total / 100, // Lemon Squeezy sends amounts in cents
        currency: currency.toUpperCase(),
        status: status === 'paid' ? 'completed' : status,
        lemon_order_id: lemonOrderId,
        variant_id: variantId?.toString() || null,
        product_name: productName,
        raw_payload: payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error('[Webhook] Failed to insert purchase:', insertError.message);
      // Return 200 anyway so Lemon Squeezy doesn't retry indefinitely
      // The error is logged for debugging
      return NextResponse.json({
        received: true,
        warning: 'Purchase logged with errors',
        detail: insertError.message,
      });
    }

    console.log(
      `[Webhook] ✅ Purchase saved — Order: ${internalOrderId}, ` +
      `Customer: ${customerName} (${customerEmail}), ` +
      `Amount: ${totalFormatted || `${total / 100} ${currency}`}`
    );

    return NextResponse.json({
      received: true,
      orderId: internalOrderId,
      message: 'Purchase recorded successfully',
    });
  } catch (error: unknown) {
    // Global catch — ensure the webhook NEVER crashes
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Webhook] Unhandled error:', message);

    // Return 200 to prevent Lemon Squeezy from retrying on server errors
    // The error is logged so it can be investigated
    return NextResponse.json(
      {
        received: true,
        warning: 'Processed with errors',
        error: message,
      },
      { status: 200 }
    );
  }
}

// Health check — useful for verifying the endpoint is reachable
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'Lemon Squeezy Webhook',
    timestamp: new Date().toISOString(),
  });
}
