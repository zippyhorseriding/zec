export const FORM_TYPES = ["contact", "franchise"] as const;
export type FormType = (typeof FORM_TYPES)[number];

export interface EnquiryPayload {
  formType: FormType;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  interest: string;
  city: string;
  landStatus: string;
  message: string;
  source: string;
  submittedAt: string;
}

interface ParsedEnquiry {
  data: EnquiryPayload;
  honeypot: boolean;
}

type ParseResult =
  | { ok: true; value: ParsedEnquiry }
  | { ok: false; errors: Record<string, string> };

const LIMITS = {
  name: 120,
  email: 200,
  phone: 30,
  interest: 120,
  city: 120,
  landStatus: 160,
  message: 4000,
  source: 500,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COUNTRY_CODE_PATTERN = /^\+\d{1,4}$/;

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Collapse horizontal whitespace and trim. Used for short, single-line fields. */
function readLine(value: unknown): string {
  return readString(value).replace(/[^\S\r\n]+/g, " ").trim();
}

/** Preserve paragraph breaks while normalising Windows line endings and trailing space. */
function readMultiline(value: unknown): string {
  return readString(value)
    .replace(/\r\n?/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isFormType(value: string): value is FormType {
  return (FORM_TYPES as readonly string[]).includes(value);
}

export function parseEnquiry(input: unknown): ParseResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: { form: "Invalid request body" } };
  }

  const body = input as Record<string, unknown>;
  const errors: Record<string, string> = {};

  // Honeypot: real users never fill this hidden field. Pretend success so bots
  // don't learn that they were detected.
  const honeypot = readLine(body.website).length > 0;

  const formType = readLine(body.formType);
  const name = readLine(body.name);
  const email = readLine(body.email).toLowerCase();
  const phone = readLine(body.phone);
  const countryCode = readLine(body.countryCode) || "+91";
  const interest = readLine(body.interest);
  const city = readLine(body.city);
  const landStatus = readLine(body.landStatus);
  const message = readMultiline(body.message);
  const source = readLine(body.source);

  if (!isFormType(formType)) {
    errors.formType = "Unknown form type";
  }

  if (!name) {
    errors.name = "Please enter your name";
  } else if (name.length > LIMITS.name) {
    errors.name = "Name is too long";
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (!phoneDigits) {
    errors.phone = "Please enter your phone number";
  } else if (phoneDigits.length < 6 || phoneDigits.length > 15) {
    errors.phone = "Please enter a valid phone number";
  }

  if (!COUNTRY_CODE_PATTERN.test(countryCode)) {
    errors.countryCode = "Invalid country code";
  }

  if (formType === "franchise" && !email) {
    errors.email = "Please enter your email address";
  }
  if (email && !EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (interest.length > LIMITS.interest) errors.interest = "Selection is too long";
  if (city.length > LIMITS.city) errors.city = "City is too long";
  if (landStatus.length > LIMITS.landStatus) errors.landStatus = "Selection is too long";
  if (message.length > LIMITS.message) errors.message = "Message is too long";
  if (source.length > LIMITS.source) errors.source = "Invalid source";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      honeypot,
      data: {
        formType: formType as FormType,
        name,
        email,
        phone: phoneDigits,
        countryCode,
        interest,
        city,
        landStatus,
        message,
        source,
        submittedAt: new Date().toISOString(),
      },
    },
  };
}
