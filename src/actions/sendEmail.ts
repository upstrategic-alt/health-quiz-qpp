"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  name: string;
  email: string;
  resultType: string;
}

export async function sendQuizResultEmail({ name, email, resultType }: SendEmailParams) {
  try {
    const isExpert = resultType === "Expert-Guided";
    
    const subject = isExpert
      ? "Your Personal Health Audit & Protocol Results"
      : "Your Metabolic Operating System Results Inside";

    const vslLink = isExpert 
      ? "https://go.fnnlx.com/portfolio" 
      : "https://go.fnnlx.com/launch";

    const htmlBody = isExpert 
      ? `
        <div style="font-family: sans-serif; color: #111;">
          <h2>Hi ${name},</h2>
          <p>Based on your answers, you are the <strong>Expert-Guided</strong> type.</p>
          <p>You execute flawlessly when you have expert guidance, but you second-guess yourself when left to figure things out alone.</p>
          <p>Because you need a personal analysis of your metabolic patterns and a custom roadmap designed for your specific life, I've prepared a VIP Audit specifically for you.</p>
          <p>Stop second-guessing and get the exact backup protocols designed for your unique circumstances.</p>
          <p><strong><a href="${vslLink}" style="color: #D4AF37;">Click here to access your VIP Audit Presentation</a></strong></p>
          <br />
          <p>Talk soon,</p>
          <p>Adeel</p>
        </div>
      `
      : `
        <div style="font-family: sans-serif; color: #111;">
          <h2>Hi ${name},</h2>
          <p>Based on your answers, you are the <strong>Independent Mastery</strong> type.</p>
          <p>You're great at implementation once you understand the complete system and the science behind it.</p>
          <p>Because you prefer learning the complete operating system once and then being self-sufficient, Karnivore Unlocked is the perfect fit.</p>
          <p>Get the complete knowledge base so you understand how to optimize your switchboard under any circumstances—no more rigid meal plans, just the science you need to troubleshoot it yourself.</p>
          <p><strong><a href="${vslLink}" style="color: #D4AF37;">Click here to access Karnivore Unlocked</a></strong></p>
          <br />
          <p>Talk soon,</p>
          <p>Adeel</p>
        </div>
      `;

    const { data, error } = await resend.emails.send({
      from: "Adeel <adeel@fnnlx.com>",
      to: email,
      subject: subject,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
