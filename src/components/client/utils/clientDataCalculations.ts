
/**
 * Calculates program progress percentage based on start date and program duration
 */
export const calculateProgramProgress = (clientStartDate: string, programDuration = 30): number => {
  if (!clientStartDate) return 0;
  
  const startDate = new Date(clientStartDate);
  const currentDate = new Date();
  const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const progressPercent = Math.min(100, Math.max(0, (daysPassed / programDuration) * 100));
  return Math.round(progressPercent);
};

/**
 * Determines weight trend by comparing recent check-ins
 */
export const getWeightTrend = (checkIns: any[]): 'up' | 'down' | 'neutral' => {
  if (checkIns.length < 2) return 'neutral';
  
  const latest = checkIns[0].weight;
  const previous = checkIns[1].weight;
  
  if (latest < previous) {
    return 'down';
  } else if (latest > previous) {
    return 'up';
  } else {
    return 'neutral';
  }
};

/**
 * Calculates water intake progress percentage
 */
export const calculateWaterProgress = (waterIntake: number, waterTarget = 8): number => {
  return Math.min(100, (waterIntake / waterTarget) * 100);
};
