import { EmailTemplate } from '@/components/email/email-template';
import { CONTACT_EMAIL } from '@/config/site';
import { contactSchema } from '@/lib/contact-schema';
import { Resend } from 'resend';

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > RATE_LIMIT.max;
}

export async function POST(request: Request) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return Response.json({ error: 'not_configured' }, { status: 500 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
        return Response.json({ error: 'rate_limited' }, { status: 429 });
    }

    const parsed = contactSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
        return Response.json({ error: 'invalid_input' }, { status: 400 });
    }

    const { email, message, website } = parsed.data;
    if (website) {
        return Response.json({ success: true });
    }

    const name = parsed.data.name.replace(/\s+/g, ' ');
    try {
        const { error } = await new Resend(apiKey).emails.send({
            from: process.env.CONTACT_FROM_EMAIL ?? 'Weihang Li Portfolio <onboarding@resend.dev>',
            to: [process.env.CONTACT_TO_EMAIL ?? CONTACT_EMAIL],
            replyTo: email,
            subject: `来自 ${name} 的新消息`,
            react: EmailTemplate({ name, email, message }),
        });

        if (error) {
            console.error('[api/send] Resend error:', error);
            return Response.json({ error: 'send_failed' }, { status: 502 });
        }

        return Response.json({ success: true });
    } catch (err) {
        console.error('[api/send] Unexpected error:', err);
        return Response.json({ error: 'server_error' }, { status: 500 });
    }
}
