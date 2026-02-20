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

No Redux/Zustand/Context. `App.tsx` is the sole state hub (class component). All state (`language`, `selectedButton`, `selectedVersion`, `searchResults`, `currentVersions`, etc.) lives there and flows down via props. Child components bubble changes back up via callback props.

### HOC Pattern for Class Components

Since the entire app uses class components but needs React Router v6 hooks (`useNavigate`, `useParams`) and `useTranslation`, every component wraps itself with an `addProps` HOC:

```typescript
function addProps(Component) {
    return props => <Component {...props} navigation={useNavigate()} params={useParams()} translation={useTranslation()}/>;
}
export default addProps(MyClassComponent);
```

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
| `src/Services/router.service.tsx` | URL parsing utilities |
| `src/Services/catalog-version.service.tsx` | Version fetching, catalog↔resource_type mapping |
| `src/Components/Bodies/` | `CodeBodyVersionized.tsx` and `CodeBodyUnversionized.tsx` — top-level page bodies |
| `src/Components/CodeAttributes/` | Attribute display components per catalog type |

### Coding Conventions (from README)

- Each class in its own file; all components under `src/Components/`, services under `src/Services/`
- Class names: first letter uppercase, rest lowercase (e.g. `Searchbar`)
- Method names: always lowercase
- Variable names: camelCase
- Constants: UPPERCASE
- Every method documented with JSDoc

### Responsive Layout

App implements manual responsive behavior: ≥1200px shows `ButtonGroup` + `Searchbar` side by side; below that, `Searchbar` appears first. `collapseMenu` state controls Bootstrap `<Collapse>` to hide/show search results on mobile.
