import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json();
    
    const result = await sendEmail({
      to: to || 'harry.gamon@outlook.com',
      subject: subject || 'Test Email from Social App',
      html: html || '<p>This is a test email from your Social app!</p>'
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Email sent successfully',
        data: result.data 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send email' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in test-email route:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 