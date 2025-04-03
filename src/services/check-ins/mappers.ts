
import { CheckIn } from '@/types';

export function mapDbCheckInToCheckIn(checkIn: any, photoUrls: string[] = []): CheckIn {
  return {
    id: checkIn.id,
    clientId: checkIn.client_id,
    date: checkIn.date,
    weight: checkIn.weight,
    measurements: {
      waist: checkIn.waist,
      hips: checkIn.hips,
      chest: checkIn.chest,
      thighs: checkIn.thighs,
      arms: checkIn.arms,
    },
    moodScore: checkIn.mood_score,
    energyScore: checkIn.energy_score,
    sleepHours: checkIn.sleep_hours,
    waterIntake: checkIn.water_intake,
    meals: {
      breakfast: checkIn.breakfast,
      lunch: checkIn.lunch,
      dinner: checkIn.dinner,
      snacks: checkIn.snacks,
    },
    notes: checkIn.notes,
    photos: photoUrls,
  } as CheckIn;
}

export function mapCheckInToDbCheckIn(checkIn: Omit<CheckIn, 'id'> & { id?: string }): any {
  const { measurements, meals, photos: _, ...restCheckIn } = checkIn;
  
  return {
    client_id: restCheckIn.clientId,
    date: restCheckIn.date,
    weight: restCheckIn.weight,
    waist: measurements?.waist,
    hips: measurements?.hips,
    chest: measurements?.chest,
    thighs: measurements?.thighs,
    arms: measurements?.arms,
    mood_score: restCheckIn.moodScore,
    energy_score: restCheckIn.energyScore,
    sleep_hours: restCheckIn.sleepHours,
    water_intake: restCheckIn.waterIntake,
    breakfast: meals?.breakfast,
    lunch: meals?.lunch,
    dinner: meals?.dinner,
    snacks: meals?.snacks,
    notes: restCheckIn.notes,
  };
}
