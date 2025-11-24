## Erik Schoeffler – Website

This is the source code for Erik Schoeffler's official website, built with Next.js and internationalization (multi-language) support via `next-intl`. The website presents content including a homepage, schedule, media, and information about Erik.

### Technical Overview

- **Next.js 15.5.2** (App Router)
- **React 19.1.0**
- **TypeScript**
- **next-intl** for translations and language switching (English, Swedish, French)
- **Cloudinary** for image management and optimization
- **Nodemailer** for contact forms
- **Framer Motion** for animations
- Component-based structure in `components/`

### Main Features

- **Page Navigation:**

  - `/` – Homepage with hero section, previews, and contact form
  - `/schedule` – Schedule with upcoming concerts and events
  - `/media` – Media page with YouTube videos, Spotify embeds, and image gallery
  - `/about` – Information about Erik Schoeffler
  - `/news` – News page

- **Language switching** via `LanguageSwitcher` (English, Swedish, French)
- **Responsive design** with mobile menu (`MobileMenu`) for small screens
- **Context-driven header** with animations and state management via `ActiveContext`
- **Contact form** with email functionality
- **Image gallery** with images from Cloudinary
- **Responsive hero images** from Cloudinary with different sizes for different screen sizes

### Getting Started (Development)

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root and add the necessary environment variables (see Environment Variables below).

3. Start the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser.

Changes to files under `app/` and `components/` will automatically reload.

### Scripts

- `npm run dev` – starts the development server
- `npm run build` – builds for production
- `npm run start` – starts production server (requires build)
- `npm run lint` – runs ESLint

### Project Structure

```
erik-shoeffler/
├── app/                          # Next.js App Router
│   ├── about/                    # About Erik page
│   ├── agenda/                   # Schedule page (deprecated, use /schedule)
│   ├── api/                      # API routes
│   │   ├── contact/              # Contact form endpoint
│   │   ├── gallery/              # Gallery images from Cloudinary
│   │   └── hero-image/           # Hero images from Cloudinary
│   ├── context/                  # React Context (ActiveContext)
│   ├── i18n/                     # Internationalization configuration
│   ├── media/                    # Media page
│   ├── news/                     # News page
│   ├── schedule/                 # Schedule page
│   ├── layout.tsx                # Root layout with Header and Footer
│   └── page.tsx                  # Homepage
├── components/
│   ├── features/                 # Feature components
│   │   ├── contact/              # Contact form
│   │   └── gallery/              # Image gallery
│   ├── layout/                   # Layout components
│   │   ├── Footer/               # Footer
│   │   └── Header/               # Header with navigation
│   │       ├── MobileMenu.tsx    # Hamburger menu for mobile
│   │       ├── Navbar.tsx        # Navigation menu
│   │       └── RequestButton.tsx # REQUEST/BACK button
│   ├── LanguageSwitcher/         # Language switching
│   │   └── messages/             # Translation files (en.json, sv.json, fr.json)
│   ├── sections/                 # Sections for homepage
│   │   ├── AboutPreview/         # Preview about Erik
│   │   ├── FormSpacer/           # Spacer for contact form
│   │   ├── Hero/                 # Hero section with image and form
│   │   ├── ListenPreview/        # Media preview
│   │   └── RepertoirePreview/    # Repertoire preview
│   └── ui/                       # UI helper components
├── public/                       # Static assets
│   ├── favicon.png               # Favicon
│   ├── flags/                    # Flags for language switching
│   └── ...                       # Other images and icons
└── types/                        # TypeScript types and interfaces
    └── interfaces.ts             # Centralized interfaces
```

### Translations

Translations are handled via `next-intl` with message files in `components/LanguageSwitcher/messages/`:

- `en.json` – English
- `sv.json` – Swedish
- `fr.json` – French

Translations are used in components via the `useTranslations()` hook, for example:

```typescript
const t = useTranslations("Header");
const homeLabel = t("home");
```

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

**Cloudinary (for image management):**

```
CLOUDINARY_ACCOUNT=your-cloudinary-account-name
# Alternatively, if using full Cloudinary configuration:
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Email (for contact form):**

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=recipient@example.com
```

**Important:** Never commit `.env.local` to git. This file contains sensitive information and should be in `.gitignore`.

### API Routes

- **`/api/contact`** – POST endpoint for contact form. Receives `name`, `email`, `tel` (optional), and `message`, validates input, and sends email via Nodemailer.

- **`/api/gallery`** – GET endpoint that fetches images from the Cloudinary folder `eric-schoeffler/gallery`. Returns optimized image URLs.

- **`/api/hero-image`** – GET endpoint that returns Cloudinary URLs for hero images. Query parameters:
  - `image` – Image name (e.g., `eric-standing`)
  - `small` – `true` for small screens, `false` or omitted for large screens
  - `width` – Desired width (default: 1200)

### Build and Deployment

1. Build the project:

```bash
npm run build
```

2. Test production locally:

```bash
npm run start
```

3. For deployment on Vercel:
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel Dashboard
   - Vercel auto-detects Next.js projects and builds automatically

### License

Unless otherwise stated, the content is copyrighted by the project owner.
