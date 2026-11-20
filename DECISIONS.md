# Rozhodnutí

Zdroj pravdy je `design/MaturitaRAG.pen`, framy 20–39 („· Glass“) a jejich tmavé kopie. Tady je zapsané všechno, co design neříká, a nejjednodušší řešení, které jsem zvolil.

## Vzhled a materiály

- **Výchozí režim je světlý.** Tmavý a „Podle systému“ si uživatel zapne v menu vzhledu (ozubené kolo u účtu). Volba se pamatuje v `localStorage`.
- **Tmavý režim je jeden markup.** Framy „· Glass · Dark“ mají stejnou strukturu jako světlé, liší se jen tématem. Ověřil jsem to diffem JSON. Tmavý režim proto řeší jen tokeny v `.dark`, které generuje `scripts/gen-tokens.mjs`.
- **Výchozí řádkování je 1,31.** pen.dev vykresluje text bez `lineHeight` s výškou 13 → 17 px a 32 → 42 px. Totéž platí na `body`.
- **`text-wrap: balance` a `pretty`** podle zadání. Nadpisy a odstavce se proto místy zalamují jinak než v designu, například „Příčiny první / světové války“.
- **Sklo má `saturate(180 %)`** podle zadání, pen.dev saturaci nemá. Sklo nad modrým hero je bez saturace, jinak z něj vznikne plná akcentová barva (nejvíc je to vidět v tmavém režimu).
- **Mesh gradienty** (pozadí 3×3, hero 3×2) jsou poskládané z radiálních gradientů na fixní vrstvě.
- **Hover a focus stavy nakreslené jako trvalé:** první řádek „Dnes k opakování“, segment „Umím“ v hodnocení kartičky a modré pole „Výsledek“ ve 27b. Na webu jsou to hover a focus stavy, ne výchozí vzhled.
- **Klávesa správné odpovědi v tmavém režimu** má tmavý text. Design používá bílou na světle zelené, a to nesplňuje AA.
- **Chybná odpověď v kvízu** (design ji nemá) používá `error`/`error-soft` stejně, jako správná používá `success`.
- **Zelená obálka balíčku „Ekonomika a podnikání“** používá hex barvy přímo z designu (v obou režimech stejné).

## Layout a responzivita

- **iOS stavový řádek (9:41) a domovský indikátor** z mobilních framů nevykresluju, jsou součástí systému.
- **Breakpointy:** pod 1024 px je mobilní chrome (plovoucí tab bar, layout podle framů 25 a 36–38), od 1024 px sidebar. Mezi 768 a 1023 px se desktopový obsah skládá do jednoho nebo dvou sloupců.
- **Fokusové obrazovky** centrují kartu a akční lištu do prostoru pod horní lištou. To odpovídá framům 23, 30, 31 a 32 (střed je v obou případech na y = 492). Frame 33 má kartu asi o 20 px výš, zůstává centrovaná stejně jako ostatní.
- **Akční lišta** je `sticky` dole. Když se obsah nevejde, drží se 24 px od spodního okraje.
- **Sbalený sidebar** nechá vlevo nahoře skleněné tlačítko „Zobrazit panel“.
- **Okraj posunu** pod horní lištou se objeví až po scrollu (gradient do `bg-d`). V klidu by změnil barvu pozadí nahoře.
- **Rozbor na mobilu** neukazuje „Tvoje odpověď“, protože ji frame 38 nemá.

## Obsah a data

