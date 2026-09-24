const HONORIFIC_PREFIX = /^(د|dr)\.?$/i;

export const initials = (name: string | null): string | null => {
  if (!name) return null;
  const firstWord = name
    .trim()
    .split(/\s+/)
    .find((word) => word !== '' && !HONORIFIC_PREFIX.test(word));

  return firstWord ? firstWord.charAt(0).toUpperCase() : null;
};
