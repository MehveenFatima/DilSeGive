// Small input validation helpers shared by the controllers.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns true for a basic, well-formed email address. */
export const isValidEmail = (email) =>
  typeof email === 'string' && email.length <= 254 && EMAIL_PATTERN.test(email.trim());

/** Returns true when the password meets the minimum length. */
export const isValidPassword = (password, minLength = 6) =>
  typeof password === 'string' && password.length >= minLength;
