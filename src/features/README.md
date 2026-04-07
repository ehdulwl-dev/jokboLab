# Features Layer

Each feature folder maps to a Supabase table (see project `rules.md`). Current domains:

| Feature folder | Supabase table |
|----------------|----------------|
| `documents/` | `genealogy_document` |
| `familycode/` | `family_management` |
| `notices/` | `notice` |
| `photos/` | `genealogy_photo` |

Other folders (e.g. `inquiries/`) follow the same pattern; add a row here when the table is fixed.

Each feature can contain:

- `components/`
- `hooks/`
- `api/`
- `types.ts`
