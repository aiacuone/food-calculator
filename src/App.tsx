import { ConvertPanel } from './components/ConvertPanel'
import { MacrosPanel } from './components/MacrosPanel'
import { TargetPanel } from './components/TargetPanel'
import { useStoredState } from './lib/storage'
import { UNITS, type WeightUnit } from './lib/units'

type Tab = 'target' | 'macros' | 'convert'

const TABS: { id: Tab; label: string }[] = [
  { id: 'target', label: 'Target → Food' },
  { id: 'macros', label: 'Food → Macros' },
  { id: 'convert', label: 'Raw ⇄ Cooked' },
]

export default function App() {
  const [tab, setTab] = useStoredState<Tab>('tab', 'target')
  const [unit, setUnit] = useStoredState<WeightUnit>('unit', 'g')
  const [favourites, setFavourites] = useStoredState<string[]>('favourites', [])

  const toggleFavourite = (key: string) =>
    setFavourites((fs) => (fs.includes(key) ? fs.filter((k) => k !== key) : [...fs, key]))

  const panelProps = { unit, favourites, onToggleFavourite: toggleFavourite }

  return (
    <div className="app">
      <header>
        <h1>Food Calculator</h1>
        <div className="units" role="radiogroup" aria-label="Weight unit">
          {UNITS.map((u) => (
            <button key={u} type="button" role="radio" aria-checked={unit === u} className={unit === u ? 'on' : ''} onClick={() => setUnit(u)}>
              {u}
            </button>
          ))}
        </div>
      </header>

      <nav className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        {tab === 'target' && <TargetPanel {...panelProps} />}
        {tab === 'macros' && <MacrosPanel {...panelProps} />}
        {tab === 'convert' && <ConvertPanel {...panelProps} />}
      </main>

      <footer>
        Values per USDA FoodData Central. Carbs are total carbohydrate (including fibre). Cooked weights are typical
        estimates and vary with cooking time and method.
      </footer>
    </div>
  )
}