- **Počty se počítají z dat.** „Dnes k opakování“ má 4 řádky, takže „4 položky“ (design uvádí 3). Kartičky: badge v sidebaru je 6, balíček má tedy 6 karet a ukazuje „1 z 6“ místo „3 z 12“. Statistiky v „Hotovo“ se počítají ze session.
- **Mock obsah doplněný z faktů v designu:** kvíz má 8 otázek, otázka 2 je z designu a ostatní jsou složené z textů podkladu, kritérií a mapy. Balíček má 6 kartiček a zdroj 2 („Časová osa“) má text z inspektoru mapy.
- **Plný obsah má jen otázka `dejepis/7`.** Ostatní otázky odkazované z „Dnes“ a ze sidebaru nemají ověřený podklad, takže ukazují stav z framu 39 „Studium · bez podkladu“. „Nahlásit chybějící zdroj“ jen lokálně potvrdí nahlášení. Text stavu („Můžeš otevřít osnovu…“) je převzatý z designu.
- **Číselná úloha 27b** patří k otázce `matematika/4`. Uzavřená úloha se vyhodnotí podle uloženého klíče (24 · 8 = 192 cm³) a výsledek se ukáže v akční liště. Tento stav design nemá.
- **Odevzdání textové zkoušky** vede na `rozbor/1` (mock vyhodnocení z framu 28). `rozbor/2` je pokus bez vyhodnocení, tedy stav z framu 39.
- **Výpadek tutora** se simuluje přes `?simulace=tutor-nedostupny`. Odpověď pak skončí stavem z framu 39 včetně „Zkusit znovu“.
- **Citace ve streamované odpovědi** jsou v textu jako malé číslo `[n]` (tlačítko) a pod odpovědí jako čipy. Úvodní odpověď z designu má jen čipy. Aktivní čip je ten, jehož zdroj je otevřený v inspektoru.
- **Konec kvízu** design nemá, proto používá kartu „Hotovo“ z framu 33.
- **Počet otázek** z nastavení kvízu se předává jako `?pocet=`.
- **Mapa pojmů** existuje jen pro `dejepis/7`. Uzly bez detailu ukazují v inspektoru navazující pojmy z grafu. Zoom má rozsah 50–200 % a tlačítko „přizpůsobit“. „Seznam vazeb“ přepne plátno na přístupný seznam a na mobilu je seznam místo plátna.
- **⌘K** hledá v otázkách a stránkách bez ohledu na diakritiku.

## Akce, které design nekreslí

Viditelné, ale neaktivní (`aria-disabled`, titulek „…připravujeme“): Pokrok, redakční Balíčky / Otázky / Publikace / Ověřování, Oznámení, „Více“, Sdílet, příloha a diktování, Celý podklad, Porovnat se vzorovou odpovědí, Zobrazit odpověď (u pokusu bez vyhodnocení), Zadat kód a Zrušit import.

Funkční navíc:

- **Ozubené kolo u účtu** otevře menu vzhledu (Světlý / Tmavý / Podle systému).
- **Záložka** u otázky se přepíná: obrys, při uložení výplň.
- **„Zkontrolovat 2 chyby“** filtruje tabulku importu na chybné řádky.

## Pohyb

- **Akce z klávesnice se neanimují:** ⌘K otevřené klávesou, výběr odpovědi A–D, hodnocení kartičky klávesami 1–3. Výjimkou je otočení kartičky: kliknutí i mezerník otočí kartu ve 3D (rotateY 180°, 520 ms, CSS přechod); obě strany sdílí jednu buňku mřížky, takže karta nemění výšku.
- **Kartičky jsou balíček:** pod horní kartou vykukují další dvě (posun 14 px, scale −5 % na úroveň). Ohodnocená karta odletí podle hodnocení (Ještě neumím doleva, Umím doprava, Částečně a Přeskočit nahoru) a balíček se posune nahoru. Hodnocení z klávesnice je okamžité. Tlačítka hodnocení se při hoveru nadzvednou, při stisku se zmenší a bliknou barvou hodnocení. Reduced motion: strany se jen prolnou, bez rotace a posunu.
- **Inspektor, bottom sheet a ⌘K** se materializují (opacity, scale 0,98 → 1, blur), sheet vyjíždí springem bez odrazu.

## Next.js 16

- Projekt má zapnuté Cache Components a Partial Prefetching (výchozí stav `create-next-app`). Dynamické routy mají `generateStaticParams` z mocků a obsah čtoucí `params` je v `<Suspense>`, takže se všechny stránky předrenderují.
