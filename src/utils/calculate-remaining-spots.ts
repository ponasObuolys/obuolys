/**
 * Apskaičiuoja likusias vietas kurse
 * 
 * Logika:
 * - Pradedame nuo max_spots (pvz. 30)
 * - Kiekvieną dieną mažiname po 2 vietas
 * - Minimumas: 5 vietos (kurso dieną)
 * 
 * Tai kosmetinė funkcija - nesusijusi su tikru Stripe inventoriumi
 */
export function calculateRemainingSpots(
  maxSpots: number,
  courseStartDate: Date | string | null
): number {
  if (!courseStartDate) {
    return maxSpots;
  }

  const startDate = typeof courseStartDate === "string" 
    ? new Date(courseStartDate) 
    : courseStartDate;
  
  const now = new Date();
  const timeDiff = startDate.getTime() - now.getTime();
  const daysUntilCourse = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // Jei kursas jau praėjo, rodome 0
  if (daysUntilCourse < 0) {
    return 0;
  }

  // Apskaičiuojame kiek dienų praėjo nuo "pradžios" (kai buvo max_spots)
  // Darome prielaidą, kad pradėjome su max_spots prieš tam tikrą laiką
  const totalDaysToSell = Math.ceil((maxSpots - 5) / 2); // Kiek dienų reikia kad pasiektume 5
  const daysFromStart = totalDaysToSell - daysUntilCourse;

  if (daysFromStart <= 0) {
    return maxSpots;
  }

  // Mažiname po 2 vietas per dieną
  const spotsReduced = daysFromStart * 2;
  const remainingSpots = maxSpots - spotsReduced;

  // Minimumas 5 vietos
  return Math.max(5, remainingSpots);
}

/**
 * Grąžina spalvos klasę pagal likusias vietas
 */
export function getSpotsColorClass(spots: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (spots > 10) {
    return {
      bg: "bg-green-500/10",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-500/30",
    };
  }
  if (spots >= 5) {
    return {
      bg: "bg-orange-500/10",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-500/30",
    };
  }
  return {
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
  };
}

/**
 * Grąžina urgency tekstą pagal likusias vietas
 */
export function getSpotsUrgencyText(spots: number): string {
  if (spots <= 5) {
    return "Paskutinės vietos!";
  }
  if (spots <= 10) {
    return "Liko nedaug vietų";
  }
  return "Vietos ribotos";
}
