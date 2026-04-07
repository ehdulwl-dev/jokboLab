# JokboLab Frontend Rules

## 1) Scope
- This repository is frontend-only and built with React.
- Keep UI rendering, routing, client state, and API consumption here.
- Do not place business rules that should be enforced by backend in frontend code.

## 2) Recommended Folder Structure
- `src/app`: app bootstrap, providers, router setup.
- `src/pages`: page-level route components.
- `src/widgets`: page section UI blocks (optional if needed).
- `src/features/<feature-name>`: feature logic (components, hooks, api, types).
- `src/shared`: reusable ui/hooks/utils/constants/lib.
- `src/assets`: static assets.
- Use feature-first structure for domain code; use shared for cross-feature code only.

## 2.1) Supabase table mapping (feature folder → table)
- `src/features/documents` → `genealogy_document`
- `src/features/familycode` → `family_management`
- `src/features/notices` → `notice`
- `src/features/photos` → `genealogy_photo`

When adding queries or types, align with these table names. Export a `*_TABLE` constant from the feature `api` module when helpful.

## 3) Naming Conventions
- Component files: `PascalCase.tsx` (e.g., `ExamCard.tsx`).
- Hooks: `useXxx.ts` (e.g., `useExamList.ts`).
- Utility/service files: `camelCase.ts`.
- Feature folders and route segments: `kebab-case`.
- Type/interface names: `PascalCase`; constants: `UPPER_SNAKE_CASE`.

## 4) React and State Rules
- Use functional components and hooks only.
- Keep components presentational when possible; move side effects to hooks.
- Avoid prop drilling over 2+ levels; prefer context/store only when necessary.
- Keep state as local as possible, then lift only when shared usage is proven.
- Derive state from source data instead of duplicating computed values.

## 5) API Integration Rules
- All HTTP calls go through `src/shared/api` or `src/features/*/api`.
- Do not call `fetch/axios` directly inside page UI components.
- Centralize auth header injection and error mapping in API client.
- Use environment variables for base URL (e.g., `VITE_API_BASE_URL`).
- Never hardcode secret-like values in source code.

## 6) UI/UX Rules
- Every async screen must implement loading, empty, error states.
- Disable submit buttons while requests are in-flight to prevent duplicates.
- Keep user-facing error messages friendly; log technical details separately.
- Ensure keyboard accessibility for interactive elements.

## 7) Security Rules
- Do not store sensitive tokens in localStorage unless absolutely required.
- Never commit `.env` or credential-like values.
- Render user-generated text safely; avoid `dangerouslySetInnerHTML` by default.
- Validate file upload type and size before sending to backend.

## 8) Testing and Quality Gates
- Add/update tests for changed UI behavior and client logic.
- Prefer:
  - unit tests for hooks/utils,
  - component tests for UI behavior,
  - integration tests for API flow-critical screens.
- Keep PRs small and focused (one concern per PR when possible).
- Run lint, type-check, and tests before merge.

## 9) Git and Commit Conventions
- Branch names: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- Commit style (recommended): `feat: ...`, `fix: ...`, `refactor: ...`, `test: ...`, `docs: ...`.
- Commit messages should explain intent and impact, not only changed files.
