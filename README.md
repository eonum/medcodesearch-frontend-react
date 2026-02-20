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

All application state lives in `App.tsx` (a class component). Child components receive state via props and bubble changes back up via callbacks — no Redux or Context is used.

Because the app uses class components throughout but depends on React Router v6 hooks (`useNavigate`, `useParams`) and `useTranslation`, every component wraps itself in an `addProps` HOC that injects those hooks as props.

**Key files**

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Root component and state hub |
| `src/interfaces.ts` | Shared TypeScript interfaces |
| `src/Utils.tsx` | `fetchURL` constant and shared utilities |
| `src/i18n.tsx` | i18next setup; translations in `src/assets/translations/` |
| `src/Services/router.service.tsx` | URL parsing utilities |
| `src/Services/catalog-version.service.tsx` | Version fetching and catalog↔resource_type mapping |
| `src/Components/Bodies/` | Top-level page bodies per catalog type |
| `src/Components/CodeAttributes/` | Attribute display components per catalog |

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

- Each class in its own file; components under `src/Components/`, services under `src/Services/`, test suites under `cypress/e2e/`
- Class names: first letter uppercase, rest lowercase (e.g. `Searchbar`)
- Method names: lowercase
- Variable names: camelCase
- Constants: UPPERCASE
- Every method documented with JSDoc

---

## Contact

- [info@eonum.ch](mailto:info@eonum.ch)
- [eonum.ch/de/kontakt/](https://eonum.ch/de/kontakt/)
