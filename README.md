# medcodesearch-frontend-react

React frontend for [medcodesearch.ch](http://medcodesearch.ch) — a search interface for Swiss medical coding catalogs (ICD, CHOP, SwissDRG, TARMED, TARDOC, MIGEL, AL, DRUG, and more).

Backend API: [search.eonum.ch](https://search.eonum.ch/documentation)

---

## Setup

**Development**

```bash
yarn install
yarn start   # http://localhost:3000
```

**Production**

```bash
./deploy.sh
```

---

## Architecture

All application state lives in `App.tsx` (a functional component). Child components receive state via props and bubble changes back up via callbacks — no Redux or Context is used.

Components use React hooks directly: `useNavigate`, `useParams`, and `useLocation` from React Router v6, and `useTranslation` from react-i18next.

**Key files**

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Root component and state hub |
| `src/interfaces.ts` | Shared TypeScript interfaces |
| `src/Utils.tsx` | `fetchURL` constant and shared utilities |
| `src/i18n.tsx` | i18next setup; translations in `src/assets/translations/` |
| `src/Services/router.service.tsx` | URL parsing functions (`getQueryVariable`, `initializeLanguageFromURL`, `initializeCatalogFromURL`) |
| `src/Services/catalog-version.service.tsx` | Version fetching and catalog↔resource_type mapping |
| `src/Components/Bodies/` | `CodeBodyVersionized.tsx` and `CodeBodyUnversionized.tsx` — top-level page bodies |
| `src/Components/CodeAttributes/` | Attribute display components per catalog type |
| `src/Components/Buttons/` | `ButtonGroup.tsx` (catalog selector tabs), `Buttons.tsx` (individual button + version dropdown), `DatePicker.tsx` (date selector for unversionized catalogs) |
| `src/Components/Searchbar/Searchbar.tsx` | Search input with debounce; triggers search API and updates results in App |
| `src/Components/SearchResult/SearchResult.tsx` | Single search result row; navigates to code detail on click |
| `src/Components/PopUp/PopUp.tsx` | Modal overlay shown on code detail pages |
| `src/Components/Header/header.tsx` | App header with logo and language switcher |
| `src/Components/Footer/footer.tsx` | App footer |
| `src/Components/Spinner/spinner.tsx` | Loading spinner shown while fetching |

---

## Testing

Tests are Cypress E2E only (no unit tests). Cypress runs against a local dev server on port 8080.

```bash
yarn test               # Run all tests headlessly
yarn test:search        # Search specs only
yarn test:breadcrumbs   # Breadcrumb specs only
yarn test:codeAttributes
yarn test:default
yarn test:popUp
yarn test-with-gui      # Open Cypress interactive GUI
```

Cypress retries assertions automatically (default timeout: 4 s, configurable in `cypress.config.ts`).

---

## Coding conventions

- Each component in its own file; components under `src/Components/`, services under `src/Services/`, test suites under `cypress/e2e/`
- Component names: first letter uppercase, rest lowercase (e.g. `Searchbar`)
- Function/method names: lowercase
- Variable names: camelCase
- Constants: UPPERCASE
- Every function documented with JSDoc

---

## Contact

- [info@eonum.ch](mailto:info@eonum.ch)
- [eonum.ch/de/kontakt/](https://eonum.ch/de/kontakt/)
