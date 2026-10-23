export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
};