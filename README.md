# Maturitni-RAG



# Maturitní studijní aplikace

Jedna aplikace pro přípravu k maturitě napříč předměty. Student pracuje s naší vlastní bankou otázek a materiálů. Může se vyzkoušet nanečisto, zeptat se tutora, projít myšlenkovou mapu a procvičit slabší místa pomocí kvízů a kartiček.

## Rozdělení vývoje

| Role | Odpovědnost |
| --- | --- |
| Frontend pro studenty | Studentské obrazovky, navigace a napojení na API. |
| Administrace a import | Redakční rozhraní, administrační API, import a publikování obsahu. |
| Jádro backendu | Databáze, účty a oprávnění, studentské API, hodnocení a pokrok. |
| AI a práce s podklady | Zpracování podkladů, RAG, tutor, návrhy studijních výstupů a NotebookLM MCP. |

### 1. Frontend pro studenty

- Vytvoří výběr předmětu, detail otázky, zkoušku nanečisto, výsledek a přehled pokroku.
- Zobrazí chat s odkazy na zdroje, myšlenkovou mapu, kvíz a kartičky. Pohlídá průchod mezi nimi na telefonu i desktopu.
- **První výstup** Student vybere otázku, odpoví a zobrazí výsledek. První verze obrazovky může používat ukázková data podle dohodnutého API.

### 2. Administrace a import

- Postaví editor předmětů, témat, otázek, řešení a příloh včetně příslušného API.
- Připraví hromadný import s náhledem, chybami u jednotlivých položek, koncepty a publikováním.
- Přidá redakční kontrolu a publikování návrhů map a kartiček.
- **První výstup** Autor naimportuje otázky ze dvou předmětů, opraví chybu a publikuje balíček dostupný studentům.

### 3. Jádro backendu

- Spravuje databázový model, přihlášení, oprávnění a studentské API. S administrací domluví, jak aplikace čte publikované verze obsahu.
- Implementuje ukládání pokusů, bodování podle klíče, historii výsledků a termíny opakování kartiček.
- Připraví sdílené testovací nasazení aplikace.
- **První výstup** Backend uloží pokus a vyhodnotí otázku podle klíče. Před odevzdáním poskytne jen zadání a přílohy určené k řešení.

### 4. AI a práce s podklady

- Zpracuje schválené podklady pro vlastní RAG a zachová odkazy na stránky nebo konkrétní pasáže.
- Přes OpenAI Agents SDK zapojí tutora s citacemi a generování návrhů map, kartiček a zpětné vazby podle hodnoticích kritérií.
- Ověří oficiální NotebookLM MCP na vytvoření sešitu, vložení podporovaného zdroje a stavu zpracování.
- **První výstup** Tutor zodpoví dotaz k publikované otázce a odkáže na konkrétní místo ve schváleném podkladu.

## Jak na sebe práce navazuje

1. **Dohoda o rozhraní.** Frontend, administrace a backend si odsouhlasí podobu otázky, příloh, odevzdané odpovědi a výsledku. AI část s nimi sjednotí formát citací a dat pro mapu a kartičky.
2. **První společné demo.** Administrace publikuje jednu matematickou a jednu ústní otázku. Studentské rozhraní je zobrazí, backend uloží oba pokusy a výpočet vyhodnotí podle klíče. U ústní otázky student po pokusu uvidí kritéria. Tutor ve studijním režimu odkáže na schválený podklad.
3. **Rozšíření po demu.** Propojí se mapa, kvízy a kartičky se skutečnými tématy a pokrokem studenta. Redakce může studijní výstupy zkontrolovat a zveřejnit.

**První milník je splněný**, když autor přidá novou otázku v administraci a student ji ve stejné aplikaci vyřeší, dostane zpětnou vazbu a vidí další krok k procvičení.

## Web (frontend): Studium

Česká aplikace na přípravu k maturitě: tutor z ověřených podkladů, zkouška nanečisto, kvízy, kartičky a mapa pojmů. Web je převedený z designu `design/MaturitaRAG.pen` (framy 20–39 „· Glass“ a tmavé kopie).

Stack: Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind CSS v4, Geist, lucide-react, motion, next-themes. Data jsou mock v `lib/mock/*.ts`, backend je jen rozhraní v `lib/api.ts`.

### Spuštění

```bash
npm install
npm run dev            # http://localhost:3000
```

### Route ↔ frame

| Route | Frame |
|---|---|
| `/` | 21 Dnes, 25 Mobil · Dnes |
| `/predmety/[predmet]/otazky/[id]` | 26 Otázka, 36 Mobil · Otázka |
| `/predmety/[predmet]/otazky/[id]/studium` | 22 Studium + tutor (na mobilu inspektor jako bottom sheet) |
| `/predmety/[predmet]/otazky/[id]/zkouska` | 27 Zkouška nanečisto, 37 Mobil · Zkouška, 27b Číselná úloha (`matematika/4`) |
| `/predmety/[predmet]/otazky/[id]/rozbor/[pokus]` | 28 Rozbor, 38 Mobil · Rozbor; `rozbor/2` = stav z 39 |
| `/predmety/[predmet]/otazky/[id]/mapa` | 29 Mapa pojmů (na mobilu seznam vazeb) |
| `/kvizy/novy` | 30 Nastavení kvízu |
| `/kvizy/[id]` | 23 Kvíz → 31 Zpětná vazba |
| `/karticky` | 32 Líc → 24 Odpověď → 33 Hotovo |
| `/balicky` | 34 Katalog balíčků (prázdné hledání = stav z 39) |
| `/redakce/importy/[id]` | 35 Kontrola importu (redakční sidebar) |
| `/design` | 20 Materiály + 39 Stavy (jen ve vývoji, `npm run dev`; v produkci 404) |

Ukázkové adresy: `/predmety/dejepis/otazky/7`, `/kvizy/prvni-svetova-valka`, `/redakce/importy/24`. Výpadek tutora: `/predmety/dejepis/otazky/7/studium?simulace=tutor-nedostupny`.

### Klávesy

- ⌘K / Ctrl+K: hledání
- Kvíz: A–D vybere odpověď, ↵ potvrdí a pokračuje
- Kartičky: mezerník otočí, 1–3 ohodnotí

### Struktura

- `app/globals.css`: Tailwind `@theme`, materiály (`glass-thin`, `glass`, `glass-thick`, `surface`, `solid`, `ink`, mesh pozadí a hero), reduced-transparency / contrast / motion
- `app/tokens.css`: tokeny `:root` / `.dark`, generované z `.pen`
- `app/(app)`: obrazovky se sidebarem, `app/(focus)`: fokusové obrazovky, `app/(redakce)`: redakční prostor
- `components/ui`: komponenty z `.pen` (tlačítka, segmenty, čipy, citace, stavy, sheet, OptionRow)
- `components/*.tsx`: obrazovky (tutor, zkouška, kvíz, kartičky, mapa, katalog, import)

### Skripty a kontroly

```bash
node scripts/gen-tokens.mjs              # tokeny z design/MaturitaRAG.pen → app/tokens.css
node scripts/czech-typography.mjs        # nedělitelné mezery za k, s, v, z, o, u, a, i
node scripts/czech-typography.mjs --check
node scripts/screenshots.mjs <url> <dir> [route…]   # 1440×900 a 390×844, světlý i tmavý
npx tsc --noEmit && npm run lint && npm run build
npx playwright test                      # e2e toky (bez BASE_URL postaví a spustí produkční build)
```

Rozhodnutí tam, kde design něco neřeší, jsou v [DECISIONS.md](DECISIONS.md).
