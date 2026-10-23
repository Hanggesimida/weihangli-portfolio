import { EmailTemplate } from '@/components/email/email-template';
import { CONTACT_EMAIL } from '@/config/site';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 254, message: 5000 } as const;

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
    recent.push(now);
    hits.set(ip, recent);
    return recent.length > RATE_LIMIT.max;
}

function parseBody(body: unknown) {
    if (typeof body !== 'object' || body === null) return null;
    const { name, email, message, website } = body as Record<string, unknown>;
    if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') return null;

    const data = {
        name: name.replace(/\s+/g, ' ').trim(),
        email: email.trim(),
        message: message.trim(),
    };
    if (!data.name || data.name.length > LIMITS.name) return null;
    if (data.email.length > LIMITS.email || !EMAIL_RE.test(data.email)) return null;
    if (!data.message || data.message.length > LIMITS.message) return null;

    return { data, isBot: typeof website === 'string' && website.length > 0 };
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

    const parsed = parseBody(await request.json().catch(() => null));
    if (!parsed) {
        return Response.json({ error: 'invalid_input' }, { status: 400 });
    }
    if (parsed.isBot) {
        return Response.json({ success: true });
    }

    const { name, email, message } = parsed.data;
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
