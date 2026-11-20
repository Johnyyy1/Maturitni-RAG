# Pohyb ve Studiu

| Prvek | Frekvence | Účel | Rozhodnutí |
| --- | --- | --- | --- |
| ⌘K, klávesové odpovědi, navigace ve výsledcích | Velmi vysoká | Okamžitá odezva | Bez posunu a bez čekání, u odhalení kartičky lze ponechat prolnutí. |
| Tlačítka, řádky a karty | Vysoká | Potvrdit stisk a ukázat interaktivní plochu | CSS stisk, barva, stín a posun šipky. Karty zůstávají na místě. |
| Sidebar, segmenty a tab bar | Vysoká | Ukázat změnu výběru | Sdílená pilulka, jemné přebarvení. |
| Menu, tooltip a hledání myší | Občasná | Ukázat vazbu na spouštěč | Krátké prolnutí a změna měřítka. Výsledky se zobrazují najednou. |
| Trasy a téma | Občasná | Zachovat orientaci | Prolnutí obsahu, na mobilu směrový návrat. Změna tématu prolne celé plátno. |
| Tutor a inspektor | Občasná | Ukázat nový text a otevřený zdroj | Text se prolíná na místě. Inspektor přijíždí od okraje, pasáž se jednou zvýrazní. |
| Kvíz a kartičky | Opakovaná | Oddělit otázky a ukázat vyhodnocení | Krátká odezva myší, okamžité zkratky a přímé tažení na dotyku. |
| Mapa | Občasná | Udržet orientaci při posunu a přiblížení | Přímé gesto, plynulé přiblížení a zvýraznění cesty. |
| Dnes a dokončení | Jednou za relaci nebo průchod | Zpřehlednit hierarchii a potvrdit výsledek | Krátká sekvence, kresba grafu či odznaku. |
| Počítadlo zkoušky, kritéria rozboru a dlouhé seznamy | Vysoká | Čitelnost a stabilní rozložení | Okamžité změny. Pulzuje pouze indikátor živé zkoušky. |
| Katalog, import a ukládání | Občasná | Potvrdit výsledek akce | Výměna ikony, prolnutí stavu a toast. |

## Hodnoty

| Použití | Hodnota |
| --- | --- |
| Stisk, řádky a odznaky kláves | 120 ms, stisk na 0,96 |
| Hover, tooltip, výstup, route | 150 ms |
| Popover, změna výšky composeru, odhalení myší | 180 ms |
| Vyhodnocení možnosti | 200 ms |
| Panel a swipe zpět | 240 ms |
| Přepnutí tématu | 250 ms |
| Kresba, zvýraznění a čítače | 600 ms |
| Živá tečka | 2 s, lineární střídání opacity |
| Pružiny | UI 0,35 s bez odrazu · ikony 0,30 s bez odrazu · gesto a tab bar 0,40 s, bounce 0,2 |
| Křivky | vstup a výstup (0.23, 1, 0.32, 1) · morph (0.77, 0, 0.175, 1) · drawer (0.32, 0.72, 0, 1) · ikony (0.2, 0, 0, 1) |

## Choreografie

### Dnes · Lead → Support, první návštěva relace

| Prvek | Role | Začátek | Délka | Pohyb | Vztah |
| --- | --- | --- | --- | --- | --- |
| Datum a pozdrav | Lead | 0 ms | 240 ms | Opacity, y +8 px, blur 4 px | Začíná jako první |
| Karta Pokračovat | Support | 70 ms | 240 ms | Opacity a y +8 px | Překrývá pozdrav |
| Parabola | Dekorace | 70 ms | 600 ms | Kresba z 0 na 1 | Současně s kartou |
| Podpůrné karty | Support | 140 ms | 240 ms | Opacity a y +8 px současně | Překrývají hero |
| Sloupce grafu | Dekorace | 140–200 ms | 240 ms | ScaleY od spodní hrany, zkracující se odstupy | Překrývají podpůrné karty |
| Vrchol, štítek a postup u grafu | Dekorace | 670 ms | 240 / 600 ms | Materializace štítku a kresba postupu souběžně | Po dokreslení paraboly |

Lišty jsou na místě. Karty lze používat během vstupu. Na šířkách bez paraboly se lišta postupu naplňuje od 140 ms.

