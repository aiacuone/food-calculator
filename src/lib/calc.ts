import type { MacroKey, Macros, Prep } from '../data/foods'

export const ZERO: Macros = { carbs: 0, protein: 0, fat: 0, kcal: 0 }

export function macrosFor(prep: Prep, grams: number): Macros {
  const f = grams / 100
  const m = prep.per100g
  return { carbs: m.carbs * f, protein: m.protein * f, fat: m.fat * f, kcal: m.kcal * f }
}

export function addMacros(a: Macros, b: Macros): Macros {
  return { carbs: a.carbs + b.carbs, protein: a.protein + b.protein, fat: a.fat + b.fat, kcal: a.kcal + b.kcal }
}

/** Grams of `prep` needed to provide `target` of `macro`, or null if the food has none of it. */
export function gramsForTarget(prep: Prep, macro: MacroKey, target: number): number | null {
  const per100 = prep.per100g[macro]
  if (per100 <= 0) return null
  return (target / per100) * 100
}

/** Convert a weight between two states of the same food, e.g. raw -> boiled. */
export function convertWeight(grams: number, from: Prep, to: Prep): number {
  if (from.foodId !== to.foodId) throw new Error('Cannot convert between different foods')
  return (grams / from.yield) * to.yield
}

/** Split `total` across shares (percentages). Shares are normalised so they always cover the total. */
export function splitTarget(total: number, shares: number[]): number[] {
  const sum = shares.reduce((a, b) => a + b, 0)
  if (sum <= 0) return shares.map(() => 0)
  return shares.map((s) => (total * s) / sum)
}

/** Even integer percentages that add up to 100, e.g. 3 -> [34, 33, 33]. */
export function evenShares(n: number): number[] {
  if (n <= 0) return []
  const base = Math.floor(100 / n)
  return Array.from({ length: n }, (_, i) => base + (i < 100 - base * n ? 1 : 0))
}
