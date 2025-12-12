# ContentEditor Module Structure

Denna mapp innehåller refaktorerad kod från den ursprungliga `ContentEditor.tsx` filen (som var ~3100 rader).

## Struktur

```
ContentEditor/
├── hooks/                    # React hooks för state management
│   ├── useContentEditorState.ts      # Alla useState hooks
│   ├── useLanguageSwitching.ts       # Språk-växling logik
│   └── index.ts                      # Exports
├── fields/                   # Field rendering komponenter
│   └── FieldRenderer.tsx            # Återanvändbar field renderer
├── lists/                    # List management hooks
│   └── (kommer snart)
├── imageUpload/              # Image upload funktionalitet
│   └── useImageUpload.ts            # Hook för alla image uploads
├── data/                     # Data operations
│   └── dataSanitization.ts          # sanitizeSharedData funktion
└── ui/                       # UI komponenter
    └── (kommer snart)
```

## Status

### ✅ Klart
- ✅ Mappstruktur skapad
- ✅ `useContentEditorState` - State management hook
- ✅ `useLanguageSwitching` - Språk-växling hook
- ✅ `useImageUpload` - Image upload hook
- ✅ `dataSanitization` - Data sanitization funktion
- ✅ `FieldRenderer` - Field rendering komponent (grundläggande)

### 🔄 Pågående
- Huvudfilen använder nu de extraherade modulerna
- Ytterligare refaktorering behövs för:
  - List management hooks
  - Data saving logic
  - UI komponenter
  - Initialization hook

### 📝 TODO
- [ ] Extrahera `useContentInitialization` hook (stor useEffect)
- [ ] Extrahera list management hooks (`useSingleListManager`, `useMultipleListsManager`)
- [ ] Extrahera data saving logic (`useContentSaving`)
- [ ] Skapa UI komponenter (`EditorHeader`, `LanguageTabs`, etc.)
- [ ] Ta bort redundans mellan `saveSingleListItem` och `saveSingleListItemInKey`
- [ ] Konsolidera field rendering (använd `FieldRenderer` överallt)

## Användning

Huvudfilen `ContentEditor.tsx` importerar nu från dessa moduler:

```typescript
import { useContentEditorState, useLanguageSwitching } from "./ContentEditor/hooks";
import { sanitizeSharedData } from "./ContentEditor/data/dataSanitization";
import { useImageUpload } from "./ContentEditor/imageUpload/useImageUpload";
```

## Nästa steg

1. Extrahera initialization logik till `useContentInitialization`
2. Skapa list management hooks
3. Skapa UI komponenter för bättre separation of concerns
4. Ta bort all redundans

