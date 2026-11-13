export const SPONSOR_LOGO_BUCKET = "sponsor-logos";
export const MAX_SPONSOR_LOGO_BYTES = 5 * 1024 * 1024;
const extensions = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

export function validateSponsorLogo(file) {
  if (!file || !extensions[file.type]) throw new Error("Choose a PNG, JPG, or WEBP image (image/png, image/jpeg, or image/webp).");
  if (!Number.isFinite(file.size) || file.size <= 0) throw new Error("The logo file is empty or unreadable.");
  if (file.size > MAX_SPONSOR_LOGO_BYTES) throw new Error("The logo must be no larger than 5 MB (5,242,880 bytes).");
  return extensions[file.type];
}

export function createSponsorLogoPath(eventId, file) {
  const extension = validateSponsorLogo(file);
  const folder = String(eventId ?? "");
  if (!/^[a-zA-Z0-9_-]+$/.test(folder)) throw new Error("A valid event ID is required before uploading a sponsor logo.");
  return `${folder}/${crypto.randomUUID()}.${extension}`;
}

// StorageApiError exposes HTTP status separately from the Storage response code.
export function describeSponsorError(error) {
  const message = error?.message || "Unknown error";
  const status = error?.status ?? error?.originalError?.status;
  const code = error?.statusCode ?? error?.code;
  const details = [status != null ? `HTTP ${status}` : null, code != null ? `code ${code}` : null].filter(Boolean);
  return `${message}${details.length ? ` (${details.join(", ")})` : ""}`;
}
