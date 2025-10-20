/**
 * Lithuanian pluralization utility
 * Returns the correct form of a word based on the number
 */

interface PluralForms {
  one: string;      // 1, 21, 31, 41, etc. (ends with 1, but not 11)
  few: string;      // 2-9, 22-29, 32-39, etc. (ends with 2-9, but not 12-19)
  many: string;     // 0, 10-20, 30, 40, etc. (ends with 0 or 10-20)
}

/**
 * Get the correct plural form for Lithuanian language
 * @param count - The number to pluralize for
 * @param forms - Object with three forms: one, few, many
 * @returns The correct form based on Lithuanian grammar rules
 */
export function pluralize(count: number, forms: PluralForms): string {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  // Rule 1: Numbers ending in 11-19 use "many" form
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return forms.many;
  }

  // Rule 2: Numbers ending in 1 use "one" form
  if (lastDigit === 1) {
    return forms.one;
  }

  // Rule 3: Numbers ending in 2-9 use "few" form
  if (lastDigit >= 2 && lastDigit <= 9) {
    return forms.few;
  }

  // Rule 4: Numbers ending in 0 use "many" form
  return forms.many;
}

/**
 * Format view count with correct Lithuanian plural form
 * @param count - Number of views
 * @returns Formatted string with correct plural form
 */
export function formatViewCount(count: number): string {
  const forms: PluralForms = {
    one: "peržiūra",    // 1, 21, 31, 41, 51, 61, 71, 81, 91, 101, etc.
    few: "peržiūros",   // 2-9, 22-29, 32-39, 42-49, 52-59, 62-69, 72-79, 82-89, 92-99, 102-109, etc.
    many: "peržiūrų",   // 0, 10-20, 30, 40, 50, 60, 70, 80, 90, 100, 110-120, etc.
  };

  return `${count.toLocaleString("lt-LT")} ${pluralize(count, forms)}`;
}

/**
 * Format comment count with correct Lithuanian plural form
 * @param count - Number of comments
 * @returns Formatted string with correct plural form
 */
export function formatCommentCount(count: number): string {
  const forms: PluralForms = {
    one: "komentaras",
    few: "komentarai",
    many: "komentarų",
  };

  return `${count.toLocaleString("lt-LT")} ${pluralize(count, forms)}`;
}

/**
 * Format reader count with correct Lithuanian plural form
 * @param count - Number of readers
 * @returns Formatted string with correct plural form
 */
export function formatReaderCount(count: number): string {
  const forms: PluralForms = {
    one: "skaitytojas",
    few: "skaitytojai",
    many: "skaitytojų",
  };

  return `${count.toLocaleString("lt-LT")} ${pluralize(count, forms)}`;
}
