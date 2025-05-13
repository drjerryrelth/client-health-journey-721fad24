import { CheckIn } from '@/types';

// Mock data for development when Supabase is not configured
export const mockCheckIns: CheckIn[] = [
  {
    id: '1',
    clientId: '1',
    date: '2025-05-06', // Most recent date - today's date
    weight: 155,
    measurements: {
      waist: 32,
      hips: 38,
      chest: 42,
      thighs: 22,
      arms: 14
    },
    moodScore: 4,
    energyScore: 4,
    sleepHours: 7.5,
    waterIntake: 64, // In ounces now
    meals: {
      breakfast: 'Oatmeal with blueberries and honey',
      lunch: 'Grilled chicken salad with avocado',
      dinner: 'Baked salmon with sweet potato and asparagus',
      snacks: 'Greek yogurt with almonds'
    },
    // Adding food details in the format expected by MealHistoryTable
    breakfastProtein: 'Egg whites',
    breakfastProteinPortion: '4 oz',
    breakfastFruit: 'Blueberries',
    breakfastFruitPortion: '1 cup',
    breakfastVegetable: 'Spinach',
    breakfastVegetablePortion: '1 cup',
    
    lunchProtein: 'Grilled chicken breast',
    lunchProteinPortion: '6 oz',
    lunchFruit: 'Apple',
    lunchFruitPortion: '1 medium',
    lunchVegetable: 'Mixed greens',
    lunchVegetablePortion: '2 cups',
    
    dinnerProtein: 'Baked salmon',
    dinnerProteinPortion: '5 oz',
    dinnerVegetable: 'Asparagus',
    dinnerVegetablePortion: '1 cup',
    dinnerFruit: '',
    dinnerFruitPortion: '',
    
    snacks: 'Greek yogurt with almonds',
    snackPortion: '6 oz',
    supplements: ['Vitamin D', 'Omega-3', 'Magnesium'],
    notes: 'Feeling good today, workout was great',
    photos: []
  },
  {
    id: '2',
    clientId: '1',
    date: '2025-05-05', // Yesterday
    weight: 155.5,
    measurements: {
      waist: 32.2,
      hips: 38.1,
      chest: 42,
      thighs: 22.1,
      arms: 14
    },
    moodScore: 3,
    energyScore: 3,
    sleepHours: 6.5,
    waterIntake: 56, // In ounces
    meals: {
      breakfast: 'Protein smoothie with berries',
      lunch: 'Turkey wrap with veggies',
      dinner: 'Stir-fry with tofu and vegetables',
      snacks: 'Hummus with carrots'
    },
    breakfastProtein: 'Protein powder',
    breakfastProteinPortion: '1 scoop',
    breakfastFruit: 'Mixed berries',
    breakfastFruitPortion: '1 cup',
    breakfastVegetable: '',
    breakfastVegetablePortion: '',
    
    lunchProtein: 'Sliced turkey',
    lunchProteinPortion: '4 oz',
    lunchVegetable: 'Lettuce, tomato, cucumber',
    lunchVegetablePortion: '1 cup',
    lunchFruit: '',
    lunchFruitPortion: '',
    
    dinnerProtein: 'Tofu',
    dinnerProteinPortion: '6 oz',
    dinnerVegetable: 'Bell peppers, broccoli, carrots',
    dinnerVegetablePortion: '2 cups',
    dinnerFruit: '',
    dinnerFruitPortion: '',
    
    snacks: 'Hummus with carrots',
    snackPortion: '4 oz',
    supplements: ['Vitamin D', 'Probiotic'],
    notes: 'Slightly tired today, but still managed a light workout',
    photos: []
  },
  {
    id: '3',
    clientId: '1',
    date: '2025-05-04', // 2 days ago
    weight: 156,
    measurements: {
      waist: 32.3,
      hips: 38.2,
      chest: 42.1,
      thighs: 22.2,
      arms: 14.1
    },
    moodScore: 4,
    energyScore: 4,
    sleepHours: 7,
    waterIntake: 60, // In ounces
    meals: {
      breakfast: 'Avocado toast with eggs',
      lunch: 'Quinoa bowl with vegetables',
      dinner: 'Grilled steak with roasted vegetables',
      snacks: 'Apple with peanut butter'
    },
    breakfastProtein: 'Eggs',
    breakfastProteinPortion: '2 large',
    breakfastFruit: 'Avocado',
    breakfastFruitPortion: '1/2',
    breakfastVegetable: 'Tomatoes',
    breakfastVegetablePortion: '1/4 cup',
    
    lunchProtein: 'Chickpeas',
    lunchProteinPortion: '1/2 cup',
    lunchVegetable: 'Bell peppers, kale, onions',
    lunchVegetablePortion: '1.5 cups',
    lunchFruit: '',
    lunchFruitPortion: '',
    
    dinnerProtein: 'Grass-fed steak',
    dinnerProteinPortion: '5 oz',
    dinnerVegetable: 'Roasted brussels sprouts and sweet potato',
    dinnerVegetablePortion: '2 cups',
    dinnerFruit: '',
    dinnerFruitPortion: '',
    
    snacks: 'Apple with peanut butter',
    snackPortion: '3 tbsp',
    supplements: ['Multivitamin', 'Vitamin C'],
    notes: 'Good energy today, productive workout session',
    photos: []
  },
  {
    id: '4',
    clientId: '1',
    date: '2025-05-03', // 3 days ago
    weight: 156.5,
    measurements: {
      waist: 32.5,
      hips: 38.5,
      chest: 42,
      thighs: 22.5,
      arms: 14
    },
    moodScore: 3,
    energyScore: 3,
    sleepHours: 6,
    waterIntake: 48, // In ounces
    meals: {
      breakfast: 'Protein pancakes',
      lunch: 'Turkey sandwich',
      dinner: 'Pasta with vegetables',
      snacks: 'Protein bar and apple'
    },
    breakfastProtein: 'Protein pancake mix',
    breakfastProteinPortion: '1/2 cup mix',
    breakfastFruit: 'Banana',
    breakfastFruitPortion: '1 medium',
    breakfastVegetable: '',
    breakfastVegetablePortion: '',
    
    lunchProtein: 'Turkey',
    lunchProteinPortion: '4 oz',
    lunchVegetable: 'Lettuce, tomato',
    lunchVegetablePortion: '1/2 cup',
    lunchFruit: '',
    lunchFruitPortion: '',
    
    dinnerProtein: 'Ground turkey',
    dinnerProteinPortion: '4 oz',
    dinnerVegetable: 'Zucchini noodles with tomato sauce',
    dinnerVegetablePortion: '1.5 cups',
    dinnerFruit: '',
    dinnerFruitPortion: '',
    
    snacks: 'Protein bar and apple',
    snackPortion: '1 bar + 1 apple',
    supplements: ['Vitamin D', 'B-complex'],
    notes: 'Felt tired today, less water than usual',
    photos: []
  },
  {
    id: '5',
    clientId: '1',
    date: '2025-05-02', // 4 days ago
    weight: 156.3,
    measurements: {
      waist: 32.4,
      hips: 38.3,
      chest: 42,
      thighs: 22.3,
      arms: 14.1
    },
    moodScore: 5,
    energyScore: 4,
    sleepHours: 7.5,
    waterIntake: 72, // In ounces
    meals: {
      breakfast: 'Greek yogurt with granola',
      lunch: 'Tuna salad wrap',
      dinner: 'Roasted chicken with vegetables',
      snacks: 'Protein shake and nuts'
    },
    breakfastProtein: 'Greek yogurt',
    breakfastProteinPortion: '1 cup',
    breakfastFruit: 'Strawberries',
    breakfastFruitPortion: '1/2 cup',
    breakfastVegetable: '',
    breakfastVegetablePortion: '',
    
    lunchProtein: 'Tuna',
    lunchProteinPortion: '4 oz',
    lunchVegetable: 'Mixed greens',
    lunchVegetablePortion: '2 cups',
    lunchFruit: '',
    lunchFruitPortion: '',
    
    dinnerProtein: 'Roasted chicken',
    dinnerProteinPortion: '5 oz',
    dinnerVegetable: 'Roasted broccoli, carrots, and cauliflower',
    dinnerVegetablePortion: '2 cups',
    dinnerFruit: '',
    dinnerFruitPortion: '',
    
    snacks: 'Protein shake and mixed nuts',
    snackPortion: '1 shake + 1 oz nuts',
    supplements: ['Fish oil', 'Vitamin D', 'Zinc'],
    notes: 'Great mood today, stayed well hydrated',
    photos: []
  },
  {
    id: '6',
    clientId: '1',
    date: '2025-05-01', // 5 days ago
    weight: 156.7,
    measurements: {
      waist: 32.6,
      hips: 38.4,
      chest: 42.1,
      thighs: 22.4,
      arms: 14.2
    },
    moodScore: 4,
    energyScore: 3,
    sleepHours: 6.5,
    waterIntake: 56, // In ounces
    meals: {
      breakfast: 'Scrambled eggs with vegetables',
      lunch: 'Chicken caesar salad',
      dinner: 'Fish tacos with coleslaw',
      snacks: 'Rice cakes with almond butter'
    },
    breakfastProtein: 'Eggs',
    breakfastProteinPortion: '3 eggs',
    breakfastFruit: '',
    breakfastFruitPortion: '',
    breakfastVegetable: 'Spinach, bell peppers, onions',
    breakfastVegetablePortion: '1 cup',
    
    lunchProtein: 'Grilled chicken',
    lunchProteinPortion: '5 oz',
    lunchVegetable: 'Romaine lettuce',
    lunchVegetablePortion: '2 cups',
    lunchFruit: '',
    lunchFruitPortion: '',
    
    dinnerProtein: 'Cod',
    dinnerProteinPortion: '5 oz',
    dinnerVegetable: 'Cabbage slaw, tomatoes',
    dinnerVegetablePortion: '1 cup',
    dinnerFruit: 'Lime',
    dinnerFruitPortion: '1/2',
    
    snacks: 'Rice cakes with almond butter',
    snackPortion: '2 cakes + 2 tbsp',
    supplements: ['Vitamin D', 'Calcium'],
    notes: 'Decent day, slightly less energy in the afternoon',
    photos: []
  },
  {
    id: '7',
    clientId: '1',
    date: '2025-04-30', // 6 days ago
    weight: 157,
    measurements: {
      waist: 32.7,
      hips: 38.6,
      chest: 42.2,
      thighs: 22.6,
      arms: 14.2
    },
    moodScore: 3,
    energyScore: 3,
    sleepHours: 5.5,
    waterIntake: 40, // In ounces
    meals: {
      breakfast: 'Protein shake',
      lunch: 'Leftover salmon with salad',
      dinner: 'Vegetable stir-fry with brown rice',
      snacks: 'String cheese and fruit'
    },
    breakfastProtein: 'Protein powder',
    breakfastProteinPortion: '1 scoop',
    breakfastFruit: 'Banana',
    breakfastFruitPortion: '1 medium',
    breakfastVegetable: '',
    breakfastVegetablePortion: '',
    
    lunchProtein: 'Leftover salmon',
    lunchProteinPortion: '4 oz',
    lunchVegetable: 'Mixed greens',
    lunchVegetablePortion: '2 cups',
    lunchFruit: '',
    lunchFruitPortion: '',
    
    dinnerProtein: 'Tofu',
    dinnerProteinPortion: '5 oz',
    dinnerVegetable: 'Mixed stir-fry vegetables',
    dinnerVegetablePortion: '2 cups',
    dinnerFruit: '',
    dinnerFruitPortion: '',
    
    snacks: 'String cheese and apple',
    snackPortion: '2 sticks + 1 apple',
    supplements: ['Multivitamin'],
    notes: 'Poor sleep last night, felt tired all day',
    photos: []
  },
  // Keep the existing entry for client 2
  {
    id: '8',
    clientId: '2',
    date: '2023-05-12',
    weight: 180,
    measurements: {
      waist: 34,
      hips: 40,
      chest: 44,
      thighs: 24,
      arms: 16
    },
    moodScore: 5,
    energyScore: 5,
    sleepHours: 8,
    waterIntake: 80, // In ounces
    meals: {
      breakfast: 'Eggs and avocado toast',
      lunch: 'Large salad with chicken',
      dinner: 'Steak and sweet potatoes',
      snacks: 'Protein shake'
    },
    breakfastProtein: 'Eggs',
    breakfastProteinPortion: '3 large',
    breakfastFruit: 'Avocado',
    breakfastFruitPortion: '1/2',
    breakfastVegetable: '',
    breakfastVegetablePortion: '',
    
    lunchProtein: 'Grilled chicken',
    lunchProteinPortion: '6 oz',
    lunchVegetable: 'Mixed greens, tomatoes, cucumbers',
    lunchVegetablePortion: '3 cups',
    lunchFruit: '',
    lunchFruitPortion: '',
    
    dinnerProtein: 'Grass-fed steak',
    dinnerProteinPortion: '8 oz',
    dinnerVegetable: 'Broccoli',
    dinnerVegetablePortion: '1 cup',
    dinnerFruit: '',
    dinnerFruitPortion: '',
    
    snacks: 'Protein shake',
    snackPortion: '1 shake',
    supplements: ['Creatine', 'Vitamin D', 'ZMA'],
    notes: 'Had a great workout session',
    photos: []
  }
];
