import { describe, expect, it } from 'vitest'
import { PREPS, PREP_BY_KEY } from '../data/foods'
import { convertWeight, evenShares, gramsForTarget, macrosFor, splitTarget } from './calc'
import { formatWeight, parseAmount, toGrams } from './units'

const rawRice = PREP_BY_KEY['white-rice:raw']
const boiledRice = PREP_BY_KEY['white-rice:boiled']
const rawChicken = PREP_BY_KEY['chicken-breast:raw']
const grilledChicken = PREP_BY_KEY['chicken-breast:grilled']

describe('food data', () => {
  it('has unique keys and positive yields', () => {
    expect(new Set(PREPS.map((p) => p.key)).size).toBe(PREPS.length)
    for (const p of PREPS) expect(p.yield).toBeGreaterThan(0)
  })
})

describe('macrosFor', () => {
  it('scales per-100g values', () => {
    expect(macrosFor(rawRice, 50).carbs).toBeCloseTo(40)
  })
})

describe('gramsForTarget', () => {
  it('finds grams of boiled rice for a carb target', () => {
    const g = gramsForTarget(boiledRice, 'carbs', 50)!
    expect(macrosFor(boiledRice, g).carbs).toBeCloseTo(50)
  })

  it('returns null when the food has none of the macro', () => {
    expect(gramsForTarget(rawChicken, 'carbs', 50)).toBeNull()
  })
})

describe('convertWeight', () => {
  it('converts raw to cooked and back', () => {
    expect(convertWeight(100, rawRice, boiledRice)).toBeCloseTo(280)
    expect(convertWeight(150, grilledChicken, rawChicken)).toBeCloseTo(200)
  })

  it('preserves macros across states', () => {
    const cooked = convertWeight(200, rawChicken, grilledChicken)
    expect(macrosFor(grilledChicken, cooked).protein).toBeCloseTo(macrosFor(rawChicken, 200).protein)
  })

  it('rejects different foods', () => {
    expect(() => convertWeight(100, rawRice, rawChicken)).toThrow()
  })
})

describe('splitTarget', () => {
  it('splits by share and normalises', () => {
    expect(splitTarget(100, [60, 40])).toEqual([60, 40])
    expect(splitTarget(90, [1, 2])).toEqual([30, 60])
    expect(splitTarget(90, [0, 0])).toEqual([0, 0])
  })
})

describe('evenShares', () => {
  it('always sums to 100', () => {
    for (let n = 1; n <= 7; n++) expect(evenShares(n).reduce((a, b) => a + b, 0)).toBe(100)
    expect(evenShares(3)).toEqual([34, 33, 33])
  })
})

describe('units', () => {
  it('converts and formats', () => {
    expect(toGrams(1, 'lb')).toBeCloseTo(453.59)
    expect(formatWeight(28.349523125, 'oz')).toBe('1.0 oz')
    expect(formatWeight(250, 'g')).toBe('250 g')
  })

  it('parses input', () => {
    expect(parseAmount('12,5')).toBe(12.5)
    expect(parseAmount('')).toBeNaN()
    expect(parseAmount('abc')).toBeNaN()
    expect(parseAmount('-3')).toBeNaN()
  })
})
