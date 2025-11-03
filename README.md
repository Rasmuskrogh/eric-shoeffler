## Erik Shoeffler – Webbplats

Detta är källkoden för Erik Shoefflers officiella webbplats, byggd med Next.js och internationellt stöd (flerspråk) via `next-intl`. Webbplatsen presenterar innehåll som startsida, spelplan/schedule, media samt information om Erik.

### Teknisk översikt

- Next.js (App Router)
- React 18
- `next-intl` för översättningar och språkbyte
- Komponentbaserad struktur i `components/`

### Huvudfunktioner

- Navigation mellan sidor: `/` (hem), `/schedule`, `/media`, `/about`
- Språkväxling via `LanguageSwitcher`
- Responsiv meny för mobila enheter (`MobileMenu`)
- Kontextstyrd header-animation och tillståndshantering via `ActiveContext`

### Kom igång (utveckling)

1. Installera beroenden:

```bash
npm install
```

2. Starta utvecklingsservern:

```bash
npm run dev
```

3. Öppna `http://localhost:3000` i webbläsaren.

Ändringar i filer under `app/` och `components/` laddas om automatiskt.

### Scripts

- `dev`: startar utvecklingsservern
- `build`: bygger produktion
- `start`: startar produktion (kräver bygg)

### Projektstruktur (utdrag)

- `app/` – sidor och routing (App Router)
- `components/` – UI-komponenter som `Header`, `Navbar`, `LanguageSwitcher`, `MobileMenu`, `RequestButton`
- `types/` – TypeScript-typer och gränssnitt (t.ex. `NavItem`)
- `public/` – statiska tillgångar (t.ex. logotyper och bilder)

### Översättningar

Översättningar hanteras via `next-intl`. Se lokala meddelandefiler under `app/` (eller motsvarande plats) samt användningen av `useTranslations("Header")` i komponenter som `Header`.

### Miljövariabler

Om tjänster/tredjepart läggs till (t.ex. analytics, API:er) dokumentera nödvändiga variabler i `.env.example` och i denna sektion.

### Bygg och driftsättning

Standardprocessen för Next.js gäller. T.ex. på Vercel:

```bash
npm run build
```

Följ sedan din plattforms instruktioner för driftsättning. På Vercel autodetekteras Next.js-projekt.

### Licens

Om inte annat anges är innehållet upphovsrättsskyddat av projektägaren. Lägg till eller uppdatera licenstyp här vid behov.
