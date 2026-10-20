import { useState } from 'react'
import { PREP_BY_KEY, rawPrep, type MacroKey } from '../data/foods'
import { addMacros, convertWeight, evenShares, gramsForTarget, macrosFor, splitTarget, ZERO } from '../lib/calc'
import { formatWeight, parseAmount, type WeightUnit } from '../lib/units'
import { FoodSelect } from './FoodSelect'
import { MacroSummary } from './MacroSummary'

interface Row {
  id: number
  prepKey: string
  share: string
}

interface Props {
  unit: WeightUnit
  favourites: string[]
  onToggleFavourite: (key: string) => void
}

const MACRO_OPTIONS: { key: MacroKey; label: string }[] = [
  { key: 'carbs', label: 'Carbs (g)' },
  { key: 'protein', label: 'Protein (g)' },
  { key: 'fat', label: 'Fat (g)' },
  { key: 'kcal', label: 'Calories (kcal)' },
]

let nextId = 1

export function TargetPanel({ unit, favourites, onToggleFavourite }: Props) {
  const [macro, setMacro] = useState<MacroKey>('carbs')
  const [target, setTarget] = useState('50')
  const [rows, setRows] = useState<Row[]>([{ id: nextId++, prepKey: 'white-rice:boiled', share: '100' }])

  const targetValue = parseAmount(target)
  const shares = rows.map((r) => parseAmount(r.share) || 0)
  const shareSum = shares.reduce((a, b) => a + b, 0)
  const parts = splitTarget(Number.isNaN(targetValue) ? 0 : targetValue, shares)

  const results = rows.map((row, i) => {
    const prep = PREP_BY_KEY[row.prepKey]
    const grams = gramsForTarget(prep, macro, parts[i])
    return { row, prep, grams, macros: grams === null ? ZERO : macrosFor(prep, grams) }
  })
  const total = results.reduce((acc, r) => addMacros(acc, r.macros), ZERO)

  const resplit = (next: Row[]) => {
    const even = evenShares(next.length)
    setRows(next.map((r, i) => ({ ...r, share: String(even[i]) })))
  }
  const update = (id: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  return (
    <section className="panel">
      <p className="hint">Set a target and see how much food reaches it. Add foods to split the target between them.</p>

      <div className="row-2">
        <label className="field">
          <span className="field-label">Target</span>
          <select value={macro} onChange={(e) => setMacro(e.target.value as MacroKey)}>
            {MACRO_OPTIONS.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Amount</span>
          <input inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
      </div>

      {results.map(({ row, prep, grams, macros }) => (
        <div key={row.id} className="card">
          <FoodSelect
            value={row.prepKey}
            onChange={(prepKey) => update(row.id, { prepKey })}
            favourites={favourites}
            onToggleFavourite={onToggleFavourite}
          />
          {rows.length > 1 && (
            <div className="share-row">
              <label className="field inline">
                <span className="field-label">Share</span>
                <input inputMode="decimal" value={row.share} onChange={(e) => update(row.id, { share: e.target.value })} />
                <span>%</span>
              </label>
              <button type="button" className="link" onClick={() => resplit(rows.filter((r) => r.id !== row.id))}>
                Remove
              </button>
            </div>
          )}
          {grams === null ? (
            <p className="warn">
              {prep.foodName} has no {macro === 'kcal' ? 'calories' : macro}.
            </p>
          ) : (
            <>
              <p className="result">
                {formatWeight(grams, unit)}
                {!prep.isRaw && (
                  <span className="sub">
                    {' '}
                    ≈ {formatWeight(convertWeight(grams, prep, rawPrep(prep.foodId)), unit)} {rawPrep(prep.foodId).label}
                  </span>
                )}
              </p>
              <MacroSummary macros={macros} highlight={macro} />
            </>
          )}
        </div>
      ))}

      <div className="actions">
        <button
          type="button"
          onClick={() => resplit([...rows, { id: nextId++, prepKey: rows.at(-1)!.prepKey, share: '0' }])}
        >
          + Add food
        </button>
        {rows.length > 1 && (
          <button type="button" className="link" onClick={() => resplit(rows)}>
            Split evenly
          </button>
        )}
      </div>

      {rows.length > 1 && shareSum !== 100 && (
        <p className="warn">Shares add up to {shareSum}%. They're scaled to 100% in the results.</p>
      )}

      {rows.length > 1 && (
        <div className="card">
          <h2>Total</h2>
          <MacroSummary macros={total} highlight={macro} total />
        </div>
      )}
    </section>
  )
}
