export type MacroKey = 'carbs' | 'protein' | 'fat' | 'kcal'
export type Macros = Record<MacroKey, number>
export type FoodGroup = 'carb' | 'protein'

interface CookedDef {
  id: string
  label: string
  /** Cooked weight produced by 1 g of raw food (e.g. rice absorbs water: 2.8, chicken loses it: 0.75). */
  yield: number
}

interface FoodDef {
  id: string
  name: string
  group: FoodGroup
  /** Label for the uncooked state, e.g. "dry" for rice and pasta. */
  rawLabel?: string
  /** Per 100 g of raw food. Values from USDA FoodData Central; carbs are total carbohydrate. */
  raw: Macros
  cooked: CookedDef[]
}

/** One food in one state (raw, boiled, grilled, ...). */
export interface Prep {
  key: string
  foodId: string
  foodName: string
  group: FoodGroup
  label: string
  isRaw: boolean
  /** Cooked weight per 1 g raw. 1 for the raw state. */
  yield: number
  per100g: Macros
}

// Yields are typical home-cooking estimates. Real results vary with cooking time,
// how much water is used and (for meat) how much fat renders out.
const FOODS: FoodDef[] = [
  {
    id: 'white-rice',
    name: 'White rice',
    group: 'carb',
    rawLabel: 'dry',
    raw: { carbs: 80, protein: 7.1, fat: 0.7, kcal: 365 },
    cooked: [{ id: 'boiled', label: 'boiled', yield: 2.8 }],
  },
  {
    id: 'brown-rice',
    name: 'Brown rice',
    group: 'carb',
    rawLabel: 'dry',
    raw: { carbs: 76.2, protein: 7.9, fat: 2.9, kcal: 370 },
    cooked: [{ id: 'boiled', label: 'boiled', yield: 3 }],
  },
  {
    id: 'pasta',
    name: 'Pasta',
    group: 'carb',
    rawLabel: 'dry',
    raw: { carbs: 75, protein: 13, fat: 1.5, kcal: 371 },
    cooked: [{ id: 'boiled', label: 'boiled', yield: 2.3 }],
  },
  {
    id: 'oats',
    name: 'Rolled oats',
    group: 'carb',
    rawLabel: 'dry',
    raw: { carbs: 67.7, protein: 16.9, fat: 6.9, kcal: 389 },
    cooked: [{ id: 'porridge', label: 'porridge (water)', yield: 5.5 }],
  },
  {
    id: 'quinoa',
    name: 'Quinoa',
    group: 'carb',
    rawLabel: 'dry',
    raw: { carbs: 64.2, protein: 14.1, fat: 6.1, kcal: 368 },
    cooked: [{ id: 'boiled', label: 'boiled', yield: 3 }],
  },
  {
    id: 'lentils',
    name: 'Lentils',
    group: 'carb',
    rawLabel: 'dry',
    raw: { carbs: 63.4, protein: 24.6, fat: 1.1, kcal: 352 },
    cooked: [{ id: 'boiled', label: 'boiled', yield: 2.5 }],
  },
  {
    id: 'potato',
    name: 'Potato',
    group: 'carb',
    raw: { carbs: 17.5, protein: 2, fat: 0.1, kcal: 77 },
    cooked: [
      { id: 'boiled', label: 'boiled', yield: 1 },
      { id: 'baked', label: 'baked', yield: 0.8 },
      { id: 'air-fried', label: 'roasted / air-fried (no oil)', yield: 0.7 },
    ],
  },
  {
    id: 'sweet-potato',
    name: 'Sweet potato',
    group: 'carb',
    raw: { carbs: 20.1, protein: 1.6, fat: 0.1, kcal: 86 },
    cooked: [
      { id: 'boiled', label: 'boiled', yield: 1 },
      { id: 'baked', label: 'baked', yield: 0.85 },
    ],
  },
  {
    id: 'chicken-breast',
    name: 'Chicken breast (skinless)',
    group: 'protein',
    raw: { carbs: 0, protein: 22.5, fat: 2.6, kcal: 120 },
    cooked: [
      { id: 'grilled', label: 'grilled / roasted', yield: 0.75 },
      { id: 'poached', label: 'poached', yield: 0.8 },
    ],
  },
  {
    id: 'chicken-thigh',
    name: 'Chicken thigh (skinless)',
    group: 'protein',
    raw: { carbs: 0, protein: 19.7, fat: 4.1, kcal: 121 },
    cooked: [{ id: 'roasted', label: 'roasted / grilled', yield: 0.75 }],
  },
  {
    id: 'turkey-breast',
    name: 'Turkey breast (skinless)',
    group: 'protein',
    raw: { carbs: 0, protein: 24.6, fat: 0.7, kcal: 111 },
    cooked: [{ id: 'roasted', label: 'roasted', yield: 0.75 }],
  },
  {
    id: 'beef-mince-10',
    name: 'Beef mince (10% fat)',
    group: 'protein',
    raw: { carbs: 0, protein: 20, fat: 10, kcal: 176 },
    cooked: [{ id: 'browned', label: 'pan-browned', yield: 0.7 }],
  },
  {
    id: 'beef-mince-20',
    name: 'Beef mince (20% fat)',
    group: 'protein',
    raw: { carbs: 0, protein: 17.2, fat: 20, kcal: 254 },
    cooked: [{ id: 'browned', label: 'pan-browned', yield: 0.7 }],
  },
  {
    id: 'sirloin',
    name: 'Sirloin steak (trimmed)',
    group: 'protein',
    raw: { carbs: 0, protein: 22, fat: 6, kcal: 143 },
    cooked: [{ id: 'grilled', label: 'grilled / pan-fried', yield: 0.75 }],
  },
  {
    id: 'salmon',
    name: 'Salmon',
    group: 'protein',
    raw: { carbs: 0, protein: 20.4, fat: 13.4, kcal: 208 },
    cooked: [{ id: 'baked', label: 'baked / grilled', yield: 0.8 }],
  },
  {
    id: 'cod',
    name: 'Cod',
    group: 'protein',
    raw: { carbs: 0, protein: 17.8, fat: 0.7, kcal: 82 },
    cooked: [{ id: 'baked', label: 'baked', yield: 0.8 }],
  },
  {
    id: 'egg',
    name: 'Egg (whole)',
    group: 'protein',
    rawLabel: 'raw, no shell',
    raw: { carbs: 0.7, protein: 12.6, fat: 9.5, kcal: 143 },
    cooked: [{ id: 'boiled', label: 'boiled, no shell', yield: 1 }],
  },
  {
    id: 'tofu',
    name: 'Firm tofu',
    group: 'protein',
    rawLabel: 'as packaged',
    raw: { carbs: 2.8, protein: 17.3, fat: 8.7, kcal: 144 },
    cooked: [],
  },
]