### Kvíz · Together, okamžitá změna stavu

| Prvek | Role | Začátek | Délka | Pohyb | Vztah |
| --- | --- | --- | --- | --- | --- |
| Ring a odznak klávesy | Lead | 0 ms od výběru | 0 / 120 ms | Ring ihned, odznak změnou barvy | Potvrzení přímo pod prstem |
| Fajfka | Support | 0 ms od výběru myší | 0,30 s spring | Opacity, scale a jemný blur | Současně s ringem |
| Možnosti, vysvětlení a text akce | Lead + Support | 0 ms od potvrzení | 200 / 240 / 150 ms | Přebarvení a ztlumení, vstup vysvětlení, prolnutí akce | Vše začíná současně |
| Stará a nová otázka | Lead | 0 ms od další otázky | 150 / 240 ms | Souběžný výstup o 8 px a vstup o 16 px se směrem z `custom` | Výstup a vstup se překrývají |

Akční lišta zůstává na místě. Při zkratce je změna okamžitá, včetně značek postupu.

### Kartičky · Together, obsah zůstává čitelný

| Prvek | Role | Začátek | Délka | Pohyb | Vztah |
| --- | --- | --- | --- | --- | --- |
| Otočení | Lead | 0 ms od odhalení | 650 ms, (0.77, 0, 0.175, 1) | 3D rotace kolem osy Y s mírným zvednutím (scale 1,04), perspektiva 1600 px; při omezeném pohybu prolnutí | Kliknutí i mezerník |
| Karta při tažení | Lead | Po překročení 10 px | Podle prstu | Sleduje prst a naklání se až o 8°, za okrajem pruží | Sleduje gesto |
| Stará a další karta | Lead | Při uvolnění | 600 ms morph křivka, balíček spring 0,6 s bounce 0,18 | Karta vyletí o šířku okna do strany s náklonem ±10° (nahoru o 320 px a scale 0,92) a mizí až od 350 ms; posun, náklon a měřítko jsou předem svázané motion values, jinak se při exitu nevykreslí; projekce 0,998 volí návrat nebo směr odhození, další karta nastoupí hned | Další karta nečeká na výstup |
| Odznak a statistiky | Lead + Support | Při dokončení ukazatelem | 600 ms | Dokreslení tahu a načtení čísel | Kresba a čísla souběžně |

Dvě další karty tvoří viditelný balíček a obě strany horní karty sdílejí stejnou výšku. Při hodnocení karta odchází doleva (1), nahoru (2 nebo přeskočení) nebo doprava (3), myší i klávesami 1–3.

### Inspektor · Lead → Support

| Prvek | Role | Začátek | Délka | Pohyb | Vztah |
| --- | --- | --- | --- | --- | --- |
| Desktopový inspektor | Lead | 0 ms | 0,35 s spring | Opacity, x +16 px, blur 4 px | Spuštění kliknutím |
| Citovaná pasáž | Support | 0 ms | 600 ms | Měkké zvýraznění, které dohasne | Překrývá otevření |
| Inspektor | Lead | 0 ms od zavření | 150 ms | Prolnutí a odsunutí k pravému okraji | Návrat k ose vstupu |
| Sheet, pozadí a stmívání | Lead + Support | 0 ms na mobilu | 240 ms nebo podle gesta | Svázaný posun, odsazení a stmívání | Sheet, pozadí a stmívání současně |

## Přísná kontrola animací

