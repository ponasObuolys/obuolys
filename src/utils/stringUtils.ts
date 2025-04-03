/**
 * Utility functions for string operations
 */

/**
 * Converts Lithuanian characters to their non-diacritical equivalents
 * @param text Text containing Lithuanian characters
 * @returns Text with Lithuanian characters replaced with their non-diacritical equivalents
 */
export const convertLithuanianChars = (text: string): string => {
  const lithuanianCharsMap: Record<string, string> = {
    'ą': 'a',
    'č': 'c',
    'ę': 'e',
    'ė': 'e',
    'į': 'i',
    'š': 's',
    'ų': 'u',
    'ū': 'u',
    'ž': 'z',
    'Ą': 'A',
    'Č': 'C',
    'Ę': 'E',
    'Ė': 'E',
    'Į': 'I',
    'Š': 'S',
    'Ų': 'U',
    'Ū': 'U',
    'Ž': 'Z'
  };

  return text.replace(/[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g, char => lithuanianCharsMap[char] || char);
};

/**
 * Generates a URL-friendly slug from a given string
 * Handles Lithuanian characters by converting them to non-diacritical equivalents
 * @param text Text to convert to a slug
 * @returns URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  // First convert Lithuanian characters to their non-diacritical equivalents
  const normalizedText = convertLithuanianChars(text);
  
  // Then create the slug using only alphanumeric characters and hyphens
  return normalizedText
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};
