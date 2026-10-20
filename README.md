# Food Calculator

Work out how much food reaches a carb, protein, fat or calorie target, convert between raw and cooked weights, and check the macros of what you're eating.

## Run it

```
npm install
npm run dev
```

Open the address Vite prints. Use `npm run dev -- --host` to open it on a phone on the same Wi-Fi.

## Other commands

- `npm test` runs the unit tests
- `npm run build` type-checks and builds to `dist/`
- `npm run lint` runs the linter

## Food data

Foods live in `src/data/foods.ts`. Per-100g values come from USDA FoodData Central. Cooked/raw weight ratios are typical home-cooking estimates.
