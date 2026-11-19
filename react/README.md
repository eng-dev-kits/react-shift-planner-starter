# Optional React sample

This is a **minimal example**, not a packaged or bundled React library. The runnable demo uses JavaScript without React. To reuse the scheduler logic in an existing React project:

1. Ensure React / ReactDOM are installed in that project.
2. Copy `react/ShiftPlanner.jsx` and `src/schedule.mjs` into your project, adjusting the import path.
3. Import `ShiftPlanner` and supply your own employee and shift arrays:

```jsx
import { ShiftPlanner } from './ShiftPlanner';

<ShiftPlanner employees={team} shifts={teamShifts} onShiftClick={(shift)=>console.log(shift)} />
```

No mutations, storage or authorization is included in this React example. Implement your own callbacks and server-side validation before deploying to production. JSX requires a bundler (e.g. Vite). No bundler is included in this starter.
