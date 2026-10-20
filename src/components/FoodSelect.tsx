import { PREPS, PREP_BY_KEY, prepName, type Prep } from '../data/foods'

interface Props {
  value: string
  onChange: (key: string) => void
  favourites: string[]
  onToggleFavourite: (key: string) => void
  /** Restrict the list, e.g. to foods that can be converted. */
  options?: Prep[]
  /** Show only the state labels (raw, boiled, ...) without grouping. For picking a state of one food. */
  flat?: boolean
  label?: string
  showStar?: boolean
}

export function FoodSelect({
  value,
  onChange,
  favourites,
  onToggleFavourite,
  options = PREPS,
  flat = false,
  label = 'Food',
  showStar = true,
}: Props) {
  const favs = options.filter((p) => favourites.includes(p.key))
  const carbs = options.filter((p) => p.group === 'carb')
  const protein = options.filter((p) => p.group === 'protein')
  const isFav = favourites.includes(value)

  return (
    <div className="food-select">
      <label className="field">
        <span className="field-label">{label}</span>
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {flat ? (
            options.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))
          ) : (
            <>
              {favs.length > 0 && (
                <optgroup label="★ Favourites">
                  {favs.map((p) => (
                    <option key={`fav-${p.key}`} value={p.key}>
                      {prepName(p)}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="Carbs">
                {carbs.map((p) => (
                  <option key={p.key} value={p.key}>
                    {prepName(p)}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Protein">
                {protein.map((p) => (
                  <option key={p.key} value={p.key}>
                    {prepName(p)}
                  </option>
                ))}
              </optgroup>
            </>
          )}
        </select>
      </label>
      {showStar && (
        <button
          type="button"
          className={`star${isFav ? ' on' : ''}`}
          onClick={() => onToggleFavourite(value)}
          aria-pressed={isFav}
          aria-label={isFav ? `Remove ${prepName(PREP_BY_KEY[value])} from favourites` : `Add ${prepName(PREP_BY_KEY[value])} to favourites`}
        >
          {isFav ? '★' : '☆'}
        </button>
      )}
    </div>
  )
}
