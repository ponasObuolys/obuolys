/**
 * Formatuoja kursų trukmę su lietuviška daugiskaita
 *
 * @param duration - Trukmė valandoms (string arba number)
 * @returns Suformatuotas tekstas su tinkama daugiskaita
 *
 * @example
 * formatDuration("1") // "1 valanda"
 * formatDuration("2") // "2 valandos"
 * formatDuration("14") // "14 valandų"
 * formatDuration("21") // "21 valanda"
 */
export const formatDuration = (duration: string | number): string => {
  // Konvertuojame į skaičių
  const hours = typeof duration === 'string' ? parseInt(duration) : duration;

  if (isNaN(hours)) {
    return String(duration); // Jei nepavyko parse'inti, grąžiname originalą
  }

  // Lietuviška daugiskaita:
  // 1, 21, 31... -> valanda
  // 2-4, 22-24, 32-34... (bet ne 12-14) -> valandos
  // 5-20, 25-30... -> valandų

  const lastDigit = hours % 10;
  const lastTwoDigits = hours % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${hours} valandų`;
  }

  if (lastDigit === 1) {
    return `${hours} valanda`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${hours} valandos`;
  }

  return `${hours} valandų`;
};
