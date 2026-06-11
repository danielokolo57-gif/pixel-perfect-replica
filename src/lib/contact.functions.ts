import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a little more (10+ chars)").max(1000),
});

export type ContactInput = z.infer<typeof ContactSchema>;

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ContactSchema.parse(data))
  .handler(async ({ data }) => {
    // Server-side log; in production wire to email or DB.
    console.log("[contact] new message", {
      name: data.name,
      email: data.email,
      preview: data.message.slice(0, 80),
      at: new Date().toISOString(),
    });
    // Simulate small server-side latency
    await new Promise((r) => setTimeout(r, 250));
    return { ok: true as const, receivedAt: new Date().toISOString() };
  });
