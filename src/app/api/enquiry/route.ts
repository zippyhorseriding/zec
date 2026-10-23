import type { NextRequest } from "next/server";
import { parseEnquiry } from "@/lib/enquiry";
import { consumeRateLimit } from "@/lib/rateLimit";

const MAX_BODY_BYTES = 16_000;
const UPSTREAM_TIMEOUT_MS = 15_000;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[enquiry] GOOGLE_SHEETS_WEBHOOK_URL is not configured");
    return json({ ok: false, error: "Enquiry service is not configured" }, 500);
  }

  const rateLimitKey = `enquiry:${getClientIp(request)}`;

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return json({ ok: false, error: "Could not read request body" }, 400);
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Request body is too large" }, 413);
  }

  let input: unknown;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return json({ ok: false, error: "Invalid JSON body" }, 400);
  }

  const parsed = parseEnquiry(input);
  if (!parsed.ok) {
    return json({ ok: false, error: "Please check the form fields", errors: parsed.errors }, 400);
  }

  // Honeypot triggered: silently accept and drop.
  if (parsed.value.honeypot) {
    return json({ ok: true });
  }

  // Only valid submissions count against the limit, so typos don't lock anyone out.
  if (!consumeRateLimit(rateLimitKey)) {
    return json(
      { ok: false, error: "Too many enquiries from this device. Please try again later." },
      429,
    );
  }

  const payload = {
    secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET ?? "",
    ...parsed.value.data,
    userAgent: request.headers.get("user-agent") ?? "",
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
      cache: "no-store",
      signal: controller.signal,
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      console.error("[enquiry] Webhook returned", upstream.status, text.slice(0, 500));
      return json({ ok: false, error: "Could not save your enquiry. Please try again." }, 502);
    }

    // Apps Script returns JSON from the webhook. Anything else means the
    // deployment is misconfigured (for example a Google sign-in page).
    let result: { ok?: boolean; error?: string; version?: string } | null = null;
    try {
      result = JSON.parse(text) as { ok?: boolean; error?: string; version?: string };
    } catch {
      console.error("[enquiry] Webhook response was not JSON", text.slice(0, 200));
    }

    if (!result || result.ok !== true) {
      console.error("[enquiry] Webhook rejected payload:", result?.error ?? "invalid response");
      return json({ ok: false, error: "Could not save your enquiry. Please try again." }, 502);
    }

    if (!result.version) {
      console.warn(
        "[enquiry] Webhook is running an older script version. Update the Apps Script deployment to the latest version.",
      );
    }

    return json({ ok: true });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    console.error("[enquiry] Webhook request failed:", timedOut ? "timeout" : error);
    return json(
      {
        ok: false,
        error: timedOut
          ? "The enquiry service timed out. Please try again."
          : "Could not send your enquiry. Please try again.",
      },
      502,
    );
  } finally {
    clearTimeout(timeout);
  }
}
