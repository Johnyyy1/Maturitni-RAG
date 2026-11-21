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
- **Fokusové obrazovky** centrují kartu a akční lištu do prostoru pod horní lištou. To odpovídá framům 23, 30, 31 a 32 (střed je v obou případech na y = 492). Frame 33 má kartu asi o 20 px výš, zůstává centrovaná stejně jako ostatní. Na mobilu (pod 1024 px) je karta kvízu a kartiček ukotvená shora a akční lišta dole: přidané „Proč“ nebo odpověď by jinak celou kartu posunuly nahoru. Karta „Hotovo“ zůstává centrovaná.
- **Spodní navigace na mobilu** je jen na kořenových obrazovkách (`/`, `/balicky`). Detail otázky, Studovat, Mapa, Rozbor i fokusové toky ji nemají; zpět vede tlačítko v horní liště.
- **Studovat a Mapa sdílí hlavičku** z layoutu `(rezim)`: na mobilu zpět vlevo a přepínač režimu vycentrovaný ve zbytku šířky. Hlavička se mezi záložkami nepřemountuje. Zkouška zůstává fokusový tok s vlastní lištou (bez sidebaru), proto do layoutu nepatří.
- **Safe area a klávesnice.** Viewport má `viewport-fit=cover` a `interactive-widget=resizes-content`. iOS Safari druhou volbu ignoruje, proto composer tutora sleduje `visualViewport` a drží se nad klávesnicí. Akční lišta zkoušky na iOS zůstává pod klávesnicí.
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
- **Mapa pojmů** existuje jen pro `dejepis/7` (`detail.map`); u ostatních otázek se odkazy na mapu nezobrazují. Každý pojem má krátké vysvětlení s citací podkladu a navazující pojmy z grafu. Zoom má rozsah 50–200 % a tlačítko „přizpůsobit“. „Seznam vazeb“ přepne plátno na přístupný seznam a na mobilu je seznam místo plátna.
- **⌘K** hledá v otázkách a stránkách bez ohledu na diakritiku.

## Akce, které design nekreslí

Pravidlo: co nefunguje a v pilotu nebude, je skryté (Další akce „…“, Sdílet, Oznámení, příloha a diktování v chatu tutora).
Co přijde brzy, je viditelné, ale zřetelně neaktivní (`aria-disabled`, opacita 45 %, bez hoveru a stisku, textová tlačítka se štítkem „Brzy“): Pokrok, redakční Balíčky / Otázky / Publikace / Ověřování, „Více“, Celý podklad, Porovnat se vzorovou odpovědí, Zobrazit odpověď (u pokusu bez vyhodnocení), Zadat kód a Zrušit import.
Stránka `/design` i její položka v hledání existují jen ve vývojovém režimu; v produkci vrací 404.
Hero „Pokračovat“ bere název, odkaz i postup („3 z 5 kroků“) z osnovy rozpracované otázky. Zkouška nanečisto ukazuje vždy zadání dané otázky.

Funkční navíc:

- **Ozubené kolo u účtu** otevře menu vzhledu (Světlý / Tmavý / Podle systému).
- **Záložka** u otázky se přepíná: obrys, při uložení výplň.
- **„Zkontrolovat 2 chyby“** filtruje tabulku importu na chybné řádky.
- **Diktovat** ve zkoušce zapne mikrofon a pole odpovědi reaguje na hlas efektem `voice-glow`. Přepis řeči na text zatím není.

## Pohyb

- **Klávesové zkratky reagují okamžitě.** Mezerník odhalí odpověď krátkým prolnutím. Kliknutí přidá blur 2 → 0 px za 180 ms. Obě strany sdílí jednu buňku mřížky a karta si při odhalení zachová výšku.
- **Kartičky jsou balíček.** Pod horní kartou vykukují až dvě neprůhledné karty. Po hodnocení ukazatelem horní karta odchází doleva, doprava nebo nahoru podle akce. Na dotyku lze ohodnotit i tažením. Karta se otáčí ve 3D a i hodnocení klávesami 1–3 ji pošle odpovídajícím směrem; omezený pohyb ponechá prolnutí.
- **Inspektor, bottom sheet a ⌘K.** Inspektor přichází zprava, mobilní sheet zdola a ⌘K se zobrazí okamžitě.
- **Tutor má tvář.** Animovaný avatar `bot-avatars` (vždy tvar „clover“, `components/ui/tutor-avatar.tsx`) je jen u tutora: v hlavičce odpovědi pracuje během streamu, při výpadku spí a ve stavu bez podkladu nahrazuje ikonu. Jinde se nepoužívá, aby vždy znamenal tutora.

## Next.js 16

- Projekt má zapnuté Cache Components a Partial Prefetching (výchozí stav `create-next-app`). Dynamické routy mají `generateStaticParams` z mocků a obsah čtoucí `params` je v `<Suspense>`, takže se všechny stránky předrenderují.