| Závažnost | Before | After | Why |
| --- | --- | --- | --- |
| HIGH | Původní zdrojový sheet měl jednu polohu a zavíral se ovládacím prvkem, klávesou nebo kliknutím mimo. | Base UI Drawer má výšku podle obsahu (max. 85 dvh), Escape, backdrop a přímé gesto. Obsah zůstává na místě během výstupu. | Zdroje lze číst a zavírat palcem, focus spravuje dialog. |
| MEDIUM | Inspektor na desktopu používal blur 8 px a škáloval text. | Inspektor se posune o 16 px, blur je 4 px, výstup je kratší. | Směr odpovídá umístění panelu a text zůstává stabilnější. |
| MEDIUM | Command menu používalo stejný blur a scale pro režim myši i pro zkratku s nulovou délkou. | Klávesové vyvolání je okamžité, výsledky nemají stagger. Myš má krátký vstup. | Opakované vyhledávání bez čekání. |
| MEDIUM | Animace postupu přepočítávala šířku při každém snímku. | Kroky používají sdílenou pružinu přes layout a klávesové skoky jsou okamžité. | Kontext se zachová při vizuálním posunu a odpověď z klávesnice reaguje hned. |
| MEDIUM | Silnější stín lišt přepočítával hodnotu i u jejich potomků. | Scroll-driven opacity předkreslené vrstvy stínu a odlesku. | Průběžný posun nezapisuje stav do Reactu. |
| MEDIUM | Blur úvodu zasahoval velké karty i celou mřížku. | Blur zůstává na pozdravu a malém popisku. Velké plochy používají opacity a transform. | Méně práce při kreslení velkých ploch a filtrace v menší oblasti. |

V auditu `improve-animations` vychází jako hlavní zbylý úkol stabilní snímková frekvence na Dnes a v mapě při zpomalení CPU. U hodin, kritérií, výsledků hledání a změn při psaní se animace záměrně minimalizují.

## Full review podle Jakuba

| Kategorie | Kontrolovaný rozsah | Výsledek |
| --- | --- | --- |
| Typografie | Čítače rozboru a dokončení, čas, postup a české texty | Tabulkové číslice a dostupná koncová hodnota. Typografická kontrola prošla. |
| Povrchy | Tři síly skla, klikací karty, plovoucí lišty, sheet, světlé a tmavé téma | Scroll mění intenzitu vrstvy stínu. Systémové omezení průhlednosti vypíná backdrop blur. |
| Animace | Dnes, kvíz, kartičky, tutor, mapa, katalog, menu, téma a přechody | Tokeny, kratší výstupy, omezení pohybu a okamžité zkratky u kvízu a kartiček. |
| Ikony | Fajfka, odeslat / stop, ukládání, zámek importu, chevrony | Kontextová výměna a odezva ve směru navigace. |
| Výkon | Přesuny mapy, streamování, dotykové gesto, první vstup | Výsledky 4× CPU níže. Delší seznamy nepřepočítávají layout při změně filtru. |

Při kontrole se vynechaly dekorativní odlesk závislý na kurzoru a pohyb výsledků hledání. U obou je hlavním prvkem čitelný obsah.

## Ověření

Produkční build, TypeScript, ESLint, česká typografie a 11 průchodů Playwright na desktopu a v emulaci Pixel 7. Dva nové scénáře ověřují přehrání vstupu Dnes jednou za relaci a dotykové hodnocení kartičky. Kontrola v Chromiu pokryla také obě témata, sbalení panelu, omezený pohyb a omezenou průhlednost.

| Interakce | Chrome CDP, 4× CPU | Nejdelší interval |
| --- | --- | --- |
| Dnes, studený start včetně načítání a hydratace | 47,4 fps | 100,0 ms |
| Dnes, první vstup z načtené aplikace | 60,0 fps | 16,7 ms |
| Stream tutora | 60,0 fps | 16,8 ms |
| Posun mapy | 60,0 fps | 16,8 ms |
| Odhození kartičky | 60,0 fps | 16,8 ms |

Vzorky vycházejí z intervalů `requestAnimationFrame` v Chromiu. Rychlost 10 % přes Chrome DevTools Protocol byla ověřena na klikacím toku kvízu. Kvíz a Ctrl+K prošly po 50 opakováních. Ostatní interakce prošly cílenými průchody nebo nahrávkami.

**Verdikt** · Funkční kontroly prošly. Výkon studeného startu Dnes zůstává pod cílem 60 fps a plošný průchod všech interakcí při 10 % a 50 opakováních zbývá.

## Nahrávky

- [Dnes · první vstup a dokreslení grafu](docs/motion/dnes.mp4)
- [Kvíz · výběr, vyhodnocení a další otázka](docs/motion/kviz.mp4)
- [Tutor · stream a otevření zdroje](docs/motion/tutor.mp4)
- [Mobil · sheet zdroje a odhození kartičky](docs/motion/mobil.mp4)
