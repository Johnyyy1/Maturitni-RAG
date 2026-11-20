# Design aplikace Studium

## Účel a předloha

Rozhraní pomáhá studentovi vybrat otázku, studovat z ověřených podkladů,
vyzkoušet se a pokračovat procvičováním. Texty jsou česky, stručné a konkrétní.
Tutor ukazuje citace a umožňuje otevřít příslušnou pasáž zdroje.

Vizuální předloha je `design/MaturitaRAG.pen`, framy 20–39 „· Glass“ a jejich
varianty Dark. Mapování obrazovek na routy je v `README.md`.
`DECISIONS.md` zaznamenává záměrné odchylky a chování, které předloha neřeší.
Tento dokument shrnuje systém; přesné rozměry jednotlivých obrazovek ber z předlohy a komponent.

## Barvy a témata

Barvy mají sémantické tokeny v `app/tokens.css`; Tailwind je zpřístupňuje přes
`@theme inline` v `app/globals.css`. Používej například `bg-panel`, `text-fg`,
`text-muted`, `border-border` a `text-accent` místo nových barev natvrdo.

| Úloha | Světlý režim | Tmavý režim |
| --- | --- | --- |
| Základ `app` | `#F8F9FB` | `#101114` |
| Panel `panel` | `#FFFFFF` | `#17181C` |
| Text `fg` | `#17181D` | `#ECEEF3` |
| Vedlejší text `muted` | `#5E6270` | `#A1A5B2` |
| Akcent `accent` | `#2B55CC` | `#8EABFF` |
| Úspěch `success` | `#207A58` | `#79D2AC` |
| Varování `warning` | `#A56017` | `#E9B374` |
| Chyba `error` | `#B53B47` | `#FA939F` |

Tabulka je orientační výpis tokenů. Jejich zdroj upravuj v `.pen` a spusť
`node scripts/gen-tokens.mjs`. Generovaný CSS soubor neupravuj ručně.
Světlý režim je výchozí; menu vzhledu nabízí tmavý a systémový režim.
Oba režimy sdílejí strukturu komponent, barvy přepíná `.dark`.

## Materiály a hierarchie

- `mesh-app`: jemné radiální gradienty v pozadí aplikace.
- `mesh-hero`: modré zvýraznění hlavního obsahu.
- `glass-thin`, `glass`, `glass-thick`: navigace, lišty a ovládací vrstvy;
  blur je 16, 28 a 40 px se saturací 180 %.
- `glass-on-hero`: sklo nad modrým pozadím bez zvýšené saturace.
- `surface`: téměř neprůhledná plocha pro čtení a práci s obsahem.
- `solid` a `raised`: ovládací prvky uvnitř skla; nevkládej další sklo do skla.
- `ink`: výrazné primární tlačítko s textem `on-fg`.

Používej komponenty z `components/ui/`, ikony přes `components/icon.tsx`
a existující stíny, obrysy a zaoblení. Stav nesděluj pouze barvou.

## Typografie a rozložení

Písmo je Geist Sans, pro monospace Geist Mono. Základní řádkování je 1,31;
nadpisy používají `text-wrap: balance`, odstavce `pretty`.
Číselné údaje mohou používat `.tnum`. České jednopísmenné předložky a spojky
spojuj s následujícím slovem nedělitelnou mezerou; kontroluje je
`node scripts/czech-typography.mjs --check`.

Od 1024 px se používá sidebar, pod touto šířkou mobilní navigace.
V rozsahu 768–1023 px se obsah skládá do jednoho nebo dvou sloupců.
Fokusové obrazovky centrují pracovní kartu na desktopu; na mobilu je karta ukotvená pod hlavičkou,
aby vyhodnocení nebo otočení kartu neposunulo. Akční lišta zůstává sticky dole.
Spodní navigace patří jen kořenovým obrazovkám (Dnes, Předměty); vnořené a soustředěné obrazovky ji nemají.
Horní i spodní plovoucí lišty respektují safe area (`top-chrome`, `bottom-chrome`), výšky používají `dvh`.
Inspektor zdrojů se na mobilu mění na bottom sheet, mapa pojmů na seznam vazeb.
Systémový stavový řádek telefonu ani domovský indikátor se nekreslí do stránky.

## Interakce a přístupnost

Zachovej viditelný `:focus-visible`, popisky ikonových tlačítek, klávesové ovládání
a návrat focusu z dialogů. Malé ovládací prvky mají rozšířenou dotykovou plochu `.hit`.

- ⌘K / Ctrl+K otevře hledání.
- V kvízu A–D volí odpověď a Enter potvrzuje nebo pokračuje.
- U kartiček mezerník otáčí a 1–3 hodnotí.

Pohyb podporuje změnu stavu: `.press` používá 120 ms a stisk na 0,96;
kartička se otočí ve 3D za 650 ms (kliknutím i mezerníkem) a po hodnocení odjede doleva (1), nahoru (2) nebo doprava (3). Ostatní klávesové akce se neanimují.
Inspektor a dialogy používají krátké zjevení, sheet pružinu bez odrazu.
Respektuj `prefers-reduced-motion`, `prefers-reduced-transparency` a
`prefers-contrast`; existující CSS nabízí neprůhledné alternativy materiálů.

## Stavy a kontrola změn

Navrhuj i načítání, prázdný výsledek, chybějící podklad, výpadek tutora,
nevyhodnocený pokus a chybné odpovědi. Vycházej ze sdílených stavových komponent
a framu 39. Nedostupné akce jsou označené a vysvětlené podle `DECISIONS.md`.
Počty odvozuj z dat. Citace musí odpovídat zdrojům konkrétní otázky.

Vizuální úpravu zkontroluj při 1440 × 900 a 390 × 844 v obou tématech,
včetně delšího textu, focusu a chybového stavu. Skript pro snímky a příkazy
Playwrightu jsou v `README.md`. Nové záměrné odchylky zapiš do `DECISIONS.md`.
