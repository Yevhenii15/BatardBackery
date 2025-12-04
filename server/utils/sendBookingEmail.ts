// server/utils/sendBookingEmail.ts
import Booking from "../models/Booking";
import { useRuntimeConfig } from "#imports";
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";

const brevo = new TransactionalEmailsApi();

// helper to initialise once
function initBrevo() {
  const config = useRuntimeConfig();
  if (config.brevoApiKey) {
    brevo.setApiKey(
      TransactionalEmailsApiApiKeys.apiKey,
      config.brevoApiKey as string
    );
  } else {
    console.error("[Brevo] Missing BREVO_API_KEY");
  }
}

let brevoInitialised = false;

export async function sendBookingConfirmationEmail(bookingId: string) {
  const booking = await Booking.findById(bookingId).lean();
  if (!booking) return;

  if (!brevoInitialised) {
    initBrevo();
    brevoInitialised = true;
  }

  const config = useRuntimeConfig();

  const customerName = `${booking.customer.firstName} ${booking.customer.lastName}`;
  const subject = `Your Batard Bakery booking #${booking.bookingNumber}`;

  const pickupsHtml = booking.pickups
    .map(
      (p: any, idx: number) => `
      <tr>
        <td style="padding:4px 8px;">Pickup ${idx + 1}</td>
        <td style="padding:4px 8px;">${p.categoryName}</td>
        <td style="padding:4px 8px;">${p.date} · ${p.timeSlot}</td>
        <td style="padding:4px 8px;">${p.orderNotes || "-"}</td>
      </tr>
    `
    )
    .join("");

  const itemsHtml = booking.items
    .map(
      (item: any) => `
      <tr>
        <td style="padding:4px 8px;">${item.name}</td>
        <td style="padding:4px 8px; text-align:center;">${item.quantity}</td>
        <td style="padding:4px 8px; text-align:right;">${item.price.toFixed(
          2
        )} DKK</td>
        <td style="padding:4px 8px; text-align:right;">${item.subtotalPrice.toFixed(
          2
        )} DKK</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; color:#111; font-size:14px;">
      <h2 style="color:#333;">Thank you for your booking, ${customerName}!</h2>
      <p>Your booking number is <strong>${booking.bookingNumber}</strong>.</p>

      <h3 style="margin-top:20px;">Customer</h3>
      <p>
        <strong>Name:</strong> ${customerName}<br/>
        <strong>Phone:</strong> ${booking.customer.phone}<br/>
        <strong>Email:</strong> ${booking.customer.email}
      </p>

      <h3 style="margin-top:20px;">Pickup time(s)</h3>
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:100%; max-width:600px;">
        <thead>
          <tr>
            <th align="left" style="padding:4px 8px; border-bottom:1px solid #ddd;">#</th>
            <th align="left" style="padding:4px 8px; border-bottom:1px solid #ddd;">Category</th>
            <th align="left" style="padding:4px 8px; border-bottom:1px solid #ddd;">When</th>
            <th align="left" style="padding:4px 8px; border-bottom:1px solid #ddd;">Notes</th>
          </tr>
        </thead>
        <tbody>
          ${pickupsHtml}
        </tbody>
      </table>

      <h3 style="margin-top:20px;">Items</h3>
      <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; width:100%; max-width:600px;">
        <thead>
          <tr>
            <th align="left" style="padding:4px 8px; border-bottom:1px solid #ddd;">Product</th>
            <th align="center" style="padding:4px 8px; border-bottom:1px solid #ddd;">Qty</th>
            <th align="right" style="padding:4px 8px; border-bottom:1px solid #ddd;">Price</th>
            <th align="right" style="padding:4px 8px; border-bottom:1px solid #ddd;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <p style="margin-top:15px; font-size:15px;">
        <strong>Total:</strong> ${booking.totalPrice.toFixed(2)} DKK
      </p>

      <p style="margin-top:20px;">
        We look forward to seeing you at Batard Bakery.
      </p>
    </div>
  `;

  await brevo.sendTransacEmail({
    to: [{ email: booking.customer.email, name: customerName }],
    bcc: config.brevoBcc ? [{ email: config.brevoBcc as string }] : undefined,
    sender: {
      email: config.brevoFromEmail as string,
      name: config.brevoFromName as string,
    },
    subject,
    htmlContent: html,
  });
}
