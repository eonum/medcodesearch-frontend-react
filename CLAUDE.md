# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start              # Dev server at http://localhost:3000
yarn build              # Production build
yarn test               # Start test server (port 8080) + run all Cypress E2E tests headlessly
yarn test:search        # Run only search specs
yarn test:breadcrumbs   # Run only breadcrumb specs
yarn test:codeAttributes
yarn test:default
yarn test:popUp
yarn test-with-gui      # Open Cypress interactive GUI
```

There is no lint script. Tests are Cypress E2E only — no Jest/unit tests exist.

## Architecture

### URL Structure

Two route shapes cover all catalogs:

```
/:language/:catalog/:version/:resource_type/:code    # Versionized (ICD, CHOP, SwissDRG, TARMED, TARDOC, Reha, ZE)
/:language/:catalog/:resource_type/:code             # Unversionized (MIGEL, AL, DRUG)
```

- `language`: `de` | `fr` | `it` | `en`
- `catalog`: `ICD` | `CHOP` | `SwissDRG` | `TARMED` | `TARDOC` | `AmbGroup` | `Reha` | `Supplements` | `MIGEL` | `AL` | `DRUG`

### State Management

No Redux/Zustand/Context. `App.tsx` is the sole state hub (functional component using `useState`/`useEffect`). All state (`language`, `selectedButton`, `selectedVersion`, `searchResults`, `currentVersions`, etc.) lives there and flows down via props. Child components bubble changes back up via callback props.

All components are functional and use React Router v6 hooks (`useNavigate`, `useParams`, `useLocation`) and `useTranslation` directly — no HOC wrappers needed.

Child components may hold local UI state (e.g. Searchbar debounce timers, PopUp open/close, Buttons hover state) — this is intentional and does not violate the App.tsx-as-hub rule.

### API

Backend is hardcoded in `src/Utils.tsx`:
```typescript
export const fetchURL = 'https://search.eonum.ch'
```

All API calls use native `fetch()`. Key patterns:
- Versions: `GET /{lang}/{resource_type}/versions`
- Code detail (versionized): `GET /{lang}/{resource_type}/{version}/{code}?show_detail=1`
- Code detail (unversionized): `GET /{lang}/{resource_type}/{catalog}/{code}?show_detail=1&date={date}`
- Search: `GET /{lang}/{resource_type}/{version}/search?highlight=1&skip_sort_by_code=1&max_results={n}&search={term}`

The mapping between catalog names and `resource_type` strings lives in `src/Services/catalog-version.service.tsx`.

### Key Files

| File | Purpose |
|---|---|
| `src/App.tsx` | Root component, state hub, routing layout |
| `src/interfaces.ts` | All shared TypeScript interfaces |
| `src/Utils.tsx` | `fetchURL` constant, shared utilities |
| `src/i18n.tsx` | i18next setup; translations in `src/assets/translations/` |
| `src/Services/router.service.tsx` | Exported functions for URL parsing (`getQueryVariable`, `initializeLanguageFromURL`, `initializeCatalogFromURL`) |
| `src/Services/catalog-version.service.tsx` | Version fetching, catalog↔resource_type mapping |
| `src/Components/Bodies/` | `CodeBodyVersionized.tsx` and `CodeBodyUnversionized.tsx` — top-level page bodies |
| `src/Components/CodeAttributes/` | Attribute display components per catalog type |
| `src/Components/Buttons/` | `ButtonGroup.tsx` (catalog selector tabs), `Buttons.tsx` (individual button + version dropdown), `DatePicker.tsx` (date selector for unversionized catalogs) |
| `src/Components/Searchbar/Searchbar.tsx` | Search input with debounce; triggers search API and updates results in App |
| `src/Components/SearchResult/SearchResult.tsx` | Single search result row; navigates to code detail on click |
| `src/Components/PopUp/PopUp.tsx` | Modal overlay shown on code detail pages |
| `src/Components/Header/header.tsx` | App header with logo and language switcher |
| `src/Components/Footer/footer.tsx` | App footer |
| `src/Components/Spinner/spinner.tsx` | Loading spinner shown while fetching |

### Coding Conventions (from README)

- Each component in its own file; all components under `src/Components/`, services under `src/Services/`
- Component names: first letter uppercase, rest lowercase (e.g. `Searchbar`)
- Function names: always lowercase
- Variable names: camelCase
- Constants: UPPERCASE
- Every function documented with JSDoc
- CSS files are colocated with their component (e.g. `Searchbar/Searchbar.css` next to `Searchbar/Searchbar.tsx`)
- Props interfaces are defined inline at the top of each component file, not in `interfaces.ts` (which holds shared domain interfaces only)

### Responsive Layout

App implements manual responsive behavior: ≥1200px shows `ButtonGroup` + `Searchbar` side by side; below that, `Searchbar` appears first. `collapseMenu` state controls Bootstrap `<Collapse>` to hide/show search results on mobile.
