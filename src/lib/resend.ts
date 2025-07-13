import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY || 're_dADWfsPi_5s721x8DSB88MgCt69assjjW');

export const sendEmail = async ({
  to,
  subject,
  html,
  from = 'onboarding@resend.dev'
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) => {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}; 