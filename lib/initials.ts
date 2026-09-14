/**
 * Generates initials from a full name.
 * - If two or more words: returns the first letter of the first and second words.
 * - If one word: returns the first two letters of that word.
 * @param name - The full name string (e.g., "Super Admin" or "Ahmed")
 * @returns A 2-character uppercase string for the avatar.
 */
export const initials = (name: string | null): string | null => {
  if (!name) return null;
  // Trim whitespace and split by any number of spaces
  const words = name.trim().split(/\s+/);

  if (!words.length || words[0] === '') return null;

  // Handle single word case (e.g., "Ahmed" -> "AH")
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  // Handle multiple words (e.g., "Super Admin User" -> "SA")
  const firstInitial = words[0].charAt(0);
  const secondInitial = words[1].charAt(0);

  return (firstInitial + secondInitial).toUpperCase();
};
