/** Aligned with API route and change-password UI. */
export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

/**
 * Server-trustworthy password rules (stricter than “8 chars only”).
 * Supabase can enforce additional rules in the dashboard (Auth → Providers → Email).
 */
export function validatePasswordStrength(password: string): { ok: true } | { ok: false; message: string } {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      ok: false,
      message: `Use at least ${PASSWORD_MIN_LENGTH} characters.`,
    };
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return { ok: false, message: `Use at most ${PASSWORD_MAX_LENGTH} characters.` };
  }
  if (!/[a-z]/.test(password)) {
    return { ok: false, message: "Include at least one lowercase letter." };
  }
  if (!/[A-Z]/.test(password)) {
    return { ok: false, message: "Include at least one uppercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { ok: false, message: "Include at least one number." };
  }
  if (/(.)\1{6,}/.test(password)) {
    return { ok: false, message: "Avoid long runs of the same character." };
  }
  return { ok: true };
}

export function passwordRequirementsHint(): string {
  return `${PASSWORD_MIN_LENGTH}+ characters with upper, lower, and a number.`;
}
