export type WeightUnit = 'g' | 'oz' | 'lb'

export const UNITS: WeightUnit[] = ['g', 'oz', 'lb']

const GRAMS_PER: Record<WeightUnit, number> = { g: 1, oz: 28.349523125, lb: 453.59237 }

export function toGrams(value: number, unit: WeightUnit): number {
  return value * GRAMS_PER[unit]
}

export function fromGrams(grams: number, unit: WeightUnit): number {
  return grams / GRAMS_PER[unit]
}

export function formatWeight(grams: number, unit: WeightUnit): string {
  const v = fromGrams(grams, unit)
  const decimals = unit === 'g' ? (v < 10 ? 1 : 0) : unit === 'oz' ? 1 : 2
  return `${v.toFixed(decimals)} ${unit}`
}

/** Parse a user-typed number; empty or invalid input gives NaN. */
export function parseAmount(s: string): number {
  const trimmed = s.trim().replace(',', '.')
  if (trimmed === '') return NaN
  const n = Number(trimmed)
  return n >= 0 ? n : NaN
}
