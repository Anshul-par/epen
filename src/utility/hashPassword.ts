import crypto from "crypto";

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${hash}.${salt}`;
};

export const comparePassword = (
  password: string,
  hashedPassword: string
): boolean => {
  const [hash, salt] = hashedPassword.split(".");
  const computedHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === computedHash;
};
