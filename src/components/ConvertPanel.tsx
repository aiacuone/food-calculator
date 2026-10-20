import { useState } from 'react'
import { PREP_BY_KEY, PREPS, prepsForFood, rawPrep } from '../data/foods'
import { convertWeight, macrosFor } from '../lib/calc'
import { formatWeight, parseAmount, toGrams, type WeightUnit } from '../lib/units'
import { FoodSelect } from './FoodSelect'
import { MacroSummary } from './MacroSummary'

interface Props {
  unit: WeightUnit
  favourites: string[]
  onToggleFavourite: (key: string) => void
}

// Only foods that have at least one cooked state can be converted.
const CONVERTIBLE = PREPS.filter((p) => prepsForFood(p.foodId).length > 1)

export function ConvertPanel({ unit, favourites, onToggleFavourite }: Props) {
  const [fromKey, setFromKey] = useState('chicken-breast:raw')
  const [toKey, setToKey] = useState('chicken-breast:grilled')
  const [amount, setAmount] = useState('200')

  const from = PREP_BY_KEY[fromKey]
  const to = PREP_BY_KEY[toKey]
  const siblings = prepsForFood(from.foodId)
  const value = parseAmount(amount)
  const grams = Number.isNaN(value) ? 0 : toGrams(value, unit)
  const result = convertWeight(grams, from, to)

  const changeFrom = (key: string) => {
    const next = PREP_BY_KEY[key]
    setFromKey(key)
    if (PREP_BY_KEY[toKey].foodId !== next.foodId || toKey === key) {
      setToKey(prepsForFood(next.foodId).find((p) => p.key !== key)!.key)
    }
  }
  const swap = () => {
    setFromKey(toKey)
    setToKey(fromKey)
  }

  const ratios = [from, to]
    .filter((p, i, arr) => !p.isRaw && arr.findIndex((q) => q.key === p.key) === i)
    .map((p) => `${p.yield} g ${p.label}`)
    .join(' or ')

  return (
    <section className="panel">
      <p className="hint">Convert a weight between raw and cooked, in either direction.</p>

      <div className="card">
        <FoodSelect
          label="From"
          value={fromKey}
          onChange={changeFrom}
          options={CONVERTIBLE}
          favourites={favourites}
          onToggleFavourite={onToggleFavourite}
        />
        <label className="field inline">
          <span className="field-label">Amount</span>
          <input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <span>{unit}</span>
        </label>
        <button type="button" className="swap" onClick={swap} aria-label="Swap direction">
          ⇅ Swap
        </button>
        <FoodSelect
          label="To"
          value={toKey}
          onChange={setToKey}
          options={siblings}
          flat
          favourites={favourites}
          onToggleFavourite={onToggleFavourite}
          showStar={false}
        />
        <p className="result">{formatWeight(result, unit)}</p>
        {ratios && (
          <p className="sub">
            Assumes 1 g {rawPrep(from.foodId).label} = {ratios}
          </p>
        )}
        <MacroSummary macros={macrosFor(from, grams)} />
      </div>
    </section>
  )
}
