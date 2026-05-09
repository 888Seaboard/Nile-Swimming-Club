// app/api/email/send/route.ts
// Temporary minimal email API for Nile Swimming Club landing page.
// Removes all Supabase admin usage so we don't need SUPABASE_SERVICE_ROLE_KEY.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendTransactionalEmail, EmailType } from '@/services/emailService';

interface SendEmailRequest {
  type: EmailType;
  to?: string;
  userId?: string;
  data: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key');
    const expectedKey =
      process.env.INTERNAL_API_KEY || process.env.RESEND_API_KEY;

    if (!apiKey || apiKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SendEmailRequest = await request.json();
    const { type, to, data } = body;

    // 暫時要求一定要有 to，唔再用 userId 查 DB
    if (!type || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: type and to' },
        { status: 400 },
      );
    }

    // 如有需要，自行在 data 裏面補 firstName（可選）
    if (!data.firstName && to) {
      const emailName = to.split('@')[0];
      const firstName =
        emailName.charAt(0).toUpperCase() +
        emailName.slice(1).split(/[._-]/)[0];
      data.firstName = firstName;
    }

    const result = await sendTransactionalEmail(type, to, data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, success: false },
        { status: 500 },
      );
    }

    // 暫時不再寫 user_email_log
    return NextResponse.json({
      success: true,
      emailId: result.emailId,
    });
  } catch (error) {
    console.error('[Email API] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}