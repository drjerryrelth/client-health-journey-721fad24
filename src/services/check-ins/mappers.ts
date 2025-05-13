
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
    
    // Add the meal-related detail fields
    breakfastProtein: checkIn.breakfast_protein,
    breakfastProteinPortion: checkIn.breakfast_protein_portion,
    breakfastFruit: checkIn.breakfast_fruit,
    breakfastFruitPortion: checkIn.breakfast_fruit_portion,
    breakfastVegetable: checkIn.breakfast_vegetable,
    breakfastVegetablePortion: checkIn.breakfast_vegetable_portion,
    
    lunchProtein: checkIn.lunch_protein,
    lunchProteinPortion: checkIn.lunch_protein_portion,
    lunchFruit: checkIn.lunch_fruit,
    lunchFruitPortion: checkIn.lunch_fruit_portion,
    lunchVegetable: checkIn.lunch_vegetable,
    lunchVegetablePortion: checkIn.lunch_vegetable_portion,
    
    dinnerProtein: checkIn.dinner_protein,
    dinnerProteinPortion: checkIn.dinner_protein_portion,
    dinnerFruit: checkIn.dinner_fruit,
    dinnerFruitPortion: checkIn.dinner_fruit_portion,
    dinnerVegetable: checkIn.dinner_vegetable,
    dinnerVegetablePortion: checkIn.dinner_vegetable_portion,
    
    supplements: checkIn.supplements,
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
    
    // Map the meal-related detail fields
    breakfast_protein: restCheckIn.breakfastProtein,
    breakfast_protein_portion: restCheckIn.breakfastProteinPortion,
    breakfast_fruit: restCheckIn.breakfastFruit,
    breakfast_fruit_portion: restCheckIn.breakfastFruitPortion,
    breakfast_vegetable: restCheckIn.breakfastVegetable,
    breakfast_vegetable_portion: restCheckIn.breakfastVegetablePortion,
    
    lunch_protein: restCheckIn.lunchProtein,
    lunch_protein_portion: restCheckIn.lunchProteinPortion,
    lunch_fruit: restCheckIn.lunchFruit,
    lunch_fruit_portion: restCheckIn.lunchFruitPortion,
    lunch_vegetable: restCheckIn.lunchVegetable,
    lunch_vegetable_portion: restCheckIn.lunchVegetablePortion,
    
    dinner_protein: restCheckIn.dinnerProtein,
    dinner_protein_portion: restCheckIn.dinnerProteinPortion,
    dinner_fruit: restCheckIn.dinnerFruit,
    dinner_fruit_portion: restCheckIn.dinnerFruitPortion,
    dinner_vegetable: restCheckIn.dinnerVegetable,
    dinner_vegetable_portion: restCheckIn.dinnerVegetablePortion,
    
    supplements: restCheckIn.supplements,
  };
}
