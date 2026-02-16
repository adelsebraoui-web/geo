# Shims Harmony Hub

En React-applikation för shimberäkningar byggd med Vite, React, TypeScript och shadcn/ui.

## 🚀 GitHub Pages Deployment

Detta projekt är konfigurerat för automatisk deployment till GitHub Pages.

### Steg för att aktivera:

1. **Pusha koden till GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/DITT-ANVÄNDARNAMN/shims-harmony-hub-main.git
   git push -u origin main
   ```

2. **Aktivera GitHub Pages:**
   - Gå till ditt repository på GitHub
   - Klicka på "Settings" → "Pages"
   - Under "Build and deployment":
     - Source: Välj "GitHub Actions"
   - Spara inställningarna

3. **Första deployment:**
   - Workflow körs automatiskt vid push till main-branchen
   - Efter ca 2-3 minuter kommer din site vara live på:
     `https://DITT-ANVÄNDARNAMN.github.io/shims-harmony-hub-main/`

### Uppdateringar

Varje gång du pushar till `main`-branchen så kommer sidan automatiskt att byggas om och deployas.

```bash
git add .
git commit -m "Dina ändringar"
git push
```

## 💻 Lokal utveckling

### Installation
```bash
npm install
```

### Utvecklingsserver
```bash
npm run dev
```
Öppna [http://localhost:8080](http://localhost:8080)

### Bygga för produktion
```bash
npm run build
```

### Förhandsgranska produktionsbygget
```bash
npm run preview
```

## 🛠️ Teknologier

- **React 18** - UI-bibliotek
- **TypeScript** - Typsäkerhet
- **Vite** - Build-verktyg och dev-server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI-komponenter
- **React Router** - Routing
- **React Hook Form** - Formulärhantering
- **Zod** - Schema-validering

## 📝 Projektstruktur

```
shims-harmony-hub-main/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/                     # Statiska filer
├── src/
│   ├── components/            # React-komponenter
│   ├── pages/                 # Sidor
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities
│   └── main.tsx              # Entry point
├── index.html
├── package.json
├── vite.config.ts             # Vite-konfiguration
└── tailwind.config.ts         # Tailwind-konfiguration
```

## 🔧 Viktiga filer för GitHub Pages

- `.github/workflows/deploy.yml` - GitHub Actions workflow för automatisk deployment
- `vite.config.ts` - Konfigurerad med rätt base path för GitHub Pages

## 📄 Licens

Projektet är privat enligt package.json.
