import type { MacroKey, Macros } from '../data/foods'

const ITEMS: { key: MacroKey; label: string; unit: string }[] = [
  { key: 'carbs', label: 'Carbs', unit: 'g' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'kcal', label: 'Calories', unit: 'kcal' },
]

export function MacroSummary({ macros, highlight, total }: { macros: Macros; highlight?: MacroKey; total?: boolean }) {
  return (
    <dl className={`macros${total ? ' total' : ''}`}>
      {ITEMS.map(({ key, label, unit }) => (
        <div key={key} className={key === highlight ? 'hl' : undefined}>
          <dt>{label}</dt>
          <dd>
            {macros[key].toFixed(key === 'kcal' ? 0 : 1)}
            <small> {unit}</small>
          </dd>
        </div>
      ))}
    </dl>
  )
}
