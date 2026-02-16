# 🚀 SNABBGUIDE: Deploya till GitHub Pages

## Steg 1: Skapa GitHub Repository
1. Gå till github.com och logga in
2. Klicka på "+" → "New repository"
3. Namnge det "shims-harmony-hub-main" (eller välj eget namn)
4. VIKTIGT: Välj "Public" (GitHub Pages fungerar bara gratis på publika repos)
5. Klicka "Create repository"

## Steg 2: Ladda upp koden
Öppna terminalen i projektmappen och kör:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/shims-harmony-hub-main.git
git push -u origin main
```

**OBS:** Byt ut `DITT-ANVÄNDARNAMN` med ditt riktiga GitHub-användarnamn!

## Steg 3: Aktivera GitHub Pages
1. Gå till ditt repository på GitHub
2. Klicka på "Settings" (längst upp till höger)
3. Scrolla ner i vänstermenyn och klicka på "Pages"
4. Under "Build and deployment":
   - **Source:** Välj "GitHub Actions" (INTE "Deploy from a branch")
5. Det är allt! Du behöver inte spara någonting

## Steg 4: Vänta på deployment
1. Gå till "Actions"-fliken i ditt repository
2. Du bör se en workflow som körs (gul cirkel)
3. Vänta tills den blir grön ✓ (tar ca 2-3 minuter)
4. Din site är nu live på:
   ```
   https://DITT-ANVÄNDARNAMN.github.io/shims-harmony-hub-main/
   ```

## ⚠️ VIKTIGT: Om du döpte repot till något annat
Om ditt repository inte heter "shims-harmony-hub-main", måste du uppdatera `vite.config.ts`:

```typescript
base: process.env.NODE_ENV === 'production' ? '/DITT-REPO-NAMN/' : '/',
```

Byt ut `/DITT-REPO-NAMN/` med ditt faktiska repository-namn.

## 🔄 Uppdatera sidan
Varje gång du gör ändringar och pushar:

```bash
git add .
git commit -m "Beskrivning av ändringar"
git push
```

...så byggs och deployas sidan automatiskt!

## ❓ Felsökning

**Sidan visar inte rätt:**
- Dubbelkolla att du valt "GitHub Actions" under Pages-inställningarna
- Kontrollera att base path i vite.config.ts matchar ditt repo-namn

**Workflow failar:**
- Gå till Actions-fliken och klicka på den röda builden för att se felet
- Oftast handlar det om dependencies eller build-fel

**404 när jag besöker sidan:**
- Vänta några minuter till efter första deployment
- Kontrollera att repot är public
- Verifiera att URL:en är rätt: `https://ANVÄNDARNAMN.github.io/REPO-NAMN/`

## 💡 Tips
- Sidan uppdateras automatiskt vid varje push till main-branchen
- Du kan se status på deployments under "Actions"-fliken
- Om något går fel, läs felmeddelandet i Actions-loggen
