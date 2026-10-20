import { useState } from 'react'
import { PREP_BY_KEY, rawPrep } from '../data/foods'
import { addMacros, convertWeight, macrosFor, ZERO } from '../lib/calc'
import { formatWeight, parseAmount, toGrams, type WeightUnit } from '../lib/units'
import { FoodSelect } from './FoodSelect'
import { MacroSummary } from './MacroSummary'

interface Row {
  id: number
  prepKey: string
  amount: string
}

interface Props {
  unit: WeightUnit
  favourites: string[]
  onToggleFavourite: (key: string) => void
}

let nextId = 1

export function MacrosPanel({ unit, favourites, onToggleFavourite }: Props) {
  const [rows, setRows] = useState<Row[]>([{ id: nextId++, prepKey: 'chicken-breast:grilled', amount: '200' }])

  const results = rows.map((row) => {
    const prep = PREP_BY_KEY[row.prepKey]
    const value = parseAmount(row.amount)
    const grams = Number.isNaN(value) ? 0 : toGrams(value, unit)
    return { row, prep, grams, macros: macrosFor(prep, grams) }
  })
  const total = results.reduce((acc, r) => addMacros(acc, r.macros), ZERO)

  const update = (id: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  return (
    <section className="panel">
      <p className="hint">Enter what you're eating, raw or cooked, and see its macros.</p>

      {results.map(({ row, prep, grams, macros }) => (
        <div key={row.id} className="card">
          <FoodSelect
            value={row.prepKey}
            onChange={(prepKey) => update(row.id, { prepKey })}
            favourites={favourites}
            onToggleFavourite={onToggleFavourite}
          />
          <div className="share-row">
            <label className="field inline">
              <span className="field-label">Amount</span>
              <input inputMode="decimal" value={row.amount} onChange={(e) => update(row.id, { amount: e.target.value })} />
              <span>{unit}</span>
            </label>
            {rows.length > 1 && (
              <button type="button" className="link" onClick={() => setRows(rows.filter((r) => r.id !== row.id))}>
                Remove
              </button>
            )}
          </div>
          {!prep.isRaw && grams > 0 && (
            <p className="sub">
              ≈ {formatWeight(convertWeight(grams, prep, rawPrep(prep.foodId)), unit)} {rawPrep(prep.foodId).label}
            </p>
          )}
          <MacroSummary macros={macros} />
        </div>
      ))}

      <div className="actions">
        <button type="button" onClick={() => setRows([...rows, { id: nextId++, prepKey: rows.at(-1)!.prepKey, amount: '' }])}>
          + Add food
        </button>
      </div>

      {rows.length > 1 && (
        <div className="card">
          <h2>Total</h2>
          <MacroSummary macros={total} total />
        </div>
      )}
    </section>
  )
}
