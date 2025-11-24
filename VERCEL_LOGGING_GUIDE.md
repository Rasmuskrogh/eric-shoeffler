# Hur man ser server-fel i Vercel

## 1. Via Vercel Dashboard (Enklast)

1. Gå till [vercel.com](https://vercel.com) och logga in
2. Välj ditt projekt (`eric-shoeffler`)
3. Klicka på **"Deployments"** i menyn
4. Klicka på den senaste deploymenten
5. Klicka på fliken **"Functions"** eller **"Logs"**
6. Här ser du alla server-side logs, inklusive:
   - `console.log()` statements
   - `console.error()` statements
   - Server-side errors
   - API route logs

## 2. Via Vercel CLI (Mer detaljerat)

Om du har Vercel CLI installerat lokalt:

```bash
# Installera Vercel CLI (om du inte har det)
npm i -g vercel

# Logga in
vercel login

# Se logs i realtid
vercel logs eric-shoeffler --follow

# Se logs för en specifik deployment
vercel logs [deployment-url] --follow
```

## 3. Via Vercel Dashboard - Real-time Logs

1. Gå till ditt projekt i Vercel
2. Klicka på **"Logs"** i menyn (eller **"Functions"** → **"View Logs"**)
3. Här kan du se real-time logs från din applikation

## 4. Viktiga loggar att leta efter

Efter att ha lagt till förbättrad logging kommer du se:

- `[Prisma] Initializing database connection` - När Prisma startar
- `[Prisma] Database connection initialized successfully` - Om anslutningen lyckades
- `[Prisma] Failed to create database pool` - Om databasanslutningen misslyckas
- `[AdminPage] Starting page render` - När admin-sidan börjar rendera
- `[AdminPage] Database error:` - Om databasfrågan misslyckas
- `[AdminPage] Fatal error:` - Om något kritiskt fel uppstår

## 5. Felsökning

Om du ser fel i loggarna:

1. **DATABASE_URL saknas**: Se `[Prisma] DATABASE_URL is not set!`

   - Lösning: Lägg till `DATABASE_URL` i Vercel Environment Variables

2. **Databasanslutning misslyckas**: Se `[Prisma] Failed to create database pool`

   - Lösning: Kontrollera att `DATABASE_URL` är korrekt formaterad
   - Format: `postgresql://user:password@host:port/database?sslmode=require`

3. **Server-side rendering fel**: Se `[AdminPage] Fatal error:`
   - Lösning: Kolla error details i loggen för mer information

## Tips

- Logs är bästa sättet att felsöka production-problem
- Använd `console.error()` för fel och `console.log()` för debugging
- Alla `console.log()` och `console.error()` visas i Vercel logs
- Server Components errors visas också i logs