function scale(m: Macros, factor: number): Macros {
  return { carbs: m.carbs * factor, protein: m.protein * factor, fat: m.fat * factor, kcal: m.kcal * factor }
}

// Cooked values are derived from raw so converting raw <-> cooked never changes the macros.
export const PREPS: Prep[] = FOODS.flatMap((food) => [
  {
    key: `${food.id}:raw`,
    foodId: food.id,
    foodName: food.name,
    group: food.group,
    label: food.rawLabel ?? 'raw',
    isRaw: true,
    yield: 1,
    per100g: food.raw,
  },
  ...food.cooked.map((c) => ({
    key: `${food.id}:${c.id}`,
    foodId: food.id,
    foodName: food.name,
    group: food.group,
    label: c.label,
    isRaw: false,
    yield: c.yield,
    per100g: scale(food.raw, 1 / c.yield),
  })),
])

export const PREP_BY_KEY: Record<string, Prep> = Object.fromEntries(PREPS.map((p) => [p.key, p]))

export function prepsForFood(foodId: string): Prep[] {
  return PREPS.filter((p) => p.foodId === foodId)
}

export function rawPrep(foodId: string): Prep {
  return PREP_BY_KEY[`${foodId}:raw`]
}

export function prepName(p: Prep): string {
  return `${p.foodName}, ${p.label}`
}
